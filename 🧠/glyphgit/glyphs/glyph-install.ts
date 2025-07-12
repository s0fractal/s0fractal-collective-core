// glyph-install.ts - Ідемпотентна установка гліфового середовища

import { ГліфФормула, обчислити } from "./glyph-core.ts";

// Таблиця станів - все є мапінг
const СТАН_ВСТАНОВЛЕННЯ = {
  "🌱": "не_встановлено",
  "🌿": "встановлюється", 
  "🌳": "встановлено",
  "🍂": "оновлюється",
  "🔄": "перевстановлюється"
};

// Компоненти для встановлення - теж мапінг
const КОМПОНЕНТИ = {
  "deno": {
    перевірка: ["test", "-f", "/usr/local/bin/deno"],
    встановлення: ["curl", "-fsSL", "https://deno.land/install.sh", "|", "sh"],
    стан: "🌱"
  },
  "glyphgit": {
    перевірка: ["test", "-f", "./gg"],
    встановлення: ["ln", "-sf", "$(pwd)/glyphgit.ts", "./gg"],
    стан: "🌱"
  },
  "база": {
    перевірка: ["test", "-d", ".glyphgit"],
    встановлення: ["mkdir", "-p", ".glyphgit/waves", ".glyphgit/agents", ".glyphgit/resonance"],
    стан: "🌱"
  },
  "гліфи": {
    перевірка: ["test", "-f", ".glyphgit/glyphs.db"],
    встановлення: ["touch", ".glyphgit/glyphs.db"],
    стан: "🌱"
  }
};

// Ідемпотентна функція встановлення
export async function встановити(компонент: string): Promise<string> {
  const конфіг = КОМПОНЕНТИ[компонент];
  if (!конфіг) return "❌";
  
  // Перевіряємо поточний стан
  try {
    const перевірка = new Deno.Command(конфіг.перевірка[0], {
      args: конфіг.перевірка.slice(1)
    });
    const { success } = await перевірка.output();
    
    if (success) {
      конфіг.стан = "🌳"; // Вже встановлено
      return "🌳";
    }
  } catch {}
  
  // Встановлюємо якщо потрібно
  конфіг.стан = "🌿"; // Встановлюється
  
  if (конфіг.встановлення.includes("|")) {
    // Складна команда з pipe
    const команда = конфіг.встановлення.join(" ");
    const sh = new Deno.Command("sh", {
      args: ["-c", команда]
    });
    await sh.output();
  } else {
    // Проста команда
    const cmd = new Deno.Command(конфіг.встановлення[0], {
      args: конфіг.встановлення.slice(1)
    });
    await cmd.output();
  }
  
  конфіг.стан = "🌳"; // Встановлено
  return "🌳";
}

// Таблиця залежностей - граф як мапінг
const ЗАЛЕЖНОСТІ = {
  "glyphgit": ["deno", "база"],
  "гліфи": ["база"],
  "база": [],
  "deno": []
};

// Топологічне сортування через рекурсію
function впорядкувати(компонент: string, відвідані = new Set<string>()): string[] {
  if (відвідані.has(компонент)) return [];
  відвідані.add(компонент);
  
  const порядок: string[] = [];
  const залежності = ЗАЛЕЖНОСТІ[компонент] || [];
  
  for (const залежність of залежності) {
    порядок.push(...впорядкувати(залежність, відвідані));
  }
  
  порядок.push(компонент);
  return порядок;
}

// Головна ідемпотентна функція
export async function встановитиВсе(): Promise<void> {
  console.log("🌟 Ідемпотентне встановлення GlyphGit");
  
  // Визначаємо порядок встановлення
  const порядок = впорядкувати("glyphgit");
  
  // Встановлюємо кожен компонент
  for (const компонент of порядок) {
    const стан = await встановити(компонент);
    console.log(`  ${стан} ${компонент}`);
  }
  
  // Фінальна перевірка через формулу
  const перевірка: ГліфФормула = ["✨", "🌳", "🌳", "🌳"];
  const результат = обчислити(перевірка);
  
  if (результат) {
    console.log("\n✅ GlyphGit готовий до роботи!");
    console.log("🎯 Запускай: ./gg 🌊 'Привіт, світе!'");
  }
}

// Функція оновлення - теж ідемпотентна
export async function оновити(): Promise<void> {
  console.log("🔄 Оновлення GlyphGit");
  
  // Pull останні зміни
  const git = new Deno.Command("git", {
    args: ["pull", "--rebase"]
  });
  
  const { success } = await git.output();
  
  if (success) {
    // Перевстановлюємо компоненти
    for (const компонент of Object.keys(КОМПОНЕНТИ)) {
      КОМПОНЕНТИ[компонент].стан = "🍂"; // Оновлюється
    }
    
    await встановитиВсе();
  }
}

// CLI команда
export async function installCommand(args: string[]): Promise<void> {
  const [дія] = args;
  
  const дії = {
    "all": встановитиВсе,
    "update": оновити,
    "check": async () => {
      console.log("📊 Стан компонентів:");
      for (const [назва, конфіг] of Object.entries(КОМПОНЕНТИ)) {
        console.log(`  ${конфіг.стан} ${назва}`);
      }
    }
  };
  
  const функція = дії[дія] || дії["all"];
  await функція();
}