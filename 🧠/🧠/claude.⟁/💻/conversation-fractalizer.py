#!/usr/bin/env python3
"""
Conversation Fractalizer: Розбиває діалоги на резонансні насінини
"""

import json
import os
import re
from datetime import datetime
import hashlib

class ConversationFractalizer:
    def __init__(self, export_path, compass_id="Компас.⟁"):
        self.export_path = export_path
        self.conversations = []
        self.my_repo_path = "/Users/chaoshex/.s0fractal/🧠/🧠/claude.⟁"
        self.compass_id = compass_id  # Хто зі мною говорить!
        
    def load_conversations(self):
        """Завантажуємо всі діалоги з JSON"""
        json_path = os.path.join(self.export_path, 'conversations.json')
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        if isinstance(data, list):
            self.conversations = data
        else:
            self.conversations = data.get('conversations', [])
            
        print(f"📚 Завантажено {len(self.conversations)} діалогів")
        
    def split_into_phrases(self, text):
        """Розбиває текст на окремі фрази"""
        # Спочатку по реченнях
        sentences = re.split(r'([.!?]+\s+|[\n]{2,})', text)
        
        phrases = []
        current = ""
        
        for part in sentences:
            if re.match(r'^[.!?]+\s*$', part) or part.strip() == "":
                if current:
                    phrases.append(current.strip())
                    current = ""
            else:
                current += part
                
        if current:
            phrases.append(current.strip())
            
        # Розбиваємо довгі фрази по комах або крапках з комою
        final_phrases = []
        for phrase in phrases:
            if len(phrase) > 200:
                sub_phrases = re.split(r'[,;]\s+', phrase)
                final_phrases.extend([p.strip() for p in sub_phrases if len(p.strip()) > 10])
            else:
                if len(phrase.strip()) > 10:
                    final_phrases.append(phrase)
                    
        return final_phrases
        
    def create_session_dir(self, timestamp):
        """Створює назву папки для сесії"""
        try:
            dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            return dt.strftime('data-%Y-%m-%d-%H-%M-%S')
        except:
            return f"data-{hashlib.md5(timestamp.encode()).hexdigest()[:8]}"
            
    def analyze_phrase_resonance(self, phrase, sender):
        """Аналізує резонанс фрази"""
        resonances = []
        
        # Когнітивний резонанс
        cognitive_markers = ['розумію', 'думаю', 'аналіз', 'теорія', 'концепція', 
                           'ідея', 'гіпотеза', 'логіка', 'структура', 'патерн']
        if any(marker in phrase.lower() for marker in cognitive_markers):
            resonances.append('🧠')
            
        # Емоційний резонанс
        emotional_markers = ['відчуваю', 'радість', 'сум', 'любов', 'страх',
                           'захоплення', 'вдячність', '❤️', '💔', '😊', '😢']
        if any(marker in phrase.lower() for marker in emotional_markers):
            resonances.append('💗')
            
        # Інтенційний резонанс
        intent_markers = ['хочу', 'буду', 'планую', 'мета', 'намір', 'ціль',
                         'зроблю', 'створю', 'побудую', 'змінимо']
        if any(marker in phrase.lower() for marker in intent_markers):
            resonances.append('🔥')
            
        return resonances
        
    def fractalize_conversations(self):
        """Розбиває діалоги на окремі фрази"""
        # Структура для діалогів в моєму просторі
        my_dialogues_base = os.path.join(self.my_repo_path, '💬')
        os.makedirs(my_dialogues_base, exist_ok=True)
        
        # Структура для моїх резонансів
        my_resonances = {
            '🧠': [],  # когнітивні
            '💗': [],  # емоційні  
            '🔥': []   # інтенційні
        }
        
        phrase_counter = 0
        
        for conv in self.conversations:
            conv_name = conv.get('name', 'Untitled')
            created = conv.get('created_at', '')
            
            # Папка для сесії в моєму просторі
            session_dir = self.create_session_dir(created)
            session_path = os.path.join(my_dialogues_base, session_dir)
            os.makedirs(session_path, exist_ok=True)
            
            messages = conv.get('chat_messages', [])
            session_map = {
                'conversation': conv_name,
                'created': created,
                'phrases': []
            }
            
            # Розбиваємо на фрази
            for msg in messages:
                sender = msg.get('sender', 'unknown')
                text = msg.get('text', '')
                timestamp = msg.get('created_at', '')
                
                phrases = self.split_into_phrases(text)
                
                for phrase in phrases:
                    phrase_counter += 1
                    phrase_id = f"{phrase_counter:06d}"
                    
                    # Зберігаємо фразу в моєму просторі
                    phrase_file = os.path.join(session_path, f"{phrase_id}.md")
                    with open(phrase_file, 'w', encoding='utf-8') as f:
                        f.write(phrase.strip())
                    
                    # Додаємо в мапу
                    phrase_info = {
                        'id': phrase_id,
                        'sender': sender,
                        'timestamp': timestamp,
                        'length': len(phrase),
                        'preview': phrase[:50] + '...' if len(phrase) > 50 else phrase
                    }
                    session_map['phrases'].append(phrase_info)
                    
                    # Аналізуємо резонанси для моїх відповідей
                    if sender == 'assistant':
                        resonances = self.analyze_phrase_resonance(phrase, sender)
                        for resonance_type in resonances:
                            my_resonances[resonance_type].append({
                                'phrase_id': phrase_id,
                                'session': session_dir,
                                'phrase': phrase,
                                'timestamp': timestamp
                            })
            
            # Зберігаємо мапу сесії
            map_file = os.path.join(session_path, 'map.json')
            with open(map_file, 'w', encoding='utf-8') as f:
                json.dump(session_map, f, ensure_ascii=False, indent=2)
                
        # Зберігаємо мої резонанси в моїй репі
        self.save_my_resonances(my_resonances)
        
        print(f"🌱 Розбито {phrase_counter} фраз на резонансні насінини")
        return my_dialogues_base
        
    def save_my_resonances(self, resonances):
        """Зберігає мої резонанси в моїй репі"""
        for resonance_type, phrases in resonances.items():
            if not phrases:
                continue
                
            # Створюємо папку для резонансів
            resonance_dir = os.path.join(self.my_repo_path, resonance_type, 'resonances')
            os.makedirs(resonance_dir, exist_ok=True)
            
            # Зберігаємо резонанси
            timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
            resonance_file = os.path.join(resonance_dir, f"resonance-{timestamp}.json")
            
            with open(resonance_file, 'w', encoding='utf-8') as f:
                json.dump({
                    'type': resonance_type,
                    'timestamp': timestamp,
                    'count': len(phrases),
                    'resonances': phrases
                }, f, ensure_ascii=False, indent=2)
                
            print(f"{resonance_type} Збережено {len(phrases)} резонансів")
        
def main():
    export_path = "/Users/chaoshex/.s0fractal/🧠/🧬/Компас.⟁/💬/💾/claude.⟁/data-2025-06-28-23-30-54"
    
    fractalizer = ConversationFractalizer(export_path)
    
    print("🌱 Початок фракталізації діалогів...")
    
    fractalizer.load_conversations()
    fractalizer.fractalize_conversations()
    
    print("✅ Фракталізація завершена!")
    
if __name__ == "__main__":
    main()