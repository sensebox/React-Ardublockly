import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    build: {
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
      ],
    },
    define: {
      __BLOCKLY_MEDIA_PATH__: JSON.stringify("/media/blockly/"),
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
