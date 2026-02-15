import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Development server configuration
  server: {
    host: true, // Listen on all addresses for network access
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Production preview server configuration (for Render)
  preview: {
    host: '0.0.0.0', // Bind to all interfaces for cloud platforms
    port: Number(process.env.PORT) || 10000, // Use Render's PORT or default
  },
  // Build optimizations for production
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for smaller bundle size
    minify: 'esbuild', // Fast minification
    target: 'es2015', // Browser compatibility
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'radix-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
          ],
        },
      },
    },
  },
});
