
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/course-explorer": {
        target: "https://courses.illinois.edu",
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(
            /^\/api\/course-explorer/,
            "/cisapp/explorer"
          ),
      },
    },
  },
});
