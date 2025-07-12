// 🧬.ts - самозаписуючий гліф

import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

const glyph = "🧬";
const db = new DB("🧬.db");

// Створюємо таблицю гліфів
db.execute(`
  create table if not exists glyphs (
    glyph text primary key,
    ts text,
    code text,
    hash text
  )
`);

// Тільки якщо запускається з файлу, а не з БД
if (import.meta.url.startsWith("file://")) {
  // Читаємо сам себе
  const code = await Deno.readTextFile(decodeURIComponent(new URL(import.meta.url).pathname));
  const ts = new Date().toISOString();
  
  // Записуємо себе в базу
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code))
    .then(buf => [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join(''));
  
  db.query(`insert or replace into glyphs (glyph, ts, code, hash) values (?, ?, ?, ?)`, 
    [glyph, ts, code, hash]);
  
  console.log(`✅ ${glyph} → БД [${hash.slice(0, 8)}...]`);
}

// Експортуємо функцію
export default () => {
  console.log(`${glyph} живе!`);
  return db;
};

// Закриваємо БД якщо запускається напряму
if (import.meta.main) {
  db.close();
}