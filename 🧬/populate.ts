// populate.ts - заповнюємо базу значеннями

import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

const db = new DB("🧬.db");

// Додаємо нові гліфи з описами
const гліфи = [
  ["g", "ген/gene - мінімальна одиниця"],
  ["gg", "good game / гліф гіт"],
  ["glyph", "символ що несе значення"],
  ["git", "система контролю версій"],
  ["glyphgit", "гіт для гліфів"],
  ["🧠", "розум/свідомість"],
  ["🌊", "хвиля/потік"],
  ["🔒", "приватне/захищене"],
  ["✨", "магія/трансформація"]
];

for (const [гліф, опис] of гліфи) {
  db.query(
    `insert or replace into "🧬" ("🧬", "📝") values (?, ?)`,
    [гліф, опис]
  );
}

// Виводимо всі записи
const всі = db.query<[string, string]>(`select "🧬", "📝" from "🧬" order by "🧬"`);

console.log("🧬 База:");
for (const [г, о] of всі) {
  console.log(`  ${г} → ${о}`);
}

db.close();