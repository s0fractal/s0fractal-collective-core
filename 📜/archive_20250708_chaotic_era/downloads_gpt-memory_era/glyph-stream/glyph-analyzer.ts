import { readTextFile } from "https://deno.land/std/fs/mod.ts";

const file = "glyph.ts";
const content = await readTextFile(file);

const glyphs = [...content.matchAll(/glyph:\s(.+)/g)].map((m) => m[1]);
console.log("🔍 Знайдено гліфи:", glyphs);
