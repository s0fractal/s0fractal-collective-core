// 🧠.ts - додаємо поле мозгів

import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

const db = new DB("🧬.db");

// Додаємо поле 🧠
try {
  db.execute(`alter table "🧬" add column "🧠" text`);
  console.log("✅ 🧠");
} catch {
  console.log("🧠 ✓");
}

// Вставляємо запис 🧠
db.query(`insert or replace into "🧬" ("🧬", "🧠") values ('🧠', '🧠')`);

// Перевіряємо
const [[г, м]] = db.query<[string, string]>(`select "🧬", "🧠" from "🧬" where "🧬" = '🧠'`);
console.log(г === '🧠' && м === '🧠' ? '✅ 🧠' : '❌');

db.close();