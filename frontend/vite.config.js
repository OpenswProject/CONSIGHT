import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), '');

  // Check for required environment variable
  if (!env.VITE_API_URL) {
    throw new Error('VITE_API_URL is not defined. Please check your .env files and build process.');
  }
  
  return defineConfig({
    plugins: [react()],
    publicDir: 'public2',
    // Define env variables to be available in the app
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL)
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log(`[Proxy] Request: ${req.method} ${req.url}`);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log(`[Proxy] Response: ${proxyRes.statusCode} ${req.url}`);
            });
            proxy.on('error', (err, req, res) => {
              console.error('[Proxy] Error: ', err);
            });
          }
        }
      }
    },
    build: {
      minify: false // Temporarily disable minification to see console.log in production build
    }
  });
}
