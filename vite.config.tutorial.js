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
      fileName: () => `tutorial.js`,
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
    alias: [
      { find: "@", replacement: "/src" },
      // Deep default imports like "@mui/icons-material/Usb" resolve to the
      // package's CJS build, and Vite's dev-time CJS interop drops the
      // ".default" unwrap for it, so the icon component renders as an
      // invalid element type. Redirect to the package's ESM build, which
      // needs no interop.
      {
        find: /^@mui\/icons-material\/(?!esm\/)(.+)$/,
        replacement: "@mui/icons-material/esm/$1",
      },
      // Same issue for deep imports like "react-spinners/GridLoader" —
      // redirect to its ESM build too.
      {
        find: /^react-spinners\/(?!esm\/)(.+)$/,
        replacement: "react-spinners/esm/$1",
      },
    ],
  },
  plugins: [react(), cssInjectedByJsPlugin()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    __BLOCKLY_MEDIA_PATH__: JSON.stringify(
      "/user/themes/ada-theme/images/tutorial/blockly/",
    ),
  },
});
