import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/Purpose-Academy-Application/" : "/",
  plugins: [
    react(),
    {
      name: "sitewise-api",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url?.startsWith("/api")) {
            next();
            return;
          }
          import("./server/api.ts")
            .then(({ handleApi }) => handleApi(req, res))
            .catch((error: unknown) => {
              res.statusCode = 500;
              res.end(error instanceof Error ? error.message : "API failed");
            });
        });
      },
    },
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
});
