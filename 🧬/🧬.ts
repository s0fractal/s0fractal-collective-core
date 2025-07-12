// 🧬.ts

import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

export default () => {
  const db = new DB("🧬.db");
  
  db.execute(`
    create table if not exists "🧬" (
      "🧬" text primary key
    )
  `);
  
  db.query(`insert or ignore into "🧬" ("🧬") values ('🧬')`);
  
  const [[результат]] = db.query<[string]>(`select "🧬" from "🧬" where "🧬" = '🧬'`);
  console.log(результат === '🧬' ? '✅ 🧬' : '❌');
  
  return db;
};

// Якщо запускається напряму
if (import.meta.main) {
  const db = (await import("./🧬.ts")).default();
  db.close();
}