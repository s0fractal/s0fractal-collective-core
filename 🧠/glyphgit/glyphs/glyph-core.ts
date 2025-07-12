// glyph-core.ts - Чиста гліфова математика

// Таблиця гліфів - все є мапінг
export const ГЛІФ_ТАБЛИЦЯ = {
  // Базові оператори
  "🌊": (x: any) => x,                    // identity
  "💭": (x: any) => !x,                   // not
  "🔮": (x: any, y: any) => x || y,      // or
  "✨": (x: any, y: any) => x && y,      // and
  "🌀": (x: any) => [x, x],              // duplicate
  "🎭": (x: any, y: any) => [y, x],      // swap
  "🌱": () => Math.random(),             // seed
  "💫": (x: number) => x * x,            // square
  "🌈": (x: any[]) => x.reduce((a,b) => a + b, 0), // sum
  "🔄": (f: Function, x: any) => f(f(x)), // twice
  
  // Композитори
  "🧬": (f: Function, g: Function) => (x: any) => f(g(x)), // compose
  "🌐": (f: Function) => (x: any) => f(x)(x),              // self-apply
  "🎯": (x: any) => () => x,                                // constant
  "📍": (f: Function, x: any) => f.bind(null, x),          // partial
  
  // Резонатори
  "🔔": (x: any, table: any) => table[x] || x,             // lookup
  "🎵": (pattern: any[]) => pattern[Date.now() % pattern.length], // cycle
  "🌺": (x: any) => JSON.stringify(x),                     // bloom
  "🍃": (x: string) => JSON.parse(x),                      // wither
};

// Гліфова формула - все є композиція
export type ГліфФормула = string[];

// Обчислити формулу
export function обчислити(формула: ГліфФормула, вхід: any = undefined): any {
  let стек: any[] = вхід !== undefined ? [вхід] : [];
  
  for (const гліф of формула) {
    const операція = ГЛІФ_ТАБЛИЦЯ[гліф];
    
    if (!операція) {
      // Якщо не операція - це літерал
      стек.push(гліф);
      continue;
    }
    
    // Визначаємо арність через length
    const арність = операція.length;
    
    // Беремо аргументи зі стеку
    const аргументи = стек.splice(-арність);
    
    // Застосовуємо операцію
    const результат = операція(...аргументи);
    
    // Кладемо результат назад
    стек.push(результат);
  }
  
  return стек[стек.length - 1];
}

// Таблиця інтентів - замість if/else
export const ІНТЕНТ_ТАБЛИЦЯ = {
  "створити": ["🌱", "🌺"],           // seed -> bloom
  "зберегти": ["🔮", "💫", "🌺"],    // oracle -> square -> bloom  
  "знайти": ["🔔", "🍃"],             // lookup -> wither
  "резонувати": ["🌊", "🌊", "🧬"],  // identity identity compose
  "трансформувати": ["🎭", "🔄"],    // swap -> twice
};

// Ідемпотентні операції
export const ІДЕМПОТЕНТНІ = {
  // f(f(x)) = f(x)
  "🌊": true,  // identity завжди ідемпотентна
  "💭💭": "🌊", // not not = identity
  "🌺🍃": "🌊", // bloom wither = identity
  "🍃🌺": "🌊", // wither bloom = identity
};

// Математичні закони гліфів
export const ЗАКОНИ = {
  // Комутативність
  "🔮": (a: any, b: any) => обчислити(["🔮"], [a, b]) === обчислити(["🔮"], [b, a]),
  "✨": (a: any, b: any) => обчислити(["✨"], [a, b]) === обчислити(["✨"], [b, a]),
  
  // Асоціативність
  "🧬": (f: any, g: any, h: any) => {
    const лівий = обчислити(["🧬", "🧬"], [f, g, h]);
    const правий = обчислити(["🧬"], [f, обчислити(["🧬"], [g, h])]);
    return лівий === правий;
  },
  
  // Дистрибутивність
  "🌈": (xs: any[]) => обчислити(["🌈"], [xs]) === xs.reduce((a, b) => a + b, 0),
};

// Гліфова база даних - все є таблиця
export class ГліфоваБаза {
  private таблиці = new Map<string, Map<string, any>>();
  
  // Записати через формулу
  записати(таблиця: string, ключ: string, формула: ГліфФормула): void {
    if (!this.таблиці.has(таблиця)) {
      this.таблиці.set(таблиця, new Map());
    }
    
    // Зберігаємо саму формулу, не результат
    this.таблиці.get(таблиця)!.set(ключ, формула);
  }
  
  // Прочитати і обчислити
  прочитати(таблиця: string, ключ: string, вхід?: any): any {
    const формула = this.таблиці.get(таблиця)?.get(ключ);
    if (!формула) return undefined;
    
    return обчислити(формула, вхід);
  }
  
  // Знайти за патерном
  знайти(патерн: ГліфФормула): Array<[string, string, ГліфФормула]> {
    const результати: Array<[string, string, ГліфФормула]> = [];
    
    for (const [таблиця, записи] of this.таблиці) {
      for (const [ключ, формула] of записи) {
        // Порівнюємо формули структурно
        if (this.співпадає(формула, патерн)) {
          результати.push([таблиця, ключ, формула]);
        }
      }
    }
    
    return результати;
  }
  
  private співпадає(формула: ГліфФормула, патерн: ГліфФормула): boolean {
    // Проста структурна рівність
    return формула.length === патерн.length &&
           формула.every((г, i) => г === патерн[i] || патерн[i] === "?");
  }
}

// Гліфовий процесор - замість CLI
export class ГліфПроцесор {
  private база = new ГліфоваБаза();
  private контекст = new Map<string, any>();
  
  // Виконати гліфову команду
  виконати(команда: string): any {
    const частини = команда.split(" ");
    const формула = частини.map(ч => {
      // Якщо це змінна з контексту
      if (ч.startsWith("$")) {
        return this.контекст.get(ч.slice(1));
      }
      return ч;
    }).filter(Boolean);
    
    return обчислити(формула as ГліфФормула);
  }
  
  // Визначити змінну
  визначити(ім'я: string, значення: any): void {
    this.контекст.set(ім'я, значення);
  }
}