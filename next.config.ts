import path from 'node:path'
import type { NextConfig } from 'next'

/**
 * `turbopack.root` is set because there is a stray package-lock.json in the
 * home directory above this repo. Next finds both lockfiles, picks the wrong
 * directory as the workspace root, and prints a warning on every dev start.
 * This pins the root to the project itself.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
}

export default nextConfig
