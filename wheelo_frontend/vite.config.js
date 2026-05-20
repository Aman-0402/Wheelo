import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (['react', 'react-dom', 'react-router-dom'].some((p) => id.includes(`/${p}/`))) return 'vendor-react'
            if (id.includes('@tanstack')) return 'vendor-query'
            if (id.includes('framer-motion')) return 'vendor-motion'
            if (['axios', 'date-fns', 'clsx', 'tailwind-merge'].some((p) => id.includes(`/${p}/`))) return 'vendor-utils'
            return 'vendor'
          }
        },
      },
    },
  },
})
