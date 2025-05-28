
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize for production
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          icons: ['lucide-react'],
          query: ['@tanstack/react-query'],
        },
      },
    },
    // Enable source maps in production for debugging
    sourcemap: mode === 'production' ? 'hidden' : true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Minify
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
  },
  // Performance optimizations
  esbuild: {
    // Remove console.log in production
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
