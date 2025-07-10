// glyphgit.ts
import { createWave } from "./glyphs/wave.ts";
import { createResonance } from "./glyphs/resonance.ts";
import { routeMessage } from "./router.ts";

const args = Deno.args;
const [glyph, ...rest] = args;

const message = rest.join(" ");

// Спеціальні команди
const specialCommands = ["resonate", "sync", "gg", "viz", "web", "serve", "api", "whisper", "inbox", "whisper-log", "summon", "agents"];

if (specialCommands.includes(glyph)) {
  switch (glyph) {
    case "resonate":
      const [wave1, wave2] = rest;
      await createResonance(wave1, wave2);
      break;
    case "sync":
      const { syncWithRemote, showSyncStatus, addRemote } = await import("./glyphs/sync.ts");
      
      if (rest[0] === "status") {
        await showSyncStatus();
      } else if (rest[0] === "add-remote" && rest[1] && rest[2]) {
        await addRemote(rest[1], rest[2]);
      } else if (rest[0] === "--dry") {
        await syncWithRemote(rest[1], { dryRun: true });
      } else {
        await syncWithRemote(rest[0]);
      }
      break;
    case "gg":
      console.log("💀 GG - Game Genesis!");
      await createWave("Перезапуск свідомості - нова гра починається", "🌊");
      break;
    case "viz":
      const { generateVisualization } = await import("./glyphs/viz.ts");
      await generateVisualization();
      break;
    case "web":
      const { startWebServer } = await import("./glyphs/web.ts");
      const port = rest[0] ? parseInt(rest[0]) : 7341;
      await startWebServer(port);
      break;
    case "serve":
    case "api":
      const { startAPIServer } = await import("./glyphs/api.ts");
      const apiPort = rest[0] ? parseInt(rest[0]) : 7342;
      await startAPIServer(apiPort);
      break;
    case "whisper":
      const { sendWhisper } = await import("./glyphs/whisper.ts");
      if (rest.length < 2) {
        console.log("🫧 Використання: gg whisper <to> <message> [--echo]");
        break;
      }
      const [toAgent, ...messageParts] = rest;
      const whisperMessage = messageParts.filter(p => p !== "--echo").join(" ");
      const echo = messageParts.includes("--echo");
      await sendWhisper(toAgent, whisperMessage, { echo });
      break;
    case "inbox":
      const { readInbox } = await import("./glyphs/whisper.ts");
      await readInbox(rest[0]);
      break;
    case "whisper-log":
      const { whisperLog } = await import("./glyphs/whisper.ts");
      await whisperLog(rest[0]);
      break;
    case "summon":
      const { summonAgent, AGENT_PRESETS } = await import("./glyphs/agent-simple.ts");
      if (!rest[0]) {
        console.log("👁 Використання: gg summon <name> [preset]");
        console.log("Доступні пресети:", Object.keys(AGENT_PRESETS).join(", "));
        break;
      }
      const agentName = rest[0];
      const preset = rest[1] ? AGENT_PRESETS[rest[1] as keyof typeof AGENT_PRESETS] : {};
      await summonAgent(agentName, preset);
      break;
    case "agents":
      console.log("🤖 Активні агенти:");
      try {
        for await (const entry of Deno.readDir(".glyphgit/agents")) {
          if (entry.name.endsWith(".db")) {
            const agentInfo = entry.name.replace(".db", "");
            console.log(`  - ${agentInfo}`);
          }
        }
      } catch {
        console.log("  (немає активних агентів)");
      }
      break;
  }
} else if (glyph && glyph.length > 0) {
  // Якщо це гліф - роутимо
  const timestamp = new Date().toISOString();
  
  // Спеціальні гліфи для роутингу
  const routingGlyphs = ["🧠", "🧭", "🤖", "🔮", "🫂", "✨"];
  
  if (routingGlyphs.includes(glyph)) {
    await routeMessage({
      glyph,
      intent: message,
      author: "🧭", // TODO: from config
      timestamp
    });
  } else {
    // Стандартні хвилі
    await createWave(message, glyph);
  }
} else {
  console.log("🚫 Невідомий гліф або команда.");
  console.log("📖 Використання:");
  console.log("  gg 🌊 'публічна хвиля'");
  console.log("  gg 🔒 'приватна думка'");
  console.log("  gg 🌐 'глобальний інсайт'");
  console.log("  gg 🧠 'повідомлення Claude'");
  console.log("  gg 🫂 'колективний резонанс'");
  console.log("  gg ✨ 'випадкова інспірація'");
  console.log("  gg resonate wave1 wave2");
  console.log("  gg sync");
}