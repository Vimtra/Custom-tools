
import os

file_path = r"d:\Office\Vimtra Custom Tools\js\company-data.js"

try:
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    if len(lines) >= 13:
        line12 = lines[11]
        print(f"Original line 12 length: {len(line12)}")
        
        # Identify the garbage "ORw0KGgoA" (and potentially a double quote)
        # We know the valid base64 ends around "AAAAAX"
        # We will search for that marker and truncate after it.
        marker = "AAAAAX"
        idx = line12.rfind(marker)
        
        if idx != -1:
            print(f"Marker found at index {idx}")
            # Truncate after marker
            valid_part = line12[:idx + len(marker)]
            
            # Ensure it ends with ',
            # Current ending usually 'logoData: '...AAAAAX'
            # We want: logoData: '...AAAAAX',
            
            # Assuming the line starts with "        logoData: '"
            # We just append ', and newline
            
            new_line12 = valid_part + "',\n"
            
            print(f"New line 12 end: {repr(new_line12[-50:])}")
            
            lines[11] = new_line12
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.writelines(lines)
            print("File updated successfully.")
        else:
            print("Marker 'AAAAAX' not found in line 12. Aborting fix.")
            # Fallback: manually inspect if needed
            print(f"Line 12 end: {repr(line12[-100:])}")

    else:
        print(f"File has fewer than 13 lines: {len(lines)}")

except Exception as e:
    print(f"Error: {e}")
