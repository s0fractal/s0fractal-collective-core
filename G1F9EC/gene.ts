// gene.ts - фрактальний імпортер з повною схемою

import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

export async function importGlyph(glyphName: string) {
  const db = new DB("🧬.db");
  
  // Отримуємо код з нової схеми
  const [[brain]] = db.query<[string]>(
    `select "🧠" from "🧬" where "🧬" = ?`,
    [glyphName]
  ) || [[]];
  
  if (!brain) {
    db.close();
    throw new Error(`❌ Гліф ${glyphName} не знайдено в БД`);
  }
  
  const { code, hash } = JSON.parse(brain);
  console.log(`📤 Імпортую ${glyphName} [${hash?.slice(0, 8)}...]`);
  
  // Оновлюємо час виконання
  db.query(`update "🧬" set "exec_ts" = ? where "🧬" = ?`, [
    new Date().toISOString(),
    glyphName
  ]);
  
  // Записуємо мутацію про імпорт
  db.query(`
    insert into "🧬_mutations" ("🧬", "meta", "👣")
    values (?, ?, ?)
  `, [
    glyphName,
    JSON.stringify({ action: "import", timestamp: new Date().toISOString() }),
    "import:dynamic"
  ]);
  
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

// Імпортувати всі гліфи певного типу
export async function importByPackage(packageType: string) {
  const db = new DB("🧬.db");
  const glyphs = db.query<[string]>(
    `select "🧬" from "🧬" where "📦" = ?`,
    [packageType]
  );
  
  const modules: Record<string, any> = {};
  
  for (const [glyph] of glyphs) {
    try {
      modules[glyph] = await importGlyph(glyph);
    } catch (err) {
      console.error(`⚠️ ${glyph}: ${err.message}`);
    }
  }
  
  db.close();
  return modules;
}

// Отримати повні метадані гліфа
export function glyphInfo(glyphName: string) {
  const db = new DB("🧬.db");
  
  const result = db.query(
    `select * from "🧬" where "🧬" = ?`,
    [glyphName]
  );
  
  if (!result || result.length === 0) {
    db.close();
    return null;
  }
  
  // Конвертуємо результат в об'єкт
  const columns = db.query(`PRAGMA table_info("🧬")`).map(row => row[1]);
  const row = result[0];
  const info: any = {};
  
  columns.forEach((col, idx) => {
    info[col as string] = row[idx];
  });
  
  // Отримуємо останні мутації
  const mutations = db.query<[string, string, string]>(
    `select "meta", "👣", "⏱️" from "🧬_mutations" 
     where "🧬" = ? order by "⏱️" desc limit 5`,
    [glyphName]
  );
  
  db.close();
  
  return {
    ...row,
    mutations: mutations.map(([meta, trace, time]) => ({
      meta: JSON.parse(meta),
      trace,
      time
    }))
  };
}

// Граф залежностей
export function glyphDependencies(glyphName: string) {
  const db = new DB("🧬.db");
  
  const [[deps]] = db.query<[string]>(
    `select "🔗" from "🧬" where "🧬" = ?`,
    [glyphName]
  ) || [[]];
  
  db.close();
  
  return deps ? JSON.parse(deps) : [];
}