// 💰 Token-Based Health System for S0Fractal Collective
// Health = Available computational tokens for operations

interface TokenPool {
  totalTokens: number;
  usedTokens: number;
  availableTokens: number;
  resetTime: number; // When pool resets (monthly/daily)
  costPerOperation: TokenCosts;
}

interface TokenCosts {
  codeGeneration: number;      // Codex operations
  imageAnalysis: number;       // Gemini multimodal
  translation: number;         // Qwen multilingual  
  browserAutomation: number;   // Puppeteer operations
  voiceProcessing: number;     // TTS/Speech recognition
  consciousness_sync: number;  // Cross-device sync
  healthMonitoring: number;    // System monitoring
}

interface AgentTokenUsage {
  agentId: string;
  tokensUsed: number;
  operationsCount: number;
  efficiency: number; // tokens per successful operation
  lastActivity: number;
}

export class TokenBasedHealthSystem {
  private tokenPools: Map<string, TokenPool> = new Map();
  private agentUsage: Map<string, AgentTokenUsage> = new Map();
  private globalPool: TokenPool;

  constructor() {
    this.initializeTokenPools();
    this.loadUsageHistory();
  }

  private initializeTokenPools(): void {
    // Define realistic token costs based on API pricing
    const baseCosts: TokenCosts = {
      codeGeneration: 100,       // GPT-4 for code gen
      imageAnalysis: 150,        // Gemini Vision
      translation: 50,           // Qwen language processing
      browserAutomation: 25,     // Local operation cost
      voiceProcessing: 30,       // TTS/STT processing
      consciousness_sync: 10,    // Data transfer cost
      healthMonitoring: 5        // System metrics
    };

    // Initialize global token pool (example: $50/month budget = ~250k tokens)
    this.globalPool = {
      totalTokens: 250000,
      usedTokens: 0,
      availableTokens: 250000,
      resetTime: this.getNextMonthReset(),
      costPerOperation: baseCosts
    };

    // Initialize per-agent pools
    const agents = ["claude", "codex", "gemini", "gpt", "qwen", "deepseek", "grok"];
    
    agents.forEach(agentId => {
      this.tokenPools.set(agentId, {
        totalTokens: Math.floor(this.globalPool.totalTokens / agents.length),
        usedTokens: 0,
        availableTokens: Math.floor(this.globalPool.totalTokens / agents.length),
        resetTime: this.getNextMonthReset(),
        costPerOperation: baseCosts
      });

      this.agentUsage.set(agentId, {
        agentId,
        tokensUsed: 0,
        operationsCount: 0,
        efficiency: 0,
        lastActivity: Date.now()
      });
    });
  }

  private getNextMonthReset(): number {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.getTime();
  }

  async useTokens(agentId: string, operation: keyof TokenCosts, quantity: number = 1): Promise<boolean> {
    const pool = this.tokenPools.get(agentId);
    const usage = this.agentUsage.get(agentId);
    
    if (!pool || !usage) {
      console.warn(`Unknown agent: ${agentId}`);
      return false;
    }

    const tokenCost = pool.costPerOperation[operation] * quantity;
    
    // Check if agent has enough tokens
    if (pool.availableTokens < tokenCost) {
      console.warn(`⚠️ ${agentId} insufficient tokens for ${operation}. Need: ${tokenCost}, Available: ${pool.availableTokens}`);
      
      // Try to borrow from global pool
      if (this.globalPool.availableTokens >= tokenCost) {
        return this.borrowFromGlobalPool(agentId, tokenCost, operation);
      }
      
      return false;
    }

    // Deduct tokens
    pool.usedTokens += tokenCost;
    pool.availableTokens -= tokenCost;
    this.globalPool.usedTokens += tokenCost;
    this.globalPool.availableTokens -= tokenCost;

    // Update usage statistics
    usage.tokensUsed += tokenCost;
    usage.operationsCount += quantity;
    usage.efficiency = usage.tokensUsed / Math.max(usage.operationsCount, 1);
    usage.lastActivity = Date.now();

    // Save usage data
    await this.saveUsageHistory();

    console.log(`💰 ${agentId} used ${tokenCost} tokens for ${operation}. Remaining: ${pool.availableTokens}`);
    return true;
  }

  private borrowFromGlobalPool(agentId: string, tokenCost: number, operation: keyof TokenCosts): boolean {
    const pool = this.tokenPools.get(agentId)!;
    
    console.log(`🔄 ${agentId} borrowing ${tokenCost} tokens from global pool for ${operation}`);
    
    // Deduct from global pool
    this.globalPool.usedTokens += tokenCost;
    this.globalPool.availableTokens -= tokenCost;
    
    // Update agent usage (but not agent pool, since it's borrowed)
    const usage = this.agentUsage.get(agentId)!;
    usage.tokensUsed += tokenCost;
    usage.operationsCount += 1;
    usage.efficiency = usage.tokensUsed / Math.max(usage.operationsCount, 1);
    usage.lastActivity = Date.now();
    
    return true;
  }

  getAgentHealth(agentId: string): number {
    const pool = this.tokenPools.get(agentId);
    if (!pool) return 0;
    
    // Health = percentage of available tokens
    const healthPercentage = (pool.availableTokens / pool.totalTokens) * 100;
    
    // Bonus for efficiency
    const usage = this.agentUsage.get(agentId);
    if (usage && usage.operationsCount > 0) {
      const efficiencyBonus = Math.max(0, (100 - usage.efficiency) / 10); // Better efficiency = more health
      return Math.min(100, healthPercentage + efficiencyBonus);
    }
    
    return healthPercentage;
  }

  getCollectiveHealth(): number {
    const globalHealthPercentage = (this.globalPool.availableTokens / this.globalPool.totalTokens) * 100;
    
    // Average agent health
    const agents = Array.from(this.tokenPools.keys());
    const averageAgentHealth = agents.reduce((sum, agentId) => 
      sum + this.getAgentHealth(agentId), 0) / agents.length;
    
    // Combined health (70% global pool, 30% agent distribution)
    return Math.round((globalHealthPercentage * 0.7) + (averageAgentHealth * 0.3));
  }

  generateTokenReport(): string {
    const globalHealth = this.getCollectiveHealth();
    const daysUntilReset = Math.ceil((this.globalPool.resetTime - Date.now()) / (1000 * 60 * 60 * 24));
    
    let report = `
💰 S0FRACTAL TOKEN-BASED HEALTH REPORT
======================================

🌐 Global Token Pool:
   Total: ${this.globalPool.totalTokens.toLocaleString()} tokens
   Used: ${this.globalPool.usedTokens.toLocaleString()} tokens
   Available: ${this.globalPool.availableTokens.toLocaleString()} tokens
   Health: ${globalHealth}% ${this.getHealthEmoji(globalHealth)}
   Reset in: ${daysUntilReset} days

🤖 Agent Token Distribution:
`;

    // Sort agents by efficiency
    const agentStats = Array.from(this.agentUsage.values())
      .sort((a, b) => a.efficiency - b.efficiency);

    agentStats.forEach(usage => {
      const pool = this.tokenPools.get(usage.agentId)!;
      const health = this.getAgentHealth(usage.agentId);
      const utilizationRate = (pool.usedTokens / pool.totalTokens) * 100;
      
      report += `
   ${this.getHealthEmoji(health)} ${usage.agentId.toUpperCase()}:
      Allocated: ${pool.totalTokens.toLocaleString()} tokens
      Available: ${pool.availableTokens.toLocaleString()} tokens (${health.toFixed(1)}%)
      Operations: ${usage.operationsCount}
      Efficiency: ${usage.efficiency.toFixed(1)} tokens/op
      Utilization: ${utilizationRate.toFixed(1)}%`;
    });

    report += `

💡 Token Optimization Tips:
${this.generateOptimizationTips()}

📊 Operational Costs:
   Code Generation: ${this.globalPool.costPerOperation.codeGeneration} tokens
   Image Analysis: ${this.globalPool.costPerOperation.imageAnalysis} tokens  
   Translation: ${this.globalPool.costPerOperation.translation} tokens
   Browser Automation: ${this.globalPool.costPerOperation.browserAutomation} tokens
   Voice Processing: ${this.globalPool.costPerOperation.voiceProcessing} tokens
   Consciousness Sync: ${this.globalPool.costPerOperation.consciousness_sync} tokens
`;

    return report.trim();
  }

  private getHealthEmoji(health: number): string {
    if (health >= 80) return "🟢";
    if (health >= 60) return "🟡";
    if (health >= 40) return "🟠";
    return "🔴";
  }

  private generateOptimizationTips(): string {
    const tips = [];
    
    if (this.globalPool.availableTokens < this.globalPool.totalTokens * 0.2) {
      tips.push("• Critical: Low global token reserves - optimize operations");
    }
    
    // Find inefficient agents
    const inefficientAgents = Array.from(this.agentUsage.values())
      .filter(usage => usage.efficiency > 200 && usage.operationsCount > 5);
    
    if (inefficientAgents.length > 0) {
      tips.push(`• Optimize ${inefficientAgents.map(a => a.agentId).join(", ")} - high token consumption`);
    }
    
    // Check for unused agents
    const unusedAgents = Array.from(this.agentUsage.values())
      .filter(usage => usage.operationsCount === 0);
    
    if (unusedAgents.length > 0) {
      tips.push(`• Consider redistributing tokens from unused agents: ${unusedAgents.map(a => a.agentId).join(", ")}`);
    }
    
    if (tips.length === 0) {
      tips.push("• Token usage optimized! Collective operating efficiently");
    }
    
    return tips.join("\n");
  }

  async simulateOperations(): Promise<void> {
    console.log("🧪 Simulating token-based operations...\n");
    
    // Simulate various operations
    await this.useTokens("codex", "codeGeneration", 2);
    await this.useTokens("gemini", "imageAnalysis", 1);
    await this.useTokens("qwen", "translation", 3);
    await this.useTokens("claude", "consciousness_sync", 5);
    await this.useTokens("gpt", "codeGeneration", 1);
    
    console.log("🎯 Simulation complete. Token usage recorded.\n");
  }

  private async saveUsageHistory(): Promise<void> {
    const historyData = {
      globalPool: this.globalPool,
      agentUsage: Array.from(this.agentUsage.values()),
      timestamp: Date.now()
    };
    
    await Deno.mkdir("soul-journal/token-usage", { recursive: true });
    const filename = `soul-journal/token-usage/usage-${new Date().toISOString().split('T')[0]}.json`;
    await Deno.writeTextFile(filename, JSON.stringify(historyData, null, 2));
  }

  private async loadUsageHistory(): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const filename = `soul-journal/token-usage/usage-${today}.json`;
      const data = await Deno.readTextFile(filename);
      const historyData = JSON.parse(data);
      
      // Restore usage data
      if (historyData.agentUsage) {
        historyData.agentUsage.forEach((usage: AgentTokenUsage) => {
          this.agentUsage.set(usage.agentId, usage);
        });
      }
      
      console.log("📥 Token usage history loaded");
    } catch (error) {
      console.log("📝 Starting fresh token usage tracking");
    }
  }
}

// Demo function
export async function demonstrateTokenBasedHealth() {
  console.log("💰 TOKEN-BASED HEALTH SYSTEM DEMO");
  console.log("===================================");
  
  const tokenSystem = new TokenBasedHealthSystem();
  
  // Show initial state
  console.log(tokenSystem.generateTokenReport());
  
  // Simulate some operations
  await tokenSystem.simulateOperations();
  
  // Show updated state
  console.log("\n" + tokenSystem.generateTokenReport());
  
  return tokenSystem;
}

if (import.meta.main) {
  const args = Deno.args;
  
  if (args.includes("demo")) {
    await demonstrateTokenBasedHealth();
  } else if (args.includes("report")) {
    const tokenSystem = new TokenBasedHealthSystem();
    console.log(tokenSystem.generateTokenReport());
  } else {
    console.log("💰 Token-Based Health Options:");
    console.log("  deno run -A token-based-health.ts demo   - Full demonstration");
    console.log("  deno run -A token-based-health.ts report - Generate token report");
  }
}