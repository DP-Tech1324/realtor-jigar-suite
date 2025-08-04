
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Fresh deployment trigger - 2025-01-01
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: path.resolve(__dirname),
  server: {
    host: "::",
    port: 8084,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@shared': path.resolve(__dirname, '../shared')
    },
  },
  optimizeDeps: {
    include: ['lucide-react'], // ✅ Add this line
  },
  build: {
    rollupOptions: {
      external: [], // Leave empty unless you want to exclude any package from the bundle
    },
  },
}));
