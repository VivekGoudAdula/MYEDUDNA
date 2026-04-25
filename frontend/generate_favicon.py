import base64
import os

img_path = 'public/image.png'
svg_path = 'public/favicon.svg'

with open(img_path, 'rb') as img_file:
    base64_data = base64.b64encode(img_file.read()).decode('utf-8')

svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="white"/>
  <image href="data:image/png;base64,{base64_data}" width="90" height="90" x="5" y="5"/>
</svg>"""

with open(svg_path, 'w') as svg_file:
    svg_file.write(svg_content)

print(f"Successfully created {svg_path} with embedded base64 image.")
