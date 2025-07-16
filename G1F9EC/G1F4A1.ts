// G1F4A1.ts - 💡
const G = {
  // 💡 → 🧠
  "1F4A1": () => "1F9E0",
  
  // 💡 + 🔥 → ✨
  "2728": (a: string, b: string) => {
    if (a === "1F4A1" && b === "1F525") {
      return "2728";  // ✨
    }
    return null;
  },
  
  // 💡 ↔️ 💭
  "1F4AD": (g: string) => {
    const m = new Map([
      ["1F4A1", "1F4AD"],  // 💡 → 💭
      ["1F4AD", "1F4A1"],  // 💭 → 💡
    ]);
    return m.get(g);
  },
  
  // рекурсія 💡 → 💡💡💡
  "*": (n: number): string[] => {
    return Array(n).fill("1F4A1");
  }
};

// самоактивація
if (import.meta.main) {
  console.log("💡");
  console.log("→", String.fromCodePoint(parseInt(G["1F4A1"](), 16)));
  console.log("+🔥→", G["2728"]("1F4A1", "1F525") ? "✨" : "❌");
  console.log("↔️", G["1F4AD"]("1F4A1") ? "💭" : "❌");
  console.log("×3→", G["*"](3).map(g => "💡").join(""));
}

export default G;