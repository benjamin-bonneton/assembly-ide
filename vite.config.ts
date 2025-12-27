import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@images": "/src/assets/images",
      "@components": "/src/components",
      "@providers": "/src/providers",
      "@panels": "/src/panels",
      "@hooks": "/src/hooks",
      "@utils": "/src/utils",
      "@styles": "/src/assets/styles",
    },
  },
});
