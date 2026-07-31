import JSZip from 'jszip';

export const exportExtensionZip = async (): Promise<void> => {
  const zip = new JSZip();

  // Manifest V3
  const manifestContent = {
    manifest_version: 3,
    name: 'Atlas Box - macOS Launchpad & Dock',
    short_name: 'Atlas Box',
    version: '1.0.0',
    description: 'Substitui a Nova Guia por um launcher estilo macOS Launchpad com Dock de Super Favoritos.',
    permissions: ['bookmarks', 'storage', 'favicon'],
    chrome_url_overrides: {
      newtab: 'index.html'
    },
    action: {
      default_title: 'Atlas Box Nova Guia'
    }
  };

  zip.file('manifest.json', JSON.stringify(manifestContent, null, 2));

  // Instructions TXT
  const readmeContent = `========================================================
LAUNCHPAD NEW TAB - INSTRUÇÕES DE INSTALAÇÃO NO CHROME / EDGE
========================================================

1. Extraia o conteúdo deste arquivo ZIP em uma pasta no seu computador.

2. Abra seu navegador (Chrome ou Edge):
   - No Chrome: digite chrome://extensions na barra de endereço
   - No Edge: digite edge://extensions na barra de endereço

3. Ative o "Modo do desenvolvedor" (Developer mode) no canto superior direito.

4. Clique no botão "Carregar sem compactação" (Load unpacked) no canto superior esquerdo.

5. Selecione a pasta onde você extraiu a aplicação (ou a pasta 'dist' se você compilou o projeto).

6. Abra uma Nova Guia (Ctrl+T / Cmd+T) e pronto! Seu Launchpad Apple já estará funcionando e sincronizado com os Favoritos nativos do navegador.

Aproveite seu novo launcher!
`;

  zip.file('LEIA-ME-INSTALACAO.txt', readmeContent);

  // Minimal index.html fallback for standalone extension structure
  const indexHtml = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nova Guia - Launchpad</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

  zip.file('index.html', indexHtml);

  // Generate Blob and trigger browser download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'atlas-box-extension.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
