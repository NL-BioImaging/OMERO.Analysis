import { defineConfig } from "vitest/config";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

const assetManifest = (): Plugin => ({
  name: "omero-analysis-asset-manifest",
  generateBundle(_options, bundle) {
    const digest = createHash("sha256");
    Object.keys(bundle).sort().forEach((name) => {
      const item = bundle[name];
      digest.update(name);
      digest.update("code" in item ? item.code : item.source);
    });
    this.emitFile({
      type: "asset",
      fileName: "asset-manifest.json",
      source: JSON.stringify({ version: 1, build: digest.digest("hex").slice(0, 16) }, null, 2)
    });
  }
});

export default defineConfig({
  plugins: [react(), assetManifest()],
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
