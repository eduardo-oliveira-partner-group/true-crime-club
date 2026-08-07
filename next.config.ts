import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  output: 'standalone',
  // Evita bundling quebrado do jsdom no SSR (Node 20 / Azure).
  serverExternalPackages: ['isomorphic-dompurify', 'jsdom'],
  turbopack: {
    root: path.resolve(__dirname),
  },
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
}

export default nextConfig
