import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    build: {
      // Keep the bundle parseable on older iOS (Safari 15.6 / iOS 15.8).
      // Vite's default target ("baseline-widely-available") is Safari 16+.
      target: [
        "es2020",
        "chrome87",
        "edge88",
        "firefox78",
        "safari15",
        "ios15",
      ],
      outDir: "build",
    },
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
    define: {
      __BLOCKLY_MEDIA_PATH__: JSON.stringify("/media/blockly/"),
      __TEACHABLE_MEDIA_PATH__: JSON.stringify("/media/teachable/"),
    },
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
    },
  };
});
