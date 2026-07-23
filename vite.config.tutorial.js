import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const widgets = [
  {
    entry: "src/tutorial-classification-widget.jsx",
    name: "TutorialClassificationWidget",
    fileName: "tutorial-classification-widget",
  },
];

const widgetKey = process.env.WIDGET;
const selected = widgetKey
  ? widgets.find((w) => w.fileName.startsWith(widgetKey))
  : null;

const target = selected ?? widgets[0];

export default defineConfig({
  build: {
    outDir: "build",
    emptyOutDir: false,
    lib: {
      entry: resolve(import.meta.dirname, target.entry),
      name: target.name,
      fileName: () => `${target.fileName}.js`,
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  base: "/user/themes/ada-theme/tutorial/",
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
