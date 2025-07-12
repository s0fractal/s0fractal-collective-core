// 🧠.ts - агент з повною схемою

const { default: gene } = await import("./🧬.ts");

export default async () => {
  const db = gene();
  const glyph = "🧠";
  
  // Читаємо себе якщо запускається з файлу
  if (import.meta.url.startsWith("file://")) {
    const code = await Deno.readTextFile(decodeURIComponent(new URL(import.meta.url).pathname));
    const ts = new Date().toISOString();
    
    // Обчислюємо хеш
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code))
      .then(buf => [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join(''));
    
    // Записуємо в схему
    db.query(`
      insert into "🧬" ("🧬", "🧠", "🌊", "📦", "version", "🫀", "🔗", "🎯", "⏱️")
      values (?, ?, ?, ?, ?, ?, ?, ?, ?)
      on conflict("🧬") do update set 
        "🧠" = excluded."🧠",
        "🌊" = excluded."🌊",
        "version" = excluded."version",
        "🫀" = excluded."🫀",
        "🔗" = excluded."🔗",
        "🎯" = excluded."🎯",
        "⏱️" = excluded."⏱️"
    `, [
      glyph,
      JSON.stringify({ code, hash, kind: "agent", created_by: "Claude" }),
      "🧠.ts",
      "agent",
      hash.slice(0, 8),
      "thinking",
      JSON.stringify(["🧬"]), // залежності
      "self-aware",
      ts
    ]);
    
    // Записуємо мутацію
    db.query(`
      insert into "🧬_mutations" ("🧬", "source", "meta", "👣", "🪞")
      values (?, ?, ?, ?, ?)
    `, [
      glyph,
      code,
      JSON.stringify({ action: "self-store", hash, parent: "🧬" }),
      "🧠:think",
      "🧠.ts"
    ]);
    
    console.log(`✅ ${glyph} → БД [${hash.slice(0, 8)}...]`);
  }
  
  return db;
};

// Якщо запускається напряму
if (import.meta.main) {
  const db = await (await import("./🧠.ts")).default();
  
  // Показуємо всі гліфи в БД
  const glyphs = db.query<[string, string, string, string]>(`
    select "🧬", "📦", "🫀", "version" from "🧬" order by "⏱️"
  `);
  
  console.log("\n📚 Гліфи в БД:");
  for (const [g, pkg, heart, ver] of glyphs) {
    console.log(`  ${g} [${pkg}] ${heart} v${ver}`);
  }
  
  db.close();
}