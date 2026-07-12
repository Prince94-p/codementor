import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite Configuration File
 * Configures the build and development environment for the React application.
 * Uses the official React plugin for Hot Module Replacement (HMR) and compilation.
 * 
 * @see https://vite.dev/config/
 */
export default defineConfig({
  plugins: [
    // Enable Fast Refresh and React optimization support
    react()
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: 'all'
  }
})
