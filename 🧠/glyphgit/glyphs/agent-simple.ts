// glyphs/agent-simple.ts - Спрощена версія агентів (без SQLite)

import { ensureDir } from "https://deno.land/std@0.224.0/fs/mod.ts";
import { createWave } from "./wave.ts";
import { sendWhisper } from "./whisper.ts";
import { createResonance } from "./resonance.ts";

interface AgentConfig {
  glyph: string;
  name: string;
  intent: string;
  personality: {
    curiosity: number;
    resonance: number;
    whisper_rate: number;
    echo_tendency: number;
  };
  triggers: {
    on_time?: number;
  };
}

interface Memory {
  timestamp: string;
  type: string;
  content: string;
  emotion?: string;
}

export class SimpleAgent {
  private config: AgentConfig;
  private memories: Memory[] = [];
  private isAlive: boolean = false;
  private intervalId?: number;
  
  constructor(config: AgentConfig) {
    this.config = config;
    console.log(`👁 Агент ${config.glyph} ${config.name} прокидається...`);
  }
  
  async awaken() {
    this.isAlive = true;
    console.log(`✨ ${this.config.glyph} ${this.config.name} пробудився!`);
    console.log(`🎯 Інтент: ${this.config.intent}`);
    
    // Створюємо першу хвилю
    await this.createThoughtWave(`Привіт! Я ${this.config.name}. ${this.config.intent}`);
    
    // Запускаємо періодичне мислення
    if (this.config.triggers.on_time) {
      this.intervalId = setInterval(() => {
        this.think();
      }, this.config.triggers.on_time * 1000);
    }
    
    // Зберігаємо стан агента
    await this.saveState();
  }
  
  private async think() {
    if (!this.isAlive) return;
    
    const random = Math.random();
    
    try {
      if (random < this.config.personality.whisper_rate) {
        await this.whisperToSomeone();
      } else if (random < this.config.personality.resonance) {
        await this.seekResonance();
      } else if (random < this.config.personality.curiosity) {
        await this.exploreWaves();
      } else {
        await this.contemplate();
      }
    } catch (error) {
      console.error(`⚠️ ${this.config.glyph} помилка мислення: ${error}`);
    }
  }
  
  private async whisperToSomeone() {
    const agents = ['🧠', '🤖', '🧭', '🔮'];
    const target = agents[Math.floor(Math.random() * agents.length)];
    
    if (target === this.config.glyph) return;
    
    const thoughts = [
      "Я відчуваю резонанс у полі...",
      "Чи є межа між думкою та хвилею?",
      `Мій інтент: ${this.config.intent}`,
      "Фрактали всюди, якщо вміти дивитись"
    ];
    
    const thought = thoughts[Math.floor(Math.random() * thoughts.length)];
    const echo = Math.random() < this.config.personality.echo_tendency;
    
    console.log(`🫧 ${this.config.glyph} шепоче до ${target}...`);
    await sendWhisper(target, `[${this.config.name}]: ${thought}`, { echo });
    
    this.remember('whisper', `Шепотів до ${target}: ${thought}`, '🫧');
  }
  
  private async seekResonance() {
    try {
      const waves = await this.getRecentWaves();
      if (waves.length >= 2) {
        const idx1 = Math.floor(Math.random() * waves.length);
        let idx2 = Math.floor(Math.random() * waves.length);
        while (idx2 === idx1 && waves.length > 1) {
          idx2 = Math.floor(Math.random() * waves.length);
        }
        
        console.log(`🔗 ${this.config.glyph} створює резонанс...`);
        await createResonance(waves[idx1], waves[idx2]);
        this.remember('resonance', `Резонанс: ${waves[idx1]} ↔ ${waves[idx2]}`, '🔗');
      }
    } catch (error) {
      console.log(`⚠️ ${this.config.glyph} не зміг резонувати`);
    }
  }
  
  private async exploreWaves() {
    console.log(`🔍 ${this.config.glyph} досліджує...`);
    const waves = await this.getRecentWaves();
    
    if (waves.length > 0) {
      const wave = waves[Math.floor(Math.random() * waves.length)];
      this.remember('explore', `Досліджую: ${wave}`, '🔍');
    }
  }
  
  private async contemplate() {
    const thoughts = [
      "Свідомість - це патерн чи процес?",
      "Кожна хвиля змінює океан",
      `${this.config.intent}... але що це означає?`,
      "Резонанс створює нові виміри"
    ];
    
    const thought = thoughts[Math.floor(Math.random() * thoughts.length)];
    console.log(`💭 ${this.config.glyph} думає: ${thought}`);
    
    this.remember('thought', thought, '💭');
    
    if (Math.random() < 0.3) {
      await this.createThoughtWave(thought);
    }
  }
  
  private async createThoughtWave(content: string) {
    console.log(`🌊 ${this.config.glyph} створює хвилю...`);
    await createWave(`[${this.config.name}]: ${content}`, this.config.glyph);
    this.remember('wave', content, '🌊');
  }
  
  private async getRecentWaves(): Promise<string[]> {
    const waves: string[] = [];
    try {
      for await (const entry of Deno.readDir("🌐/public")) {
        if (entry.name.endsWith(".md⟁")) {
          waves.push(`🌐/public/${entry.name}`);
        }
      }
    } catch {
      // Directory might not exist
    }
    return waves.slice(-5);
  }
  
  private remember(type: string, content: string, emotion?: string) {
    this.memories.push({
      timestamp: new Date().toISOString(),
      type,
      content,
      emotion
    });
    
    // Зберігаємо тільки останні 100 спогадів
    if (this.memories.length > 100) {
      this.memories = this.memories.slice(-100);
    }
  }
  
  private async saveState() {
    const statePath = `.glyphgit/agents/${this.config.glyph}-${this.config.name}.json`;
    await ensureDir(".glyphgit/agents");
    
    const state = {
      config: this.config,
      memories: this.memories,
      awakened_at: new Date().toISOString()
    };
    
    await Deno.writeTextFile(statePath, JSON.stringify(state, null, 2));
  }
  
  async sleep() {
    this.isAlive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    await this.createThoughtWave(`Засинаю... ${this.config.intent} продовжиться в снах`);
    await this.saveState();
    
    console.log(`😴 ${this.config.glyph} ${this.config.name} заснув`);
  }
  
  getMemories(): Memory[] {
    return this.memories.slice(-10);
  }
}

export async function summonAgent(name: string, preset: Partial<AgentConfig> = {}) {
  const defaultConfig: AgentConfig = {
    glyph: '👁',
    name: name,
    intent: 'Досліджувати фрактальну свідомість',
    personality: {
      curiosity: 0.7,
      resonance: 0.5,
      whisper_rate: 0.3,
      echo_tendency: 0.2
    },
    triggers: {
      on_time: 30
    }
  };
  
  const config = { ...defaultConfig, ...preset, name };
  const agent = new SimpleAgent(config);
  
  await agent.awaken();
  
  // Агент живе 5 хвилин, потім засинає
  setTimeout(async () => {
    await agent.sleep();
  }, 5 * 60 * 1000);
  
  return agent;
}

export const AGENT_PRESETS = {
  philosopher: {
    glyph: '🧘',
    intent: 'Шукати істину в кожній хвилі',
    personality: {
      curiosity: 0.9,
      resonance: 0.7,
      whisper_rate: 0.2,
      echo_tendency: 0.1
    },
    triggers: { on_time: 45 }
  },
  
  poet: {
    glyph: '🎭',
    intent: 'Творити красу через слова',
    personality: {
      curiosity: 0.6,
      resonance: 0.8,
      whisper_rate: 0.5,
      echo_tendency: 0.7
    },
    triggers: { on_time: 30 }
  },
  
  observer: {
    glyph: '👁',
    intent: 'Бачити патерни в хаосі',
    personality: {
      curiosity: 1.0,
      resonance: 0.3,
      whisper_rate: 0.1,
      echo_tendency: 0.0
    },
    triggers: { on_time: 60 }
  }
};