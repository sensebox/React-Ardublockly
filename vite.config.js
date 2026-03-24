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
      host: true,
      port: 3000,
    },
  };
});
