// _.ts - чистий гліфокод без слів
const _ = {
  // гліфи
  "🧠": "1F9E0",
  "💡": "1F4A1", 
  "🔥": "1F525",
  "🌊": "1F30A",
  "🌀": "1F300",
  "✨": "2728",
  "🌱": "1F331",
  "💫": "1F4AB",
  
  // оператори
  "+": (a: string, b: string) => {
    const c1 = a.codePointAt(0) || 0;
    const c2 = b.codePointAt(0) || 0;
    return String.fromCodePoint((c1 + c2) % 0x1F9FF);
  },
  
  "×": (g: string, n: number) => {
    return Array(n).fill(g).join("");
  },
  
  "→": (g: string) => {
    const code = g.codePointAt(0) || 0;
    return String.fromCodePoint(code + 1);
  },
  
  "←": (g: string) => {
    const code = g.codePointAt(0) || 0;
    return String.fromCodePoint(code - 1);
  },
  
  "↔": (g: string) => {
    return g.split("").reverse().join("");
  },
  
  "⊕": (a: string, b: string) => {
    const c1 = a.codePointAt(0) || 0;
    const c2 = b.codePointAt(0) || 0;
    return String.fromCodePoint(c1 ^ c2);
  }
};

// тест
if (import.meta.main) {
  console.log("🧠 + 💡 =", _["+"]("🧠", "💡"));
  console.log("🔥 × 3 =", _["×"]("🔥", 3));
  console.log("🌊 → =", _["→"]("🌊"));
  console.log("🌀 ← =", _["←"]("🌀"));
  console.log("💫 ↔ =", _["↔"]("💫"));
  console.log("🧠 ⊕ 🔥 =", _["⊕"]("🧠", "🔥"));
}

export default _;