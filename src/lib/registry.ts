/**
 * src/lib/registry.ts
 *
 * Game-side helper for consuming registry.json at runtime.
 * Handles loading, caching, image resolution, and translations.
 *
 * Usage:
 *   import { loadRegistry, getImage, getTranslation } from "@/lib/registry";
 *
 *   await loadRegistry();                      // once at app startup
 *
 *   getImage("Honey Block");                   // → "https://..." | null
 *   getTranslation("Honey Block", "pt");       // → "Bloco de Mel"
 *   hasImage("Honey Block");                   // → true
 */

import rawRegistryData from "@/app/data/registry.json";
import type { Registry, RegistryEntry, RegistryRow } from "@/types/index";

// ─── Module state ─────────────────────────────────────────────────────────────

let _registry: Registry | null = null;

// ─── Load ─────────────────────────────────────────────────────────────────────

/**
 * Load and cache registry.json. Call once at app startup before rendering tiles.
 * Safe to call multiple times — only fetches on the first call.
 */
export async function loadRegistry(): Promise<void> {
  if (_registry) return;

  _registry = rawRegistryData as Registry;

  if (process.env.NODE_ENV === "development") {
    console.log(`[Registry] Loaded — ${_registry._meta?.totalEntries ?? "?"} entries`);
  }
}

// ─── Internal ─────────────────────────────────────────────────────────────────

function assertLoaded(): Registry {
  if (!_registry) throw new Error("Registry not loaded. Call loadRegistry() first.");
  return _registry;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Get the full registry entry for an item.
 * Returns null if the item isn't in the registry.
 */
export function getItem(name: string): RegistryEntry | null {
  const registry = assertLoaded();
  const entry = registry[name]
    ?? registry[name.toLowerCase()]
    ?? Object.entries(registry).find(
      ([k]) => k.toLowerCase() === name.toLowerCase()
    )?.[1];
  // _meta is also in the registry map — guard against it
  if (!entry || typeof entry !== "object" || !("translations" in entry)) return null;
  return entry as RegistryEntry;
}

/** Flatten the registry into rows for admin/debug views. */
export function getAllItems(): RegistryRow[] {
  const registry = assertLoaded();
  return Object.entries(registry)
    .filter(([key, val]) => key !== "_meta" && typeof val === "object" && "translations" in val)
    .map(([name, entry]) => {
      const e = entry as RegistryEntry;
      return {
        name,
        url: e.pageUrl ?? null,
        pt: e.translations?.pt ?? null,
        es: e.translations?.es ?? null,
        image: e.image ?? null,
      };
    });
}

/**
 * Get the image URL for an item.
 * Returns null if no image is available — tile should fall back to label-only.
 */
export function getImage(name: string): string | null {
  return getItem(name)?.image ?? null;
}

/**
 * Get the translated name for an item.
 * Falls back to the English name (the key itself) if no translation exists.
 */
export function getTranslation(name: string, lang: string): string {
  if (!lang || lang === "en") return name;
  return getItem(name)?.translations[lang] ?? name;
}

/** Whether the registry has an image for this item. */
export function hasImage(name: string): boolean {
  return !!getImage(name);
}

/** All language codes available in this registry build. */
export function availableLanguages(): string[] {
  return assertLoaded()._meta?.languages ?? [];
}