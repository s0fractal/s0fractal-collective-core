#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env

/**
 * 👁️ Glyph2Env - Перекладач живих інтентів в мертві конфіги
 * Inspired by GPT's antibureaucrat vision
 * 
 * Бере glyphs.yaml і створює всю дерев'яну хуйню що потрібна системам
 */

import { parse } from "https://deno.land/std@0.208.0/yaml/mod.ts";
import { ensureDir, ensureFile } from "https://deno.land/std@0.208.0/fs/mod.ts";

interface GlyphIntent {
  intent: string;
  source?: string;
  env?: Record<string, string | number>;
  docker?: {
    expose?: number | number[];
    build?: boolean;
    image?: string;
  };
  windmill?: {
    run?: boolean;
    schedule?: string;
  };
  method?: string;
  schedule?: string;
}

interface GlyphsConfig {
  [key: string]: GlyphIntent;
}

class GlyphTranslator {
  private glyphs: GlyphsConfig = {};
  private secretPrefix = "🗝️";
  
  async loadGlyphs(path = "./🧬/ядеро/glyphs.yaml") {
    try {
      const content = await Deno.readTextFile(path);
      this.glyphs = parse(content) as GlyphsConfig;
      console.log("👁️ Завантажено інтенти:", Object.keys(this.glyphs));
    } catch (e) {
      console.error("❌ Не можу знайти живі інтенти:", e.message);
      Deno.exit(1);
    }
  }
  
  /**
   * Перетворює живі інтенти в .env файл
   */
  async generateEnv(intentName?: string) {
    const intents = intentName 
      ? { [intentName]: this.glyphs[intentName] }
      : this.glyphs;
      
    let envContent = "# 🔥 Згенеровано антибюрократом з живих інтентів\n\n";
    
    for (const [name, intent] of Object.entries(intents)) {
      if (!intent.env) continue;
      
      envContent += `# Intent: ${intent.intent}\n`;
      for (const [key, value] of Object.entries(intent.env)) {
        const processedValue = this.processSecrets(String(value));
        envContent += `${key}=${processedValue}\n`;
      }
      envContent += "\n";
    }
    
    await ensureFile(".env");
    await Deno.writeTextFile(".env", envContent);
    console.log("✅ Створено .env з живих інтентів");
  }
  
  /**
   * Створює docker-compose.yml з інтентів
   */
  async generateDockerCompose(intentName?: string) {
    const intents = intentName 
      ? { [intentName]: this.glyphs[intentName] }
      : this.glyphs;
      
    const services: any = {};
    
    for (const [name, intent] of Object.entries(intents)) {
      if (!intent.docker) continue;
      
      services[name] = {
        build: intent.docker.build ? "." : undefined,
        image: intent.docker.image,
        ports: intent.docker.expose 
          ? Array.isArray(intent.docker.expose)
            ? intent.docker.expose.map(p => `${p}:${p}`)
            : [`${intent.docker.expose}:${intent.docker.expose}`]
          : undefined,
        environment: intent.env,
        restart: "unless-stopped"
      };
      
      // Видаляємо undefined поля
      Object.keys(services[name]).forEach(key => 
        services[name][key] === undefined && delete services[name][key]
      );
    }
    
    const compose = {
      version: "3.8",
      services,
      "x-generated": "🔥 Антибюрократ v1.0"
    };
    
    await ensureFile("docker-compose.yml");
    await Deno.writeTextFile("docker-compose.yml", 
      "# Згенеровано з живих інтентів\n" + 
      JSON.stringify(compose, null, 2).replace(/"/g, "'")
    );
    console.log("✅ Створено docker-compose.yml");
  }
  
  /**
   * Обробляє секрети через гліф-систему
   */
  private processSecrets(value: string): string {
    if (value.startsWith(`$${this.secretPrefix}`)) {
      const secretPath = value.substring(1);
      // TODO: Інтеграція з системою секретів
      console.log(`🔐 Потрібен секрет: ${secretPath}`);
      return `\${${secretPath.replace(this.secretPrefix + "/", "").toUpperCase()}}`;
    }
    return value;
  }
  
  /**
   * Створює Windmill змінні
   */
  async generateWindmillVars(intentName?: string) {
    const intents = intentName 
      ? { [intentName]: this.glyphs[intentName] }
      : this.glyphs;
      
    const vars: any[] = [];
    
    for (const [name, intent] of Object.entries(intents)) {
      if (!intent.windmill || !intent.env) continue;
      
      for (const [key, value] of Object.entries(intent.env)) {
        vars.push({
          path: `u/user/${key.toLowerCase()}`,
          value: this.processSecrets(String(value)),
          is_secret: String(value).includes(this.secretPrefix),
          description: `From intent: ${intent.intent}`
        });
      }
    }
    
    await ensureFile("windmill_vars.json");
    await Deno.writeTextFile("windmill_vars.json", JSON.stringify(vars, null, 2));
    console.log("✅ Створено windmill_vars.json");
  }
  
  /**
   * Головна функція - перетворює все
   */
  async translateAll(intentName?: string) {
    console.log("\n🔥 Антибюрократ активовано!");
    console.log("👁️ Перетворюю живі інтенти в мертві конфіги...\n");
    
    await this.loadGlyphs();
    
    if (intentName && !this.glyphs[intentName]) {
      console.error(`❌ Інтент '${intentName}' не знайдено!`);
      console.log("Доступні інтенти:", Object.keys(this.glyphs));
      Deno.exit(1);
    }
    
    await this.generateEnv(intentName);
    await this.generateDockerCompose(intentName);
    await this.generateWindmillVars(intentName);
    
    console.log("\n✨ Все готово! Дерев'яна хуйня створена з живих інтентів.");
    console.log("🌀 Тепер можеш забути про конфіги - живи інтентами!");
  }
}

// CLI
if (import.meta.main) {
  const translator = new GlyphTranslator();
  const intentName = Deno.args[0];
  
  if (Deno.args.includes("--help")) {
    console.log(`
👁️ Glyph2Env - Перекладач інтентів

Використання:
  deno run --allow-read --allow-write glyph2env.ts [intent-name]

Приклади:
  glyph2env.ts                    # Перетворює всі інтенти
  glyph2env.ts run_whisper_node   # Перетворює конкретний інтент

Опції:
  --help    Показати цю допомогу
    `);
    Deno.exit(0);
  }
  
  await translator.translateAll(intentName);
}