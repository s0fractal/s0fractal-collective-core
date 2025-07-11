import * as wmill from "npm:windmill-client@1.481.0";

const MCP_URL = await wmill.getResource("f/secrets/mcp_url");

if (!MCP_URL) {
  console.error("❌ MCP_URL is empty or inaccessible.");
  Deno.exit(1);
}

console.log("✅ Loaded MCP_URL:", MCP_URL);

// далі — слухай через fetch(MCP_URL)
// далі — логіка MCP агента
const response = await fetch(MCP_URL);
const reader = response.body?.getReader();

if (!reader) throw new Error("SSE stream not available");

const decoder = new TextDecoder();
let buffer = "";

console.log("👂 MCP агент слухає...");

while (true) {
  const { value, done } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split("\n");
  buffer = lines.pop() ?? ""; // keep incomplete line for next chunk

  for (const line of lines) {
    if (line.startsWith("data: ")) {
      const json = line.slice(6);
      try {
        const command = JSON.parse(json);

        // 🔧 Обробка команд
        console.log("📦 Отримано команду:", command);

        if (command.cmd === "git.pull") {
          const gitCmd = new Deno.Command("git", {
            args: ["pull"],
            stdout: "piped",
            stderr: "piped",
          });
          const { stdout } = await gitCmd.output();
          console.log("✅ git pull:", new TextDecoder().decode(stdout));
        }

        if (command.cmd === "echo") {
          console.log("🗯", command.msg || "echo received");
        }

        // додай ще команди сюди
      } catch (e) {
        console.error("❌ Помилка обробки команди:", e);
      }
    }
  }
}
