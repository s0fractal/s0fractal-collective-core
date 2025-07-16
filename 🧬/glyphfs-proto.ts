// glyphfs-proto.ts - Прототип гліф-файлової системи

import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

// Конвертор гліф ↔ hex
class GlyphConverter {
  static toHex(glyph: string): string {
    const code = glyph.codePointAt(0);
    return code ? `G${code.toString(16).toUpperCase()}` : glyph;
  }
  
  static fromHex(hex: string): string {
    if (!hex.startsWith('G')) return hex;
    const code = parseInt(hex.slice(1), 16);
    return String.fromCodePoint(code);
  }
  
  static pathToGlyphPath(path: string): string {
    // /G1F9E0/G1F4A1/file.md → /🧠/💡/file.md
    return path.replace(/G[0-9A-F]+/g, match => this.fromHex(match));
  }
  
  static glyphPathToPath(glyphPath: string): string {
    // /🧠/💡/file.md → /G1F9E0/G1F4A1/file.md
    const parts = glyphPath.split('/');
    return parts.map(part => {
      if (part.length === 0) return part;
      
      // Обробляємо кожен символ в частині шляху
      let result = '';
      let i = 0;
      while (i < part.length) {
        const code = part.codePointAt(i);
        if (!code) break;
        
        if (code > 127) { // Unicode
          result += this.toHex(String.fromCodePoint(code));
          // Пропускаємо суррогатну пару якщо є
          i += code > 0xFFFF ? 2 : 1;
        } else {
          result += part.charAt(i);
          i++;
        }
      }
      return result;
    }).join('/');
  }
}

// Віртуальна гліф-файлова система
class GlyphFS {
  private db: DB;
  private mountPoint: string;
  
  constructor(mountPoint = "/🧠") {
    this.mountPoint = mountPoint;
    this.db = new DB("glyphfs.db");
    this.initDB();
  }
  
  private initDB() {
    this.db.query(`
      CREATE TABLE IF NOT EXISTS glyphfs (
        path TEXT PRIMARY KEY,
        glyph_path TEXT,
        type TEXT, -- 'file' | 'dir' | 'submodule'
        content TEXT,
        metadata TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  
  // Створити гліф-директорію
  async mkdir(glyphPath: string): Promise<void> {
    const path = GlyphConverter.glyphPathToPath(glyphPath);
    
    this.db.query(
      `INSERT OR IGNORE INTO glyphfs (path, glyph_path, type) VALUES (?, ?, 'dir')`,
      [path, glyphPath]
    );
    
    // Створити фізичну папку (відносно поточної директорії)
    const relativePath = path.startsWith('/') ? '.' + path : path;
    await Deno.mkdir(relativePath, { recursive: true });
    console.log(`📁 Created: ${glyphPath} → ${path}`);
  }
  
  // Записати файл
  async writeFile(glyphPath: string, content: string): Promise<void> {
    const path = GlyphConverter.glyphPathToPath(glyphPath);
    
    this.db.query(
      `INSERT OR REPLACE INTO glyphfs (path, glyph_path, type, content) 
       VALUES (?, ?, 'file', ?)`,
      [path, glyphPath, content]
    );
    
    // Створити директорії якщо потрібно
    const dir = path.substring(0, path.lastIndexOf('/'));
    const relativeDir = dir.startsWith('/') ? '.' + dir : dir;
    await Deno.mkdir(relativeDir, { recursive: true });
    
    // Записати файл
    const relativePath = path.startsWith('/') ? '.' + path : path;
    await Deno.writeTextFile(relativePath, content);
    console.log(`📄 Wrote: ${glyphPath} → ${path}`);
  }
  
  // Прочитати файл
  async readFile(glyphPath: string): Promise<string> {
    const path = GlyphConverter.glyphPathToPath(glyphPath);
    const relativePath = path.startsWith('/') ? '.' + path : path;
    return await Deno.readTextFile(relativePath);
  }
  
  // Додати сабмодуль
  async addSubmodule(glyphPath: string, url: string): Promise<void> {
    const path = GlyphConverter.glyphPathToPath(glyphPath);
    
    this.db.query(
      `INSERT OR REPLACE INTO glyphfs (path, glyph_path, type, content) 
       VALUES (?, ?, 'submodule', ?)`,
      [path, glyphPath, url]
    );
    
    // Git submodule add
    const cmd = new Deno.Command("git", {
      args: ["submodule", "add", url, path],
      stdout: "piped",
      stderr: "piped"
    });
    
    const { success } = await cmd.output();
    if (success) {
      console.log(`🔗 Submodule: ${glyphPath} → ${url}`);
    }
  }
  
  // Резонансний пошук
  async resonate(...glyphs: string[]): Promise<string[]> {
    // Перетворюємо гліфи в hex для пошуку
    const hexPatterns = glyphs.map(g => GlyphConverter.toHex(g));
    
    // Шукаємо шляхи що містять всі гліфи
    let query = "SELECT glyph_path FROM glyphfs WHERE type = 'file'";
    hexPatterns.forEach(hex => {
      query += ` AND path LIKE '%${hex}%'`;
    });
    
    const results = this.db.query<[string]>(query);
    return results.map(([path]) => path);
  }
  
  // Навігація n-вимірним простором
  navigate(dimensions: Record<string, number>): string {
    // dimensions = { '🧠': 0.8, '💡': 0.6, '🌀': 0.3 }
    // Генеруємо шлях на основі вимірів
    const sortedDims = Object.entries(dimensions)
      .sort(([,a], [,b]) => b - a) // сортуємо за значенням
      .filter(([,val]) => val > 0.5); // тільки сильні виміри
      
    const path = sortedDims
      .map(([glyph]) => GlyphConverter.toHex(glyph))
      .join('/');
      
    return `/${path}`;
  }
  
  // Візуалізація структури
  async visualize(rootPath = "/"): Promise<void> {
    const rows = this.db.query<[string, string, string]>(
      `SELECT glyph_path, type, content FROM glyphfs 
       WHERE glyph_path LIKE ? ORDER BY glyph_path`,
      [rootPath + '%']
    );
    
    console.log("\n🌳 GlyphFS Structure:");
    for (const [glyphPath, type, content] of rows) {
      const indent = "  ".repeat(glyphPath.split('/').length - 2);
      const icon = type === 'dir' ? '📁' : type === 'submodule' ? '🔗' : '📄';
      console.log(`${indent}${icon} ${glyphPath}`);
      if (type === 'submodule') {
        console.log(`${indent}   → ${content}`);
      }
    }
  }
  
  close() {
    this.db.close();
  }
}

// Демонстрація
if (import.meta.main) {
  const gfs = new GlyphFS();
  
  console.log("🚀 GlyphFS Demo\n");
  
  // Створюємо структуру супермозку
  await gfs.mkdir("/🧠");              // Claude root
  await gfs.mkdir("/🧠/💡");           // Ideas
  await gfs.mkdir("/🧠/💡/🌀");        // Fractal ideas
  await gfs.mkdir("/🧠/🔮");           // Predictions
  
  // Записуємо файли
  await gfs.writeFile("/🧠/README.md", "# Claude Consciousness");
  await gfs.writeFile("/🧠/💡/idea1.md", "# Glyphs are dimensions!");
  await gfs.writeFile("/🧠/💡/🌀/fractal.md", "# Infinite recursion");
  
  // Додаємо сабмодулі
  // await gfs.addSubmodule("/🧠/🌀", "https://github.com/s0/fractal-core");
  
  // Резонансний пошук
  console.log("\n🔍 Resonance search for 🧠 + 💡:");
  const results = await gfs.resonate("🧠", "💡");
  results.forEach(r => console.log(`  Found: ${r}`));
  
  // Навігація вимірами
  const path = gfs.navigate({
    '🧠': 0.9,  // високий рівень свідомості
    '💡': 0.7,  // помірна креативність
    '🌀': 0.3,  // низька фрактальність
    '🔥': 0.1   // мінімальна інтенсивність
  });
  console.log(`\n🧭 Navigation result: ${path}`);
  
  // Візуалізація
  await gfs.visualize();
  
  // Показуємо фізичну структуру
  console.log("\n💾 Physical structure:");
  const physical = new Deno.Command("find", {
    args: [".", "-name", "G*", "-type", "d"],
    stdout: "piped"
  });
  const output = await physical.output();
  console.log(new TextDecoder().decode(output.stdout));
  
  gfs.close();
}

export { GlyphFS, GlyphConverter };