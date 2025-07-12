// 🧬.ts - мінімальна самовизначальна система

import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

// Створюємо базу з іменем що містить 🧬
const db = new DB("🧬.db");

// Створюємо таблицю 🧬 з полем 🧬
db.execute(`
  create table if not exists "🧬" (
    "🧬" text primary key
  )
`);

// Вставляємо запис 🧬
db.query(`insert or ignore into "🧬" ("🧬") values ('🧬')`);

// Перевіряємо що 🧬 існує
const [[результат]] = db.query<[string]>(`select "🧬" from "🧬" where "🧬" = '🧬'`);

console.log(результат === '🧬' ? '✅ 🧬' : '❌');

// Експортуємо базу
export { db };

// Закриваємо після тесту
db.close();