import { $, fs } from 'zx';
import path from 'path';

const rootDir = path.join(process.cwd(), '..'); // Kořenový adresář
const slidesDir = path.join(rootDir, 'slides');
const componentPath = path.join(rootDir, 'components', 'global-bottom.vue');
const publicDir = path.join(rootDir, 'public');
const mainDistDir = path.join(rootDir, 'dist');

// Funkce pro rekurzivní kopírování složek a souborů
async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

(async () => {
  try {
    // Zajištění, že hlavní složka /dist existuje
    await fs.mkdir(mainDistDir, { recursive: true });

    // Získání seznamu všech podadresářů ve složce /slides
    const lectureDirs = await fs.readdir(slidesDir, { withFileTypes: true });
    const directories = lectureDirs.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

    // Pro každý podadresář
    for (const dir of directories) {
      const lectureDir = path.join(slidesDir, dir);
      console.log(`lectureDir ${lectureDir}`);

      // Zkopírování souboru global-bottom.vue do podadresáře
      const targetPath = path.join(lectureDir, 'global-bottom.vue');
      await fs.copyFile(componentPath, targetPath);
      console.log(`Copied global-bottom.vue to ${targetPath}`);

      // Zkopírování celé složky /public do podadresáře
      const destPublicDir = path.join(lectureDir, 'public');
      await copyDir(publicDir, destPublicDir);
      console.log(`Copied ${publicDir} to ${destPublicDir}`);

      // Spuštění slidev build
      //await $`cd ${lectureDir} && slidev build`;
      //await $`cd ${lectureDir}`;
      //await $`slidev build`;

      // Zkopírování obsahu složky dist do hlavní složky /dist
      const lectureDistDir = path.join(lectureDir, 'dist');
      const files = await fs.readdir(lectureDistDir);

      for (const file of files) {
        const sourceFile = path.join(lectureDistDir, file);
        const targetFile = path.join(mainDistDir, file);
        await fs.copyFile(sourceFile, targetFile);
        console.log(`Copied ${sourceFile} to ${targetFile}`);
      }
    }

    console.log('All tasks completed successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
