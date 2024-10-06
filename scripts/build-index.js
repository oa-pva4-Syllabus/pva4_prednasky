import fs from 'node:fs/promises';
import path from 'node:path';

const TALKS_PATH = 'slides/';
const OUTPUT_PATH = 'dist';
const PUBLIC_PATH = 'public/';
const talks = [];
const SKIP_TALKS = ['00_skeleton', '00_uvodni_hodina']; // , '00_uvodni_hodina' Seznam přednášek k přeskočení

const currentYear = new Date().getFullYear();

const talksFiles = await fs.readdir(path.join(TALKS_PATH), { withFileTypes: true });


console.log( "📃 build index ...");

for (const file of talksFiles) {
  if (file.isDirectory()) {
    try {
      const rawPackageJson = await fs.readFile(path.join(file.path, file.name, 'package.json'));
      const packageJson = JSON.parse(rawPackageJson.toString());
      talks.push({path: file.name, title: packageJson.title, author: packageJson.author});
    } catch (err) {
      console.error(err);
    }
  }
}


const createLinkList = (talks) => {
  return talks
    .filter(talk => !SKIP_TALKS.includes(talk.path))
    .map(talk => `
<li class="ibm-plex-mono-thin">
    <a href="./${talk.path}" class="ibm-plex-mono-semibold">${talk.title}</a> <span class="action">(<a href="./${talk.path}/${talk.path}.pdf">PDF</a>)</span>
</li>`
    ).join('');
};

await fs.writeFile(path.join(OUTPUT_PATH, 'index.html'), `<!DOCTYPE html>
<html lang="cs">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adam Fišer | Přednášky</title>
    <link rel="stylesheet" href="styles.css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
  </head>
  <body>
  
    <div class="container">
        <div class="row margin-top">
            <div>                
                <h1>PVA4 | Programování a vývoj aplikací</h1>               
                       
                <h2>Přednášky</h2>
                <ol>
                  ${createLinkList(talks)}
                </ol>
            </div>
        </div>
  
    </div>  
    
    <footer class="footer text-center mt-4">
        <p class="small">&copy; ${currentYear} Adam Fišer | Wanex. Všechna práva vyhrazena.</p>
    </footer>  
    
    
  </body>
</html>
`);

await fs.copyFile(path.join(PUBLIC_PATH, 'styles.css'), path.join(OUTPUT_PATH, 'styles.css'));
await fs.copyFile(path.join(PUBLIC_PATH, 'logo.png'), path.join(OUTPUT_PATH, 'logo.png'));