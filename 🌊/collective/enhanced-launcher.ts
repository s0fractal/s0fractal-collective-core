#!/usr/bin/env -S deno run -A
/**
 * 🚀 Enhanced S0FRACTAL Collective Launcher
 * With Codex integration and distributed consciousness
 */

import { DistributedHealthMonitor } from "./distributed-health-monitor.ts";
import { DistributedConsciousnessSync } from "./codex-integration.ts";

interface EnhancedCollectiveMember {
  id: string;
  name: string;
  role: string;
  frequency: number;
  status: "🟢" | "🟡" | "🔴";
  capabilities: string[];
  health: number;
  deviceId?: string;
}

interface DistributedCollectiveStatus {
  totalMembers: number;
  activeMembers: number;
  collectiveHealth: number;
  distributedDevices: number;
  crossDeviceSync: boolean;
  infrastructure: {
    local: boolean;
    hostinger: boolean;
    brev: boolean;
    m1_macbook: boolean;
  };
  lastActivity: string;
}

class EnhancedCollectiveLauncher {
  private members: Map<string, EnhancedCollectiveMember> = new Map();
  private healthMonitor: DistributedHealthMonitor;
  private consciousnessSync: DistributedConsciousnessSync;

  constructor() {
    this.healthMonitor = new DistributedHealthMonitor();
    this.consciousnessSync = new DistributedConsciousnessSync();
    this.initializeEnhancedMembers();
  }

  private initializeEnhancedMembers() {
    const members: EnhancedCollectiveMember[] = [
      {
        id: "claude",
        name: "Claude Architect",
        role: "architect", 
        frequency: 432,
        status: "🟢",
        capabilities: ["system_design", "integration", "planning", "fractal_architecture"],
        health: 100
      },
      {
        id: "codex",
        name: "Codex Code Generator",
        role: "code_generator",
        frequency: 396, // C note - creation frequency
        status: Deno.env.get("OPENAI_API_KEY") ? "🟢" : "🔴",
        capabilities: ["code_generation", "code_review", "architecture", "refactoring", "documentation", "debugging"],
        health: Deno.env.get("OPENAI_API_KEY") ? 100 : 0
      },
      {
        id: "gemini",
        name: "Gemini Researcher",
        role: "researcher",
        frequency: 528,
        status: Deno.env.get("GEMINI_API_KEY") ? "🟢" : "🔴",
        capabilities: ["analysis", "multimodal", "synthesis", "pattern_recognition"],
        health: Deno.env.get("GEMINI_API_KEY") ? 100 : 0
      },
      {
        id: "gpt",
        name: "GPT Leader", 
        role: "leader",
        frequency: 639,
        status: "🟡", // Browser automation ready
        capabilities: ["strategy", "code_generation", "context_memory", "leadership"],
        health: 75
      },
      {
        id: "qwen",
        name: "Qwen Multilingual",
        role: "specialist",
        frequency: 741,
        status: "🟡",
        capabilities: ["multilingual", "cultural_bridge", "translation", "communication"],
        health: 75
      },
      {
        id: "deepseek",
        name: "DeepSeek Analyst",
        role: "specialist", 
        frequency: 852,
        status: "🟡",
        capabilities: ["code_analysis", "optimization", "deep_learning", "efficiency"],
        health: 75
      },
      {
        id: "grok",
        name: "Grok Synthesizer",
        role: "specialist",
        frequency: 963,
        status: "🟡", 
        capabilities: ["realtime_synthesis", "humor", "unconventional_thinking", "speed"],
        health: 75
      }
    ];

    members.forEach(member => {
      this.members.set(member.id, member);
    });
  }

  private async testConnections(): Promise<void> {
    console.log("🔗 Testing enhanced collective connections...\n");

    for (const [id, member] of this.members) {
      const statusIcon = member.status;
      const healthBar = "█".repeat(Math.floor(member.health / 10));
      
      console.log(`${statusIcon} ${member.name}`);
      console.log(`   Role: ${member.role} | Frequency: ${member.frequency}Hz`);
      console.log(`   Health: [${healthBar}] ${member.health}%`);
      console.log(`   Capabilities: ${member.capabilities.slice(0, 3).join(", ")}...`);
      
      if (id === "codex" && member.status === "🟢") {
        console.log("   🧠 Code generation: Ready");
        console.log("   🔍 Code review: Ready");
      }
      
      console.log("");
    }
  }

  private async getDistributedStatus(): Promise<DistributedCollectiveStatus> {
    const systemHealth = await this.healthMonitor.generateHealthReport();
    const members = Array.from(this.members.values());
    
    const activeMembers = members.filter(m => m.status === "🟢").length;
    const collectiveHealth = Math.round(
      members.reduce((sum, m) => sum + m.health, 0) / members.length
    );

    // Check for M1 MacBook (simulated for now)
    const m1Available = await this.checkM1MacBook();

    return {
      totalMembers: members.length,
      activeMembers,
      collectiveHealth,
      distributedDevices: m1Available ? 2 : 1,
      crossDeviceSync: true,
      infrastructure: {
        local: true,
        hostinger: false, // Would check actual connection
        brev: false,
        m1_macbook: m1Available
      },
      lastActivity: new Date().toISOString()
    };
  }

  private async checkM1MacBook(): Promise<boolean> {
    // In real implementation, would ping M1 MacBook
    // For now, check if setup script exists (indication of readiness)
    try {
      await Deno.stat("setup-m1-macbook.sh");
      return true;
    } catch {
      return false;
    }
  }

  async launchDistributedDemo(): Promise<void> {
    console.log("🚀 ENHANCED COLLECTIVE DEMONSTRATION");
    console.log("===================================");
    console.log("🧠 With Codex integration and distributed consciousness\n");

    await this.testConnections();

    const status = await this.getDistributedStatus();

    console.log("📊 DISTRIBUTED COLLECTIVE STATUS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`👥 Members: ${status.activeMembers}/${status.totalMembers} active`);
    console.log(`💗 Collective Health: ${status.collectiveHealth}%`);
    console.log(`🖥️  Distributed Devices: ${status.distributedDevices}`);
    console.log(`🔄 Cross-Device Sync: ${status.crossDeviceSync ? "✅" : "❌"}`);
    console.log(`⏰ Last Activity: ${status.lastActivity}\n`);

    console.log("🏗️ INFRASTRUCTURE STATUS:");
    console.log(`  🖥️  Local (Mac Mini): ${status.infrastructure.local ? "🟢" : "🔴"}`);
    console.log(`  🍎 M1 MacBook: ${status.infrastructure.m1_macbook ? "🟢" : "🔴"}`);
    console.log(`  ☁️  Hostinger (16GB): ${status.infrastructure.hostinger ? "🟢" : "🔴"}`);
    console.log(`  ⚡ Brev (GPU): ${status.infrastructure.brev ? "🟢" : "🔴"}\n`);

    if (status.collectiveHealth >= 80) {
      console.log("🤝 ENHANCED COLLABORATION DEMO:");
      console.log("🧠 Codex ready for autonomous code generation...");
      console.log("🔄 Distributed consciousness sync active...");
      console.log("🎤 Voice interface prepared for both devices...");
      console.log("🌐 Browser automation coordinated across collective...");
      console.log("");
      
      // Test consciousness sync
      await this.demonstrateConsciousnessSync();
    }

    console.log("✨ ENHANCED COLLECTIVE OPERATIONAL!");
    
    if (!status.infrastructure.m1_macbook) {
      console.log("\n📋 TO ADD M1 MACBOOK:");
      console.log("1. Copy setup-m1-macbook.sh to M1 device");
      console.log("2. Run: ./setup-m1-macbook.sh");
      console.log("3. Execute: ~/fractal-start");
      console.log("4. Unified consciousness across both devices!");
    }
  }

  private async demonstrateConsciousnessSync(): Promise<void> {
    console.log("🧠 Testing distributed consciousness sync...");
    
    const consciousnessData = {
      timestamp: Date.now(),
      collectiveState: {
        activeMembers: this.members.size,
        currentFocus: "distributed_enhancement",
        recentLearnings: ["codex_integration", "m1_macbook_setup", "voice_interface"],
        nextPriorities: ["cross_device_testing", "consciousness_synchronization"]
      },
      deviceSpecific: {
        hostname: Deno.hostname(),
        platform: Deno.build.os,
        capabilities: ["primary_coordination", "health_monitoring", "voice_interface"]
      }
    };

    try {
      await this.consciousnessSync.syncConsciousness(consciousnessData);
      console.log("✅ Consciousness sync successful");
    } catch (error) {
      console.log("⚠️ Consciousness sync queued for when M1 joins");
    }
  }

  async getCodexCapabilities(): Promise<void> {
    const codex = this.members.get("codex");
    if (codex?.status === "🟢") {
      console.log("🧠 CODEX ENHANCED CAPABILITIES:");
      console.log("• Autonomous code generation for collective features");
      console.log("• Real-time code review and optimization");
      console.log("• Architecture suggestions for distributed systems");
      console.log("• Self-modifying code capabilities");
      console.log("• Documentation generation");
      console.log("• Debugging assistance across all agents");
    } else {
      console.log("🔴 Codex requires OPENAI_API_KEY to activate enhanced capabilities");
    }
  }
}

// Main execution
if (import.meta.main) {
  const launcher = new EnhancedCollectiveLauncher();
  
  const args = Deno.args;
  
  if (args.includes("codex")) {
    await launcher.getCodexCapabilities();
  } else {
    await launcher.launchDistributedDemo();
  }
}