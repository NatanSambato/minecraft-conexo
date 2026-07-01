/**
 * build-registry.ts
 *
 * One-time (or post-MC-update) full registry builder.
 * Recursively crawls every root category and its subcategories,
 * fetches each page's canonical image and translations,
 * and writes registry.json.
 *
 * Usage:
 *   npx tsx scripts/build-registry.ts
 *   npx tsx scripts/build-registry.ts --langs=pt,es,fr,de
 *   npx tsx scripts/build-registry.ts --out=src/data/registry.json
 */

import {
  ROOT_CATEGORIES,
  DEFAULT_LANGS,
  crawlCategory,
  fetchAllInBatches,
  saveRegistry,
  countEntries,
  parseArgs,
  generateVariantCandidates,
  fetchFileImageUrl,
  translateVariant,
  getVariantFamilies,
} from "./registry-utils";

import type { Registry } from "@/types";


// ─── CLI args ─────────────────────────────────────────────────────────────────

const args = parseArgs(process.argv);

const LANGS = typeof args.langs === "string"
  ? args.langs.split(",").map((l) => l.trim())
  : DEFAULT_LANGS;

const OUT_PATH = typeof args.out === "string"
  ? args.out
  : "./src/app/data/registry.json";

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("🟢 Starting full registry build");
  console.log(`   Languages : ${LANGS.join(", ")}`);
  console.log(`   Output    : ${OUT_PATH}`);
  console.log(`   Categories: ${ROOT_CATEGORIES.length} root categories\n`);

  // 1. Crawl all root categories recursively
  //    A single shared `visited` set prevents double-crawling subcategories
  //    that appear under multiple parents (common on the Minecraft Wiki).
  const allTitles = new Set<string>();
  const visitedCategories = new Set<string>();

  for (const cat of ROOT_CATEGORIES) {
    process.stdout.write(`📂 Crawling ${cat}... `);
    const before = allTitles.size;
    const pages = await crawlCategory(cat, visitedCategories);
    pages.forEach((t) => allTitles.add(t));
    const added = allTitles.size - before;
    console.log(`+${added} pages (${allTitles.size} total unique)`);
  }

  const titleList = [...allTitles];
  console.log(`\n📋 Total unique pages to fetch: ${titleList.length}\n`);

  // 2. Fetch image + translations for every page in batches
  const entries = await fetchAllInBatches(titleList, LANGS);

  // 3. Report pages that had no wiki entry (need manual images)
  const notFound = Object.entries(entries)
    .filter(([, v]) => v._notFound)
    .map(([k]) => k);

  if (notFound.length > 0) {
    console.log(`\n⚠️  ${notFound.length} pages had no wiki entry (manual image needed):`);
    notFound.forEach((n) => console.log(`   - ${n}`));
  }

  // 3.5 - Resolve blocks with variants (Red Wool, Oak Log) 
  const VARIANT_FAMILIES = await getVariantFamilies();

  // Fetch translations for the base block names themselves (Wool, Bundle, Candle, ...)
  const allBaseNames = [...new Set(VARIANT_FAMILIES.flatMap((f) => f.bases))];
  const baseNameData = await fetchAllInBatches(allBaseNames, LANGS);

  const baseTranslationsLookup: Record<string, Record<string, string>> = {};
  for (const [name, entry] of Object.entries(baseNameData)) {
    baseTranslationsLookup[name] = entry.translations;
  }

  const basePageUrlLookup: Record<string, string | null> = {};
  for (const [name, entry] of Object.entries(baseNameData)) {
    basePageUrlLookup[name] = entry.pageUrl;
  }

  for (const family of VARIANT_FAMILIES) {
    if (family.name === "colors") console.log("🎨 Resolving color variants...");
    if (family.name === "woods") console.log("🌲 Resolving wood variants...");
    if (family.name === "ores") console.log("⛏️ Resolving ore variants...");
    if (family.name === "tipped-arrows") console.log("🏹 Resolving tipped arrow variants...");

    const candidates = generateVariantCandidates({
      modifiers: family.modifiers,
      bases: family.bases,
      buildName: family.buildName
    });

    for (const name of candidates) {
      const imageUrl = await fetchFileImageUrl(name);
      if (!imageUrl) continue;
  

      const { base } = family.splitName(name);

      const translations = translateVariant(
        name,
        family,
        LANGS,
        baseTranslationsLookup
      );

      entries[name] = {
        image: imageUrl,
        pageUrl: basePageUrlLookup[base] ?? null,
        translations: translations,
      };
    }
  }

  // 4. Assemble and save the registry
  const registry: Registry = {
    _meta: {
      builtAt: new Date().toISOString(),
      totalEntries: Object.keys(entries).length,
      languages: LANGS,
      categories: ROOT_CATEGORIES,
    },
    ...entries,
  };

  await saveRegistry(registry, OUT_PATH);

  console.log(`\n✅ Registry written to ${OUT_PATH}`);
  console.log(`   Total entries : ${countEntries(registry)}`);
  console.log(`   Not found     : ${notFound.length}`);
  console.log(`   Categories crawled: ${visitedCategories.size}`);
}

main().catch((err: unknown) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});