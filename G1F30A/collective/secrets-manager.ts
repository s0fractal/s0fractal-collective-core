#!/usr/bin/env -S deno run -A
/**
 * 🔐 Secrets Manager using 1Password CLI
 * Безпечне управління ключами колективу
 */

class SecretsManager {
  private vaultName = "s0fractal_collective";
  private isAuthenticated = false;

  async initialize(): Promise<boolean> {
    try {
      // Перевірка чи встановлений 1Password CLI
      const which = await Deno.run({ 
        cmd: ["which", "op"], 
        stdout: "null" 
      }).status();
      
      if (!which.success) {
        console.log("❌ 1Password CLI не встановлений");
        return false;
      }

      // Перевірка аутентифікації
      const whoami = await Deno.run({ 
        cmd: ["op", "whoami"], 
        stdout: "piped",
        stderr: "null"
      });
      
      const output = new TextDecoder().decode(await whoami.output());
      whoami.close();
      
      this.isAuthenticated = whoami.status.success && output.trim().length > 0;
      
      if (this.isAuthenticated) {
        console.log(`✅ 1Password автентифікований: ${output.trim()}`);
        await this.ensureVaultExists();
        return true;
      } else {
        console.log("🔐 Потрібна автентифікація в 1Password:");
        console.log("Виконай: op signin");
        return false;
      }
    } catch (error) {
      console.log(`❌ Помилка ініціалізації: ${error.message}`);
      return false;
    }
  }

  private async ensureVaultExists(): Promise<void> {
    try {
      // Перевірка чи існує vault
      const listVaults = await Deno.run({
        cmd: ["op", "vault", "list", "--format=json"],
        stdout: "piped",
        stderr: "null"
      });
      
      const vaultsData = new TextDecoder().decode(await listVaults.output());
      listVaults.close();
      
      if (listVaults.status.success) {
        const vaults = JSON.parse(vaultsData);
        const exists = vaults.some((v: any) => v.name === this.vaultName);
        
        if (!exists) {
          console.log(`🏗️ Створюємо vault: ${this.vaultName}`);
          await this.createVault();
        } else {
          console.log(`✅ Vault існує: ${this.vaultName}`);
        }
      }
    } catch (error) {
      console.log(`⚠️ Помилка перевірки vault: ${error.message}`);
    }
  }

  private async createVault(): Promise<void> {
    const create = await Deno.run({
      cmd: ["op", "vault", "create", this.vaultName],
      stdout: "piped",
      stderr: "piped"
    });
    
    await create.status();
    create.close();
  }

  async storeSecret(
    key: string, 
    value: string, 
    category: "api_credential" | "database" | "infrastructure" = "api_credential",
    metadata?: Record<string, string>
  ): Promise<boolean> {
    if (!this.isAuthenticated) {
      console.log("❌ Не автентифікований в 1Password");
      return false;
    }

    try {
      const tags = ["s0fractal", "collective"];
      if (metadata?.service) tags.push(metadata.service);
      
      const cmd = [
        "op", "item", "create",
        "--category", category,
        "--title", key,
        "--vault", this.vaultName,
        "--tags", tags.join(","),
        `password=${value}`
      ];

      if (metadata?.url) {
        cmd.push(`url=${metadata.url}`);
      }

      const create = await Deno.run({
        cmd,
        stdout: "piped",
        stderr: "piped"
      });

      const success = (await create.status()).success;
      create.close();

      if (success) {
        console.log(`✅ Збережено секрет: ${key}`);
        return true;
      } else {
        console.log(`❌ Помилка збереження: ${key}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ Помилка: ${error.message}`);
      return false;
    }
  }

  async getSecret(key: string): Promise<string | null> {
    if (!this.isAuthenticated) {
      console.log("❌ Не автентифікований в 1Password");
      return null;
    }

    try {
      const get = await Deno.run({
        cmd: ["op", "item", "get", key, "--vault", this.vaultName, "--field", "password"],
        stdout: "piped",
        stderr: "null"
      });

      if (get.status.success) {
        const value = new TextDecoder().decode(await get.output()).trim();
        get.close();
        return value;
      } else {
        get.close();
        return null;
      }
    } catch (error) {
      console.log(`❌ Помилка отримання секрету: ${error.message}`);
      return null;
    }
  }

  async initializeCollectiveSecrets(): Promise<void> {
    console.log("🔐 Ініціалізація секретів колективу...");

    const secrets = [
      {
        key: "gemini_api_key",
        value: Deno.env.get("GEMINI_API_KEY") || "",
        metadata: { service: "gemini", url: "https://generativelanguage.googleapis.com" }
      },
      // Placeholder для інших ключів
      {
        key: "openai_api_key", 
        value: "",
        metadata: { service: "openai", url: "https://api.openai.com" }
      },
      {
        key: "qwen_api_key",
        value: "",
        metadata: { service: "qwen" }
      },
      {
        key: "deepseek_api_key", 
        value: "",
        metadata: { service: "deepseek" }
      },
      {
        key: "grok_api_key",
        value: "",
        metadata: { service: "grok" }
      },
      {
        key: "hostinger_ssh_key",
        value: "",
        metadata: { service: "hostinger", url: "hostinger.com" }
      }
    ];

    for (const secret of secrets) {
      if (secret.value) {
        await this.storeSecret(secret.key, secret.value, "api_credential", secret.metadata);
      } else {
        console.log(`⏭️ Пропускаємо пустий ключ: ${secret.key}`);
      }
    }
  }

  async exportSecretsToEnv(envPath: string = "./.env"): Promise<void> {
    console.log("📝 Експорт секретів в .env файл...");
    
    const secretKeys = [
      "gemini_api_key",
      "openai_api_key", 
      "qwen_api_key",
      "deepseek_api_key",
      "grok_api_key"
    ];

    let envContent = "# 🔐 Collective Secrets (managed by 1Password)\n";
    envContent += `# Generated: ${new Date().toISOString()}\n\n`;

    for (const key of secretKeys) {
      const value = await this.getSecret(key);
      if (value) {
        const envKey = key.toUpperCase();
        envContent += `${envKey}=${value}\n`;
      }
    }

    await Deno.writeTextFile(envPath, envContent);
    await Deno.chmod(envPath, 0o600); // Обмежені права доступу
    console.log(`✅ Секрети експортовані в ${envPath}`);
  }

  async setupCollectiveInfrastructure(): Promise<void> {
    console.log("🏗️ Налаштування інфраструктури колективу...");
    
    // Генерація SSH ключів для безпечного доступу
    const sshKeyPath = "./collective/shared/ssh_keys";
    await Deno.mkdir(sshKeyPath, { recursive: true });
    
    const sshGen = await Deno.run({
      cmd: [
        "ssh-keygen", 
        "-t", "ed25519", 
        "-f", `${sshKeyPath}/collective_key`,
        "-N", "", 
        "-C", "s0fractal_collective"
      ],
      stdout: "null"
    });
    
    await sshGen.status();
    sshGen.close();
    
    // Збереження приватного ключа в 1Password
    const privateKey = await Deno.readTextFile(`${sshKeyPath}/collective_key`);
    await this.storeSecret(
      "collective_ssh_private_key", 
      privateKey, 
      "infrastructure",
      { service: "ssh", type: "private_key" }
    );
    
    console.log("✅ SSH ключі згенеровані та збережені");
  }
}

// CLI інтерфейс
if (import.meta.main) {
  const secretsManager = new SecretsManager();
  const command = Deno.args[0];
  
  switch (command) {
    case "init":
      if (await secretsManager.initialize()) {
        await secretsManager.initializeCollectiveSecrets();
        await secretsManager.exportSecretsToEnv();
        await secretsManager.setupCollectiveInfrastructure();
      }
      break;
      
    case "export":
      if (await secretsManager.initialize()) {
        await secretsManager.exportSecretsToEnv(Deno.args[1] || "./.env");
      }
      break;
      
    case "store":
      if (await secretsManager.initialize()) {
        const key = Deno.args[1];
        const value = Deno.args[2];
        if (key && value) {
          await secretsManager.storeSecret(key, value);
        } else {
          console.log("Usage: store <key> <value>");
        }
      }
      break;
      
    case "get":
      if (await secretsManager.initialize()) {
        const key = Deno.args[1];
        if (key) {
          const value = await secretsManager.getSecret(key);
          console.log(value || "Secret not found");
        } else {
          console.log("Usage: get <key>");
        }
      }
      break;
      
    default:
      console.log("🔐 Secrets Manager Commands:");
      console.log("  init    - Initialize collective secrets");
      console.log("  export  - Export secrets to .env");
      console.log("  store   - Store a secret");
      console.log("  get     - Get a secret");
  }
}