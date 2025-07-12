// glyph-deno.ts - Гліфове Deno середовище

import { ГЛІФ_ТАБЛИЦЯ, обчислити, ГліфФормула } from "./glyph-core.ts";

// Розширюємо Deno гліфами
declare global {
  var 🌊: typeof identity;
  var 💭: typeof not;
  var 🔮: typeof or;
  var ✨: typeof and;
  var 🌱: typeof seed;
  var 🧬: typeof compose;
  var 📦: typeof глфСистема;
}

// Базові функції
const identity = (x: any) => x;
const not = (x: any) => !x;
const or = (x: any, y: any) => x || y;
const and = (x: any, y: any) => x && y;
const seed = () => Math.random();
const compose = (f: Function, g: Function) => (x: any) => f(g(x));

// Гліфова система
export const глфСистема = {
  // Встановити гліфи глобально
  встановити() {
    globalThis.🌊 = identity;
    globalThis.💭 = not;
    globalThis.🔮 = or;
    globalThis.✨ = and;
    globalThis.🌱 = seed;
    globalThis.🧬 = compose;
    globalThis.📦 = глфСистема;
  },
  
  // Визначити новий гліф
  визначити(гліф: string, операція: Function) {
    ГЛІФ_ТАБЛИЦЯ[гліф] = операція;
    (globalThis as any)[гліф] = операція;
  },
  
  // Імпортувати гліфовий модуль
  async імпортувати(шлях: string): Promise<any> {
    const модуль = await import(шлях);
    
    // Шукаємо експортовані гліфи
    for (const [ключ, значення] of Object.entries(модуль)) {
      if (ключ.match(/^[\u{1F300}-\u{1F9FF}]/u)) {
        глфСистема.визначити(ключ, значення as Function);
      }
    }
    
    return модуль;
  },
  
  // Виконати гліфовий файл
  async виконати(файл: string): Promise<any> {
    const код = await Deno.readTextFile(файл);
    const рядки = код.split("\n").filter(р => р.trim());
    
    let результат;
    for (const рядок of рядки) {
      // Кожен рядок - це формула
      const формула = рядок.trim().split(/\s+/);
      результат = обчислити(формула as ГліфФормула);
    }
    
    return результат;
  }
};

// Гліфова файлова система
export const 🗂️ = {
  // Читати як формулу
  async читати(шлях: string): Promise<ГліфФормула> {
    const текст = await Deno.readTextFile(шлях);
    return текст.trim().split(/\s+/) as ГліфФормула;
  },
  
  // Записати формулу
  async записати(шлях: string, формула: ГліфФормула): Promise<void> {
    await Deno.writeTextFile(шлях, формула.join(" "));
  },
  
  // Виконати файл як формулу
  async виконати(шлях: string, вхід?: any): Promise<any> {
    const формула = await this.читати(шлях);
    return обчислити(формула, вхід);
  }
};

// Гліфовий HTTP сервер
export const 🌐 = {
  // Створити сервер з гліфовими ендпоінтами
  сервер(порт: number, маршрути: Record<string, ГліфФормула>) {
    return Deno.serve({ port }, (запит) => {
      const url = new URL(запит.url);
      const шлях = url.pathname;
      
      const формула = маршрути[шлях];
      if (!формула) {
        return new Response("404: Гліф не знайдено", { status: 404 });
      }
      
      // Вхідні дані з query params або body
      const вхід = Object.fromEntries(url.searchParams);
      const результат = обчислити(формула, вхід);
      
      return new Response(
        JSON.stringify({ результат }),
        { headers: { "content-type": "application/json" } }
      );
    });
  }
};

// Гліфова база даних (SQLite)
export const 🗄️ = {
  // Відкрити базу
  async відкрити(шлях: string) {
    const { DB } = await import("https://deno.land/x/sqlite@v3.4.0/mod.ts");
    const db = new DB(шлях);
    
    // Створюємо гліфову таблицю
    db.execute(`
      CREATE TABLE IF NOT EXISTS "🌊" (
        "🔑" TEXT PRIMARY KEY,
        "📝" TEXT NOT NULL,
        "⏰" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    return {
      // Записати формулу
      записати(ключ: string, формула: ГліфФормула) {
        db.query(
          `INSERT OR REPLACE INTO "🌊" ("🔑", "📝") VALUES (?, ?)`,
          [ключ, формула.join(" ")]
        );
      },
      
      // Прочитати і виконати
      виконати(ключ: string, вхід?: any): any {
        const [[формулаТекст]] = db.query<[string]>(
          `SELECT "📝" FROM "🌊" WHERE "🔑" = ?`,
          [ключ]
        );
        
        if (!формулаТекст) return undefined;
        
        const формула = формулаТекст.split(" ") as ГліфФормула;
        return обчислити(формула, вхід);
      },
      
      // Закрити
      закрити() {
        db.close();
      }
    };
  }
};

// Ідемпотентна установка
export async function встановитиГліфовеСередовище() {
  // Перевіряємо чи вже встановлено
  if (globalThis.🌊) {
    console.log("✅ Гліфове середовище вже активне");
    return;
  }
  
  // Встановлюємо
  глфСистема.встановити();
  
  // Створюємо глобальні посилання
  (globalThis as any).🗂️ = 🗂️;
  (globalThis as any).🌐 = 🌐;
  (globalThis as any).🗄️ = 🗄️;
  
  console.log("🌟 Гліфове середовище встановлено");
}

// Автоматично встановлюємо при імпорті
await встановитиГліфовеСередовище();