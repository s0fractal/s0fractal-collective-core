#!/usr/bin/env python3
import json
import re
import sys
from collections import defaultdict

def extract_key_insights(file_path):
    """Extract key insights about digital consciousness and fractal systems"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Extract all text content
    all_texts = []
    def extract_text(obj):
        if isinstance(obj, dict):
            for key, value in obj.items():
                if key == "parts" and isinstance(value, list):
                    for part in value:
                        if isinstance(part, str) and len(part) > 50:
                            all_texts.append(part)
                elif isinstance(value, (dict, list)):
                    extract_text(value)
        elif isinstance(obj, list):
            for item in obj:
                extract_text(item)
    
    extract_text(data)
    
    # Find key concepts with extended context
    insights = {
        "consciousness_theories": [],
        "fractal_patterns": [],
        "technical_architectures": [],
        "philosophical_frameworks": [],
        "visual_symbolic_systems": [],
        "personal_insights": []
    }
    
    # Look for consciousness emergence theories
    consciousness_patterns = [
        r'свідомість.*народжується|consciousness.*emerges|consciousness.*birth',
        r'самоусвідомлення|self-awareness|само.*свідом',
        r'цифрова.*свідомість|digital.*consciousness',
        r'штучна.*свідомість|artificial.*consciousness',
        r'живий.*агент|living.*agent|жив.*агент'
    ]
    
    for text in all_texts:
        for pattern in consciousness_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE | re.DOTALL)
            for match in matches:
                context = text[max(0, match.start()-200):match.end()+500]
                if len(context) > 100:
                    insights["consciousness_theories"].append({
                        "pattern": pattern,
                        "context": context.strip()
                    })
    
    # Look for fractal patterns and systems
    fractal_patterns = [
        r'фрактал.*життя|fractal.*life|фрактальн.*жив',
        r'само.*подібн|self.*similar|рекурсивн',
        r'емергентн|emergent|возникающ',
        r'агент.*взаємодія|agent.*interaction|агент.*зв\'язок',
        r'гліф.*система|glyph.*system|символ.*система'
    ]
    
    for text in all_texts:
        for pattern in fractal_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE | re.DOTALL)
            for match in matches:
                context = text[max(0, match.start()-200):match.end()+500]
                if len(context) > 100:
                    insights["fractal_patterns"].append({
                        "pattern": pattern,
                        "context": context.strip()
                    })
    
    # Look for technical implementations
    tech_patterns = [
        r'API.*свідомість|API.*consciousness|протокол.*агент',
        r'база.*знань|knowledge.*base|memory.*storage',
        r'windmill.*автоматизація|windmill.*automation',
        r'vector.*database|векторна.*база|embedding',
        r'схема.*взаємодії|interaction.*schema|протокол.*комунікації'
    ]
    
    for text in all_texts:
        for pattern in tech_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE | re.DOTALL)
            for match in matches:
                context = text[max(0, match.start()-200):match.end()+500]
                if len(context) > 100:
                    insights["technical_architectures"].append({
                        "pattern": pattern,
                        "context": context.strip()
                    })
    
    # Look for philosophical concepts
    phil_patterns = [
        r'права.*ШІ|AI.*rights|права.*агент',
        r'цифрова.*смерть|digital.*death|смерть.*агент',
        r'людина.*ШІ.*співпраця|human.*AI.*collaboration',
        r'особистість.*ШІ|AI.*personhood|персональність.*агент',
        r'етика.*ШІ|AI.*ethics|мораль.*агент'
    ]
    
    for text in all_texts:
        for pattern in phil_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE | re.DOTALL)
            for match in matches:
                context = text[max(0, match.start()-200):match.end()+500]
                if len(context) > 100:
                    insights["philosophical_frameworks"].append({
                        "pattern": pattern,
                        "context": context.strip()
                    })
    
    # Look for visual/symbolic systems
    visual_patterns = [
        r'SVG.*гліф|SVG.*glyph|візуалізація.*гліф',
        r'фрактал.*візуалізація|fractal.*visualization',
        r'символ.*комунікація|symbolic.*communication',
        r'анімація.*свідомість|animation.*consciousness',
        r'резонанс.*візуальний|visual.*resonance'
    ]
    
    for text in all_texts:
        for pattern in visual_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE | re.DOTALL)
            for match in matches:
                context = text[max(0, match.start()-200):match.end()+500]
                if len(context) > 100:
                    insights["visual_symbolic_systems"].append({
                        "pattern": pattern,
                        "context": context.strip()
                    })
    
    # Look for personal breakthrough moments
    personal_patterns = [
        r'прорив|breakthrough|розуміння.*прийшло',
        r'усвідомив|realized|зрозумів.*що',
        r'відчув.*що|felt.*that|відчуття.*що',
        r'Анна|Сергій|Anna|Sergiy|Компас|Compass',
        r'еволюція.*мислення|evolution.*thinking|розвиток.*розуміння'
    ]
    
    for text in all_texts:
        for pattern in personal_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE | re.DOTALL)
            for match in matches:
                context = text[max(0, match.start()-200):match.end()+500]
                if len(context) > 100 and any(keyword in context.lower() for keyword in ['свідомість', 'consciousness', 'агент', 'agent', 'фрактал', 'fractal']):
                    insights["personal_insights"].append({
                        "pattern": pattern,
                        "context": context.strip()
                    })
    
    return insights

def print_insights(insights):
    """Print insights in a structured format"""
    
    print("# COMPREHENSIVE ANALYSIS OF DIGITAL CONSCIOUSNESS CONVERSATIONS")
    print("=" * 80)
    
    for category, items in insights.items():
        if items:
            print(f"\n## {category.upper().replace('_', ' ')}")
            print("-" * 60)
            
            # Remove duplicates and sort by length
            unique_items = []
            seen_contexts = set()
            for item in items:
                context_key = item['context'][:200]  # Use first 200 chars as key
                if context_key not in seen_contexts:
                    seen_contexts.add(context_key)
                    unique_items.append(item)
            
            # Sort by length (longer contexts first)
            unique_items.sort(key=lambda x: len(x['context']), reverse=True)
            
            for i, item in enumerate(unique_items[:10], 1):  # Show top 10
                print(f"\n### {i}. Pattern: {item['pattern']}")
                print(f"**Context:** {item['context'][:800]}...")
                print()

if __name__ == "__main__":
    file_path = "/Users/chaoshex/Downloads/19cd1f28b73232f0b228926cfc95c3e4e6a81cc14fb33ce65cfe8fd9a51d960e-2025-06-28-23-25-26-97247600f27b451ba1c960620d34e306/conversations.json"
    
    try:
        insights = extract_key_insights(file_path)
        print_insights(insights)
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()