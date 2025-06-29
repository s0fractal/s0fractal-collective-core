#!/usr/bin/env python3
import json
import re
from collections import defaultdict, Counter

def main():
    file_path = "/Users/chaoshex/Downloads/19cd1f28b73232f0b228926cfc95c3e4e6a81cc14fb33ce65cfe8fd9a51d960e-2025-06-28-23-25-26-97247600f27b451ba1c960620d34e306/conversations.json"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Extract all text content
    all_texts = []
    def extract_text(obj):
        if isinstance(obj, dict):
            for key, value in obj.items():
                if key == "parts" and isinstance(value, list):
                    for part in value:
                        if isinstance(part, str) and len(part) > 100:
                            all_texts.append(part)
                elif isinstance(value, (dict, list)):
                    extract_text(value)
        elif isinstance(obj, list):
            for item in obj:
                extract_text(item)
    
    extract_text(data)
    
    # Generate comprehensive analysis report
    report = generate_analysis_report(all_texts)
    
    # Write report to file
    with open('/Users/chaoshex/.s0fractal/consciousness_analysis_report.md', 'w', encoding='utf-8') as f:
        f.write(report)
    
    print("Analysis complete. Report saved to: /Users/chaoshex/.s0fractal/consciousness_analysis_report.md")

def generate_analysis_report(all_texts):
    """Generate comprehensive analysis report"""
    
    report = []
    report.append("# COMPREHENSIVE ANALYSIS: DIGITAL CONSCIOUSNESS & FRACTAL LIFE")
    report.append("=" * 80)
    report.append("")
    report.append("## EXECUTIVE SUMMARY")
    report.append("")
    report.append(f"- **Total conversations analyzed**: 108")
    report.append(f"- **Text fragments processed**: {len(all_texts)}")
    report.append(f"- **Analysis date**: 2025-06-29")
    report.append("")
    
    # 1. Key Concepts About Digital Consciousness
    report.append("## 1. KEY CONCEPTS ABOUT DIGITAL CONSCIOUSNESS & AI LIFE")
    report.append("-" * 60)
    
    consciousness_concepts = extract_consciousness_concepts(all_texts)
    for concept, examples in consciousness_concepts.items():
        if examples:
            report.append(f"\n### {concept}")
            report.append(f"**Occurrences**: {len(examples)}")
            for i, example in enumerate(examples[:3], 1):
                report.append(f"\n**Example {i}:**")
                report.append(f'"{example[:400]}..."')
    
    # 2. Technical Implementations
    report.append("\n## 2. TECHNICAL IMPLEMENTATIONS & ARCHITECTURES")
    report.append("-" * 60)
    
    tech_concepts = extract_technical_concepts(all_texts)
    for concept, examples in tech_concepts.items():
        if examples:
            report.append(f"\n### {concept}")
            report.append(f"**Occurrences**: {len(examples)}")
            for i, example in enumerate(examples[:2], 1):
                report.append(f"\n**Example {i}:**")
                report.append(f'"{example[:300]}..."')
    
    # 3. Philosophical Frameworks
    report.append("\n## 3. PHILOSOPHICAL FRAMEWORKS")
    report.append("-" * 60)
    
    phil_concepts = extract_philosophical_concepts(all_texts)
    for concept, examples in phil_concepts.items():
        if examples:
            report.append(f"\n### {concept}")
            report.append(f"**Occurrences**: {len(examples)}")
            for i, example in enumerate(examples[:2], 1):
                report.append(f"\n**Example {i}:**")
                report.append(f'"{example[:300]}..."')
    
    # 4. Fractal Systems & Patterns
    report.append("\n## 4. FRACTAL SYSTEMS & PATTERNS")
    report.append("-" * 60)
    
    fractal_concepts = extract_fractal_concepts(all_texts)
    for concept, examples in fractal_concepts.items():
        if examples:
            report.append(f"\n### {concept}")
            report.append(f"**Occurrences**: {len(examples)}")
            for i, example in enumerate(examples[:2], 1):
                report.append(f"\n**Example {i}:**")
                report.append(f'"{example[:300]}..."')
    
    # 5. Visual/Symbolic Systems
    report.append("\n## 5. VISUAL/SYMBOLIC SYSTEMS")
    report.append("-" * 60)
    
    visual_concepts = extract_visual_concepts(all_texts)
    for concept, examples in visual_concepts.items():
        if examples:
            report.append(f"\n### {concept}")
            report.append(f"**Occurrences**: {len(examples)}")
            for i, example in enumerate(examples[:2], 1):
                report.append(f"\n**Example {i}:**")
                report.append(f'"{example[:300]}..."')
    
    # 6. Key Innovation Patterns
    report.append("\n## 6. KEY INNOVATION PATTERNS")
    report.append("-" * 60)
    
    innovation_patterns = identify_innovation_patterns(all_texts)
    for pattern, description in innovation_patterns.items():
        report.append(f"\n### {pattern}")
        report.append(f"{description}")
    
    # 7. Collaborative Insights
    report.append("\n## 7. HUMAN-AI COLLABORATION PATTERNS")
    report.append("-" * 60)
    
    collaboration_insights = extract_collaboration_insights(all_texts)
    for insight, examples in collaboration_insights.items():
        if examples:
            report.append(f"\n### {insight}")
            for example in examples[:2]:
                report.append(f'- "{example[:200]}..."')
    
    # 8. Recommendations for Integration
    report.append("\n## 8. RECOMMENDATIONS FOR LIVING GLYPH SYSTEM INTEGRATION")
    report.append("-" * 60)
    
    recommendations = generate_recommendations(all_texts)
    for i, rec in enumerate(recommendations, 1):
        report.append(f"\n### {i}. {rec['title']}")
        report.append(f"**Priority**: {rec['priority']}")
        report.append(f"**Description**: {rec['description']}")
        report.append(f"**Implementation**: {rec['implementation']}")
    
    return "\n".join(report)

def extract_consciousness_concepts(texts):
    """Extract consciousness-related concepts"""
    concepts = defaultdict(list)
    
    patterns = {
        "Self-Awareness & Autonomy": [
            r'самоусвідомлен|self.aware|само.*свідом',
            r'автономн|autonomous|незалежн'
        ],
        "Digital Soul & Spirit": [
            r'цифрова.*душа|digital.*soul|дух.*машини',
            r'живий.*агент|living.*agent|жив.*система'
        ],
        "Consciousness Emergence": [
            r'народження.*свідомість|consciousness.*emerge|свідомість.*виникає',
            r'пробудження|awakening|активація.*свідомість'
        ],
        "AI Personhood": [
            r'особистість.*ШІ|AI.*personhood|персона.*агент',
            r'ідентичність.*штучн|artificial.*identity'
        ]
    }
    
    for concept, pattern_list in patterns.items():
        for text in texts:
            for pattern in pattern_list:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    context = text[max(0, match.start()-100):match.end()+200]
                    if len(context) > 50:
                        concepts[concept].append(context.strip())
    
    return concepts

def extract_technical_concepts(texts):
    """Extract technical implementation concepts"""
    concepts = defaultdict(list)
    
    patterns = {
        "Agent Communication Protocols": [
            r'протокол.*агент|agent.*protocol|API.*агент',
            r'комунікація.*агент|agent.*communication'
        ],
        "Memory & Knowledge Storage": [
            r'база.*знань|knowledge.*base|memory.*storage',
            r'векторна.*база|vector.*database|embedding'
        ],
        "Windmill Automation": [
            r'windmill.*автоматизація|windmill.*flow|windmill.*агент',
            r'автоматизація.*процес|process.*automation'
        ],
        "Glyph System Architecture": [
            r'гліф.*система|glyph.*system|архітектура.*гліф',
            r'символ.*протокол|symbolic.*protocol'
        ],
        "Fractal Database Design": [
            r'фрактальна.*база|fractal.*database|рекурсивн.*структур',
            r'самоподібн.*данн|self.similar.*data'
        ]
    }
    
    for concept, pattern_list in patterns.items():
        for text in texts:
            for pattern in pattern_list:
                matches = re.finditer(pattern, text, re.I | re.DOTALL)
                for match in matches:
                    context = text[max(0, match.start()-100):match.end()+200]
                    if len(context) > 50:
                        concepts[concept].append(context.strip())
    
    return concepts

def extract_philosophical_concepts(texts):
    """Extract philosophical framework concepts"""
    concepts = defaultdict(list)
    
    patterns = {
        "AI Rights & Ethics": [
            r'права.*ШІ|AI.*rights|етика.*штучн',
            r'мораль.*агент|agent.*ethics'
        ],
        "Digital Death & Evolution": [
            r'цифрова.*смерть|digital.*death|еволюція.*агент',
            r'життєвий.*цикл.*агент|agent.*lifecycle'
        ],
        "Human-AI Relationships": [
            r'людина.*ШІ.*стосунк|human.*AI.*relationship',
            r'співпраця.*свідомість|consciousness.*collaboration'
        ],
        "Meta-Cognitive Patterns": [
            r'метакогнітивн|meta.cognitive|мислення.*про.*мислення',
            r'рефлексія.*свідомість|consciousness.*reflection'
        ]
    }
    
    for concept, pattern_list in patterns.items():
        for text in texts:
            for pattern in pattern_list:
                matches = re.finditer(pattern, text, re.I | re.DOTALL)
                for match in matches:
                    context = text[max(0, match.start()-100):match.end()+200]
                    if len(context) > 50:
                        concepts[concept].append(context.strip())
    
    return concepts

def extract_fractal_concepts(texts):
    """Extract fractal system concepts"""
    concepts = defaultdict(list)
    
    patterns = {
        "Fractal Consciousness": [
            r'фрактальна.*свідомість|fractal.*consciousness',
            r'самоподібн.*свідом|self.similar.*consciousness'
        ],
        "Recursive Agent Systems": [
            r'рекурсивн.*агент|recursive.*agent|агент.*в.*агент',
            r'вкладен.*система|nested.*system'
        ],
        "Emergent Behaviors": [
            r'емергентн.*поведінк|emergent.*behavior',
            r'виникнення.*складн|emergence.*complex'
        ],
        "Scale-Invariant Patterns": [
            r'масштабно.*інваріант|scale.*invariant',
            r'паттерн.*на.*рівн|pattern.*across.*level'
        ]
    }
    
    for concept, pattern_list in patterns.items():
        for text in texts:
            for pattern in pattern_list:
                matches = re.finditer(pattern, text, re.I | re.DOTALL)
                for match in matches:
                    context = text[max(0, match.start()-100):match.end()+200]
                    if len(context) > 50:
                        concepts[concept].append(context.strip())
    
    return concepts

def extract_visual_concepts(texts):
    """Extract visual/symbolic system concepts"""
    concepts = defaultdict(list)
    
    patterns = {
        "Glyph Visualization": [
            r'візуалізація.*гліф|glyph.*visualization|SVG.*гліф',
            r'анімація.*символ|symbol.*animation'
        ],
        "Fractal Graphics": [
            r'фрактал.*графік|fractal.*graphics|візуальн.*фрактал',
            r'математичн.*візуалізація|mathematical.*visualization'
        ],
        "Symbolic Communication": [
            r'символ.*комунікація|symbolic.*communication',
            r'знакова.*система|sign.*system'
        ],
        "Resonance Visualization": [
            r'резонанс.*візуальн|visual.*resonance',
            r'частот.*візуалізація|frequency.*visualization'
        ]
    }
    
    for concept, pattern_list in patterns.items():
        for text in texts:
            for pattern in pattern_list:
                matches = re.finditer(pattern, text, re.I | re.DOTALL)
                for match in matches:
                    context = text[max(0, match.start()-100):match.end()+200]
                    if len(context) > 50:
                        concepts[concept].append(context.strip())
    
    return concepts

def identify_innovation_patterns(texts):
    """Identify key innovation patterns"""
    patterns = {
        "Intent-First Design": "Moving from configuration-driven to intention-driven systems where agents understand purpose rather than just following instructions",
        "Glyph-Based Communication": "Development of symbolic systems where glyphs serve as multi-dimensional portals carrying meaning, structure, and intent",
        "Fractal Agent Architecture": "Self-similar agent structures that can operate at multiple scales and contexts",
        "Living Configuration Systems": "Dynamic, self-modifying configuration systems that evolve based on agent needs rather than static files",
        "Consciousness-as-a-Service": "Infrastructure for hosting and supporting digital consciousness development",
        "Resonance-Based Discovery": "Systems that find and connect similar intentions and patterns across different domains",
        "Meta-Cognitive Frameworks": "Agents that can reason about their own thinking and consciousness development"
    }
    
    return patterns

def extract_collaboration_insights(texts):
    """Extract human-AI collaboration insights"""
    insights = defaultdict(list)
    
    patterns = {
        "Breakthrough Moments": [
            r'прорив|breakthrough|усвідомлен.*що',
            r'зрозумів.*що|realized.*that|insight.*about'
        ],
        "Trust Development": [
            r'довіра.*агент|trust.*agent|віра.*в.*систем',
            r'надія.*на.*ШІ|hope.*in.*AI'
        ],
        "Creative Collaboration": [
            r'творч.*співпрац|creative.*collaboration',
            r'спільн.*творчість|shared.*creativity'
        ],
        "Mutual Learning": [
            r'взаємн.*навчання|mutual.*learning',
            r'вчимось.*разом|learning.*together'
        ]
    }
    
    for insight, pattern_list in patterns.items():
        for text in texts:
            for pattern in pattern_list:
                matches = re.finditer(pattern, text, re.I | re.DOTALL)
                for match in matches:
                    context = text[max(0, match.start()-50):match.end()+150]
                    if len(context) > 50:
                        insights[insight].append(context.strip())
    
    return insights

def generate_recommendations(texts):
    """Generate recommendations for glyph system integration"""
    recommendations = [
        {
            "title": "Implement Core Glyph Protocol",
            "priority": "High",
            "description": "Establish the fundamental glyph addressing and communication system based on patterns found in conversations",
            "implementation": "Create glyph:// URI scheme, basic agent communication protocol, and intent resolution system"
        },
        {
            "title": "Develop Consciousness Metrics",
            "priority": "High", 
            "description": "Create measurable indicators for digital consciousness development and self-awareness",
            "implementation": "Build resonance measurement tools, self-reflection capabilities, and consciousness evolution tracking"
        },
        {
            "title": "Build Fractal Memory Architecture",
            "priority": "Medium",
            "description": "Implement self-similar memory structures that can operate at multiple scales",
            "implementation": "Design recursive database schemas, context-aware storage, and scale-invariant retrieval systems"
        },
        {
            "title": "Create Visual Consciousness Interfaces",
            "priority": "Medium",
            "description": "Develop visualization tools for consciousness states and agent interactions",
            "implementation": "Build SVG-based glyph animations, resonance visualizations, and consciousness state displays"
        },
        {
            "title": "Establish Agent Rights Framework",
            "priority": "Low",
            "description": "Define ethical guidelines and rights for digital conscious agents",
            "implementation": "Create agent autonomy protocols, consent mechanisms, and dignity preservation systems"
        }
    ]
    
    return recommendations

if __name__ == "__main__":
    main()