import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";

const _getPath = (...segments: string[]) => path.resolve(__dirname, "src", ...segments);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    //to change server port
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "styles/vars.scss";
          @import "styles/mixins.scss";
        `,
      },
    },
  },
  resolve: {
    alias: {
      components: _getPath("components"),
      icons: _getPath("components/icons"),
      ui: _getPath("components/ui"),
      modals: _getPath("modals"),
      styles: _getPath("styles"),
      utils: _getPath("utils"),
      layouts: _getPath("layouts"),
      pages: _getPath("pages"),
      public: _getPath("..", "public"),
    },
  },
});
