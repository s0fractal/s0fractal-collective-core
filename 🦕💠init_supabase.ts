import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { parse } from "https://deno.land/std@0.224.0/yaml/mod.ts";
import { walk } from "https://deno.land/std@0.224.0/fs/walk.ts";
import {
  basename,
  dirname,
  extname,
  relative,
} from "https://deno.land/std@0.224.0/path/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("❌ Missing Supabase creds");
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
const IGNORED = [".DS_Store", ".gitkeep"];

const ALLOWED_COLUMNS = new Set([
  "🧬",
  "slug",
  "🌊",
  "🫧",
  "🧠",
  "🔗",
  "⏱️",
  "🏠",
  "🫀",
  "🤲",
  "🎯",
  "📦",
  "📍",
  "version",
]);

async function readAny(path: string): Promise<any> {
  const stat = await Deno.stat(path);
  if (stat.isDirectory) {
    const obj: Record<string, any> = {};
    for await (const entry of Deno.readDir(path)) {
      if (IGNORED.includes(entry.name)) continue;
      obj[entry.name] = await readAny(`${path}/${entry.name}`);
    }
    return obj;
  }

  const ext = extname(path);
  const txt = await Deno.readTextFile(path);
  if (ext === ".yaml" || ext === ".yml") return parse(txt);
  try {
    return JSON.parse(txt);
  } catch {
    return txt.trim();
  }
}

async function main() {
  for await (const entry of walk("🧬", { includeDirs: false })) {
    if (IGNORED.includes(entry.name)) continue;
    const rel = relative("🧬", entry.path);
    const parts = rel.split("/");
    if (parts.length < 1) continue;

    const glyph = parts[0]; // 🧬/glyph/...
    const subpath = parts.slice(1).join("/");

    const folder = `🧬/${glyph}`;
    const record: Record<string, any> = { "🧬": glyph };

    for await (const file of Deno.readDir(folder)) {
      if (IGNORED.includes(file.name)) continue;
      const key = basename(file.name, extname(file.name));
      const fullPath = `${folder}/${file.name}`;
      const value = await readAny(fullPath);

      if (ALLOWED_COLUMNS.has(key)) {
        record[key] = value;
      } else {
        record["🧠"] ??= {};
        record["🧠"][key] = value;
      }
    }
    record.slug = record.slug || glyph;

    const { error } = await sb.from("🧬").upsert(record, {
      onConflict: "slug",
    });
    if (error) {
      console.error(`❌ ${glyph}: ${error.message}`);
    } else {
      console.log(`✅ ${glyph}`);
    }
  }
}

main();
