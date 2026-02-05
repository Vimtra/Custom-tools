
import base64
import re
import os

# Paths
logo_path = r"d:\Office\Vimtra Custom Tools\logos\Tlogo01_1.png"
js_path = r"d:\Office\Vimtra Custom Tools\js\company-data.js"

try:
    # 1. Read and encode image
    with open(logo_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    
    base64_data = f"data:image/png;base64,{encoded_string}"
    print(f"Encoded logo length: {len(base64_data)}")

    # 2. Read JS file
    with open(js_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 3. Replace logoData for tekcog
    # We look for the tekcog block then the logoData field inside it
    # Pattern: tekcog: { ... logoData: '...' ... }
    # This is complex with regex across lines. 
    # Simpler: Find the line containing "logoData:" inside the tekcog section or just by line context if unique?
    # Given the previous corruption, strict regex is safer.
    
    # Locate tekcog object start
    tekcog_start = content.find("'tekcog': {")
    if tekcog_start == -1:
        print("Error: 'tekcog' object not found.")
        exit(1)
        
    # Find logoData after tekcog start
    logo_data_start = content.find("logoData: '", tekcog_start)
    if logo_data_start == -1:
        # It might be truncated or look different. Let's try searching for the key.
        logo_data_start = content.find("logoData:", tekcog_start)
    
    if logo_data_start != -1:
        # Find the end of the line or string
        # Assuming it ends with "'," or "}," or just newline
        line_end = content.find("\n", logo_data_start)
        
        # Construct new line
        # Preserve indentation
        # We'll just replace the whole line to be safe
        
        # Check indentation
        line_start = content.rfind("\n", 0, logo_data_start) + 1
        indentation = content[line_start:logo_data_start]
        
        new_line = f"{indentation}logoData: '{base64_data}',"
        
        # Splice content
        new_content = content[:line_start] + new_line + content[line_end:]
        
        # Now do logoDataSignature as well? User asked to use this logo for tekcog. 
        # Usually signature logo might be same or different. Let's update both to be safe as the other was also bad.
        # Find logoDataSignature
        sig_start = new_content.find("logoDataSignature:", tekcog_start) # Search in new_content
        if sig_start != -1:
             sig_line_end = new_content.find("\n", sig_start)
             sig_line_start = new_content.rfind("\n", 0, sig_start) + 1
             indentation_sig = new_content[sig_line_start:sig_start]
             
             new_sig_line = f"{indentation_sig}logoDataSignature: '{base64_data}'" 
             # Note: might not have comma if last item, but usually does or doesn't matter for JS objects if not strict JSON
             # Check if original had comma
             original_sig_line = new_content[sig_line_start:sig_line_end]
             if original_sig_line.strip().endswith(","):
                 new_sig_line += ","
             
             new_content = new_content[:sig_line_start] + new_sig_line + new_content[sig_line_end:]
             
        with open(js_path, "w", encoding="utf-8") as f:
            f.write(new_content)
            
        print("Successfully updated logoData and logoDataSignature for tekcog.")
        
    else:
        print("Error: logoData field not found in tekcog object.")

except Exception as e:
    print(f"Error: {e}")
