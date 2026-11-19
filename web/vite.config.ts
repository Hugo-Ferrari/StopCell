import path from "node:path"
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }) => {
  if (command === "build" && mode === "production") {
    const env = loadEnv(mode, process.cwd(), "");
    if (!env.VITE_API_URL) {
      throw new Error(
        "Falta a variável VITE_API_URL (endereço da API) para o build de produção. " +
          "Defina no web/.env ou no painel do deploy. " +
          "Pra testar o build na sua máquina: VITE_API_URL=http://localhost:3000 npm run build",
      );
    }
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
