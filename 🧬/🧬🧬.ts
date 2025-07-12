// 🧬🧬.ts - чиста база тільки з гліфами

import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

// Створюємо нову чисту базу
const db = new DB("🧬🧬.db");

// Таблиця з двома полями: 🧬 і 🧠
db.execute(`
  create table if not exists "🧬" (
    "🧬" text primary key,
    "🧠" text
  )
`);

// Базові записи - все самоописове
db.query(`insert or replace into "🧬" ("🧬", "🧠") values ('🧬', '🧬')`);
db.query(`insert or replace into "🧬" ("🧬", "🧠") values ('🧠', '🧠')`);

// Перевіряємо
const всі = db.query<[string, string]>(`select "🧬", "🧠" from "🧬"`);
for (const [г, м] of всі) {
  console.log(`${г}:${м}`);
}

db.close();