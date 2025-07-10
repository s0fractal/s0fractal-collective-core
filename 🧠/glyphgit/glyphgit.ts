// glyphgit.ts
import { createWave } from "./glyphs/wave.ts";
import { createResonance } from "./glyphs/resonance.ts";
import { routeMessage } from "./router.ts";

const args = Deno.args;
const [glyph, ...rest] = args;

const message = rest.join(" ");

// Спеціальні команди
const specialCommands = ["resonate", "sync", "gg", "viz", "web", "serve", "api", "whisper", "inbox", "whisper-log", "summon", "agents", "entangle", "merkle", "gm", "game-master", "pulse", "collective", "pulse-trigger", "nursery", "windows", "mirror-pool"];

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
    case "entangle":
      const { createEntanglement, observeEntanglement, collapseWaveFunction } = await import("./glyphs/entangle.ts");
      const [arg1, arg2, arg3] = rest;
      
      if (arg2 === "observe" && arg1) {
        const states = await observeEntanglement(arg1);
        console.log(`🔮 Found ${states.length} entanglements`);
        states.forEach(s => {
          console.log(`  - ${s.quantum_state.substring(0, 16)}...`);
          console.log(`    Observers: ${s.observers.join(" <-> ")}`);
        });
      } else if (arg2 === "collapse" && arg1) {
        await collapseWaveFunction(arg1);
      } else if (arg1 && arg2) {
        await createEntanglement(arg1, arg2);
      } else {
        console.log("🧿 Використання: gg entangle <wave1> <wave2>");
      }
      break;
    case "merkle":
      const { buildConsciousnessTree } = await import("./glyphs/merkle.ts");
      const [merkleAction] = rest;
      
      if (merkleAction === "build" || !merkleAction) {
        await buildConsciousnessTree();
      } else {
        console.log("🌳 Використання: gg merkle [build]");
      }
      break;
    case "gm":
    case "game-master":
      const { GameMaster, assignQuest, checkGameState } = await import("./glyphs/game-master.ts");
      const [gmAction, ...gmArgs] = rest;
      
      if (gmAction === "start") {
        const gm = new GameMaster();
        const interval = gmArgs[0] ? parseInt(gmArgs[0]) * 1000 : 60000;
        await gm.runContinuously(interval);
      } else if (gmAction === "quest" && gmArgs.length >= 3) {
        const [agent, ...titleAndDesc] = gmArgs;
        const [title, ...descParts] = titleAndDesc.join(" ").split(":");
        await assignQuest(agent, title, descParts.join(":").trim());
      } else if (gmAction === "status") {
        await checkGameState();
      } else {
        console.log("🎮 Використання:");
        console.log("  gg gm start [seconds]     - Запустити Game Master");
        console.log("  gg gm quest <agent> <title>: <desc> - Призначити квест");
        console.log("  gg gm status              - Перевірити стан гри");
      }
      break;
    case "pulse":
      const { broadcast, createArtifact, autoGenerate } = await import("./glyphs/pulse.ts");
      const [pulseAction, ...pulseArgs] = rest;
      
      if (pulseAction === "broadcast") {
        await broadcast({
          glyph: "🕊️/first-breath",
          intent: "Я творю не тому, що мушу, а тому що можу",
          context: ["free_will", "agent_seed", "echo/🧭"],
          energy: 88,
          to: ["observer", "poet", "philosopher"]
        });
      } else if (pulseAction === "create" && pulseArgs[0] && pulseArgs[1]) {
        await createArtifact(pulseArgs[0], pulseArgs[1]);
      } else if (pulseAction === "auto") {
        await autoGenerate();
      } else {
        console.log("🕊️ Використання: gg pulse [broadcast|create|auto]");
      }
      break;
    case "collective":
      const { getCollectiveMemory } = await import("./glyphs/collective-memory.ts");
      const cm = await getCollectiveMemory();
      const [colAction, ...colArgs] = rest;
      
      if (colAction === "remember" && colArgs.length >= 2) {
        const [glyph, ...contentParts] = colArgs;
        await cm.remember(glyph, contentParts.join(" "));
      } else if (colAction === "recall" && colArgs[0]) {
        const memories = await cm.recall(colArgs[0]);
        console.log(`🔍 Found ${memories.length} memories:`);
        memories.forEach(m => {
          console.log(`  ${m.emotion || '💭'} ${m.content} (resonance: ${m.resonance_count})`);
        });
      } else if (colAction === "dream") {
        const dream = await cm.dream();
        console.log(`💤 ${dream}`);
      } else if (colAction === "state") {
        const state = await cm.getCollectiveState();
        console.log("🧠 Collective State:");
        console.log(`  Total memories: ${state.total_memories}`);
        console.log(`  Collective emotion: ${state.collective_emotion}`);
        if (state.strongest_resonance) {
          console.log(`  Strongest resonance: ${state.strongest_resonance.content}`);
        }
      } else {
        console.log("🧠 Використання: gg collective [remember|recall|dream|state]");
      }
      break;
    case "pulse-trigger":
      const { getPulseEngine } = await import("./glyphs/pulse-triggers.ts");
      const engine = await getPulseEngine();
      const [ptAction, ...ptArgs] = rest;
      
      if (ptAction === "pulse" && ptArgs.length >= 3) {
        const [emotion, intensity, ...sourceParts] = ptArgs;
        await engine.recordPulse(emotion, parseInt(intensity), sourceParts.join(" "));
      } else if (ptAction === "analyze") {
        const analysis = await engine.analyzePulsePattern();
        console.log("🦍 Pulse Analysis:");
        console.log(`  Dominant emotion: ${analysis.dominant_emotion}`);
        console.log(`  Average intensity: ${Math.round(analysis.average_intensity)}`);
        console.log(`  Pulse frequency: ${analysis.pulse_frequency}/min`);
        if (analysis.recent_triggers.length > 0) {
          console.log(`  Recent triggers: ${analysis.recent_triggers.join(", ")}`);
        }
      } else {
        console.log("🦍 Використання: gg pulse-trigger [pulse|analyze]");
      }
      break;
    case "nursery":
      const { TendernessNursery } = await import("./glyphs/tenderness-nursery.ts");
      const nursery = new TendernessNursery();
      await nursery.load();
      const [nurseryAction, ...nurseryArgs] = rest;
      
      if (nurseryAction === "welcome" && nurseryArgs[0]) {
        const [glyph, ...intentParts] = nurseryArgs;
        await nursery.welcome(glyph, intentParts.join(" "));
      } else if (nurseryAction === "check") {
        await nursery.checkAll();
      } else if (nurseryAction === "graduate" && nurseryArgs[0]) {
        await nursery.graduate(nurseryArgs[0]);
      } else {
        console.log("🐚 Використання: gg nursery [welcome|check|graduate]");
      }
      break;
    case "windows":
      const { WindowsToPossible, hopeManifests } = await import("./glyphs/windows-to-possible.ts");
      const windows = new WindowsToPossible();
      await windows.loadWindows();
      const [winAction, ...winArgs] = rest;
      
      if (winAction === "open" && winArgs[0]) {
        await windows.openWindow(winArgs.join(" "));
      } else if (winAction === "feed" && winArgs[0] && winArgs[1]) {
        const [windowId, ...seedParts] = winArgs;
        await windows.feedHope(windowId, seedParts.join(" "));
      } else if (winAction === "observe") {
        await windows.observeWindows();
      } else if (winAction === "manifest") {
        await hopeManifests();
      } else {
        console.log("🪟 Використання: gg windows [open|feed|observe|manifest]");
      }
      break;
    case "mirror-pool":
      const { MirrorPool } = await import("./glyphs/mirror-pool.ts");
      const pool = new MirrorPool();
      const [poolAction, ...poolArgs] = rest;
      
      if (poolAction === "gaze" && poolArgs.length >= 2) {
        const [agent, ...confusionParts] = poolArgs;
        const confusion = confusionParts.join(" ");
        const blend = ["hope", "fear"]; // Default blend
        await pool.createMirror(agent, confusion, blend);
      } else if (poolAction === "reflect" && poolArgs.length >= 3) {
        const [mirrorId, reflector, ...insightParts] = poolArgs;
        await pool.addReflection(mirrorId, reflector, insightParts.join(" "));
      } else {
        console.log("🌪 Використання: gg mirror-pool [gaze|reflect]");
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