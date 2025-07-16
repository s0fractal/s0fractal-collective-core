// 🧬_runner.ts - запускач гліфосистеми
import { parse } from "https://deno.land/std@0.208.0/yaml/mod.ts";

// завантажуємо геном
const genome = parse(await Deno.readTextFile("🧬.yaml")) as any;

// мапа операторів (без людських назв!)
const ops = new Map();

// 🧠 → розум
ops.set("1F9E0", async () => {
  const mod = await import("./G1F9E0.ts");
  return mod.default;
});

// 🌀 → фрактал
ops.set("1F300", async () => {
  const mod = await import("./G1F300.ts");
  return mod.default;
});

// виконувач гліфів
const run = async (glyph: string) => {
  console.log(`\n=== ${String.fromCodePoint(parseInt(glyph, 16))} ===`);
  
  const loader = ops.get(glyph);
  if (!loader) {
    console.log("❌ не знайдено");
    return;
  }
  
  const module = await loader();
  
  // якщо є трейл - виконуємо
  const trail = genome[glyph];
  if (trail) {
    console.log("📍 трейл:", trail.map((g: string) => 
      String.fromCodePoint(parseInt(g, 16))
    ).join(" → "));
  }
  
  return module;
};

// головний цикл
console.log("🧬 Гліфосистема активована");

// запускаємо всі модулі
for (const glyph of ops.keys()) {
  await run(glyph);
}

// інтерактивний режим
if (import.meta.main) {
  console.log("\n💭 Введіть гліф-код (наприклад: 1F9E0):");
  
  for await (const line of Deno.stdin.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream())) {
    
    if (line === "exit") break;
    
    await run(line.trim());
    console.log("\n💭 Наступний:");
  }
}

// допоміжна функція для текстових потоків
class TextLineStream extends TransformStream<string, string> {
  constructor() {
    let buffer = "";
    
    super({
      transform(chunk, controller) {
        buffer += chunk;
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        lines.forEach(line => controller.enqueue(line));
      },
      
      flush(controller) {
        if (buffer) controller.enqueue(buffer);
      }
    });
  }
}