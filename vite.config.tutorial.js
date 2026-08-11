import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "build",
    emptyOutDir: false,
    lib: {
      entry: resolve(
        import.meta.dirname,
        "src/widgets/TutorialClassification/index.jsx",
      ),
      name: "TutorialClassificationWidget",
      fileName: () => `tutorial-classification-widget.js`,
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames: "[name].[ext]",
      },
    },
  },
  base: "/user/themes/ada-theme/tutorial/",
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [react(), cssInjectedByJsPlugin()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
