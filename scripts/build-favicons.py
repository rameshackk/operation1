import os
import base64
from PIL import Image

logo_path = 'assets/logo.png'
if os.path.exists(logo_path):
    img = Image.open(logo_path).convert('RGBA')
    
    # 1. Save favicon.png
    img.save('favicon.png', 'PNG')
    
    # 2. Save favicon.ico with multi-resolution icon sizes
    img.save('favicon.ico', format='ICO', sizes=[(16,16), (32,32), (48,48), (64,64), (128,128), (256,256)])
    
    # 3. Save favicon.svg embedding the high-res transparent PNG
    with open('assets/logo.png', 'rb') as f:
        b64_str = base64.b64encode(f.read()).decode('utf-8')
    
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,{b64_str}" x="0" y="0" width="512" height="512" preserveAspectRatio="xMidYMid meet" />
</svg>"""
    
    with open('favicon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
        
    print('Successfully generated favicon.ico, favicon.png, and favicon.svg!')
else:
    print('Error: assets/logo.png not found')
