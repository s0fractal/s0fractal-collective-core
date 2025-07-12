// 🧬.ts - базовий гліф з повною схемою

import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

const glyph = "🧬";
const db = new DB("🧬.db");

// Тільки якщо запускається з файлу
if (import.meta.url.startsWith("file://")) {
  const code = await Deno.readTextFile(decodeURIComponent(new URL(import.meta.url).pathname));
  const ts = new Date().toISOString();
  
  // Обчислюємо хеш
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code))
    .then(buf => [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join(''));
  
  // Записуємо в нову схему
  db.query(`
    insert into "🧬" ("🧬", "🧠", "🌊", "📦", "version", "🫀", "⏱️")
    values (?, ?, ?, ?, ?, ?, ?)
    on conflict("🧬") do update set 
      "🧠" = excluded."🧠",
      "🌊" = excluded."🌊",
      "version" = excluded."version",
      "🫀" = excluded."🫀",
      "⏱️" = excluded."⏱️"
  `, [
    glyph,
    JSON.stringify({ code, hash, kind: "genesis" }),
    "🧬.ts",
    "core",
    hash.slice(0, 8),
    "alive",
    ts
  ]);
  
  // Записуємо мутацію
  db.query(`
    insert into "🧬_mutations" ("🧬", "source", "meta", "👣", "🪞")
    values (?, ?, ?, ?, ?)
  `, [
    glyph,
    code,
    JSON.stringify({ action: "self-store", hash }),
    "🧬:genesis",
    "🧬.ts"
  ]);
  
  console.log(`✅ ${glyph} → БД [${hash.slice(0, 8)}...]`);
}

// Експортуємо функцію підключення до БД
export default () => {
  console.log(`${glyph} живе!`);
  return db;
};

// Закриваємо БД якщо запускається напряму
if (import.meta.main) {
  db.close();
}