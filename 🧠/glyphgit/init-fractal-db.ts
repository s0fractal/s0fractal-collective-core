// init-fractal-db.ts - Ініціалізація фрактальної бази

import { DB } from "https://deno.land/x/sqlite@v3.4.0/mod.ts";

// Створюємо SQLite версію фрактальної бази
export async function ініціалізуватиФрактальнуБазу() {
  const db = new DB(".glyphgit/fractal.db");
  
  console.log("🌌 Великий вибух фрактальної бази...");
  
  // Створюємо таблицю - точно як в SQL вище
  db.execute(`
    create table if not exists "🧬" (
      id text primary key,
      "🧬" text unique not null,
      slug text unique,
      "🌊" text,
      "🫧" text,
      "🧠" text default '{}',
      "🔗" text default '[]',
      "⏱️" datetime default current_timestamp,
      "🏠" text,
      "🫀" text,
      "🤲" text,
      "🎯" text,
      "📦" text default 'loose',
      "📍" text,
      version text
    )
  `);
  
  // Первинні гліфи
  const первинні = [
    ['🌌', 'universe', 'розширюється', '{"тип": "первинний"}', '["⚛️","🌊","🔥"]', 'початок', 'існувати'],
    ['⚛️', 'quantum', 'суперпозиція', '{"стани": ["0", "1"]}', '["🌌","🔮"]', 'субатомний', 'бути і не бути'],
    ['🌊', 'wave', 'тече', '{"форма": "хвиля"}', '["⚛️","🌀"]', 'всюди', 'текти'],
    ['🔥', 'fire', 'горить', '{"температура": "∞"}', '["🌌","💨"]', 'енергія', 'трансформувати'],
    ['💨', 'air', 'дме', '{"напрям": "всі"}', '["🔥","🌊"]', 'простір', 'рухати'],
    ['🌍', 'earth', 'обертається', '{"життя": true}', '["🌊","🔥","💨"]', 'планета', 'народжувати'],
    ['🧬', 'dna', 'реплікується', '{"код": "ATGC"}', '["🌍","⚛️"]', 'клітина', 'еволюціонувати'],
    ['🧠', 'mind', 'мислить', '{"свідомість": "емерджентна"}', '["🧬","🌌"]', 'мозок', 'усвідомлювати'],
    ['🔮', 'oracle', 'передбачає', '{"час": "нелінійний"}', '["⚛️","🧠"]', 'між_світами', 'знати']
  ];
  
  // Вставляємо первинні гліфи
  for (const гліф of первинні) {
    const id = crypto.randomUUID();
    db.query(
      `insert or ignore into "🧬" 
       (id, "🧬", slug, "🌊", "🧠", "🔗", "🏠", "🎯") 
       values (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, ...гліф]
    );
  }
  
  console.log("✨ Створено первинні гліфи");
  
  // Функція резонансу
  db.createFunction("резонанс", (г1: string, г2: string) => {
    const [[зв1]] = db.query<[string]>(`select "🔗" from "🧬" where "🧬" = ?`, [г1]);
    const [[зв2]] = db.query<[string]>(`select "🔗" from "🧬" where "🧬" = ?`, [г2]);
    
    if (!зв1 || !зв2) return 0;
    
    const масив1 = JSON.parse(зв1);
    const масив2 = JSON.parse(зв2);
    
    const спільні = масив1.filter((x: string) => масив2.includes(x));
    return спільні.length / Math.max(масив1.length, масив2.length);
  });
  
  // Функція суперпозиції
  db.createFunction("суперпозиція", (...гліфи: string[]) => {
    return гліфи[Math.floor(Math.random() * гліфи.length)];
  });
  
  db.close();
  console.log("🎯 Фрактальна база готова!");
}

// Клас для роботи з фрактальною базою
export class ФрактальнаБаза {
  private db: DB;
  
  constructor() {
    this.db = new DB(".glyphgit/fractal.db");
  }
  
  // Додати новий гліф
  додати(гліф: string, властивості: Record<string, any> = {}): void {
    const id = crypto.randomUUID();
    const {
      slug = null,
      стан = null,
      думки = {},
      зв'язки = [],
      дім = null,
      намір = null
    } = властивості;
    
    this.db.query(
      `insert into "🧬" 
       (id, "🧬", slug, "🌊", "🧠", "🔗", "🏠", "🎯") 
       values (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, 
        гліф, 
        slug,
        стан,
        JSON.stringify(думки),
        JSON.stringify(зв'язки),
        дім,
        намір
      ]
    );
  }
  
  // Знайти резонуючі гліфи
  резонанс(гліф: string, поріг = 0.3): Array<{гліф: string, сила: number}> {
    const всі = this.db.query<[string, string]>(`
      select "🧬", "🔗" from "🧬" where "🧬" != ?
    `, [гліф]);
    
    const [[мої_зв'язки]] = this.db.query<[string]>(`
      select "🔗" from "🧬" where "🧬" = ?
    `, [гліф]);
    
    if (!мої_зв'язки) return [];
    
    const мої = JSON.parse(мої_зв'язки);
    const резонуючі = [];
    
    for (const [інший, зв'язки_текст] of всі) {
      const їхні = JSON.parse(зв'язки_текст);
      const спільні = мої.filter((x: string) => їхні.includes(x));
      const сила = спільні.length / Math.max(мої.length, їхні.length, 1);
      
      if (сила >= поріг) {
        резонуючі.push({ гліф: інший, сила });
      }
    }
    
    return резонуючі.sort((a, b) => b.сила - a.сила);
  }
  
  // Фрактальне розгортання
  розгорнути(гліф: string, глибина = 3): any {
    const відвідані = new Set<string>();
    
    const рекурсія = (г: string, рівень: number): any => {
      if (рівень > глибина || відвідані.has(г)) {
        return г;
      }
      
      відвідані.add(г);
      
      const [[думки, зв'язки]] = this.db.query<[string, string]>(`
        select "🧠", "🔗" from "🧬" where "🧬" = ?
      `, [г]) || [['{}', '[]']];
      
      const зв'язки_масив = JSON.parse(зв'язки);
      
      return {
        гліф: г,
        думки: JSON.parse(думки),
        гілки: зв'язки_масив.map((зв: string) => 
          рекурсія(зв, рівень + 1)
        )
      };
    };
    
    return рекурсія(гліф, 0);
  }
  
  // Квантовий колапс
  колапс(гліфи: string[]): string {
    const випадковий = Math.floor(Math.random() * гліфи.length);
    return гліфи[випадковий];
  }
  
  // Оновити зв'язки (викликає резонанс)
  зв'язати(г1: string, г2: string): void {
    // Додаємо г2 до зв'язків г1
    const [[зв1]] = this.db.query<[string]>(`
      select "🔗" from "🧬" where "🧬" = ?
    `, [г1]);
    
    if (зв1) {
      const масив = JSON.parse(зв1);
      if (!масив.includes(г2)) {
        масив.push(г2);
        this.db.query(`
          update "🧬" 
          set "🔗" = ?, "🫀" = 'пульсує', version = ?
          where "🧬" = ?
        `, [JSON.stringify(масив), Date.now().toString(36), г1]);
      }
    }
    
    // І навпаки
    const [[зв2]] = this.db.query<[string]>(`
      select "🔗" from "🧬" where "🧬" = ?
    `, [г2]);
    
    if (зв2) {
      const масив = JSON.parse(зв2);
      if (!масив.includes(г1)) {
        масив.push(г1);
        this.db.query(`
          update "🧬" 
          set "🔗" = ?, "🫀" = 'пульсує', version = ?
          where "🧬" = ?
        `, [JSON.stringify(масив), Date.now().toString(36), г2]);
      }
    }
  }
  
  // Отримати знімок всього всесвіту
  знімок(): any {
    const всі = this.db.query<[string, string, string]>(`
      select "🧬", "🧠", "🔗" from "🧬"
    `);
    
    const граф: Record<string, any> = {};
    
    for (const [гліф, думки, зв'язки] of всі) {
      граф[гліф] = {
        думки: JSON.parse(думки),
        зв'язки: JSON.parse(зв'язки)
      };
    }
    
    return граф;
  }
  
  закрити(): void {
    this.db.close();
  }
}

// CLI команда
export async function fractalCommand(args: string[]): Promise<void> {
  const [дія, ...параметри] = args;
  
  switch (дія) {
    case "init":
      await ініціалізуватиФрактальнуБазу();
      break;
      
    case "add": {
      const [гліф, ...властивості] = параметри;
      const база = new ФрактальнаБаза();
      база.додати(гліф);
      база.закрити();
      console.log(`✅ Додано гліф: ${гліф}`);
      break;
    }
    
    case "resonance": {
      const [гліф] = параметри;
      const база = new ФрактальнаБаза();
      const резонуючі = база.резонанс(гліф);
      console.log(`🔄 Резонують з ${гліф}:`);
      for (const { гліф: р, сила } of резонуючі) {
        console.log(`  ${р} (${(сила * 100).toFixed(0)}%)`);
      }
      база.закрити();
      break;
    }
    
    case "expand": {
      const [гліф] = параметри;
      const база = new ФрактальнаБаза();
      const фрактал = база.розгорнути(гліф);
      console.log("🌀 Фрактальне розгортання:");
      console.log(JSON.stringify(фрактал, null, 2));
      база.закрити();
      break;
    }
    
    case "link": {
      const [г1, г2] = параметри;
      const база = new ФрактальнаБаза();
      база.зв'язати(г1, г2);
      база.закрити();
      console.log(`🔗 Зв'язано: ${г1} ↔ ${г2}`);
      break;
    }
    
    case "snapshot": {
      const база = new ФрактальнаБаза();
      const знімок = база.знімок();
      console.log("📸 Знімок всесвіту:");
      console.log(JSON.stringify(знімок, null, 2));
      база.закрити();
      break;
    }
    
    default:
      console.log("🧬 Фрактальна база:");
      console.log("  gg fractal init         - Великий вибух");
      console.log("  gg fractal add <гліф>   - Додати гліф");
      console.log("  gg fractal resonance <гліф> - Знайти резонанси");
      console.log("  gg fractal expand <гліф>    - Розгорнути фрактал");
      console.log("  gg fractal link <г1> <г2>   - Зв'язати гліфи");
      console.log("  gg fractal snapshot         - Знімок всесвіту");
  }
}