#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net

// glyph-exec.ts - виконувач гліфів з БД

import { importGlyph, glyphInfo } from "./gene.ts";

// Отримуємо назву гліфа з аргументів
const glyphName = Deno.args[0];

if (!glyphName) {
  console.error("❌ Використання: glyph-exec.ts <гліф>");
  console.error("   Приклад: glyph-exec.ts 🧠");
  Deno.exit(1);
}

try {
  // Показуємо інформацію про гліф
  const info = glyphInfo(glyphName);
  if (!info) {
    console.error(`❌ Гліф ${glyphName} не знайдено`);
    Deno.exit(1);
  }
  
  console.log(`\n🔍 Гліф: ${info["🧬"]}`);
  console.log(`📦 Пакет: ${info["📦"]}`);
  console.log(`🫀 Стан: ${info["🫀"]}`);
  console.log(`🎯 Мета: ${info["🎯"] || "—"}`);
  console.log(`⚡ Версія: ${info["version"]}`);
  console.log(`🕐 Створено: ${info["⏱️"]}`);
  
  if (info["🔗"]) {
    const deps = JSON.parse(info["🔗"]);
    if (deps.length > 0) {
      console.log(`🔗 Залежності: ${deps.join(", ")}`);
    }
  }
  
  if (info.mutations && info.mutations.length > 0) {
    console.log(`\n📝 Останні мутації:`);
    for (const mut of info.mutations.slice(0, 3)) {
      console.log(`  • ${mut.trace} - ${mut.meta.action || "?"} (${mut.time})`);
    }
  }
  
  console.log(`\n🚀 Запускаю ${glyphName}...\n`);
  
  // Імпортуємо і виконуємо гліф
  const module = await importGlyph(glyphName);
  
  // Якщо це функція - викликаємо
  if (typeof module === "function") {
    const result = await module();
    if (result && result.close) {
      result.close(); // закриваємо БД якщо повернулась
    }
  }
  
  console.log(`\n✅ ${glyphName} виконано`);
  
} catch (err) {
  console.error(`\n❌ Помилка виконання ${glyphName}:`, err.message);
  Deno.exit(1);
}