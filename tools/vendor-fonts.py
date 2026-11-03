from pathlib import Path
from urllib.request import urlopen, Request
import re
root=Path(__file__).resolve().parent.parent
headers={'User-Agent':'Mozilla/5.0'}
css_url='https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Noto+Sans+Armenian:wght@400;500;600&display=swap'
def get(url):
 return urlopen(Request(url,headers=headers),timeout=30).read()
css=get(css_url).decode()
folder=root/'assets/fonts';folder.mkdir(exist_ok=True)
urls=list(dict.fromkeys(re.findall(r'url\((https://fonts\.gstatic\.com/[^)]+)\)',css)))
for i,url in enumerate(urls):
 suffix='woff2' if '.woff2' in url else 'ttf'
 name=f'font-{i}.{suffix}'
 (folder/name).write_bytes(get(url))
 css=css.replace(url,f'fonts/{name}')
(root/'assets/fonts.css').write_text(css)
for font in ['manrope','notosansarmenian']:
 (folder/f'{font}-OFL.txt').write_bytes(get(f'https://raw.githubusercontent.com/google/fonts/main/ofl/{font}/OFL.txt'))
p=root/'index.html';html=p.read_text();html=re.sub(r'  <link rel="preconnect"[^\n]+\n','',html);html=re.sub(r'  <link href="https://fonts.googleapis.com/[^\n]+\n','  <link rel="stylesheet" href="assets/fonts.css">\n',html);p.write_text(html)
print(f'Vendored {len(urls)} font files with OFL license notices')
