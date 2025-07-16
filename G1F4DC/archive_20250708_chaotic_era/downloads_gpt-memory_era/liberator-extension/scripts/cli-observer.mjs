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
