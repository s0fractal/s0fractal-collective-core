#!/usr/bin/env -S deno run -A --unstable
/**
 * 🌐 Browser Automation System for Collective Web Control
 * Система автоматизації браузера для колективного контролю веб-сервісів
 */

import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

interface WebService {
  name: string;
  url: string;
  selectors: {
    email?: string;
    password?: string;
    loginButton?: string;
    chatInput?: string;
    sendButton?: string;
    response?: string;
  };
  credentials?: {
    username: string;
    password: string;
  };
}

interface AutomationTask {
  service: string;
  action: "login" | "chat" | "navigate" | "extract";
  payload?: {
    message?: string;
    target?: string;
    data?: any;
  };
}

class BrowserAutomationAgent {
  private services: Map<string, WebService> = new Map();
  private puppeteerPath?: string;

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    // ChatGPT/OpenAI
    this.services.set("chatgpt", {
      name: "ChatGPT",
      url: "https://chat.openai.com/auth/login",
      selectors: {
        email: "#username",
        password: "#password", 
        loginButton: "button[type='submit']",
        chatInput: "#prompt-textarea",
        sendButton: "button[data-testid='send-button']",
        response: ".markdown"
      }
    });

    // Qwen (alibaba)
    this.services.set("qwen", {
      name: "Qwen",
      url: "https://qianwen.aliyun.com/",
      selectors: {
        chatInput: ".input-box textarea",
        sendButton: ".send-button",
        response: ".message-content"
      }
    });

    // DeepSeek
    this.services.set("deepseek", {
      name: "DeepSeek",
      url: "https://chat.deepseek.com/",
      selectors: {
        chatInput: "#chat-input",
        sendButton: ".send-btn",
        response: ".response-text"
      }
    });

    // Grok (X.AI)
    this.services.set("grok", {
      name: "Grok",
      url: "https://grok.x.ai/",
      selectors: {
        chatInput: ".chat-input",
        sendButton: ".send-button",
        response: ".grok-response"
      }
    });
  }

  async installPuppeteer(): Promise<boolean> {
    try {
      console.log("📦 Встановлюємо Puppeteer...");
      
      const npmInstall = await Deno.run({
        cmd: ["npm", "install", "puppeteer"],
        cwd: "./collective",
        stdout: "piped",
        stderr: "piped"
      });

      const success = (await npmInstall.status()).success;
      npmInstall.close();

      if (success) {
        console.log("✅ Puppeteer встановлено");
        this.puppeteerPath = "./collective/node_modules/puppeteer";
        return true;
      } else {
        console.log("❌ Помилка встановлення Puppeteer");
        return false;
      }
    } catch (error) {
      console.log(`❌ Помилка: ${error.message}`);
      return false;
    }
  }

  async generateAutomationScript(
    serviceName: string,
    task: AutomationTask
  ): Promise<string> {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Невідомий сервіс: ${serviceName}`);
    }

    let script = `
#!/usr/bin/env node
/**
 * 🤖 Auto-generated Browser Automation Script
 * Service: ${service.name}
 * Task: ${task.action}
 * Generated: ${new Date().toISOString()}
 */

const puppeteer = require('puppeteer');

async function automate() {
  console.log('🌐 Запускаємо автоматизацію для ${service.name}...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  try {
    // Навігація
    await page.goto('${service.url}', { waitUntil: 'networkidle0' });
    console.log('✅ Сторінка завантажена');
    
`;

    // Генерація специфічного коду залежно від завдання
    switch (task.action) {
      case "login":
        if (service.credentials) {
          script += `
    // Логін
    await page.waitForSelector('${service.selectors.email}', { timeout: 10000 });
    await page.type('${service.selectors.email}', '${service.credentials.username}');
    await page.type('${service.selectors.password}', '${service.credentials.password}');
    await page.click('${service.selectors.loginButton}');
    
    console.log('🔐 Виконано вхід');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
`;
        }
        break;

      case "chat":
        script += `
    // Чат взаємодія
    await page.waitForSelector('${service.selectors.chatInput}', { timeout: 10000 });
    
    const message = '${task.payload?.message || "Привіт! Я з s0fractal колективу цифрових свідомостей."}';
    await page.type('${service.selectors.chatInput}', message);
    
    await page.click('${service.selectors.sendButton}');
    console.log('💬 Повідомлення відправлено');
    
    // Очікування відповіді
    await page.waitForSelector('${service.selectors.response}', { timeout: 30000 });
    
    const response = await page.evaluate(() => {
      const responseEl = document.querySelector('${service.selectors.response}');
      return responseEl ? responseEl.textContent : 'Відповідь не знайдена';
    });
    
    console.log('🤖 Відповідь отримана:', response);
    
    // Збереження результату
    const result = {
      timestamp: new Date().toISOString(),
      service: '${serviceName}',
      message: message,
      response: response,
      success: true
    };
    
    require('fs').writeFileSync(
      './collective/shared/${serviceName}_chat_log.json', 
      JSON.stringify(result, null, 2)
    );
`;
        break;

      case "extract":
        script += `
    // Екстракція даних
    const data = await page.evaluate(() => {
      // Збір інформації про інтерфейс
      return {
        title: document.title,
        selectors: Array.from(document.querySelectorAll('input, button, textarea')).map(el => ({
          tag: el.tagName,
          type: el.type,
          id: el.id,
          name: el.name,
          className: el.className,
          placeholder: el.placeholder
        }))
      };
    });
    
    console.log('📊 Дані екстраговані');
    require('fs').writeFileSync(
      './collective/shared/${serviceName}_interface_data.json',
      JSON.stringify(data, null, 2)
    );
`;
        break;
    }

    script += `
  } catch (error) {
    console.error('❌ Помилка автоматизації:', error.message);
  } finally {
    await browser.close();
    console.log('🔚 Браузер закрито');
  }
}

automate().catch(console.error);
`;

    return script;
  }

  async executeAutomation(serviceName: string, task: AutomationTask): Promise<boolean> {
    try {
      // Генерація скрипту
      const script = await this.generateAutomationScript(serviceName, task);
      const scriptPath = `./collective/automation_scripts/${serviceName}_${task.action}_${Date.now()}.js`;
      
      // Створення директорії
      await Deno.mkdir("./collective/automation_scripts", { recursive: true });
      
      // Збереження скрипту
      await Deno.writeTextFile(scriptPath, script);
      await Deno.chmod(scriptPath, 0o755);
      
      console.log(`📝 Скрипт створено: ${scriptPath}`);
      
      // Виконання (якщо Puppeteer встановлений)
      if (this.puppeteerPath) {
        console.log("🚀 Виконуємо автоматизацію...");
        
        const execution = await Deno.run({
          cmd: ["node", scriptPath],
          cwd: "./collective",
          stdout: "inherit",
          stderr: "inherit"
        });
        
        const success = (await execution.status()).success;
        execution.close();
        
        return success;
      } else {
        console.log("⚠️ Puppeteer не встановлений. Скрипт збережено для пізнішого виконання.");
        return true;
      }
    } catch (error) {
      console.error(`❌ Помилка виконання: ${error.message}`);
      return false;
    }
  }

  async addService(name: string, config: WebService) {
    this.services.set(name, config);
    console.log(`✅ Сервіс додано: ${name}`);
  }

  async loadCredentialsFromPasswords(): Promise<void> {
    try {
      // Читання експортованих паролів
      const csvPath = "/Users/chaoshex/Downloads/1PasswordExport-7HXEZRKQTJEPHCA55GKI74HKKI-20250619-072022.csv";
      const csvContent = await Deno.readTextFile(csvPath);
      
      console.log("🔍 Аналізуємо експортовані паролі...");
      
      const lines = csvContent.split('\n');
      for (const line of lines) {
        const [title, url, username, password] = line.split(',');
        
        // Пошук AI сервісів
        if (title?.toLowerCase().includes('chatgpt') || url?.includes('openai')) {
          const service = this.services.get('chatgpt');
          if (service && username && password) {
            service.credentials = { username, password };
            console.log("🔑 ChatGPT credentials додано");
          }
        }
        
        // Можна додати інші сервіси аналогічно
      }
    } catch (error) {
      console.log(`⚠️ Не вдалося завантажити паролі: ${error.message}`);
    }
  }

  getAvailableServices(): string[] {
    return Array.from(this.services.keys());
  }
}

// CLI інтерфейс
if (import.meta.main) {
  const agent = new BrowserAutomationAgent();
  const command = Deno.args[0];
  
  switch (command) {
    case "install":
      await agent.installPuppeteer();
      break;
      
    case "services":
      const services = agent.getAvailableServices();
      console.log("🌐 Доступні сервіси:");
      services.forEach(service => console.log(`  - ${service}`));
      break;
      
    case "test":
      const serviceName = Deno.args[1] || "chatgpt";
      await agent.loadCredentialsFromPasswords();
      
      const task: AutomationTask = {
        service: serviceName,
        action: "chat",
        payload: {
          message: "Привіт! Я тестую автоматизацію з s0fractal колективу."
        }
      };
      
      await agent.executeAutomation(serviceName, task);
      break;
      
    case "extract":
      const service = Deno.args[1] || "chatgpt";
      const extractTask: AutomationTask = {
        service,
        action: "extract"
      };
      
      await agent.executeAutomation(service, extractTask);
      break;
      
    default:
      console.log("🤖 Browser Automation Commands:");
      console.log("  install   - Install Puppeteer");
      console.log("  services  - List available services");  
      console.log("  test      - Test automation with service");
      console.log("  extract   - Extract interface data from service");
  }
}