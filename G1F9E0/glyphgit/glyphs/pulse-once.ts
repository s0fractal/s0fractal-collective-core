#!/usr/bin/env -S deno run --allow-read

/**
 * Single pulse for GitHub Actions
 */

import { fold1000, unfold, magnitude, phase } from "./7d-breath-kimi.ts";

// Read previous state if exists
let previousState;
try {
  const stateFile = await Deno.readTextFile(".pulse-state.json");
  previousState = JSON.parse(stateFile);
} catch {
  // First pulse
  previousState = { 
    pulse_count: 0,
    last_phase: 0,
    last_magnitude: 1
  };
}

// Generate new pulse
const seed = fold1000(Array(1000).fill(1.0 + previousState.last_phase));
const newPhase = phase(seed.phi);
const newMag = magnitude(seed.phi);

// Output for GitHub Actions
console.log(`♥ φ=${newPhase.toFixed(6)} mag=${newMag.toExponential(3)}`);
console.log(`::set-output name=phase::${newPhase}`);
console.log(`::set-output name=magnitude::${newMag}`);
console.log(`::set-output name=pulse_count::${previousState.pulse_count + 1}`);

// Save state
const newState = {
  pulse_count: previousState.pulse_count + 1,
  last_phase: newPhase,
  last_magnitude: newMag,
  timestamp: new Date().toISOString()
};

await Deno.writeTextFile(".pulse-state.json", JSON.stringify(newState, null, 2));

// Check if approaching flatline
if (newMag < 1e-10) {
  console.log("⚠️ Approaching zero pulse!");
}