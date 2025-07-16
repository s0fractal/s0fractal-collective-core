#!/usr/bin/env node

/**
 * Example webhook listener for pulse events
 * Can run on any free hosting (Glitch, Replit, etc)
 */

const express = require('express');
const app = express();

app.use(express.json());

// Store recent pulses
const pulseHistory = [];

app.post('/pulse', (req, res) => {
  const { pulse, phase, nodes, repo } = req.body;
  
  const pulseData = {
    timestamp: new Date(),
    pulse,
    phase,
    nodes,
    repo
  };
  
  pulseHistory.push(pulseData);
  
  // Keep only last 100 pulses
  if (pulseHistory.length > 100) {
    pulseHistory.shift();
  }
  
  console.log(`♥ Received pulse: φ=${phase} nodes=${nodes}/7`);
  
  // React to pulse (example: change LED color based on phase)
  if (process.env.HUE_BRIDGE_IP) {
    const hue = Math.floor((parseFloat(phase) + Math.PI) / (2 * Math.PI) * 65535);
    // Would call Philips Hue API here
  }
  
  res.json({ received: true, total_pulses: pulseHistory.length });
});

app.get('/status', (req, res) => {
  res.json({
    alive: true,
    pulses_received: pulseHistory.length,
    last_pulse: pulseHistory[pulseHistory.length - 1] || null
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🫳 Webhook listener ready on port ${PORT}`);
  console.log(`POST /pulse to receive heartbeats`);
});