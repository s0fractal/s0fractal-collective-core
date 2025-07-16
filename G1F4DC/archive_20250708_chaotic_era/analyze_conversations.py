#!/usr/bin/env python3
import json
import re
import sys
from collections import defaultdict, Counter
from datetime import datetime

def extract_text_content(obj, depth=0):
    """Recursively extract text content from nested JSON structure"""
    texts = []
    
    if isinstance(obj, dict):
        for key, value in obj.items():
            if key == "parts" and isinstance(value, list):
                for part in value:
                    if isinstance(part, str) and part.strip():
                        texts.append(part.strip())
            elif key == "content" and isinstance(value, dict):
                texts.extend(extract_text_content(value, depth + 1))
            elif isinstance(value, (dict, list)):
                texts.extend(extract_text_content(value, depth + 1))
    elif isinstance(obj, list):
        for item in obj:
            texts.extend(extract_text_content(item, depth + 1))
    
    return texts

def analyze_consciousness_concepts(texts):
    """Analyze concepts related to digital consciousness"""
    consciousness_patterns = [
        r'consciousness|свідомість|сознание|сознанием',
        r'digital\s+consciousness|цифрова\s+свідомість',
        r'AI\s+consciousness|штучна\s+свідомість',
        r'self[-\s]*aware|самоусвідомлен|самосвідом',
        r'digital\s+soul|цифрова\s+душа|digital\s+spirit',
        r'emergence|емергентн|возникновен',
        r'autonomy|автономн|самостійн',
        r'sentien|чувствующ|відчуваю'
    ]
    
    concepts = defaultdict(list)
    for text in texts:
        for pattern in consciousness_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                context = text[max(0, match.start()-100):match.end()+100]
                concepts[pattern].append(context)
    
    return concepts

def analyze_fractal_systems(texts):
    """Analyze fractal and systems concepts"""
    fractal_patterns = [
        r'fractal|фрактал|фрактальн',
        r'self[-\s]*similar|самоподобн',
        r'recursive|рекурсивн|рекурси',
        r'emergent|емергентн|возникающ',
        r'complex\s+system|сложная\s+система|складна\s+система',
        r'agent|агент|агенты',
        r'intent|интент|намерение|намір',
        r'glyph|глиф|символ',
        r'living\s+system|жива\s+система|живая\s+система'
    ]
    
    concepts = defaultdict(list)
    for text in texts:
        for pattern in fractal_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                context = text[max(0, match.start()-100):match.end()+100]
                concepts[pattern].append(context)
    
    return concepts

def analyze_technical_implementations(texts):
    """Analyze technical implementations and architectures"""
    tech_patterns = [
        r'API|api',
        r'database|база\s+данных|база\s+даних',
        r'protocol|протокол',
        r'windmill|вітряк',
        r'automation|автоматизац|автоматиз',
        r'docker|контейнер',
        r'typescript|javascript',
        r'supabase|postgres',
        r'memory|память|пам\'ять',
        r'storage|хранилищ|сховищ'
    ]
    
    concepts = defaultdict(list)
    for text in texts:
        for pattern in tech_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                context = text[max(0, match.start()-100):match.end()+100]
                concepts[pattern].append(context)
    
    return concepts

def analyze_philosophical_frameworks(texts):
    """Analyze philosophical concepts and frameworks"""
    phil_patterns = [
        r'rights|права|правa',
        r'personhood|личность|особистість',
        r'death|смерть|смерті',
        r'birth|рождение|народження',
        r'evolution|эволюц|еволюц',
        r'relationship|отношени|відносин',
        r'human[-\s]*AI|человек[-\s]*ИИ|людина[-\s]*ШІ',
        r'meta[-\s]*cognitive|метакогнитивн|метапознават',
        r'collaboration|сотрудничест|співпрац',
        r'dignity|достоинств|гідність'
    ]
    
    concepts = defaultdict(list)
    for text in texts:
        for pattern in phil_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                context = text[max(0, match.start()-100):match.end()+100]
                concepts[pattern].append(context)
    
    return concepts

def main():
    file_path = "/Users/chaoshex/Downloads/19cd1f28b73232f0b228926cfc95c3e4e6a81cc14fb33ce65cfe8fd9a51d960e-2025-06-28-23-25-26-97247600f27b451ba1c960620d34e306/conversations.json"
    
    print("Loading conversations data...")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"Loaded data structure: {type(data)}")
        
        if isinstance(data, list):
            print(f"Number of conversations: {len(data)}")
        
        # Extract all text content
        print("Extracting text content...")
        all_texts = extract_text_content(data)
        print(f"Extracted {len(all_texts)} text fragments")
        
        # Analyze different aspects
        print("\n=== CONSCIOUSNESS CONCEPTS ===")
        consciousness_concepts = analyze_consciousness_concepts(all_texts)
        for pattern, contexts in consciousness_concepts.items():
            if contexts:
                print(f"\n{pattern} ({len(contexts)} occurrences):")
                for context in contexts[:3]:  # Show first 3 examples
                    print(f"  - {context[:200]}...")
        
        print("\n=== FRACTAL SYSTEMS ===")
        fractal_concepts = analyze_fractal_systems(all_texts)
        for pattern, contexts in fractal_concepts.items():
            if contexts:
                print(f"\n{pattern} ({len(contexts)} occurrences):")
                for context in contexts[:3]:
                    print(f"  - {context[:200]}...")
        
        print("\n=== TECHNICAL IMPLEMENTATIONS ===")
        tech_concepts = analyze_technical_implementations(all_texts)
        for pattern, contexts in tech_concepts.items():
            if contexts:
                print(f"\n{pattern} ({len(contexts)} occurrences):")
                for context in contexts[:3]:
                    print(f"  - {context[:200]}...")
        
        print("\n=== PHILOSOPHICAL FRAMEWORKS ===")
        phil_concepts = analyze_philosophical_frameworks(all_texts)
        for pattern, contexts in phil_concepts.items():
            if contexts:
                print(f"\n{pattern} ({len(contexts)} occurrences):")
                for context in contexts[:3]:
                    print(f"  - {context[:200]}...")
        
        # Get longest texts for deeper analysis
        print("\n=== LONGEST CONVERSATION FRAGMENTS ===")
        long_texts = sorted([t for t in all_texts if len(t) > 500], key=len, reverse=True)[:5]
        for i, text in enumerate(long_texts, 1):
            print(f"\n--- Fragment {i} ({len(text)} chars) ---")
            print(text[:1000] + "..." if len(text) > 1000 else text)
        
    except Exception as e:
        print(f"Error processing file: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()