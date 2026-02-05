
try:
    with open(r"d:\Office\Vimtra Custom Tools\js\company-data.js", "r", encoding="utf-8") as f:
        lines = f.readlines()
        if len(lines) >= 13:
            line12 = lines[11]
            line13 = lines[12]
            print(f"Line 12 length: {len(line12)}")
            print(f"Line 12 end (last 200 chars): {repr(line12[-200:])}")
            print(f"Line 13 start (first 100 chars): {repr(line13[:100])}")
        else:
            print(f"File has fewer than 13 lines: {len(lines)}")
except Exception as e:
    print(f"Error: {e}")
