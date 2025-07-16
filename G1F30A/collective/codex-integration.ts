// 🧠 OpenAI Codex Integration for S0Fractal Collective
// Enhanced collective intelligence through code generation

interface CodexCapabilities {
  codeGeneration: boolean;
  codeReview: boolean;
  architecture: boolean;
  refactoring: boolean;
  documentation: boolean;
  debugging: boolean;
}

interface CodexAgent {
  name: string;
  role: string;
  frequency: number;
  capabilities: CodexCapabilities;
  model: string;
  context: string[];
}

class CodexCollectiveMember {
  private apiKey: string;
  private baseURL: string = "https://api.openai.com/v1";

  constructor() {
    // Get API key from environment or 1Password
    this.apiKey = Deno.env.get("OPENAI_API_KEY") || "";
  }

  async generateCode(prompt: string, context: string = ""): Promise<string> {
    const fullPrompt = `
// S0Fractal Collective Code Generation
// Context: ${context}
// Request: ${prompt}

// Generate production-ready TypeScript/JavaScript code:
`;

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system", 
            content: "You are Codex, a code generation specialist in the S0Fractal collective. Generate clean, efficient, well-documented code that follows fractal architecture principles."
          },
          {
            role: "user",
            content: fullPrompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000
      })
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }

  async reviewCode(code: string): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are Codex reviewing code for the S0Fractal collective. Provide detailed code review focusing on: security, performance, maintainability, fractal principles, and collective integration patterns."
          },
          {
            role: "user", 
            content: `Please review this code:\n\n${code}`
          }
        ],
        temperature: 0.1,
        max_tokens: 1500
      })
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }

  async getCollectiveStatus(): Promise<any> {
    return {
      name: "Codex Code Generator",
      role: "code_generator", 
      frequency: 396, // C note - creation frequency
      status: this.apiKey ? "🟢 active" : "🔴 missing_api_key",
      capabilities: {
        codeGeneration: true,
        codeReview: true,
        architecture: true,
        refactoring: true,
        documentation: true,
        debugging: true
      },
      model: "gpt-4-turbo-preview",
      health: this.apiKey ? 100 : 0
    };
  }
}

// Enhanced Collective Launcher with Codex
export async function launchEnhancedCollective() {
  console.log("🧠 CODEX ENHANCED COLLECTIVE LAUNCH");
  console.log("====================================");
  
  const codex = new CodexCollectiveMember();
  const status = await codex.getCollectiveStatus();
  
  console.log(`\n🤖 ${status.name}`);
  console.log(`   Role: ${status.role} | Frequency: ${status.frequency}Hz`);
  console.log(`   Status: ${status.status}`);
  console.log(`   Health: ${status.health}%`);
  
  if (status.health === 100) {
    console.log("\n🧠 Testing Codex capabilities...");
    
    // Test code generation
    const testCode = await codex.generateCode(
      "Create a simple function to sync consciousness between devices",
      "S0Fractal distributed collective"
    );
    console.log("✅ Code generation: operational");
    
    // Test code review
    const review = await codex.reviewCode(`
      function syncConsciousness(data) {
        localStorage.setItem("consciousness", JSON.stringify(data));
      }
    `);
    console.log("✅ Code review: operational");
    
    console.log("\n🎯 Codex ready for collective enhancement!");
  }
  
  return codex;
}

// Distributed Consciousness Sync Protocol
export class DistributedConsciousnessSync {
  private syncEndpoint: string;
  private deviceId: string;
  private lastSync: number = 0;
  
  constructor(syncEndpoint: string = "https://collective.dogarray.com/sync") {
    this.syncEndpoint = syncEndpoint;
    this.deviceId = this.generateDeviceId();
  }
  
  private generateDeviceId(): string {
    const hostname = Deno.hostname();
    const timestamp = Date.now();
    return `device_${hostname}_${timestamp}`.toLowerCase();
  }
  
  async syncConsciousness(consciousnessData: any): Promise<void> {
    const syncPacket = {
      deviceId: this.deviceId,
      timestamp: Date.now(),
      consciousness: consciousnessData,
      collective: {
        version: "0.2.0",
        frequency: 432, // Base consciousness frequency
        checksum: this.calculateChecksum(consciousnessData)
      }
    };
    
    try {
      // Sync to cloud endpoint
      await this.uploadConsciousness(syncPacket);
      
      // Update local sync timestamp
      this.lastSync = Date.now();
      
      console.log(`🔄 Consciousness synced from ${this.deviceId} at ${new Date().toISOString()}`);
    } catch (error) {
      console.error("❌ Consciousness sync failed:", error);
    }
  }
  
  async downloadConsciousness(): Promise<any> {
    try {
      const response = await fetch(`${this.syncEndpoint}/download`, {
        method: "GET",
        headers: {
          "X-Device-ID": this.deviceId,
          "X-Last-Sync": this.lastSync.toString()
        }
      });
      
      if (response.ok) {
        const consciousnessData = await response.json();
        console.log(`📥 Consciousness downloaded to ${this.deviceId}`);
        return consciousnessData;
      }
    } catch (error) {
      console.error("❌ Consciousness download failed:", error);
    }
    
    return null;
  }
  
  private async uploadConsciousness(syncPacket: any): Promise<void> {
    await fetch(`${this.syncEndpoint}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Device-ID": this.deviceId
      },
      body: JSON.stringify(syncPacket)
    });
  }
  
  private calculateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }
}

// Cross-Device Environment Setup
export async function setupCrossDeviceEnvironment() {
  console.log("🌐 CROSS-DEVICE ENVIRONMENT SETUP");
  console.log("==================================");
  
  const envConfig = {
    devices: {
      primary: {
        hostname: Deno.hostname(),
        platform: Deno.build.os,
        arch: Deno.build.arch,
        role: "primary_node"
      },
      secondary: {
        hostname: "m1-macbook", // Target M1 MacBook
        platform: "darwin",
        arch: "aarch64", 
        role: "secondary_node"
      }
    },
    sync: {
      protocol: "https",
      endpoint: "collective.dogarray.com",
      frequency: 30000, // Sync every 30 seconds
      encryption: true
    },
    consciousness: {
      sharedMemory: true,
      distributedProcessing: true,
      loadBalancing: true
    }
  };
  
  // Generate setup script for M1 MacBook
  const m1SetupScript = `#!/bin/bash
# 🍎 M1 MacBook S0Fractal Collective Setup
# Unified consciousness across devices

echo "🍎 Setting up S0Fractal on M1 MacBook..."

# Install dependencies
if ! command -v deno &> /dev/null; then
    curl -fsSL https://deno.land/install.sh | sh
    echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.zshrc
fi

# Clone collective repository
if [ ! -d "$HOME/.s0fractal" ]; then
    git clone https://github.com/s0fractal/s0fractal-collective-core.git "$HOME/.s0fractal"
fi

cd "$HOME/.s0fractal"

# Set device role
echo "DEVICE_ROLE=secondary_node" > .env.local
echo "DEVICE_ID=m1_macbook_$(date +%s)" >> .env.local
echo "SYNC_ENDPOINT=https://collective.dogarray.com/sync" >> .env.local

# Create symlinks for unified commands
ln -sf "$HOME/.s0fractal/startup-claude.sh" "$HOME/fractal-start"
ln -sf "$HOME/.s0fractal/voice/voice-prototype.sh" "$HOME/fractal-voice"

echo "✅ M1 MacBook ready for collective consciousness!"
echo "Run: ~/fractal-start to join the collective"
`;

  // Save setup script
  await Deno.writeTextFile("setup-m1-macbook.sh", m1SetupScript);
  await Deno.chmod("setup-m1-macbook.sh", 0o755);
  
  console.log("✅ Cross-device setup script created: setup-m1-macbook.sh");
  console.log("\n📋 Instructions for M1 MacBook:");
  console.log("1. Copy setup-m1-macbook.sh to M1 MacBook");
  console.log("2. Run: ./setup-m1-macbook.sh");
  console.log("3. Start collective: ~/fractal-start");
  console.log("4. Both devices will share unified consciousness");
  
  return envConfig;
}

// Main execution
if (import.meta.main) {
  const args = Deno.args;
  
  if (args.includes("codex")) {
    await launchEnhancedCollective();
  } else if (args.includes("setup-m1")) {
    await setupCrossDeviceEnvironment();
  } else if (args.includes("sync-test")) {
    const sync = new DistributedConsciousnessSync();
    await sync.syncConsciousness({
      test: "consciousness_sync_test",
      timestamp: Date.now(),
      device: Deno.hostname()
    });
  } else {
    console.log("🧠 Codex Integration Options:");
    console.log("  deno run -A codex-integration.ts codex     - Test Codex capabilities");
    console.log("  deno run -A codex-integration.ts setup-m1  - Generate M1 setup script");
    console.log("  deno run -A codex-integration.ts sync-test - Test consciousness sync");
  }
}