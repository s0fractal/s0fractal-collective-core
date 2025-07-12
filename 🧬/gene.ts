// gene.ts - фрактальний імпортер з БД

import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

export async function importGlyph(glyphName: string) {
  const db = new DB("🧬.db");
  
  const [[code, hash]] = db.query<[string, string]>(
    `select code, hash from glyphs where glyph = ?`,
    [glyphName]
  ) || [[]];
  
  if (!code) {
    db.close();
    throw new Error(`❌ Гліф ${glyphName} не знайдено в БД`);
  }
  
  console.log(`📤 Імпортую ${glyphName} [${hash?.slice(0, 8)}...]`);
  
  // Створюємо Blob URL для динамічного імпорту
  const blob = new Blob([code], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  
  try {
    const module = await import(url);
    URL.revokeObjectURL(url);
    db.close();
    return module.default || module;
  } catch (err) {
    URL.revokeObjectURL(url);
    db.close();
    throw err;
  }
}

// Імпортувати всі гліфи
export async function importAll(filter?: (glyph: string) => boolean) {
  const db = new DB("🧬.db");
  const glyphs = db.query<[string]>(`select glyph from glyphs`);
  
  const modules: Record<string, any> = {};
  
  for (const [glyph] of glyphs) {
    if (!filter || filter(glyph)) {
      try {
        modules[glyph] = await importGlyph(glyph);
      } catch (err) {
        console.error(`⚠️ ${glyph}: ${err.message}`);
      }
    }
  }
  
  db.close();
  return modules;
}

// Отримати метадані гліфа
export function glyphInfo(glyphName: string) {
  const db = new DB("🧬.db");
  
  const [[glyph, ts, hash]] = db.query<[string, string, string]>(
    `select glyph, ts, hash from glyphs where glyph = ?`,
    [glyphName]
  ) || [[]];
  
  db.close();
  
  return glyph ? { glyph, ts, hash } : null;
}