#!/usr/bin/env zx
import "zx/globals";
import fg from "fast-glob";
import { rimraf, rimrafSync, native, nativeSync } from 'rimraf'

const rootDir = path.resolve(__dirname, "../");
const slidesDir = path.resolve(__dirname, "../slides");
const slideProjectDirs = await fg("./*", {
  cwd: slidesDir,
  onlyFiles: false,
  deep: 1,
  absolute: true,
});

// dist
if (fs.existsSync(path.resolve(rootDir, "dist"))) {
  cd(rootDir);
//  await $`rm -rf dist`;
  //await $`node rimraf dist`;
  rimraf('dist')
}

for (let dir of slideProjectDirs) {
  cd(dir);
  //  await $`rm -rf dist`;
  //await $`node rimraf dist`;
  rimraf('dist')
}