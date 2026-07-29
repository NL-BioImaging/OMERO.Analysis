import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.VITEST ? "test" : "production"
    )
  },
  server: {
    fs: {
      allow: [resolve(__dirname, "..")]
    }
  },
  build: {
    outDir: resolve(__dirname, "../src/omero_analysis/static/omero_analysis"),
    emptyOutDir: false,
    sourcemap: false,
    lib: {
      entry: resolve(__dirname, "src/main.tsx"),
      formats: ["es"],
      fileName: () => "app.js"
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: (asset) =>
          asset.name?.endsWith(".css") ? "app.css" : "assets/[name]-[hash][extname]"
      }
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts"
  }
});
