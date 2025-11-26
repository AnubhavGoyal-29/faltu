import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      'faltuverse.cloud',
      'www.faltuverse.cloud',
      '72.61.170.102',
      'localhost'
    ]
  }
})
