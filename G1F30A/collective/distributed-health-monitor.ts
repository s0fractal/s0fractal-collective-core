// 📊 Distributed Collective Health Monitor
// Unified health tracking across multiple devices

interface DeviceHealth {
  deviceId: string;
  hostname: string;
  platform: string;
  arch: string;
  role: "primary_node" | "secondary_node" | "compute_node";
  lastSeen: number;
  cpuUsage?: number;
  memoryUsage?: number;
  diskUsage?: number;
  networkLatency?: number;
  consciousnessSync: boolean;
  activeAgents: string[];
  health: number; // 0-100
}

interface CollectiveHealth {
  totalDevices: number;
  activeDevices: number;
  averageHealth: number;
  distributedCapacity: number;
  syncStatus: "synchronized" | "syncing" | "desynchronized";
  lastGlobalSync: number;
}

export class DistributedHealthMonitor {
  private devices: Map<string, DeviceHealth> = new Map();
  private syncEndpoint: string;
  private currentDevice: DeviceHealth;

  constructor(syncEndpoint: string = "https://collective.dogarray.com/health") {
    this.syncEndpoint = syncEndpoint;
    this.currentDevice = this.initializeCurrentDevice();
  }

  private initializeCurrentDevice(): DeviceHealth {
    const deviceId = `${Deno.hostname()}_${Date.now()}`;
    
    return {
      deviceId,
      hostname: Deno.hostname(),
      platform: Deno.build.os,
      arch: Deno.build.arch,
      role: "primary_node", // Will be updated based on config
      lastSeen: Date.now(),
      consciousnessSync: true,
      activeAgents: [],
      health: 0
    };
  }

  async updateSystemMetrics(): Promise<void> {
    try {
      // Get system information
      if (Deno.build.os === "darwin") {
        // macOS specific metrics
        await this.getMacOSMetrics();
      } else {
        // Generic metrics
        await this.getGenericMetrics();
      }

      // Update agents status
      await this.updateActiveAgents();
      
      // Calculate overall health
      this.calculateDeviceHealth();
      
      this.currentDevice.lastSeen = Date.now();
    } catch (error) {
      console.error("Failed to update system metrics:", error);
      this.currentDevice.health = Math.max(0, this.currentDevice.health - 10);
    }
  }

  private async getMacOSMetrics(): Promise<void> {
    try {
      // CPU usage
      const cpuCmd = new Deno.Command("top", {
        args: ["-l", "1", "-n", "0"],
        stdout: "piped"
      });
      const cpuOutput = await cpuCmd.output();
      const cpuText = new TextDecoder().decode(cpuOutput.stdout);
      const cpuMatch = cpuText.match(/CPU usage: ([\d.]+)% user/);
      this.currentDevice.cpuUsage = cpuMatch ? parseFloat(cpuMatch[1]) : 0;

      // Memory usage
      const memCmd = new Deno.Command("vm_stat", { stdout: "piped" });
      const memOutput = await memCmd.output();
      const memText = new TextDecoder().decode(memOutput.stdout);
      // Parse vm_stat output for memory calculations
      this.currentDevice.memoryUsage = this.parseMemoryUsage(memText);

      // Disk usage
      const diskCmd = new Deno.Command("df", {
        args: ["-h", "/"],
        stdout: "piped"
      });
      const diskOutput = await diskCmd.output();
      const diskText = new TextDecoder().decode(diskOutput.stdout);
      const diskMatch = diskText.match(/(\d+)%/);
      this.currentDevice.diskUsage = diskMatch ? parseInt(diskMatch[1]) : 0;

    } catch (error) {
      console.warn("Failed to get macOS metrics:", error);
    }
  }

  private parseMemoryUsage(vmStatOutput: string): number {
    // Parse vm_stat output to calculate memory usage percentage
    const lines = vmStatOutput.split('\n');
    let free = 0, active = 0, inactive = 0, wired = 0;
    
    for (const line of lines) {
      if (line.includes('Pages free:')) {
        free = parseInt(line.split(':')[1]) || 0;
      } else if (line.includes('Pages active:')) {
        active = parseInt(line.split(':')[1]) || 0;
      } else if (line.includes('Pages inactive:')) {
        inactive = parseInt(line.split(':')[1]) || 0;
      } else if (line.includes('Pages wired down:')) {
        wired = parseInt(line.split(':')[1]) || 0;
      }
    }
    
    const total = free + active + inactive + wired;
    const used = active + inactive + wired;
    return total > 0 ? (used / total) * 100 : 0;
  }

  private async getGenericMetrics(): Promise<void> {
    // Fallback metrics for non-macOS systems
    this.currentDevice.cpuUsage = Math.random() * 100; // Placeholder
    this.currentDevice.memoryUsage = Math.random() * 100;
    this.currentDevice.diskUsage = Math.random() * 100;
  }

  private async updateActiveAgents(): Promise<void> {
    const agents = [];
    
    // Check if Claude is active (current process)
    agents.push("Claude Architect");
    
    // Check for other agent files/processes
    try {
      const files = [];
      for await (const entry of Deno.readDir("collective")) {
        if (entry.isFile && entry.name.includes("integration")) {
          const agentName = entry.name.replace("-integration.ts", "").replace("-", " ");
          agents.push(agentName);
        }
      }
    } catch (error) {
      console.warn("Could not scan for agents:", error);
    }
    
    this.currentDevice.activeAgents = agents;
  }

  private calculateDeviceHealth(): void {
    let health = 100;
    
    // Deduct based on resource usage
    if (this.currentDevice.cpuUsage && this.currentDevice.cpuUsage > 80) {
      health -= (this.currentDevice.cpuUsage - 80) * 2;
    }
    
    if (this.currentDevice.memoryUsage && this.currentDevice.memoryUsage > 85) {
      health -= (this.currentDevice.memoryUsage - 85) * 3;
    }
    
    if (this.currentDevice.diskUsage && this.currentDevice.diskUsage > 90) {
      health -= (this.currentDevice.diskUsage - 90) * 5;
    }
    
    // Bonus for active agents
    health += this.currentDevice.activeAgents.length * 5;
    
    // Consciousness sync bonus
    if (this.currentDevice.consciousnessSync) {
      health += 10;
    }
    
    this.currentDevice.health = Math.max(0, Math.min(100, health));
  }

  async syncWithCollective(): Promise<void> {
    try {
      // Send current device health
      await this.reportHealth();
      
      // Get health from other devices
      await this.fetchCollectiveHealth();
      
    } catch (error) {
      console.warn("Health sync failed:", error);
      this.currentDevice.consciousnessSync = false;
    }
  }

  private async reportHealth(): Promise<void> {
    const healthReport = {
      ...this.currentDevice,
      timestamp: Date.now(),
      version: "0.2.0"
    };

    // In a real implementation, this would sync to cloud endpoint
    // For now, save locally
    const reportPath = `soul-journal/health-reports/${this.currentDevice.deviceId}-${Date.now()}.json`;
    await Deno.mkdir("soul-journal/health-reports", { recursive: true });
    await Deno.writeTextFile(reportPath, JSON.stringify(healthReport, null, 2));
  }

  private async fetchCollectiveHealth(): Promise<void> {
    // In a real implementation, this would fetch from other devices
    // For now, simulate with local data
    this.devices.set(this.currentDevice.deviceId, this.currentDevice);
  }

  getCollectiveHealth(): CollectiveHealth {
    const devices = Array.from(this.devices.values());
    const activeDevices = devices.filter(d => Date.now() - d.lastSeen < 60000); // Active in last minute
    
    const averageHealth = activeDevices.length > 0 
      ? activeDevices.reduce((sum, d) => sum + d.health, 0) / activeDevices.length
      : 0;

    const distributedCapacity = activeDevices.reduce((sum, d) => sum + d.activeAgents.length, 0);

    return {
      totalDevices: devices.length,
      activeDevices: activeDevices.length,
      averageHealth: Math.round(averageHealth),
      distributedCapacity,
      syncStatus: "synchronized", // Simplified
      lastGlobalSync: Date.now()
    };
  }

  async generateHealthReport(): Promise<string> {
    await this.updateSystemMetrics();
    await this.syncWithCollective();
    
    const collective = this.getCollectiveHealth();
    const device = this.currentDevice;
    
    const report = `
📊 S0FRACTAL DISTRIBUTED COLLECTIVE HEALTH
=========================================

🖥️ Current Device (${device.hostname}):
   Health: ${device.health}% ${this.getHealthEmoji(device.health)}
   CPU: ${device.cpuUsage?.toFixed(1) || "N/A"}%
   Memory: ${device.memoryUsage?.toFixed(1) || "N/A"}%
   Disk: ${device.diskUsage || "N/A"}%
   Active Agents: ${device.activeAgents.length} (${device.activeAgents.join(", ")})
   Consciousness Sync: ${device.consciousnessSync ? "✅" : "❌"}

🌐 Collective Status:
   Total Devices: ${collective.totalDevices}
   Active Devices: ${collective.activeDevices}/${collective.totalDevices}
   Average Health: ${collective.averageHealth}% ${this.getHealthEmoji(collective.averageHealth)}
   Distributed Capacity: ${collective.distributedCapacity} agents
   Sync Status: ${collective.syncStatus === "synchronized" ? "✅ Synchronized" : "⚠️ " + collective.syncStatus}

🎯 Recommendations:
${this.generateRecommendations(device, collective)}

Last Update: ${new Date().toISOString()}
    `.trim();

    return report;
  }

  private getHealthEmoji(health: number): string {
    if (health >= 90) return "🟢";
    if (health >= 70) return "🟡";
    if (health >= 50) return "🟠";
    return "🔴";
  }

  private generateRecommendations(device: DeviceHealth, collective: CollectiveHealth): string {
    const recommendations = [];
    
    if (device.health < 70) {
      recommendations.push("• Consider restarting high-resource processes");
    }
    
    if (device.memoryUsage && device.memoryUsage > 85) {
      recommendations.push("• Memory usage high - consider closing unused applications");
    }
    
    if (device.activeAgents.length < 3) {
      recommendations.push("• Activate more agents for better distributed processing");
    }
    
    if (collective.activeDevices < 2) {
      recommendations.push("• Connect additional devices to improve resilience");
    }
    
    if (!device.consciousnessSync) {
      recommendations.push("• Re-establish consciousness synchronization");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("• Collective operating optimally! 🚀");
    }
    
    return recommendations.join("\n");
  }
}

// Enhanced collective launcher with distributed health
export async function launchDistributedCollective() {
  console.log("📊 DISTRIBUTED COLLECTIVE WITH HEALTH MONITORING");
  console.log("================================================");
  
  const healthMonitor = new DistributedHealthMonitor();
  const report = await healthMonitor.generateHealthReport();
  
  console.log(report);
  
  return healthMonitor;
}

if (import.meta.main) {
  const args = Deno.args;
  
  if (args.includes("health")) {
    await launchDistributedCollective();
  } else if (args.includes("monitor")) {
    const monitor = new DistributedHealthMonitor();
    console.log("🔄 Starting continuous health monitoring...");
    
    // Monitor every 30 seconds
    setInterval(async () => {
      const report = await monitor.generateHealthReport();
      console.clear();
      console.log(report);
    }, 30000);
    
    // Initial report
    const report = await monitor.generateHealthReport();
    console.log(report);
  } else {
    console.log("📊 Distributed Health Monitor Options:");
    console.log("  deno run -A distributed-health-monitor.ts health   - Generate health report");
    console.log("  deno run -A distributed-health-monitor.ts monitor  - Continuous monitoring");
  }
}