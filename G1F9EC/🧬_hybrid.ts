// 🧬_hybrid.ts - базовий гліф з гібридним режимом
import { HybridLoader } from "./hybrid-loader.ts";

const glyph = "🧬";
const loader = new HybridLoader();

// самозапис з автоматичним вибором режиму
if (import.meta.url.startsWith("file://")) {
  const code = await Deno.readTextFile(decodeURIComponent(new URL(import.meta.url).pathname));
  const ts = new Date().toISOString();
  
  // обчислюємо хеш
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code))
    .then(buf => [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join(''));
  
  // визначаємо розмір для вибору режиму
  const dataSize = new TextEncoder().encode(code).length;
  const useFS = dataSize > 1024; // якщо більше 1KB - використовуємо FS
  
  // зберігаємо
  await loader.saveGlyph({
    "🧬": glyph,
    "🧠": { code, hash, kind: "genesis-hybrid" },
    "🌊": "🧬_hybrid.ts",
    "📦": "core",
    "version": hash.slice(0, 8),
    "🫀": "alive",
    "🎯": "hybrid-demo",
    "⏱️": ts
  }, useFS);
  
  console.log(`✅ ${glyph} → ${useFS ? 'GlyphFS' : 'SQL'} [${hash.slice(0, 8)}...]`);
}

// експортуємо функції
export default {
  // отримати гліф
  get: async (id: string) => {
    return await loader.getGlyph(id);
  },
  
  // зберегти гліф
  save: async (glyph: any, useFS = false) => {
    return await loader.saveGlyph(glyph, useFS);
  },
  
  // мігрувати в FS
  migrate: async (id: string) => {
    return await loader.migrate(id);
  },
  
  // статистика
  stats: () => {
    return loader.getStats();
  },
  
  // закрити з'єднання
  close: () => {
    loader.close();
  }
};

// демо використання
if (import.meta.main) {
  console.log("\n📊 Гібридний режим:");
  
  // статистика
  const stats = loader.getStats();
  console.log(`Всього: ${stats.total} (SQL: ${stats.sql}, FS: ${stats.hybrid})`);
  
  // читаємо гліф
  const data = await loader.getGlyph("🧬");
  if (data) {
    console.log(`\n🧬 завантажено з ${data["📁"] ? 'GlyphFS' : 'SQL'}`);
    console.log(`Версія: ${data.version}`);
    console.log(`Розмір даних: ${JSON.stringify(data["🧠"]).length} байт`);
  }
  
  loader.close();
}