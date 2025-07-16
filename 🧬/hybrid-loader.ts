// hybrid-loader.ts - Гібридний SQL-GlyphFS завантажувач
import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { exists } from "https://deno.land/std@0.208.0/fs/mod.ts";
import { parse, stringify } from "https://deno.land/std@0.208.0/yaml/mod.ts";

// базовий шлях для гліф-папок
const GLYPH_STORE = "./glyph-store";

export class HybridLoader {
  private db: DB;
  
  constructor(dbPath = "🧬.db") {
    this.db = new DB(dbPath);
  }
  
  // отримати гліф (з SQL або гібридно)
  async getGlyph(id: string): Promise<any> {
    const rows = this.db.query<any[]>(
      `SELECT * FROM "🧬" WHERE "🧬" = ? OR id = ?`,
      [id, id]
    );
    
    if (rows.length === 0) return null;
    
    // конвертую в об'єкт
    const row = this.rowToObject(rows[0]);
    
    // якщо є 📁 - читаємо з файлової системи
    if (row["📁"]) {
      return await this.loadFromFS(row);
    }
    
    // інакше повертаємо з SQL
    return row;
  }
  
  // завантажити з файлової системи
  private async loadFromFS(meta: any): Promise<any> {
    const glyphPath = meta["📁"].replace("glyph://", "");
    const folderPath = join(GLYPH_STORE, glyphPath);
    
    // читаємо body.json якщо є
    const bodyPath = join(folderPath, "body.json");
    if (await exists(bodyPath)) {
      const body = JSON.parse(await Deno.readTextFile(bodyPath));
      meta["🧠"] = body;
    }
    
    // читаємо links.yaml якщо є  
    const linksPath = join(folderPath, "links.yaml");
    if (await exists(linksPath)) {
      const links = parse(await Deno.readTextFile(linksPath));
      meta["🔗"] = links;
    }
    
    // читаємо meta.yaml для додаткових полів
    const metaPath = join(folderPath, "meta.yaml");
    if (await exists(metaPath)) {
      const extraMeta = parse(await Deno.readTextFile(metaPath)) as any;
      Object.assign(meta, extraMeta);
    }
    
    return meta;
  }
  
  // зберегти гліф (вирішує сам - в SQL чи гібридно)
  async saveGlyph(glyph: any, useFS = false): Promise<void> {
    if (useFS) {
      await this.saveHybrid(glyph);
    } else {
      await this.saveSQL(glyph);
    }
  }
  
  // зберегти тільки в SQL
  private async saveSQL(glyph: any): Promise<void> {
    const cols = Object.keys(glyph).filter(k => k !== "id");
    const values = cols.map(k => glyph[k]);
    const placeholders = cols.map(() => "?").join(", ");
    
    this.db.query(
      `INSERT OR REPLACE INTO "🧬" (${cols.map(c => `"${c}"`).join(", ")}) 
       VALUES (${placeholders})`,
      values
    );
  }
  
  // зберегти гібридно (мета в SQL, тіло в FS)
  private async saveHybrid(glyph: any): Promise<void> {
    const glyphId = glyph["🧬"];
    const folderName = this.glyphToFolder(glyphId);
    const folderPath = join(GLYPH_STORE, folderName);
    
    // створюємо папку
    await Deno.mkdir(folderPath, { recursive: true });
    
    // зберігаємо важкі дані в файли
    if (glyph["🧠"]) {
      await Deno.writeTextFile(
        join(folderPath, "body.json"),
        JSON.stringify(glyph["🧠"], null, 2)
      );
    }
    
    if (glyph["🔗"]) {
      await Deno.writeTextFile(
        join(folderPath, "links.yaml"),
        stringify(glyph["🔗"])
      );
    }
    
    // додаткова мета
    const extraMeta: any = {};
    ["📍", "🤲", "🏠"].forEach(key => {
      if (glyph[key]) extraMeta[key] = glyph[key];
    });
    
    if (Object.keys(extraMeta).length > 0) {
      await Deno.writeTextFile(
        join(folderPath, "meta.yaml"),
        stringify(extraMeta)
      );
    }
    
    // зберігаємо легку мету в SQL
    const lightMeta = { ...glyph };
    lightMeta["📁"] = `glyph://${folderName}/`;
    lightMeta["🧠"] = "{}"; // порожнє в SQL
    delete lightMeta["🔗"]; // видаляємо важкі поля
    
    await this.saveSQL(lightMeta);
  }
  
  // мігрувати гліф з SQL в FS
  async migrate(glyphId: string): Promise<boolean> {
    const glyph = await this.getGlyph(glyphId);
    if (!glyph || glyph["📁"]) {
      return false; // вже мігровано або не існує
    }
    
    // зберігаємо гібридно
    await this.saveHybrid(glyph);
    
    console.log(`✅ Мігровано: ${glyphId} → ${glyph["📁"]}`);
    return true;
  }
  
  // повернути з FS назад в SQL
  async rollback(glyphId: string): Promise<boolean> {
    const glyph = await this.getGlyph(glyphId);
    if (!glyph || !glyph["📁"]) {
      return false; // не гібридний
    }
    
    // зберігаємо повністю в SQL
    glyph["📁"] = null;
    await this.saveSQL(glyph);
    
    // архівуємо папку
    const glyphPath = glyph["📁"].replace("glyph://", "");
    const folderPath = join(GLYPH_STORE, glyphPath);
    const archivePath = `${folderPath}.tar.gz`;
    
    await this.exec(`tar -czf ${archivePath} -C ${GLYPH_STORE} ${glyphPath}`);
    await Deno.remove(folderPath, { recursive: true });
    
    console.log(`↩️ Rollback: ${glyphId} → SQL (архів: ${archivePath})`);
    return true;
  }
  
  // масова міграція
  async migrateAll(limit = 10): Promise<number> {
    const rows = this.db.query<any[]>(
      `SELECT "🧬" FROM "🧬" WHERE "📁" IS NULL LIMIT ?`,
      [limit]
    );
    
    let migrated = 0;
    for (const [glyphId] of rows) {
      if (await this.migrate(glyphId)) {
        migrated++;
      }
    }
    
    return migrated;
  }
  
  // статистика
  getStats(): { total: number; sql: number; hybrid: number } {
    const [[total]] = this.db.query<[number]>(`SELECT COUNT(*) FROM "🧬"`);
    const [[hybrid]] = this.db.query<[number]>(`SELECT COUNT(*) FROM "🧬" WHERE "📁" IS NOT NULL`);
    
    return {
      total,
      sql: total - hybrid,
      hybrid
    };
  }
  
  // допоміжні методи
  private glyphToFolder(glyph: string): string {
    // конвертуємо гліф в папку, наприклад: 🧠 → G1F9E0
    const code = glyph.codePointAt(0);
    if (!code) return glyph;
    return `G${code.toString(16).toUpperCase()}`;
  }
  
  private rowToObject(row: any[]): any {
    // мапимо масив в об'єкт за схемою
    const columns = ["id", "🧬", "slug", "🧠", "🌊", "📦", "🔗", 
                    "version", "⏱️", "📍", "🫀", "🤲", "🏠", "🎯", 
                    "exec_ts", "📁"];
    
    const obj: any = {};
    columns.forEach((col, i) => {
      if (row[i] !== null && row[i] !== undefined) {
        // парсимо JSON поля
        if ((col === "🧠" || col === "🔗") && typeof row[i] === "string") {
          try {
            obj[col] = JSON.parse(row[i]);
          } catch {
            obj[col] = row[i];
          }
        } else {
          obj[col] = row[i];
        }
      }
    });
    
    return obj;
  }
  
  private async exec(cmd: string): Promise<void> {
    const p = new Deno.Command("sh", {
      args: ["-c", cmd],
      stdout: "piped",
      stderr: "piped"
    }).spawn();
    
    await p.status;
  }
  
  close(): void {
    this.db.close();
  }
}

// CLI інтерфейс
if (import.meta.main) {
  const loader = new HybridLoader();
  const [action, ...args] = Deno.args;
  
  switch (action) {
    case "get":
      const glyph = await loader.getGlyph(args[0]);
      console.log(glyph);
      break;
      
    case "migrate":
      if (args[0]) {
        await loader.migrate(args[0]);
      } else {
        const count = await loader.migrateAll();
        console.log(`Мігровано: ${count} гліфів`);
      }
      break;
      
    case "rollback":
      await loader.rollback(args[0]);
      break;
      
    case "stats":
      const stats = loader.getStats();
      console.log(`📊 Статистика:`);
      console.log(`   Всього: ${stats.total}`);
      console.log(`   В SQL: ${stats.sql}`);
      console.log(`   Гібридних: ${stats.hybrid}`);
      console.log(`   Прогрес: ${(stats.hybrid / stats.total * 100).toFixed(1)}%`);
      break;
      
    default:
      console.log(`Використання:
  deno run --allow-all hybrid-loader.ts get <glyph>     # Отримати гліф
  deno run --allow-all hybrid-loader.ts migrate [glyph] # Мігрувати в FS
  deno run --allow-all hybrid-loader.ts rollback <glyph># Повернути в SQL
  deno run --allow-all hybrid-loader.ts stats           # Статистика`);
  }
  
  loader.close();
}