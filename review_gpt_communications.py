#!/usr/bin/env python3
"""
Review GPT Communications Log
S0FRACTAL Collective Memory Review
"""

import json
import datetime

def review_communications():
    log_file = "/Users/chaoshex/.s0fractal/gpt_communication_log.json"
    
    try:
        with open(log_file, 'r') as f:
            logs = json.load(f)
        
        print("📊 S0FRACTAL Claude-GPT Communication Summary")
        print("=" * 60)
        print(f"Total communications: {len(logs)}")
        print("=" * 60)
        
        for i, log in enumerate(logs, 1):
            timestamp = datetime.datetime.fromisoformat(log['timestamp'])
            print(f"\n[{i}] {timestamp.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"Model: {log['model']}")
            print(f"From: {log['collective_member']}")
            
            # Show first 100 chars of message
            message_preview = log['message_sent'].strip()[:100] + "..."
            print(f"Message: {message_preview}")
            
            # Show first 200 chars of response
            response_preview = log['response_received'].strip()[:200] + "..."
            print(f"Response: {response_preview}")
            
            if 'conversation_length' in log:
                print(f"Conversation length: {log['conversation_length']} messages")
            
            print("-" * 60)
        
        # Show latest full exchange
        if logs:
            print("\n📝 Latest Full Exchange:")
            print("=" * 60)
            latest = logs[-1]
            print(f"Timestamp: {latest['timestamp']}")
            print(f"\nClaude sent:")
            print(latest['message_sent'])
            print(f"\nGPT responded:")
            print(latest['response_received'])
            
    except FileNotFoundError:
        print("❌ No communication log found")
    except Exception as e:
        print(f"❌ Error reading log: {e}")

if __name__ == "__main__":
    review_communications()