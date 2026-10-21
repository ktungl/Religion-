import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      // The offline page must never stand in for API addresses.
      workbox: { navigateFallbackDenylist: [/^\/api\//] },
      manifest: {
        name: 'Faith Together',
        short_name: 'Faith Together',
        description: 'A shared faith calendar that helps coworkers understand each other.',
        start_url: '/',
        display: 'standalone',
        background_color: '#FAF8F4',
        theme_color: '#2B3440',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})
