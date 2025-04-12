import { defineConfig } from 'vite';
import path from 'path';

// This is a specialized configuration for production builds on GitHub Pages
export default defineConfig({
  root: '.',
  base: './', // Relative base path for GitHub Pages
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Ensure all assets are included in the build
    assetsInlineLimit: 0,
    // Generate source maps for debugging
    sourcemap: true,
    // Simplify output structure for GitHub Pages
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      },
      // Ensure the main entry point is included
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'components'),
      '@styles': path.resolve(__dirname, 'styles'),
      '@assets': path.resolve(__dirname, 'assets'),
    },
  },
});
