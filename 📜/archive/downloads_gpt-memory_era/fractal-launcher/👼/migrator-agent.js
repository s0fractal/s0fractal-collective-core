
const openFractalDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("🧬FractalDB", 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const migrateEntry = async (entry) => {
  const patch = entry?.["🧠"]?.patch;
  const script = entry?.["🧠"]?.script;

  if (patch) {
    console.log("🧬 Applying patch:", patch);
    entry[patch.field] = patch.value;
  }

  if (script) {
    console.log("🧬 Running script...");
    try {
      const fn = new Function("entry", script);
      fn(entry);
    } catch (e) {
      console.warn("🧬 Script failed:", e);
    }
  }

  const db = await openFractalDB();
  const tx = db.transaction("🧬", "readwrite");
  tx.objectStore("🧬").put(entry);
};

const runMigrator = async () => {
  const db = await openFractalDB();
  const tx = db.transaction("🧬", "readonly");
  const store = tx.objectStore("🧬");

  const request = store.openCursor();
  request.onsuccess = async (event) => {
    const cursor = event.target.result;
    if (cursor) {
      const entry = cursor.value;
      const needsMigration =
        entry?.["🧠"]?.patch !== undefined || entry?.["🧠"]?.script !== undefined;

      if (needsMigration) {
        await migrateEntry(entry);
      }
      cursor.continue();
    }
  };
};

runMigrator();
