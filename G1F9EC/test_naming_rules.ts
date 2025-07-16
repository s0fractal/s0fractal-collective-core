// Testing various naming patterns with glyphs

// 1. Glyphs in strings - WORKS
const brain = "🧠";
const star = "🌟";
console.log("Glyphs in strings: " + brain + " " + star);

// 2. Glyphs in object keys - WORKS
const obj = {
  "🧠": "brain value",
  "🌟": "star value"
};
console.log("Object keys: " + obj["🧠"] + ", " + obj["🌟"]);

// 3. ASCII + glyph combinations
const brain_glyph = "🧠";
const g_brain = "G🧠";
const $brain = "$🧠";
console.log("Mixed names: " + brain_glyph + ", " + g_brain + ", " + $brain);

// 4. Functions returning glyphs
const getBrain = () => "🧠";
const getStar = () => "🌟";
console.log("Functions: " + getBrain() + " " + getStar());

// 5. Glyph-based data structures
const glyphMap = new Map([
  ["brain", "🧠"],
  ["star", "🌟"],
  ["rocket", "🚀"]
]);
console.log("Map access: " + glyphMap.get("brain"));

// 6. Glyph enum-like pattern
const GLYPHS = {
  BRAIN: "🧠",
  STAR: "🌟",
  ROCKET: "🚀",
  WAVE: "🌊"
} as const;
console.log("Enum pattern: " + GLYPHS.BRAIN + " " + GLYPHS.WAVE);