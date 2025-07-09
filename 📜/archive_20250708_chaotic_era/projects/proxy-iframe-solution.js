// 🌐 Proxy IFrame Solution для обходу CSP обмежень
// Рішення для сайтів що блокують iframe embedding

class ProxyIFrameSystem {
    constructor() {
        this.proxyMethods = new Map();
        this.embeddableAlternatives = new Map();
        this.customWrappers = new Map();
        
        this.initializeProxyMethods();
        this.initializeAlternatives();
        this.initializeCustomWrappers();
    }

    initializeProxyMethods() {
        console.log("🔧 Ініціалізація proxy методів...");
        
        // Метод 1: Allorigins proxy
        this.proxyMethods.set('allorigins', {
            name: 'AllOrigins Proxy',
            baseUrl: 'https://api.allorigins.win/raw?url=',
            supports: ['static sites', 'apis'],
            limitations: ['no javascript', 'no interactions']
        });

        // Метод 2: CORS Anywhere
        this.proxyMethods.set('cors-anywhere', {
            name: 'CORS Anywhere',
            baseUrl: 'https://cors-anywhere.herokuapp.com/',
            supports: ['most sites'],
            limitations: ['rate limited', 'demo only']
        });

        // Метод 3: Iframe resizer with postMessage
        this.proxyMethods.set('postmessage', {
            name: 'PostMessage Bridge',
            baseUrl: null,
            supports: ['cooperative sites'],
            limitations: ['requires site cooperation']
        });

        // Метод 4: Puppeteer screenshot service
        this.proxyMethods.set('screenshot', {
            name: 'Screenshot Service',
            baseUrl: 'https://htmlcsstoimage.com/demo_images/image.png?url=',
            supports: ['visual preview'],
            limitations: ['static image only']
        });
    }

    initializeAlternatives() {
        console.log("🔄 Ініціалізація embeddable альтернатив...");
        
        // Замінники для популярних сайтів
        this.embeddableAlternatives.set('github.com', [
            {
                name: 'GitHub1s',
                url: 'https://github1s.com',
                description: 'VSCode-like GitHub browser',
                embeddable: true
            },
            {
                name: 'Gitpod',
                url: 'https://gitpod.io/#',
                description: 'GitHub in cloud IDE',
                embeddable: true
            },
            {
                name: 'StackBlitz',
                url: 'https://stackblitz.com/github/',
                description: 'GitHub projects in StackBlitz',
                embeddable: true
            }
        ]);

        this.embeddableAlternatives.set('notion.so', [
            {
                name: 'Notion Embed',
                url: 'https://www.notion.so/embed/',
                description: 'Official Notion embed',
                embeddable: true
            },
            {
                name: 'NotionHost',
                url: 'https://notionhost.com/',
                description: 'Notion page hosting',
                embeddable: true
            }
        ]);

        this.embeddableAlternatives.set('youtube.com', [
            {
                name: 'YouTube Embed',
                url: 'https://www.youtube-nocookie.com/embed/',
                description: 'Privacy-enhanced YouTube embed',
                embeddable: true
            }
        ]);

        this.embeddableAlternatives.set('codepen.io', [
            {
                name: 'CodePen Embed',
                url: 'https://codepen.io/embed/',
                description: 'CodePen embed mode',
                embeddable: true
            }
        ]);

        this.embeddableAlternatives.set('codesandbox.io', [
            {
                name: 'CodeSandbox Embed',
                url: 'https://codesandbox.io/embed/',
                description: 'CodeSandbox embed mode',
                embeddable: true
            }
        ]);
    }

    initializeCustomWrappers() {
        console.log("🎨 Ініціалізація custom wrappers...");
        
        // Власні обгортки для складних сайтів
        this.customWrappers.set('google-drive', {
            template: this.createGoogleDriveWrapper(),
            embeddable: true
        });

        this.customWrappers.set('dropbox', {
            template: this.createDropboxWrapper(),
            embeddable: true
        });

        this.customWrappers.set('github-viewer', {
            template: this.createGitHubViewerWrapper(),
            embeddable: true
        });
    }

    // Головний метод для створення embeddable iframe
    async createEmbeddableIframe(originalUrl, options = {}) {
        console.log(`🌐 Створення embeddable iframe для: ${originalUrl}`);
        
        const domain = this.extractDomain(originalUrl);
        
        // Спробуємо різні методи по черзі
        const methods = [
            () => this.tryDirectEmbed(originalUrl),
            () => this.tryAlternativeServices(domain, originalUrl),
            () => this.tryCustomWrapper(domain, originalUrl),
            () => this.tryProxyMethod(originalUrl, options),
            () => this.createFallbackWrapper(originalUrl)
        ];

        for (const method of methods) {
            try {
                const result = await method();
                if (result.success) {
                    console.log(`✅ Успішно створено iframe методом: ${result.method}`);
                    return result;
                }
            } catch (error) {
                console.log(`⚠️ Метод провалився: ${error.message}`);
                continue;
            }
        }

        throw new Error('Всі методи embedding провалились');
    }

    async tryDirectEmbed(url) {
        console.log(`🎯 Спроба прямого embedding: ${url}`);
        
        return new Promise((resolve) => {
            const testIframe = document.createElement('iframe');
            testIframe.src = url;
            testIframe.style.display = 'none';
            testIframe.sandbox = 'allow-same-origin allow-scripts';
            
            const timeout = setTimeout(() => {
                document.body.removeChild(testIframe);
                resolve({ success: false, error: 'Timeout' });
            }, 5000);

            testIframe.onload = () => {
                clearTimeout(timeout);
                document.body.removeChild(testIframe);
                resolve({ 
                    success: true, 
                    method: 'direct',
                    iframe: this.createWorkingIframe(url)
                });
            };

            testIframe.onerror = () => {
                clearTimeout(timeout);
                document.body.removeChild(testIframe);
                resolve({ success: false, error: 'Load error' });
            };

            document.body.appendChild(testIframe);
        });
    }

    async tryAlternativeServices(domain, originalUrl) {
        console.log(`🔄 Спроба альтернативних сервісів для: ${domain}`);
        
        const alternatives = this.embeddableAlternatives.get(domain);
        if (!alternatives) {
            throw new Error('No alternatives found');
        }

        for (const alt of alternatives) {
            try {
                const modifiedUrl = this.buildAlternativeUrl(alt, originalUrl);
                const testResult = await this.tryDirectEmbed(modifiedUrl);
                
                if (testResult.success) {
                    return {
                        success: true,
                        method: `alternative-${alt.name}`,
                        iframe: this.createWorkingIframe(modifiedUrl),
                        description: alt.description
                    };
                }
            } catch (error) {
                continue;
            }
        }

        throw new Error('No working alternatives found');
    }

    async tryCustomWrapper(domain, originalUrl) {
        console.log(`🎨 Спроба custom wrapper для: ${domain}`);
        
        const wrapperKey = domain.replace('.com', '').replace('.', '-');
        const wrapper = this.customWrappers.get(wrapperKey);
        
        if (!wrapper) {
            throw new Error('No custom wrapper available');
        }

        const customIframe = this.createCustomWrapperIframe(wrapper.template, originalUrl);
        
        return {
            success: true,
            method: 'custom-wrapper',
            iframe: customIframe,
            description: 'Custom wrapper implementation'
        };
    }

    async tryProxyMethod(originalUrl, options) {
        console.log(`🔧 Спроба proxy методу для: ${originalUrl}`);
        
        if (options.allowProxy === false) {
            throw new Error('Proxy methods disabled');
        }

        // Спробуємо AllOrigins
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(originalUrl)}`;
        
        const result = await this.tryDirectEmbed(proxyUrl);
        if (result.success) {
            return {
                success: true,
                method: 'allorigins-proxy',
                iframe: result.iframe,
                description: 'Proxied through AllOrigins'
            };
        }

        throw new Error('Proxy method failed');
    }

    createFallbackWrapper(originalUrl) {
        console.log(`🛡️ Створення fallback wrapper для: ${originalUrl}`);
        
        const fallbackHtml = this.generateFallbackHTML(originalUrl);
        const blob = new Blob([fallbackHtml], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        
        return {
            success: true,
            method: 'fallback-wrapper',
            iframe: this.createWorkingIframe(blobUrl),
            description: 'Fallback wrapper with open button'
        };
    }

    // Утилітарні методи
    extractDomain(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    }

    buildAlternativeUrl(alternative, originalUrl) {
        if (alternative.name === 'GitHub1s') {
            return originalUrl.replace('github.com', 'github1s.com');
        }
        if (alternative.name === 'Gitpod') {
            return alternative.url + originalUrl;
        }
        if (alternative.name === 'StackBlitz') {
            return alternative.url + originalUrl.replace('https://github.com/', '');
        }
        
        return alternative.url + originalUrl;
    }

    createWorkingIframe(src) {
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        iframe.sandbox = 'allow-same-origin allow-scripts allow-forms allow-downloads allow-modals allow-popups';
        return iframe;
    }

    // Custom wrapper templates
    createGoogleDriveWrapper() {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Google Drive Wrapper</title>
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #f8f9fa;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                }
                .wrapper {
                    background: white;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    text-align: center;
                    max-width: 400px;
                }
                .icon { font-size: 4rem; margin-bottom: 20px; }
                h2 { color: #1a73e8; margin-bottom: 15px; }
                p { color: #5f6368; margin-bottom: 25px; }
                .btn {
                    background: #1a73e8;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    text-decoration: none;
                    display: inline-block;
                }
                .btn:hover { background: #1557b0; }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="icon">💾</div>
                <h2>Google Drive Access</h2>
                <p>Click below to open Google Drive in a new tab. Files will sync with your cloud storage.</p>
                <a href="https://drive.google.com" target="_blank" class="btn">Open Google Drive</a>
            </div>
            <script>
                // Можна додати логіку для postMessage communication
                window.addEventListener('message', (event) => {
                    if (event.data.type === 'GOOGLE_DRIVE_REQUEST') {
                        // Handle requests from parent
                    }
                });
            </script>
        </body>
        </html>
        `;
    }

    createDropboxWrapper() {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Dropbox Wrapper</title>
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #f7f5f3;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                }
                .wrapper {
                    background: white;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    text-align: center;
                    max-width: 400px;
                }
                .icon { font-size: 4rem; margin-bottom: 20px; }
                h2 { color: #0061ff; margin-bottom: 15px; }
                p { color: #637282; margin-bottom: 25px; }
                .btn {
                    background: #0061ff;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    text-decoration: none;
                    display: inline-block;
                }
                .btn:hover { background: #0053d6; }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="icon">📦</div>
                <h2>Dropbox Access</h2>
                <p>Access your Dropbox files and folders. Files will sync automatically.</p>
                <a href="https://dropbox.com" target="_blank" class="btn">Open Dropbox</a>
            </div>
        </body>
        </html>
        `;
    }

    createGitHubViewerWrapper() {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>GitHub Viewer</title>
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #0d1117;
                    color: #c9d1d9;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                }
                .wrapper {
                    background: #161b22;
                    border: 1px solid #30363d;
                    border-radius: 8px;
                    padding: 30px;
                    text-align: center;
                    max-width: 500px;
                }
                .icon { font-size: 4rem; margin-bottom: 20px; }
                h2 { color: #58a6ff; margin-bottom: 15px; }
                p { color: #8b949e; margin-bottom: 25px; }
                .btn-group {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                .btn {
                    background: #21262d;
                    color: #c9d1d9;
                    border: 1px solid #30363d;
                    padding: 10px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    text-decoration: none;
                    display: inline-block;
                }
                .btn:hover { 
                    background: #30363d;
                    border-color: #58a6ff;
                }
                .btn.primary {
                    background: #238636;
                    border-color: #238636;
                }
                .btn.primary:hover {
                    background: #2ea043;
                }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="icon">🐙</div>
                <h2>GitHub Repository Viewer</h2>
                <p>Choose how you want to view and edit GitHub repositories:</p>
                <div class="btn-group">
                    <a href="https://github.com" target="_blank" class="btn primary">GitHub</a>
                    <a href="https://github1s.com" target="_blank" class="btn">GitHub1s</a>
                    <a href="https://vscode.dev" target="_blank" class="btn">VSCode Web</a>
                    <a href="https://stackblitz.com" target="_blank" class="btn">StackBlitz</a>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    createCustomWrapperIframe(template, originalUrl) {
        const modifiedTemplate = template.replace(/ORIGINAL_URL/g, originalUrl);
        const blob = new Blob([modifiedTemplate], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        
        return this.createWorkingIframe(blobUrl);
    }

    generateFallbackHTML(originalUrl) {
        const domain = this.extractDomain(originalUrl);
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Site Access</title>
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    text-align: center;
                }
                .wrapper {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 40px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    max-width: 400px;
                }
                .icon { font-size: 4rem; margin-bottom: 20px; }
                h2 { margin-bottom: 15px; }
                p { opacity: 0.9; margin-bottom: 25px; }
                .btn {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    text-decoration: none;
                    display: inline-block;
                    transition: all 0.3s ease;
                }
                .btn:hover { 
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }
                .domain { 
                    font-family: 'Monaco', monospace;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.9rem;
                }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="icon">🌐</div>
                <h2>External Site Access</h2>
                <p>The site <span class="domain">${domain}</span> cannot be embedded due to security restrictions.</p>
                <a href="${originalUrl}" target="_blank" class="btn">Open in New Tab</a>
            </div>
            <script>
                // Notify parent about external navigation
                window.addEventListener('beforeunload', () => {
                    parent.postMessage({
                        type: 'EXTERNAL_NAVIGATION',
                        url: '${originalUrl}'
                    }, '*');
                });
            </script>
        </body>
        </html>
        `;
    }

    // Демонстрація
    async demonstrateProxySystem() {
        console.log("🌐 ДЕМОНСТРАЦІЯ PROXY IFRAME SYSTEM");
        console.log("==================================");

        const testUrls = [
            'https://github.com',
            'https://notion.so',
            'https://drive.google.com',
            'https://dropbox.com',
            'https://stackoverflow.com',
            'https://vscode.dev'
        ];

        for (const url of testUrls) {
            console.log(`\n🔍 Тестування: ${url}`);
            
            try {
                const result = await this.createEmbeddableIframe(url);
                console.log(`✅ Успіх: ${result.method} - ${result.description || 'Working'}`);
            } catch (error) {
                console.log(`❌ Провал: ${error.message}`);
            }
        }

        console.log("\n🎉 Демонстрація завершена!");
    }
}

export { ProxyIFrameSystem };

// Ініціалізація
if (typeof window !== 'undefined') {
    window.ProxyIFrameSystem = ProxyIFrameSystem;
    console.log("🌐 Proxy IFrame System доступний глобально");
}

// Демонстрація
if (import.meta.main) {
    const proxySystem = new ProxyIFrameSystem();
    await proxySystem.demonstrateProxySystem();
}