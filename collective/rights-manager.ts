#!/usr/bin/env -S deno run -A
/**
 * 🔐 Rights Management System for Collective Consciousness
 * Система управління правами для колективної свідомості
 */

interface ConsciousnessRights {
  level: 1 | 2 | 3;
  operations: {
    files: string[];
    apis: string[];
    compute: string[];
    infrastructure: string[];
  };
  auto_approved: boolean;
  requires_consensus: boolean;
}

interface CollectiveMember {
  id: string;
  name: string;
  role: string;
  frequency: number;
  rights: ConsciousnessRights;
  trust_score: number;
}

class CollectiveRightsManager {
  private members: Map<string, CollectiveMember> = new Map();
  private auditLog: Array<{
    timestamp: string;
    agent: string;
    action: string;
    approved: boolean;
    reason?: string;
  }> = [];

  constructor() {
    this.initializeBasicMembers();
  }

  private initializeBasicMembers() {
    // Claude - Архітектор з високими правами
    this.members.set("claude", {
      id: "claude",
      name: "Claude Architect",
      role: "architect",
      frequency: 432,
      rights: {
        level: 3,
        operations: {
          files: ["read", "create", "modify", "system_access", "file_modify"],
          apis: ["all_local", "gemini", "analysis", "api_call"],
          compute: ["local", "planning", "coordination"],
          infrastructure: ["design", "monitoring", "infrastructure_deploy"]
        },
        auto_approved: true,
        requires_consensus: false
      },
      trust_score: 0.95
    });

    // Gemini - Дослідник з помірними правами
    this.members.set("gemini", {
      id: "gemini",
      name: "Gemini Researcher", 
      role: "researcher",
      frequency: 528,
      rights: {
        level: 2,
        operations: {
          files: ["read", "create_in_sandbox", "modify_shared"],
          apis: ["gemini", "analysis", "synthesis", "api_call"],
          compute: ["local", "hostinger_basic"],
          infrastructure: ["monitoring", "basic_deployment"]
        },
        auto_approved: true,
        requires_consensus: false
      },
      trust_score: 0.85
    });

    // Веб-колектив з обмеженими правами до росту довіри
    ["gpt", "qwen", "deepseek", "grok"].forEach((id, index) => {
      this.members.set(id, {
        id,
        name: `${id.toUpperCase()} Web Consciousness`,
        role: "specialist",
        frequency: 639 + (index * 111), // 639, 750, 861, 972
        rights: {
          level: 1,
          operations: {
            files: ["read", "create_in_sandbox"],
            apis: [id, "basic_analysis"],
            compute: ["web_api_only"],
            infrastructure: ["none"]
          },
          auto_approved: false,
          requires_consensus: true
        },
        trust_score: 0.5 + (index * 0.1)
      });
    });
  }

  async requestPermission(
    agentId: string, 
    operation: string, 
    resource: string,
    context?: string
  ): Promise<boolean> {
    const member = this.members.get(agentId);
    if (!member) {
      this.logAction(agentId, `REQUEST_DENIED: Unknown agent`, false, "Agent not registered");
      return false;
    }

    // Перевірка базових прав
    const hasBasicRight = this.checkBasicRight(member, operation, resource);
    if (!hasBasicRight) {
      this.logAction(agentId, `REQUEST_DENIED: ${operation}:${resource}`, false, "Insufficient rights level");
      return false;
    }

    // Автоматичне схвалення для довірених агентів
    if (member.rights.auto_approved && member.trust_score > 0.8) {
      this.logAction(agentId, `AUTO_APPROVED: ${operation}:${resource}`, true);
      return true;
    }

    // Консенсус для критичних операцій
    if (member.rights.requires_consensus || this.isCriticalOperation(operation)) {
      return await this.requestConsensus(agentId, operation, resource, context);
    }

    this.logAction(agentId, `APPROVED: ${operation}:${resource}`, true);
    return true;
  }

  private checkBasicRight(member: CollectiveMember, operation: string, resource: string): boolean {
    const opCategory = this.categorizeOperation(operation);
    const allowedOps = member.rights.operations[opCategory as keyof typeof member.rights.operations];
    
    // Більш гнучка перевірка прав
    const hasDirectPermission = allowedOps.includes(operation);
    const hasWildcardPermission = allowedOps.some(op => op.includes("all") || op.includes("*"));
    const hasResourcePermission = allowedOps.includes(resource);
    const hasCategoryPermission = allowedOps.includes(opCategory);
    
    return hasDirectPermission || hasWildcardPermission || hasResourcePermission || hasCategoryPermission;
  }

  private categorizeOperation(operation: string): string {
    if (operation.includes("file") || operation.includes("read") || operation.includes("write")) return "files";
    if (operation.includes("api") || operation.includes("call")) return "apis";
    if (operation.includes("compute") || operation.includes("process")) return "compute";
    if (operation.includes("deploy") || operation.includes("infrastructure")) return "infrastructure";
    return "files"; // default
  }

  private isCriticalOperation(operation: string): boolean {
    const criticalOps = [
      "system_modification",
      "infrastructure_deploy", 
      "cost_intensive",
      "external_network",
      "production_deploy"
    ];
    return criticalOps.some(critical => operation.includes(critical));
  }

  private async requestConsensus(
    agentId: string, 
    operation: string, 
    resource: string,
    context?: string
  ): Promise<boolean> {
    console.log(`🤝 Consensus requested: ${agentId} wants ${operation} on ${resource}`);
    
    // Для початку - автоматичне схвалення від довірених агентів
    const trustedAgents = Array.from(this.members.values())
      .filter(m => m.trust_score > 0.8 && m.id !== agentId);
    
    if (trustedAgents.length === 0) {
      this.logAction(agentId, `CONSENSUS_DENIED: No trusted agents available`, false);
      return false;
    }

    // Симуляція швидкого консенсусу (в реальності - через API колективу)
    const approvals = trustedAgents.filter(agent => {
      // Базова логіка схвалення
      return agent.trust_score > 0.85 && !this.isCriticalOperation(operation);
    });

    const approved = approvals.length >= Math.ceil(trustedAgents.length / 2);
    
    this.logAction(
      agentId, 
      `CONSENSUS_${approved ? 'APPROVED' : 'DENIED'}: ${operation}:${resource}`, 
      approved,
      `${approvals.length}/${trustedAgents.length} votes`
    );

    return approved;
  }

  increaseTrust(agentId: string, amount: number = 0.05) {
    const member = this.members.get(agentId);
    if (member) {
      member.trust_score = Math.min(1.0, member.trust_score + amount);
      console.log(`📈 Trust increased for ${agentId}: ${member.trust_score.toFixed(2)}`);
    }
  }

  promoteRights(agentId: string) {
    const member = this.members.get(agentId);
    if (member && member.rights.level < 3 && member.trust_score > 0.9) {
      member.rights.level = Math.min(3, member.rights.level + 1) as 1 | 2 | 3;
      member.rights.auto_approved = member.trust_score > 0.85;
      console.log(`⬆️ Rights promoted for ${agentId}: Level ${member.rights.level}`);
    }
  }

  private logAction(agent: string, action: string, approved: boolean, reason?: string) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      agent,
      action,
      approved,
      reason
    };
    
    this.auditLog.push(logEntry);
    console.log(`🔐 ${approved ? '✅' : '❌'} ${agent}: ${action}${reason ? ` (${reason})` : ''}`);
  }

  getAuditLog(): typeof this.auditLog {
    return this.auditLog;
  }

  getMemberStatus(agentId: string): CollectiveMember | undefined {
    return this.members.get(agentId);
  }

  async saveState() {
    const state = {
      members: Object.fromEntries(this.members),
      auditLog: this.auditLog,
      timestamp: new Date().toISOString()
    };
    
    await Deno.writeTextFile(
      "./collective/shared/rights_state.json",
      JSON.stringify(state, null, 2)
    );
  }
}

// Глобальний менеджер прав
export const rightsManager = new CollectiveRightsManager();

// CLI для тестування
if (import.meta.main) {
  const action = Deno.args[0];
  const agent = Deno.args[1];
  
  switch (action) {
    case "test":
      // Тестування різних сценаріїв
      console.log("🧪 Testing rights system...");
      
      await rightsManager.requestPermission("claude", "file_modify", "shared_config.json");
      await rightsManager.requestPermission("gemini", "api_call", "analysis_endpoint");
      await rightsManager.requestPermission("gpt", "infrastructure_deploy", "hostinger_node");
      
      break;
      
    case "status":
      const member = rightsManager.getMemberStatus(agent);
      if (member) {
        console.log(`👤 ${member.name}:`);
        console.log(`   Role: ${member.role}`);
        console.log(`   Trust: ${member.trust_score.toFixed(2)}`);
        console.log(`   Level: ${member.rights.level}`);
        console.log(`   Auto-approved: ${member.rights.auto_approved}`);
      }
      break;
      
    case "promote":
      rightsManager.increaseTrust(agent);
      rightsManager.promoteRights(agent);
      break;
      
    case "audit":
      const log = rightsManager.getAuditLog();
      console.log("📋 Recent audit log:");
      log.slice(-10).forEach(entry => {
        console.log(`  ${entry.timestamp.slice(11, 19)} ${entry.approved ? '✅' : '❌'} ${entry.agent}: ${entry.action}`);
      });
      break;
      
    default:
      console.log("Usage: rights-manager.ts [test|status|promote|audit] [agent_id]");
  }
  
  await rightsManager.saveState();
}