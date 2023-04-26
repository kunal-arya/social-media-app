import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Specifies options for the JavaScript language server in VSCode
  jsconfig: {
    // Specifies compiler options
    compilerOptions: {
      // Sets the base URL for module resolution to "src" directory
      baseUrl: "src",
    },
    // Specifies which files or directories should be included for analysis
    include: ["src"],
  },
});
