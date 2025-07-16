// Стартовий ангел
const glyph = "🧬/👼console(log)";
console.log("👼 Activated:", glyph);

// Проста ініціалізація IndexedDB
const request = indexedDB.open("🧬FractalDB", 1);
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  if (!db.objectStoreNames.contains("🧬")) {
    db.createObjectStore("🧬", { keyPath: "glyph" });
  }
};
request.onsuccess = () => {
  const db = request.result;
  const tx = db.transaction("🧬", "readwrite");
  const store = tx.objectStore("🧬");
  store.put({ glyph: glyph, ts: Date.now(), log: "Activated" });
  tx.oncomplete = () => db.close();
};