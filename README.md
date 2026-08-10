# VNNUS ERP 2.0 — pronto para GitHub Pages

## Upload correto
Envie o **conteúdo desta pasta**, não o ZIP e não uma pasta contendo os arquivos.

Na raiz do repositório devem aparecer:
- index.html
- manifest.webmanifest
- sw.js
- .nojekyll
- css/
- js/
- pages/
- assets/

## Publicação
GitHub: Settings > Pages > Build and deployment > Deploy from a branch > main > /(root) > Save.

## Scanner
Depois de publicar o repositório `vnnus-scanner`, abra `js/config.js` e cole a URL publicada no campo `SCANNER_URL`.

## Dados reais
Esta versão ainda usa demonstração em `js/api.js`. A próxima etapa é conectar o ERP 2.0 ao Apps Script/Google Sheets existente sem recadastrar os dados.
