/**
 * registry-utils.ts
 *
 * Shared types, constants, and helpers for build-registry.ts and update-registry.ts.
 * Never imported by the game itself — scripts only.
 */

import fs from "fs/promises";
import path from "path";

import type { Registry, RegistryEntry } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Raw page object returned by the MediaWiki API */
export interface WikiPage {
  pageid?: number;
  ns: number;
  title: string;
  missing?: ""; // present (as empty string) when page doesn't exist
  pageimage?: string; // filename, e.g. "Honey_Block.png"
  langlinks?: WikiLangLink[];
}

export interface WikiLangLink {
  lang: string;
  "*": string; // translated title
}

export interface WikiCategoryMember {
  pageid: number;
  ns: number; // 0 = article, 14 = category
  title: string;
}

export interface WikiApiResponse {
  query?: {
    pages?: Record<string, WikiPage>;
    categorymembers?: WikiCategoryMember[];
  };
  continue?: {
    cmcontinue?: string;
    [key: string]: string | undefined;
  };
}

interface WikiImageInfo {
  url: string;
  descriptionurl?: string;
  descriptionshorturl?: string;
}

interface WikiFilePage {
  pageid?: number;
  ns: number;
  title: string;
  missing?: string;
  imagerepository?: string;
  imageinfo?: WikiImageInfo[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const API = "https://minecraft.wiki/api.php";
export const USER_AGENT =
  "MinecraftConexo/1.0 (registry builder; contact: natan_sambato@hotmail.com)";
export const DELAY_MS = 200;
export const BATCH_SIZE = 50;

/** Default languages to fetch translations for */
export const DEFAULT_LANGS = ["pt", "es"];

/**
 * Root categories to crawl. crawlCategory() recurses into subcategories,
 * so you only need the top-level ones here.
 */
export const ROOT_CATEGORIES = [
  "Category:Items",
  "Category:Blocks",
  "Category:Mobs",
  "Category:Entities",
  "Category:Biomes",
  "Category:Structures",
  "Category:Effects",
  "Category:Enchantments",
  "Category:Gameplay",
];

/**
 * Categories to skip during crawl — subcategories that would add noise
 * (upcoming, removed, joke features) or cause runaway recursion.
 */
export const SKIP_CATEGORIES = new Set([""]);

export const MUSHROOM_BLOCK_OVERRIDES: Record<
  string,
  { image: string; translations: Record<string, string> }
> = {
  "Red Mushroom Block": {
    image:
      "https://minecraft.wiki/images/Red_Mushroom_Block_%28ESU%29_JE2_BE2.png?3c3f9",
    translations: {
      pt: "Bloco de Cogumelo Vermelho",
      es: "Bloque de Champiñón Rojo",
    },
  },
  "Brown Mushroom Block": {
    image:
      "https://minecraft.wiki/images/Brown_Mushroom_Block_%28ESU%29_JE2_BE2.png?e44ea",
    translations: {
      pt: "Bloco de Cogumelo Marrom",
      es: "Bloque de Champiñón Marrón",
    },
  },
  "Mushroom Stem": {
    image:
      "https://minecraft.wiki/images/Mushroom_Stem_%28ESU%29_JE2_BE2.png?a1315",
    translations: { pt: "Caule de Cogumelo", es: "Tallo de Champiñón" },
  },
  "Mushroom Block (Pores)": {
    image:
      "https://minecraft.wiki/images/Mushroom_Block_%28ESU%29_JE2_BE2.png?6db76",
    translations: {
      pt: "Bloco de Cogumelo (Poros)",
      es: "Bloque de Champiñón (Poros)",
    },
  },
};

const COLOR_VARIANT_BLOCKS = [
  "Bundle",
  "Wool",
  "Wool Slab",
  "Wool Stairs",
  "Concrete",
  "Concrete Powder",
  "Terracotta",
  "Glazed Terracotta",
  "Carpet",
  "Candle",
  "Stained Glass",
  "Stained Glass Pane",
  "Bed",
  "Banner",
  "Shulker Box",
  "Cushion"
];

const FEMININE_BASES: Record<string, Set<string>> = {
  pt: new Set([
    "Bundle",
    "Wool",
    "Wool Slab",
    "Wool Stairs",
    "Terracotta",
    "Glazed Terracota",
    "Candle",
    "Bed",
    "Shulker Box",
    "Cushion",
  ]),
  es: new Set([
    "Wool",
    "Wool Slab",
    "Wool Stairs",
    "Terracota",
    "Carpet",
    "Candle",
    "Bed",
    "Shulker Box",
  ]),
};

const DYE_COLORS = [
  "White",
  "Orange",
  "Magenta",
  "Light Blue",
  "Yellow",
  "Lime",
  "Pink",
  "Gray",
  "Light Gray",
  "Cyan",
  "Purple",
  "Blue",
  "Brown",
  "Green",
  "Red",
  "Black",
];

const WOODEN_BLOCKS = [
  "Log",
  "Stripped Log",
  "Stripped Wood",
  "Shelf",
  "Planks",
  "Stairs",
  "Slab",
  "Fence",
  "Fence Gate",
  "Door",
  "Trapdoor",
  "Sign",
  "Hanging Sign",
  "Button",
  "Pressure Plate",
  "Boat",
  "Boat with Chest",
  "Sapling",
  "Leaves",
  "Leaves carried",
  "Wood",
];

const WOOD_TYPES = [
  "Oak",
  "Birch",
  "Spruce",
  "Jungle",
  "Acacia",
  "Dark Oak",
  "Mangrove",
  "Cherry",
  "Pale Oak",
  "Bamboo",
  "Crimson",
  "Warped",
  "Poplar",
];

const NETHER_TYPES = new Set(["Crimson", "Warped"]);

const ORE_BLOCKS = [
  "Iron Ore",
  "Gold Ore",
  "Diamond Ore",
  "Copper Ore",
  "Lapis Lazuli Ore",
  "Redstone Ore",
  "Coal Ore",
  "Emerald Ore",
];

const TIPPED_ARROW_EFFECTS = [
  "Night Vision",
  "Invisibility",
  "Leaping",
  "Fire Resistance",
  "Swiftness",
  "Slowness",
  "Water Breathing",
  "Healing",
  "Harming",
  "Poison",
  "Regeneration",
  "Strength",
  "Weakness",
  "Slow Falling",
  "Weaving",
  "Oozing",
  "Luck",
  "Decay",
  // "Infested", "Potion of the Turtle Master", "Wind Charged", // Manual, since they don't match the effect name
];

const COLOR_TRANSLATIONS: Record<string, Record<string, string>> = {
  Orange: { pt: "Laranja", es: "Naranja" },
  Magenta: { pt: "Magenta", es: "Magenta" },
  "Light Blue": { pt: "Azul Claro", es: "Azul Claro" },
  Lime: { pt: "Verde-Limão", es: "Lima" },
  Pink: { pt: "Rosa", es: "Rosa" },
  Gray: { pt: "Cinza", es: "Gris" },
  "Light Gray": { pt: "Cinza Claro", es: "Gris Claro" },
  Cyan: { pt: "Ciano", es: "Cian" },
  Purple: { pt: "Púrpura", es: "Púrpura" },
  Blue: { pt: "Azul", es: "Azul" },
  Brown: { pt: "Marrom", es: "Marrón" },
  Green: { pt: "Verde", es: "Verde" },
};

const COLOR_TRANSLATIONS_GENDERED: Record<
  string,
  { m: Record<string, string>; f: Record<string, string> }
> = {
  White: {
    m: { pt: "Branco", es: "Blanco" },
    f: { pt: "Branca", es: "Blanca" },
  },
  Red: { m: { pt: "Vermelho", es: "Rojo" }, f: { pt: "Vermelha", es: "Roja" } },
  Black: { m: { pt: "Preto", es: "Negro" }, f: { pt: "Preta", es: "Negra" } },
  Yellow: {
    m: { pt: "Amarelo", es: "Amarillo" },
    f: { pt: "Amarela", es: "Amarilla" },
  },
};

const WOOD_TRANSLATIONS: Record<string, Record<string, string>> = {
  Oak: { pt: "Carvalho", es: "Roble" },
  Birch: { pt: "Bétula", es: "Abedul" },
  Spruce: { pt: "Abeto", es: "Picea" },
  Jungle: { pt: "Selva", es: "Jungla" },
  Acacia: { pt: "Acácia", es: "Acacia" },
  "Dark Oak": { pt: "Carvalho Negro", es: "Roble Oscuro" },
  Mangrove: { pt: "Mangue", es: "Mangle" },
  Cherry: { pt: "Cerejeira", es: "Cerezo" },
  "Pale Oak": { pt: "Carvalho Pálido", es: "Roble Pálido" },
  Crimson: { pt: "Carmesim", es: "Carmesí" },
  Warped: { pt: "Deformado", es: "Deformado" },
  Bamboo: { pt: "Bambu", es: "Bambú" },
  Poplar: { pt: "Álamo", es: "Álamo" },
};

const BASE_TRANSLATION_FALLBACKS: Record<string, Record<string, string>> = {
  // Colored Blocks
  "Wool Slab": { pt: "Laje de Lã", es: "Laje de Lana" },
  "Wool Stairs": { pt: "Escadas de Lã", es: "Escaleras de Lana" },
  "Cushion": { pt: "Almofada", es: "Cojín" },
  // Wooden Blocks
  Fence: { pt: "Cerca", es: "Valla" },
  Door: { pt: "Porta", es: "Puerta" },
  Shelf: { pt: "Estante", es: "Estante" },
  "Hanging Sign": { pt: "Placa Suspensa", es: "Cartel Colgante" },
  "Boat with Chest": { pt: "Bote com Baú", es: "Barca con Cofre" },
  // Nether wood aliases
  Stem: { pt: "Caule", es: "Tallo" },
  "Stripped Stem": { pt: "Caule Descascado", es: "Tallo Pelado" },
  Hyphae: { pt: "Hifas", es: "Hifas" },
  "Stripped Hyphae": { pt: "Hifas Descascadas", es: "Hifas Peladas" },
};

interface VariantFamily {
  name: string;
  modifiers: string[]; // colors, wood types, "Deepslate", potion effects
  bases: string[]; // Bundle, Log, Ore, Mushroom Block
  modifierTranslations: Record<string, Record<string, string>>;
  buildName: (modifier: string, base: string) => string | null; // word order varies per family
  splitName: (fullName: string) => { modifier: string; base: string };
  buildTranslatedName: (m: string, b: string) => string; // translation word order, defaults to buildName's shape
}

const STATIC_VARIANT_FAMILIES: VariantFamily[] = [
  {
    name: "colors",
    modifiers: DYE_COLORS,
    bases: COLOR_VARIANT_BLOCKS,
    modifierTranslations: COLOR_TRANSLATIONS,
    buildName: (m, b) => `${m} ${b}`, // "Green Bundle"
    splitName: createPrefixSplitter(DYE_COLORS),
    buildTranslatedName: (m, b) => `${b} ${m}`, // "Lã Cinza"
  },
  {
    name: "woods",
    modifiers: WOOD_TYPES,
    bases: WOODEN_BLOCKS,
    modifierTranslations: WOOD_TRANSLATIONS,
    buildName: buildWoodName, // "Oak Log"
    splitName: createPrefixSplitter(WOOD_TYPES),
    buildTranslatedName: (m, b) => `${b} de ${m}`, // "Tronco de Carvalho"
  },
  {
    name: "ores",
    modifiers: ["", "Deepslate"],
    bases: ORE_BLOCKS,
    modifierTranslations: {
      "": {},
      Deepslate: { pt: "Ardosiabissal", es: "pizarra profunda" },
    },
    buildName: (m, b) => (m ? `${m} ${b}` : b), // "Deepslate Iron Ore" vs "Iron Ore"
    splitName: createPrefixSplitter(["Deepslate"]),
    buildTranslatedName: (m, b) => (m ? `${b} de ${m}` : b), // "Minério de Ferro de Ardosiabissal" vs "Minério de Ferro"
  },
];

/**
 * Returns all variant families, including ones whose translations
 * must be fetched from the wiki first (e.g. Tipped Arrow effects).
 */
export async function getVariantFamilies(): Promise<VariantFamily[]> {
  const effectsTranslations = await buildArrowsEffectsTranslations();

  const tippedArrows: VariantFamily = {
    name: "tipped-arrows",
    modifiers: TIPPED_ARROW_EFFECTS,
    bases: ["Arrow"],
    modifierTranslations: effectsTranslations,
    buildName: (m, b) => `${b} of ${m}`,
    splitName: createSuffixSplitter(" of ", TIPPED_ARROW_EFFECTS),
    buildTranslatedName: (m) => `Flecha de ${m}`,
  };

  return [...STATIC_VARIANT_FAMILIES, tippedArrows];
}

async function buildArrowsEffectsTranslations(): Promise<
  Record<string, Record<string, string>>
> {
  const effectData = await fetchAllInBatches(
    TIPPED_ARROW_EFFECTS,
    DEFAULT_LANGS,
  );

  const modifierTranslations: Record<string, Record<string, string>> = {};
  for (const [name, entry] of Object.entries(effectData)) {
    modifierTranslations[name] = entry.translations;
  }

  return modifierTranslations;
}

function pickGenderedColor(
  color: string,
  base: string,
  lang: string,
): string | undefined {
  const entry = COLOR_TRANSLATIONS_GENDERED[color];
  if (!entry) return COLOR_TRANSLATIONS[color]?.[lang]; // no variance, plain lookup
  const isFeminine = FEMININE_BASES[lang]?.has(base);
  return (isFeminine ? entry.f : entry.m)[lang];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

/** Low-level wiki API GET. Adds format=json automatically. */
async function apiGet(
  params: Record<string, string | number>,
): Promise<WikiApiResponse> {
  const url = new URL(API);
  url.search = new URLSearchParams({
    format: "json",
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ),
  }).toString();

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json() as Promise<WikiApiResponse>;
}

/**
 * Recursively crawl a category and all its subcategories.
 * Collects only real article pages (namespace 0).
 * Never adds category pages themselves as entries.
 * Tracks visited categories to handle circular references.
 *
 * @param category  - e.g. "Category:Mobs"
 * @param visited   - shared Set across all recursive calls (pass-by-reference)
 */
export async function crawlCategory(
  category: string,
  visited: Set<string> = new Set(),
): Promise<Set<string>> {
  if (visited.has(category)) return new Set();
  visited.add(category);

  const pages = new Set<string>();
  let cmcontinue: string | undefined;

  do {
    await sleep(DELAY_MS);

    const data = await apiGet({
      action: "query",
      list: "categorymembers",
      cmtitle: category,
      cmtype: "page|subcat", // fetch both articles AND subcategories
      cmlimit: 500,
      ...(cmcontinue ? { cmcontinue } : {}),
    });

    for (const member of data?.query?.categorymembers ?? []) {
      if (member.ns === 0) {
        // Real article page — collect it
        pages.add(member.title);
      } else if (member.ns === 14 && !SKIP_CATEGORIES.has(member.title)) {
        // Subcategory — recurse into it, passing the shared visited set
        const subPages = await crawlCategory(member.title, visited);
        subPages.forEach((p) => pages.add(p));
      }
    }

    cmcontinue = data?.continue?.cmcontinue;
  } while (cmcontinue);

  return pages;
}

export async function crawlCategoryFiles(
  category: string,
  visited: Set<string> = new Set(),
): Promise<Set<string>> {
  if (visited.has(category)) return new Set();
  visited.add(category);

  const files = new Set<string>();
  let cmcontinue: string | undefined;

  do {
    await sleep(DELAY_MS);
    const data = await apiGet({
      action: "query",
      list: "categorymembers",
      cmtitle: category,
      cmtype: "file|subcat",
      cmlimit: 500,
      ...(cmcontinue ? { cmcontinue } : {}),
    });

    for (const member of data?.query?.categorymembers ?? []) {
      if (member.ns === 6) {
        files.add(member.title.replace(/^File:/, "")); // strip "File:" prefix
      } else if (member.ns === 14 && !SKIP_CATEGORIES.has(member.title)) {
        const subFiles = await crawlCategoryFiles(member.title, visited);
        subFiles.forEach((f) => files.add(f));
      }
    }

    cmcontinue = data?.continue?.cmcontinue;
  } while (cmcontinue);

  return files;
}

/**
 * Fetch image URL and translations for a batch of page titles (max 50).
 * Pages that don't exist are recorded with _notFound: true.
 * Pages with _manual: true in the existing registry are skipped entirely.
 */
async function fetchPageData(
  titles: string[],
  langs: string[],
): Promise<Record<string, RegistryEntry>> {
  await sleep(DELAY_MS);

  const data = await apiGet({
    action: "query",
    titles: titles.join("|"),
    prop: "pageimages|langlinks",
    piprop: "name", // return filename, not a thumbnail URL
    lllimit: 500, // all language links in one shot
    llprop: "url|langname",
    redirects: 1, // follow redirects (e.g. "Zombie Pigman" → "Zombified Piglin")
  });

  const pages = data?.query?.pages ?? {};
  const result: Record<string, RegistryEntry> = {};

  for (const page of Object.values(pages)) {
    const title = page.title;

    if (page.missing !== undefined) {
      // Page doesn't exist — record it so we don't retry on every update run
      result[title] = {
        image: null,
        pageUrl: null,
        translations: {},
        _notFound: true,
      };
      continue;
    }

    const pageUrl = `https://minecraft.wiki/w/${encodeURIComponent(title.replace(/ /g, "_"))}`;
    const imageFile = page.pageimage;
    const imageUrl = imageFile
      ? `https://minecraft.wiki/images/${encodeURIComponent(imageFile.replace(/ /g, "_"))}`
      : null;

    const translations: Record<string, string> = {};
    for (const ll of page.langlinks ?? []) {
      if (langs.includes(ll.lang)) {
        translations[ll.lang] = ll["*"];
      }
    }

    result[title] = { image: imageUrl, pageUrl, translations };
  }

  return result;
}

/**
 * Fetch all pages in batches of BATCH_SIZE, merging into a result map.
 * Logs progress to stdout.
 */
export async function fetchAllInBatches(
  titles: string[],
  langs: string[],
): Promise<Record<string, RegistryEntry>> {
  const result: Record<string, RegistryEntry> = {};
  let done = 0;

  for (let i = 0; i < titles.length; i += BATCH_SIZE) {
    const batch = titles.slice(i, i + BATCH_SIZE);
    const batchData = await fetchAllInBatches_batch(batch, langs);
    Object.assign(result, batchData);
    done += batch.length;
    process.stdout.write(`\r⬇️  Fetched ${done}/${titles.length} pages...`);
  }

  process.stdout.write("\n");
  return result;
}

// internal — just the single-batch fetch, used by fetchAllInBatches
async function fetchAllInBatches_batch(
  titles: string[],
  langs: string[],
): Promise<Record<string, RegistryEntry>> {
  return fetchPageData(titles, langs);
}

/** Load registry.json from disk. Returns a minimal empty registry if not found. */
export async function loadRegistry(filePath: string): Promise<Registry> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as Registry;
  } catch {
    console.log("  ℹ️  No existing registry found — will create one.");
    return {
      _meta: { totalEntries: 0, languages: DEFAULT_LANGS },
    };
  }
}

/**
 * Fetch the direct image URL for a File: page.
 * Used for variants that have no article page, only an image file.
 */
export async function fetchFileImageUrl(
  itemName: string,
): Promise<string | null> {
  await sleep(DELAY_MS);

  const data = await apiGet({
    action: "query",
    titles: `File:${itemName}.png`,
    prop: "imageinfo",
    iiprop: "url",
  });

  const pages = data?.query?.pages ?? {};

  // missing pages still come back with a negative pageid and no imageinfo
  const page = Object.values(pages)[0] as WikiFilePage | undefined;
  const info = page?.imageinfo?.[0];
  return info?.url ?? null;
}

/** Write registry to disk, pretty-printed. */
export async function saveRegistry(
  registry: Registry,
  filePath: string,
): Promise<void> {
  await fs.mkdir(path.dirname(path.resolve(filePath)), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(registry, null, 2), "utf8");
}

/** Count non-meta entries in the registry. */
export function countEntries(registry: Registry): number {
  return Object.keys(registry).filter((k) => !k.startsWith("_")).length;
}

/** Parse --key=value CLI args into a plain object. */
export function parseArgs(argv: string[]): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};
  const args = argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const eqIdx = arg.indexOf("=");
      if (eqIdx !== -1) {
        // --key=value
        result[arg.slice(2, eqIdx)] = arg.slice(eqIdx + 1);
      } else {
        // --flag followed by positional values (e.g. --force "Item A" "Item B")
        const values: string[] = [];
        while (i + 1 < args.length && !args[i + 1].startsWith("--")) {
          values.push(args[++i]);
        }
        result[arg.slice(2)] = values.length === 1 ? values[0] : values;
      }
    }
  }

  return result;
}

/** Generates every "{Prefix} {Base}" combination, e.g. "Green Bundle" or "Oak Planks" */
export function generateVariantCandidates(
  family: Pick<VariantFamily, "modifiers" | "bases" | "buildName">,
): string[] {
  const candidates: string[] = [];
  for (const base of family.bases) {
    for (const modifier of family.modifiers) {
      const name = family.buildName(modifier, base);
      if (name) candidates.push(name);
    }
  }
  return candidates;
}

/** Returns the correct block-name variant for a given wood type,
 *  or null if it doesn't exist for that type.
 */
function buildWoodName(type: string, block: string): string | null {
  if (type === "Bamboo") {
    switch (block) {
      case "Log":
      case "Stripped Log":
      case "Wood":
      case "Stripped Wood":
        return null;

      case "Boat":
        return `${type} Raft`;

      case "Boat with Chest":
        return `${type} Raft with Chest`;

      default:
        return `${type} ${block}`;
    }
  }

  if (NETHER_TYPES.has(type)) {
    switch (block) {
      case "Log":
        return `${type} Stem`;

      case "Stripped Log":
        return `Stripped ${type} Stem`;

      case "Wood":
        return `${type} Hyphae`;

      case "Stripped Wood":
        return `Stripped ${type} Hyphae`;

      case "Boat":
      case "Boat with Chest":
      case "Sapling":
      case "Leaves":
      case "Leaves carried":
        return null;

      default:
        return `${type} ${block}`;
    }
  }

  switch (block) {
    case "Stripped Log":
      return `Stripped ${type} Log`;

    case "Stripped Wood":
      return `Stripped ${type} Wood`;

    default:
      return `${type} ${block}`;
  }
}

/**
 * Builds translations for a variant item by combining the translated
 * prefix with the base item's translation (pulled from the registry if the
 * base item — e.g. plain "Bundle" — has its own wiki page already fetched).
 */
export function translateVariant(
  fullName: string,
  family: VariantFamily, // e.g. "Green Bundle"
  langs: string[],
  baseTranslationsLookup: Record<string, Record<string, string>>, // e.g. {pt: "Saco"} from "Bundle" page
): Record<string, string> {
  const { modifier, base } = family.splitName(fullName);
  const baseTranslations = baseTranslationsLookup[base];

  const result: Record<string, string> = {};
  for (const lang of langs) {
    const isColorFamily = family.name === "colors";

    const translatedModifier = isColorFamily
      ? pickGenderedColor(modifier, base, lang)
      : family.modifierTranslations[modifier]?.[lang];

    const translatedBase =
      baseTranslations?.[lang] ??
      BASE_TRANSLATION_FALLBACKS[base]?.[lang] ??
      base;

    if (translatedModifier) {
      result[lang] = family.buildTranslatedName(
        translatedModifier,
        translatedBase,
      );
    }
  }
  return result;
}

function createPrefixSplitter(modifiers: string[]) {
  const sorted = [...modifiers].sort((a, b) => b.length - a.length);

  return (fullName: string) => {
    for (const modifier of sorted) {
      if (!modifier) continue;

      if (fullName.startsWith(modifier + " ")) {
        return {
          modifier,
          base: fullName.slice(modifier.length + 1),
        };
      }
    }

    return {
      modifier: "",
      base: fullName,
    };
  };
}

function createSuffixSplitter(
  separator: string,
  modifiers: string[],
): (fullName: string) => { modifier: string; base: string } {
  const sorted = [...modifiers].sort((a, b) => b.length - a.length);

  return (fullName: string) => {
    for (const modifier of sorted) {
      if (!modifier) continue;

      const suffix = `${separator}${modifier}`;

      if (fullName.endsWith(suffix)) {
        return {
          modifier,
          base: fullName.slice(0, -suffix.length),
        };
      }
    }

    return {
      modifier: "",
      base: fullName,
    };
  };
}
