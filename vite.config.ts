import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Raise warning threshold — Recharts is large by design
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split vendor chunks for better long-term caching
        manualChunks(id) {
          if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts'
          if (id.includes('framer-motion')) return 'vendor-motion'
          if (id.includes('@radix-ui')) return 'vendor-radix'
          if (id.includes('react-dom') || id.includes('react-router')) return 'vendor-react'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
