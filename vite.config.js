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
    plugins: [react()],
    server: {
      port: 3000,
    },
  };
});
