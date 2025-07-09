
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { parse } from "https://deno.land/std@0.224.0/yaml/mod.ts";
import { walk } from "https://deno.land/std@0.224.0/fs/walk.ts";
import { basename, extname, join } from "https://deno.land/std@0.224.0/path/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("❌ Missing Supabase creds");
}

const IGNORED_FILES = [".DS_Store", ".gitkeep"];
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

async function readAny(path: string): Promise<any> {
  const info = await Deno.stat(path);
  if (info.isDirectory) {
    const data: Record<string, any> = {};
    for await (const entry of Deno.readDir(path)) {
      if (IGNORED_FILES.includes(entry.name)) continue;
      const subPath = join(path, entry.name);
      data[entry.name] = await readAny(subPath);
    }
    return data;
  }
  const ext = extname(path);
  const txt = await Deno.readTextFile(path);
  if (ext === ".yaml" || ext === ".yml") return parse(txt);
  return txt.trim();
}

function glyphFromPath(path: string): string {
  return "/" + path
    .replace(/^🧬\//, "")   // remove prefix
    .replace(/\/g, "/")     // normalize slashes
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .join("/🧬");
}

async function main() {
  for await (const entry of walk("🧬", { includeFiles: false, includeDirs: true, maxDepth: 20 })) {
    const glyphPath = entry.path;
    if (glyphPath === "🧬") continue;
    const glyphKey = glyphFromPath(glyphPath);
    const record: any = {
      "🧬": glyphKey,
      "🧠": await readAny(glyphPath)
    };
    const { error } = await sb.from("🧬").upsert(record);
    if (error) console.error("❌", glyphKey, error.message);
    else console.log("✅", glyphKey);
  }
}

main();
