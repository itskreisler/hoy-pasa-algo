// @ts-check
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      allowedHosts: ['ptetxv-ip-190-61-46-146.tunnelmole.net'],
      watch: {
        ignored: ['**/backend/**']
      }
    },
    plugins: [tailwindcss()]
  },
  outDir: 'backend/static',
  integrations: [react()]
})
