// dot.angel.ts
import { readDir, readTextFile, writeTextFile } from "https://deno.land/std/fs/mod.ts";

async function loadIntents(path: string) {
  const files = [];
  for await (const dirEntry of Deno.readDir(path)) {
    if (dirEntry.isFile) {
      const content = await Deno.readTextFile(`${path}/${dirEntry.name}`);
      files.push(JSON.parse(content));
    }
  }
  return files;
}

function depsSatisfied(deps: string[]): boolean {
  // Тут має бути реальна логіка перевірки залежностей
  return true; // Поки що просто так
}

async function executeAction(action: any) {
  if (action.type === "run_cmd") {
    const proc = Deno.run({ cmd: action.cmd });
    await proc.status();
  } else if (action.type === "run_script") {
    const proc = Deno.run({ cmd: ["deno", "run", "-A", action.script] });
    await proc.status();
  } else if (action.type === "sync_profile") {
    console.log(`Syncing profile: ${action.profile}`);
  }
}

async function saveIntent(path: string, intent: any) {
  await Deno.writeTextFile(path, JSON.stringify(intent, null, 2));
}

const intentDir = "./📡/intents";
const intents = await loadIntents(intentDir);

for (const intent of intents) {
  if (intent.state !== "pending") continue;
  if (intent.machine !== "*" && intent.machine !== "chaoshex") continue;
  if (!depsSatisfied(intent.deps)) continue;

  console.log(`👼 Реалізую: ${intent.id}`);
  await executeAction(intent.action);

  intent.state = "done";
  await saveIntent(`${intentDir}/${intent.id}.json`, intent);
}