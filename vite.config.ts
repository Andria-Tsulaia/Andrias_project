
import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import {
  enterDevPlugin,
  enterProdPlugin,
} from "vite-plugin-enter-dev";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

export default defineConfig(({ mode }) => {
  const plugins = [
    react(),
    ...enterProdPlugin({ injectGoogleFonts: false }),
    visualizer({
      open: false,
      filename: "stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ];

  if (mode === "development") {
    plugins.push(...enterDevPlugin({ react: false }));
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: plugins.filter(Boolean) as PluginOption[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base: "/Andrias-project/",
    build: {
      outDir: "dist",
      target: "es2022",
      cssCodeSplit: true,
      reportCompressedSize: false,
    },
  };
});
