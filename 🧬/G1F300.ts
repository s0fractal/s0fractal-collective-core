// G1F300.ts - 🌀 Fractal Operator
import G1F9E0 from "./G1F9E0.ts";

// 🌀 фрактальний оператор
const G1F300 = {
  // рекурсивна композиція
  compose: (...glyphs: string[]) => {
    return glyphs.reduce((acc, g) => {
      const code = parseInt(g.replace("1F", ""), 16);
      return acc ^ code;  // XOR для унікальності
    }, 0);
  },
  
  // генерація нових гліфів
  generate: (seed: number) => {
    const base = 0x1F300;
    const offset = seed % 0x100;
    return String.fromCodePoint(base + offset);
  },
  
  // фрактальне розгортання
  unfold: (depth: number, glyph: string): string[] => {
    if (depth === 0) return [glyph];
    
    const code = glyph.codePointAt(0) || 0;
    const child1 = String.fromCodePoint(code + 1);
    const child2 = String.fromCodePoint(code - 1);
    
    return [
      glyph,
      ...G1F300.unfold(depth - 1, child1),
      ...G1F300.unfold(depth - 1, child2)
    ];
  }
};

// самотест
if (import.meta.main) {
  console.log("🌀 активовано");
  
  const comp = G1F300.compose("1F9E0", "1F525", "1F30A");
  console.log("compose →", comp);
  
  const glyph = G1F300.generate(comp);
  console.log("generate →", glyph);
  
  const tree = G1F300.unfold(2, "🌀");
  console.log("unfold →", tree);
}

export default G1F300;