#!/usr/bin/env node
/**
 * Copies published writing from the ../mi workspace into this repo.
 *
 * Writing is authored in ../mi, which also holds prompts, research and drafts
 * that have no business in a public site repo. This script pulls across only
 * the dated post files, so the site has a self-contained content/ directory
 * that builds without ../mi being present.
 *
 * Usage: pnpm sync-content
 */

import { readdirSync, mkdirSync, copyFileSync, cpSync, existsSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const SOURCES = [
  {
    from: '../mi/personal-blog/content',
    to: 'content/blog',
    // images are served, so they go to public/ with their structure intact;
    // bodies reference them relatively and the reader rewrites the prefix
    images: 'public/writing/blog',
  },
  // newsletter posts stay canonical on Substack; mirrored here for the index
  {
    from: '../mi/the-working-prototype/content',
    to: 'content/newsletter',
    images: 'public/writing/newsletter',
  },
]

const IMAGE_DIRS = ['background-images', 'content-images']

/** dated post files only — page-*.md, prompts and assets stay behind */
const POST = /^\d{8}-[a-z0-9-]+\.md$/

let total = 0

for (const { from, to, images } of SOURCES) {
  const src = join(root, from)
  const dest = join(root, to)

  if (!existsSync(src)) {
    console.warn(`skip  ${from} — not found`)
    continue
  }

  // rebuild the directory so deletions upstream propagate
  rmSync(dest, { recursive: true, force: true })
  mkdirSync(dest, { recursive: true })

  const files = readdirSync(src).filter((f) => POST.test(f))
  for (const file of files) {
    copyFileSync(join(src, file), join(dest, file))
  }

  console.log(`sync  ${from} → ${to}  (${files.length} posts)`)
  total += files.length

  if (!images) continue
  const imageDest = join(root, images)
  rmSync(imageDest, { recursive: true, force: true })
  mkdirSync(imageDest, { recursive: true })

  for (const dir of IMAGE_DIRS) {
    const srcDir = join(src, dir)
    if (!existsSync(srcDir)) continue
    cpSync(srcDir, join(imageDest, dir), { recursive: true })
    console.log(`      ${dir}/`)
  }
}

console.log(`done  ${total} posts`)
