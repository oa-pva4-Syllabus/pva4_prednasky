#!/usr/bin/env node
// Multiplatformní build Slidev monorepa (Windows + Linux) bez Bash/WSL
// - řazení slajdů stabilně podle názvu složky (přirozené/číselné)
// - README zobrazuje title (pokud není, tak name)

import 'zx/globals'
import fg from 'fast-glob'
import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
import { rimraf } from 'rimraf'
import { fileURLToPath } from 'url'

// ✅ Windows: používej PowerShell a vypni bash prefix, ať $`…` neběží přes "set -euo pipefail;"
if (process.platform === 'win32') {
    $.shell = 'powershell.exe'   // nebo 'pwsh.exe', pokud používáš PowerShell 7
    $.prefix = ''
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Nastav si podle svého nasazení (GitHub Pages)
const GitPagesBase = 'pva4_prednasky/'
const GitPagesURL  = 'https://oa-pva4-syllabus.github.io/'

const rootDir       = path.resolve(__dirname, '..')
const slidesDir     = path.resolve(rootDir, 'slides')
const distDir       = path.resolve(rootDir, 'dist')
const componentsSrc = path.resolve(rootDir, 'components')
const setupSrc      = path.resolve(rootDir, 'setup')

// 0) clean & připrav root/dist
await rimraf(distDir)
await fse.ensureDir(distDir)

console.log('📃 ============ ...')
console.log('📃 build slides ...')
console.log('📃 ============ ...')

// 1) najdi všechny slajdy (adresáře s package.json)
const slidePkgPaths = await fg(['*/package.json'], { cwd: slidesDir, absolute: true })

// 1a) stabilní řazení podle názvu složky (přirozeně s čísly, cs locale)
const collator = new Intl.Collator('cs', { numeric: true, sensitivity: 'base' })
const slideDirs = slidePkgPaths
    .map(p => path.dirname(p))
    .sort((a, b) => collator.compare(path.basename(a), path.basename(b)))

const NL = '\n'
let readmeLines = [
    '# Seznam přednášek',
    '',
    '| Přednáška | Odkaz |',
    '|-----------|-------|',
]

for (const dir of slideDirs) {
    const pkgJsonPath = path.resolve(dir, 'package.json')
    const pkgJson     = JSON.parse(await fs.promises.readFile(pkgJsonPath, 'utf8'))
    const pkgName     = pkgJson.name
    const title       = pkgJson.title ?? pkgName

    console.log(`\n📃 build slide: ${pkgName}`)
    console.log(dir)

    // 2) dočasný vite.config.ts s base pro GitHub Pages
    const viteConfigPath = path.join(dir, 'vite.config.ts')
    const viteConfigContent = `import { defineConfig } from 'vite';
export default defineConfig({
  base: '/${GitPagesBase}${pkgName}/',
});
`
    await fs.promises.writeFile(viteConfigPath, viteConfigContent, 'utf8')

    // 3) shared složky (kopíruj, pokud existují)
    if (await fse.pathExists(componentsSrc)) {
        console.log('prepare components')
        await fse.copy(componentsSrc, path.join(dir, 'components'), { overwrite: true })
    }
    if (await fse.pathExists(setupSrc)) {
        console.log('prepare setup')
        await fse.copy(setupSrc, path.join(dir, 'setup'), { overwrite: true })
    }

    // 4) build konkrétního slajdu (použije jeho package.json scripts.build)
    cd(dir)
    await $`pnpm build`

    // 5) přesun výstupu do root/dist/{pkgName}
    const slideDist  = path.join(dir, 'dist')
    const targetDist = path.join(distDir, pkgName)
    console.log('copy to root dist:', targetDist)
    await fse.copy(slideDist, targetDist, { overwrite: true })
    await rimraf(slideDist)

    // 6) úklid dočasného vite.config.ts
    console.log('vite.config.ts removed')
    await fs.promises.unlink(viteConfigPath).catch(() => {})

    // 7) řádek do README (titulek → odkaz)
    readmeLines.push(`| ${title} | [Odkaz](${GitPagesURL}${GitPagesBase}${pkgName}/) |`)
}

// 8) zapiš README (LF konce řádků)
await fs.promises.writeFile(path.resolve(rootDir, 'README.md'), readmeLines.join(NL) + NL, 'utf8')

console.log('\n🎉  build success')
