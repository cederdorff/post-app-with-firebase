import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      react({
        // Enable React Compiler for better performance (React 19+)
        // plugins: [["babel-plugin-react-compiler", {}]],
      })
    ],
    base: command === "serve" ? "/" : "/post-app-with-firebase/",
    server: {
      port: 5173,
      host: true, // Expose to network
      open: false
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router"],
            firebase: ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/storage"]
          }
        }
      }
    },
    preview: {
      port: 4173,
      host: true
    }
  };
});
