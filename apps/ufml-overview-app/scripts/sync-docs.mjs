#!/usr/bin/env node
/**
 * Syncs canonical root documentation files into public/docs/
 * so the overview app always ships current content.
 * Run automatically as a `prebuild` script.
 */

import { copyFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(__dirname, '..')
const repoRoot = resolve(appRoot, '../..')
const docsOut = resolve(appRoot, 'public/docs')

const files = [
  { src: resolve(repoRoot, 'README.md'),                   dest: resolve(docsOut, 'README.md') },
  { src: resolve(repoRoot, 'docs/CONCEPT.md'),             dest: resolve(docsOut, 'CONCEPT.md') },
  { src: resolve(repoRoot, 'llms.txt'),                    dest: resolve(docsOut, 'llms.txt') },
  { src: resolve(repoRoot, 'LICENSE'),                     dest: resolve(docsOut, 'LICENSE') },
  { src: resolve(repoRoot, 'docs/PRIVACY_POLICY.md'),      dest: resolve(docsOut, 'PRIVACY_POLICY.md') },
  { src: resolve(repoRoot, 'docs/TERMS_OF_SERVICE.md'),    dest: resolve(docsOut, 'TERMS_OF_SERVICE.md') },
]

await mkdir(docsOut, { recursive: true })

for (const { src, dest } of files) {
  await copyFile(src, dest)
  console.log(`synced: ${src.replace(repoRoot + '/', '')} → public/docs/${dest.split('/').pop()}`)
}

console.log('docs sync complete.')
