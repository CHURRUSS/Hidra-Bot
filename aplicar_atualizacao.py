"""Atualiza uma cópia local do repositório Hidra-Bot preservando todos os arquivos existentes."""
from pathlib import Path
import shutil
import sys
root=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path.cwd()
source=Path(__file__).with_name('mobile-daily.js')
index=root/'index.html';sw=root/'sw.js'
if not index.exists() or not sw.exists() or not (root/'app.js').exists():
    raise SystemExit('Pasta inválida: execute na pasta do repositório Hidra-Bot ou indique o caminho.')
old=index.read_text(encoding='utf-8')
if 'mobile-daily.js' not in old:
    marker='</body>'
    if marker not in old:raise SystemExit('Não encontrei </body> em index.html')
    shutil.copy2(index,index.with_name('index.html.bak'))
    old=old.replace(marker,'<script src="mobile-daily.js?v=16" defer></script>'+marker)
    index.write_text(old,encoding='utf-8')
else: print('Index já possui mobile-daily.js')
shutil.copy2(source,root/'mobile-daily.js')
text=sw.read_text(encoding='utf-8')
if 'mobile-daily.js?v=16' not in text:
    shutil.copy2(sw,sw.with_name('sw.js.bak'))
    import re
    text=re.sub(r"const CACHE='[^']+'", "const CACHE='hidra-mobile-v16-daily'",text,count=1)
    text=text.replace("'./index.html'","'./index.html','./mobile-daily.js?v=16'",1)
    sw.write_text(text,encoding='utf-8')
print('Atualização aplicada. Confira os arquivos e publique o commit no GitHub.')
