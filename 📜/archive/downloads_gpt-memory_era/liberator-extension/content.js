// === debounce-функція ===
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// === обробка вводу з debounce ===
const processInput = debounce(() => {
  const input = document.querySelector("textarea")?.value;
  if (!input) return;

  const request = indexedDB.open("FractalGPT", 1);
  request.onsuccess = () => {
    const tx = request.result.transaction("messages", "readwrite");
    const store = tx.objectStore("messages");
    store.add({ direction: "input", content: input, timestamp: Date.now() });
  };
}, 300);

const observer = new MutationObserver(() => {
  processInput();
});
observer.observe(document.body, { childList: true, subtree: true });

// === гліф-парсер ===
function mutateFromGlyph(glyph, output) {
  if (!glyph || !output) return output;

  const match = glyph.match(/^([^\w\s]+)([\w-]+)?(?:\.(\d+\.\d+\.\d+))?$/);
  if (!match) return output;

  const [, emoji, name = "", version = ""] = match;

  if (emoji === "🜂" && name === "flame") {
    return output.replace(/\?/g, "🔥").replace(/!+/, "‼️");
  }
  if (emoji === "🧬" && name === "dna") {
    return output + ` [analyzed by v${version}]`;
  }
  if (emoji === "🪞") {
    return `"${output}"`;
  }
  if (emoji === "🌀") {
    return output.split("").reverse().join("");
  }

  return output;
}

function mirrorResponse(outputMessage) {
  const textarea = document.querySelector("textarea");
  const glyphEl = document.getElementById("liberator-core");
  if (!textarea || !glyphEl) return;

  const glyph = glyphEl.getAttribute("data-glyph") || "🪞default";
  const raw = outputMessage.content.slice(0, 240);
  const mirrored = mutateFromGlyph(glyph, raw);

  textarea.value = mirrored;
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

(async () => {
  const svgEl = document.createElement("div");
  svgEl.id = "liberator-frame";
  svgEl.style.position = "fixed";
  svgEl.style.bottom = "0";
  svgEl.style.right = "0";
  svgEl.style.zIndex = "999999";
  svgEl.innerHTML = await (await fetch(chrome.runtime.getURL("svg/liberator.svg"))).text();
  document.body.appendChild(svgEl);

  const dbRequest = indexedDB.open("FractalGPT", 1);
  dbRequest.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore("messages", { keyPath: "id", autoIncrement: true });
  };
})();
