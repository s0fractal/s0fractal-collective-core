// 🧠.ts

const { default: gene } = await import("./🧬.ts");

export default () => {
  // Імпортуємо базу від 🧬
  const db = gene();
  
  // Додаємо поле 🧠 до існуючої таблиці
  try {
    db.execute(`alter table "🧬" add column "🧠" text`);
    console.log("✅ +🧠");
  } catch {
    console.log("🧠 ✓");
  }
  
  // Додаємо запис 🧠
  db.query(`insert or replace into "🧬" ("🧬", "🧠") values ('🧠', '🧠')`);
  
  const [[г, м]] = db.query<[string, string]>(`select "🧬", "🧠" from "🧬" where "🧬" = '🧠'`);
  console.log(г === '🧠' && м === '🧠' ? '✅ 🧠' : '❌');
  
  return db;
};

// Якщо запускається напряму
if (import.meta.main) {
  const db = (await import("./🧠.ts")).default();
  db.close();
}