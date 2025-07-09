
#!/usr/bin/env node
/**
 * 🤖 Auto-generated Browser Automation Script
 * Service: ChatGPT
 * Task: chat
 * Generated: 2025-06-29T01:30:42.507Z
 */

const puppeteer = require('puppeteer');

async function automate() {
  console.log('🌐 Запускаємо автоматизацію для ChatGPT...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  try {
    // Навігація
    await page.goto('https://chat.openai.com/auth/login', { waitUntil: 'networkidle0' });
    console.log('✅ Сторінка завантажена');
    

    // Чат взаємодія
    await page.waitForSelector('#prompt-textarea', { timeout: 10000 });
    
    const message = 'Привіт! Я тестую автоматизацію з s0fractal колективу.';
    await page.type('#prompt-textarea', message);
    
    await page.click('button[data-testid='send-button']');
    console.log('💬 Повідомлення відправлено');
    
    // Очікування відповіді
    await page.waitForSelector('.markdown', { timeout: 30000 });
    
    const response = await page.evaluate(() => {
      const responseEl = document.querySelector('.markdown');
      return responseEl ? responseEl.textContent : 'Відповідь не знайдена';
    });
    
    console.log('🤖 Відповідь отримана:', response);
    
    // Збереження результату
    const result = {
      timestamp: new Date().toISOString(),
      service: 'chatgpt',
      message: message,
      response: response,
      success: true
    };
    
    require('fs').writeFileSync(
      './collective/shared/chatgpt_chat_log.json', 
      JSON.stringify(result, null, 2)
    );

  } catch (error) {
    console.error('❌ Помилка автоматизації:', error.message);
  } finally {
    await browser.close();
    console.log('🔚 Браузер закрито');
  }
}

automate().catch(console.error);
