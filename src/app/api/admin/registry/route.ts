import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { Registry, RegistryEntry } from "@/types";
import {
  countEntries,
  DEFAULT_LANGS,
} from "../../../../../scripts/registry-utils";

const REGISTRY_PATH = path.join(
  process.cwd(),
  "src",
  "app",
  "data",
  "registry.json",
);

export interface EntryFields {
  name: string;
  pt?: string;
  es?: string;
  image: string;
  pageUrl: string;
}

type Payload =
  | { action: "create"; entry: EntryFields }
  | { action: "update"; oldName: string; entry: EntryFields }
  | { action: "delete"; name: string };

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Registry editing is only available in development" },
      { status: 403 },
    );
  }

  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = await fs.readFile(REGISTRY_PATH, "utf-8");
  const registry = JSON.parse(raw) as Registry;

  switch (payload.action) {
    case "create": {
      const { entry } = payload;
      if (!entry.name.trim()) {
        return NextResponse.json(
          { error: "Name is required." },
          { status: 400 },
        );
      }
      if (registry[entry.name]) {
        return NextResponse.json(
          { error: `"${entry.name}" already exists in the registry.` },
          { status: 409 },
        );
      }
      registry[entry.name] = buildEntry(entry);
      break;
    }
    case "update": {
      const { oldName, entry } = payload;
      if (!entry.name.trim()) {
        return NextResponse.json(
          { error: "Name is required." },
          { status: 400 },
        );
      }
      if (oldName !== entry.name) {
        if (registry[entry.name]) {
          return NextResponse.json(
            { error: `"${entry.name}" already exists in the registry.` },
            { status: 409 },
          );
        }
        delete registry[oldName];
      }
      registry[entry.name] = buildEntry(entry);
      break;
    }
    case "delete": {
      if (!registry[payload.name]) {
        return NextResponse.json(
          { error: `"${payload.name}" not found in registry.` },
          { status: 404 },
        );
      }
      delete registry[payload.name];
      break;
    }
    default:
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  registry._meta = {
    ...(registry._meta ?? { totalEntries: 0, languages: DEFAULT_LANGS }),
    totalEntries: countEntries(registry),
  };

  await fs.writeFile(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf-8");

  return NextResponse.json({ ok: true });
}

function buildEntry(fields: EntryFields): RegistryEntry {
  const translations: Record<string, string> = {};
  if (fields.pt?.trim()) translations.pt = fields.pt.trim();
  if (fields.es?.trim()) translations.es = fields.es.trim();

  return {
    image: fields.image.trim() || null,
    pageUrl: fields.pageUrl.trim() || null,
    translations,
    _manual: true,
  };
}
