import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const desktop = process.env.VITE_PCForge_DESKTOP === "true";

export default defineConfig({
  plugins: [react()],
  base: desktop ? "./" : "/PCForge/",
});
