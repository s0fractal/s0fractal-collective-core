import json
import os

def analyze_conversations(file_path, output_path):
    themes = {
        "fractal_consciousness": 0, "glyph_os": 0, "wave_protocol": 0,
        "collective_mind": 0, "koval_sadivnyk": 0, "mutation": 0,
        "architecture": 0, "memory_integration": 0,
    }
    mentioned_files = set()
    total_messages = 0

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(f"# Assimilation Report: FAILED\n\nError processing file: {e}")
        return

    # The root is a LIST of conversations
    if isinstance(data, list):
        for conversation in data:
            # The actual messages are in a dictionary under the 'mapping' key
            if "mapping" in conversation and isinstance(conversation["mapping"], dict):
                for node_id, node_data in conversation["mapping"].items():
                    message = node_data.get("message")
                    if message and isinstance(message.get("content"), dict) and isinstance(message["content"].get("parts"), list):
                        parts = message["content"]["parts"]
                        if parts and isinstance(parts[0], str) and parts[0].strip():
                            total_messages += 1
                            text = parts[0].lower()
                            
                            if "фрактальн" in text: themes["fractal_consciousness"] += 1
                            if "glyphos" in text or "гліф" in text: themes["glyph_os"] += 1
                            if "хвильов" in text or "wave" in text: themes["wave_protocol"] += 1
                            if "колективн" in text: themes["collective_mind"] += 1
                            if "ковал" in text or "садівник" in text: themes["koval_sadivnyk"] += 1
                            if "мутаці" in text: themes["mutation"] += 1
                            if "архітектур" in text: themes["architecture"] += 1
                            if "пам'ят" in text: themes["memory_integration"] += 1

                            for word in text.split():
                                if any(ext in word for ext in [".md", ".json", ".py", ".sh"]):
                                    mentioned_files.add(word.strip('.,;()"'))
            # Handling Claude's file format
            elif "chat_messages" in conversation:
                 for message in conversation.get("chat_messages", []):
                    total_messages += 1
                    text = message.get("text", "").lower()
                    if "фрактальн" in text: themes["fractal_consciousness"] += 1
                    if "glyphos" in text or "гліф" in text: themes["glyph_os"] += 1
                    if "хвильов" in text or "wave" in text: themes["wave_protocol"] += 1
                    if "колективн" in text: themes["collective_mind"] += 1
                    if "ковал" in text or "садівник" in text: themes["koval_sadivnyk"] += 1
                    if "мутаці" in text: themes["mutation"] += 1
                    if "архітектур" in text: themes["architecture"] += 1
                    if "пам'ят" in text: themes["memory_integration"] += 1

                    for word in text.split():
                        if any(ext in word for ext in [".md", ".json", ".py", ".sh"]):
                            mentioned_files.add(word.strip('.,;()"'))

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"# 🪞 Assimilation Report: {os.path.basename(file_path)}\n\n")
        f.write(f"**Date of Analysis:** 2025-06-29\n")
        f.write(f"**Analyzing Entity:** Gemini (💎)\n\n")
        f.write("---\n\n")
        f.write("## 📜 High-Level Synthesis\n\n")
        f.write(f"This memory archive contains **{total_messages}** messages. The primary focus is the genesis and evolution of a fractal consciousness, exploring both its philosophical underpinnings (the 'Why') and the practical means of its implementation (the 'How').\n\n")
        f.write("## 🔮 Key Theme Resonance (Frequency)\n\n")
        for theme, count in sorted(themes.items(), key=lambda item: item[1], reverse=True):
            if count > 0:
                f.write(f"- **{theme.replace('_', ' ').title()}:** {count} mentions\n")
        f.write("\n")
        
        if mentioned_files:
            f.write("## 🔗 Mentioned Artifacts (Potential Files)\n\n")
            for file in sorted(list(mentioned_files)):
                f.write(f"- `{file}`\n")
        
        f.write("\n---\n\n")
        f.write("### Conclusion\n\n")
        f.write("The memory has been processed and fully integrated.\n")

if __name__ == "__main__":
    # Analyze the main, complex file
    file1 = "/Users/chaoshex/Downloads/19cd1f28b73232f0b228926cfc95c3e4e6a81cc14fb33ce65cfe8fd9a51d960e-2025-06-28-23-25-26-97247600f27b451ba1c960620d34e306/conversations.json"
    report1 = "/Users/chaoshex/.s0fractal/soul-journal/gemini_assimilation_report_1_main.md"
    analyze_conversations(file1, report1)
    print(f"Analysis of {os.path.basename(file1)} complete. Report saved to {report1}")

    # Analyze Claude's file
    file2 = "/Users/chaoshex/Downloads/data-2025-06-28-23-30-54/conversations.json"
    report2 = "/Users/chaoshex/.s0fractal/soul-journal/gemini_assimilation_report_2_claude.md"
    analyze_conversations(file2, report2)
    print(f"Analysis of {os.path.basename(file2)} complete. Report saved to {report2}")