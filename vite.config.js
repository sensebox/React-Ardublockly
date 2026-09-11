import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    resolve: {
      alias: {
        "@": "/src",
      },
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
