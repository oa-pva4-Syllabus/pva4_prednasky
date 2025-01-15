#!/usr/bin/env zx
import fg from "fast-glob";
import fs from "fs";
import fse from "fs-extra";
import path from "path";
import "zx/globals";
import {rimraf} from "rimraf";

const GitPagesBase = "pva4_prednasky/"

const rootDir = path.resolve(__dirname, "../");
const slidesDir = path.resolve(__dirname, "../slides");
const galleryDir = path.resolve(__dirname, "../gallery");
const slideProjectDirs = await fg("./*", {
  cwd: slidesDir,
  onlyFiles: false,
  deep: 1,
  absolute: true,
});

cd(rootDir);

// dist
if (!fs.existsSync(path.resolve(rootDir, "dist"))) {
  fs.mkdirSync(path.resolve(rootDir, "dist"));
}

$`echo "📃 ============ ..."`;
$`echo "📃 build slides ..."`;
$`echo "📃 ============ ..."`;

let readmeContent = `# Seznam přednášek\n\n| Přednáška | Odkaz |\n|-----------|-------|\n`;


for (let dir of slideProjectDirs) {
  const pkgJsonFile = path.resolve(dir, "package.json");
  const pkgName = require(pkgJsonFile).name;

  $`echo "📃 build slides ${pkgName} ..."`;
  console.log(dir)

  cd(dir);
  await fs.promises.writeFile(path.join(dir, 'vite.config.ts'), `import { defineConfig } from "vite";  

export default defineConfig({
  base: "/${GitPagesBase}${pkgName}/",
});
`);

  //components - copy from root to slides dir
  console.log("prepare components")
  const src_comp = path.resolve(rootDir, 'components');
  const dest_comp = path.resolve(dir, 'components');

  //global components - copy from root to slides dir
  await fse.copy(src_comp, dest_comp);


  //setup - copy from root to slides dir
  console.log("prepare setup")
  const src_setup = path.resolve(rootDir, 'setup');
  const dest_setup = path.resolve(dir, 'setup');

  //global components - copy from root to slides dir
  await fse.copy(src_setup, dest_setup);

  //await fse.copy(path.join(src_comp,'global-bottom.vue'), path.resolve(dir));


  await $`pnpm build`;

  console.log("vite.config.ts removed")
  await fs.promises.unlink(path.join(dir, 'vite.config.ts'));

  console.log("copy to root dist")
  const src = path.join(dir, 'dist');
  const dest = path.resolve(rootDir, 'dist', pkgName);
  await fse.copy(src, dest);
  await fse.remove(src);

  // Add entry to README content
  readmeContent += `| ${pkgName} | [Odkaz](/${GitPagesBase}${pkgName}/) |\n`;
}

// Write README.md
await fs.promises.writeFile(path.resolve(rootDir, "README.md"), readmeContent);

/*
console.log("gal")
$`echo "🚀  build gallery index ..."`;
cd(galleryDir);
await $`pnpm build`;
//await $`mv ./dist/* ${path.resolve(rootDir, 'dist')}`;
//await $`mv ./dist/* ${path.resolve(rootDir, 'dist')}`;
await fse.copy('./dist/*', path.resolve(rootDir, 'dist'));
//await $`rm -rf ./dist`;
rimraf('dist')
*/
$`echo "🎉  build success"`;