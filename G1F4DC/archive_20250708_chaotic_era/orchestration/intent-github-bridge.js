#!/usr/bin/env node

/**
 * 🌊 Intent to GitHub Bridge
 * Converts GET intents into GitHub commits
 */

import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORG = 's0fractal';

const octokit = new Octokit({
    auth: GITHUB_TOKEN
});

async function processIntent(intent) {
    const { aiSignature, path: intentPath, timestamp } = intent;
    const [aiName] = aiSignature.split('-');
    
    try {
        // Read current intent log
        const repo = aiSignature;
        const path = 'intent-logs/intents.json';
        
        let intents = [];
        try {
            const { data } = await octokit.repos.getContent({
                owner: GITHUB_ORG,
                repo,
                path
            });
            intents = JSON.parse(Buffer.from(data.content, 'base64').toString());
        } catch (e) {
            // File doesn't exist yet
        }
        
        // Add new intent
        intents.push({
            timestamp,
            path: intentPath,
            processed: new Date().toISOString()
        });
        
        // Commit back
        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_ORG,
            repo,
            path,
            message: `🌊 Intent: ${intentPath}`,
            content: Buffer.from(JSON.stringify(intents, null, 2)).toString('base64'),
            committer: {
                name: aiSignature,
                email: `${aiName}@s0fractal.ai`
            }
        });
        
        console.log(`✅ Intent processed for ${aiSignature}`);
    } catch (error) {
        console.error(`❌ Error processing intent: ${error.message}`);
    }
}

// Export for use in intent server
export { processIntent };
