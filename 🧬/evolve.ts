// evolve.ts - еволюція схеми 🧬

import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

const db = new DB("🧬.db");

// Перевіряємо чи поле вже існує
try {
  db.execute(`alter table "🧬" add column "📝" text`);
  console.log("✅ Додано поле 📝");
} catch {
  console.log("📝 вже існує");
}

// Оновлюємо початковий запис
db.query(`update "🧬" set "📝" = 'початок' where "🧬" = '🧬'`);

// Перевіряємо
const [[гліф, опис]] = db.query<[string, string]>(`select "🧬", "📝" from "🧬" where "🧬" = '🧬'`);

console.log(`${гліф}: ${опис}`);

db.close();