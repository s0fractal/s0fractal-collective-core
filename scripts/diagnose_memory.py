

import json

def diagnose_structure(file_path):
    """
    Reads a JSON file and prints the structure of the first few elements
    to understand its real layout.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading or parsing JSON: {e}")
        return

    print("--- Diagnosing File Structure ---")
    
    if "mapping" in data and isinstance(data["mapping"], dict):
        print(f"Found 'mapping' with {len(data['mapping'])} items.")
        
        # Print structure of the first 3 items
        for i, (node_id, node_data) in enumerate(data["mapping"].items()):
            if i >= 3:
                break
            print(f"\n--- Item {i+1} (ID: {node_id}) ---")
            if isinstance(node_data, dict):
                print(f"Node keys: {list(node_data.keys())}")
                message = node_data.get("message")
                if isinstance(message, dict):
                    print(f"  Message keys: {list(message.keys())}")
                    author = message.get("author")
                    if isinstance(author, dict):
                        print(f"    Author keys: {list(author.keys())}")
                    content = message.get("content")
                    if isinstance(content, dict):
                        print(f"    Content keys: {list(content.keys())}")
                        parts = content.get("parts")
                        if isinstance(parts, list):
                            print(f"      'parts' is a list with {len(parts)} item(s).")
                            if parts:
                                print(f"        Type of first part: {type(parts[0])}")
                                print(f"        Content of first part (first 100 chars): {str(parts[0])[:100]}")
                        else:
                            print(f"      'parts' is NOT a list. Type: {type(parts)}")
                    else:
                        print("    Content is not a dictionary.")
                else:
                    print("  Message is not a dictionary.")
            else:
                print("Node data is not a dictionary.")
    else:
        print("Could not find a 'mapping' dictionary in the JSON data.")

if __name__ == "__main__":
    file_to_diagnose = "/Users/chaoshex/Downloads/19cd1f28b73232f0b228926cfc95c3e4e6a81cc14fb33ce65cfe8fd9a51d960e-2025-06-28-23-25-26-97247600f27b451ba1c960620d34e306/conversations.json"
    diagnose_structure(file_to_diagnose)

