#!/usr/bin/env zx
import fg from "fast-glob";
import fs from "fs";
import path from "path";
import "zx/globals";

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


if (!fs.existsSync(path.resolve(rootDir, "dist"))) {
  fs.mkdirSync(path.resolve(rootDir, "dist"));
}

$`echo "📃 build slides ..."`;

for (let dir of slideProjectDirs) {
  const pkgJsonFile = path.resolve(dir, "package.json");
  const pkgName = require(pkgJsonFile).name;

  cd(dir);
  await $`
cat <<EOF >vite.config.ts 
import { defineConfig } from "vite";

export default defineConfig({
  base: "/${pkgName}/",
});
`;
  await $`pnpm build`;
  await $`rm vite.config.ts`;
  await $`mv dist ../../dist/${pkgName}`;
}

$`echo "🚀  build gallery index ..."`;
cd(galleryDir)
await $`pnpm build`
await $`mv ./dist/* ../dist`
await $`rm -rf ./dist`

$`echo "🎉  build success"`;