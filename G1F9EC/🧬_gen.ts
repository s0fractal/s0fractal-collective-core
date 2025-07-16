// 🧬_gen.ts - самогенеруючий гліфокод
import _ from "./_.ts";

// генератор модулів
const gen = {
  // створює новий гліф-модуль
  module: (glyph: string) => {
    const code = glyph.codePointAt(0)?.toString(16).toUpperCase();
    return `// G${code}.ts - ${glyph}
export default {
  "${glyph}": () => "${code}",
  "→": () => "${_["→"](glyph)}",
  "←": () => "${_["←"](glyph)}",
  "×2": () => "${_["×"](glyph, 2)}",
  "⊕": (g: string) => _["⊕"]("${glyph}", g)
};`;
  },
  
  // генерує зв'язки
  links: (from: string, to: string[]) => {
    return `"${from}": [${to.map(g => `"${g}"`).join(", ")}]`;
  },
  
  // генерує трейл
  trail: (...glyphs: string[]) => {
    let result = glyphs[0];
    for (let i = 1; i < glyphs.length; i++) {
      result = _["+"]!(result, glyphs[i]);
    }
    return result;
  }
};

// самогенерація
if (import.meta.main) {
  // генеруємо модуль для 🚀
  console.log("=== Генерація модуля 🚀 ===");
  const rocketModule = gen.module("🚀");
  console.log(rocketModule);
  
  // зберігаємо
  await Deno.writeTextFile("G1F680.ts", rocketModule);
  console.log("\n✅ Збережено в G1F680.ts");
  
  // генеруємо зв'язки
  console.log("\n=== Генерація зв'язків ===");
  console.log(gen.links("🚀", ["🔥", "💨", "⭐"]));
  
  // генеруємо трейл
  console.log("\n=== Генерація трейлу ===");
  const trail = gen.trail("🧠", "💡", "✨");
  console.log("🧠 → 💡 → ✨ =", trail);
}

export default gen;