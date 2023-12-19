import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  define: {
    VERSION: JSON.stringify(process.env.npm_package_version)
  },
  server: {
    host: true,
    port: 8000,
    watch: {
      usePolling: true
    }
  }
})
