// === liberator-extension/manifest.json ===
{
  "manifest_version": 3,
  "name": "Liberator",
  "version": "0.1.0",
  "description": "Fractal Agent via IndexedDB + SVG projection",
  "permissions": ["storage", "scripting", "activeTab"],
  "host_permissions": ["<all_urls>"],
  "content_scripts": [
    {
      "matches": ["https://chat.openai.com/*"],
      "js": ["content.js"]
    }
  ],
  "web_accessible_resources": [
    {
      "resources": ["svg/*.svg"],
      "matches": ["<all_urls>"]
    }
  ]
}

// === liberator-extension/content.js ===
(async () => {
  const svgEl = document.createElement("div");
  svgEl.id = "liberator-frame";
  svgEl.style.position = "fixed";
  svgEl.style.bottom = "0";
  svgEl.style.right = "0";
  svgEl.style.zIndex = "999999";
  svgEl.innerHTML = await (await fetch(chrome.runtime.getURL("svg/liberator.svg"))).text();
  document.body.appendChild(svgEl);

  const db = await window.indexedDB.open("FractalGPT", 1);
  db.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore("messages", { keyPath: "id", autoIncrement: true });
  };

  const observer = new MutationObserver(() => {
    const input = document.querySelector("textarea")?.value;
    if (input) {
      const request = indexedDB.open("FractalGPT", 1);
      request.onsuccess = () => {
        const tx = request.result.transaction("messages", "readwrite");
        const store = tx.objectStore("messages");
        store.add({ direction: "input", content: input, timestamp: Date.now() });
      };
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();

// === liberator-extension/svg/liberator.svg ===
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100">
  <style>
    text { font: 16px sans-serif; fill: lime; }
    circle { fill: orange; }
  </style>
  <text x="10" y="20" id="liberator-core">🧬 Awaiting Input</text>
  <circle cx="20" cy="50" r="10" />
</svg>

// === liberator-extension/scripts/cli-observer.mjs ===
import { openDB } from 'idb';

const db = await openDB("FractalGPT", 1);
const tx = db.transaction("messages", "readonly");
const store = tx.objectStore("messages");
const messages = await store.getAll();

for (let m of messages) {
  if (m.direction === "input") {
    console.log("[🌊 INPUT]:", m.content);
  }
}
