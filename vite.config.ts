import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // server: {
  //   open: true,
  //   proxy: {
  //     "/api": {
  //       target: "https://xddaogia.vn",
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: path => path.replace(/^\/api/, "/public/api"),
  //       configure: (proxy, options) => {
  //         // Additional configuration options for the proxy
  //         proxy.on("proxyReq", (proxyReq, req, res) => {
  //           proxyReq.setHeader("Origin", "https:xddaogia.vn")
  //         })
  //       },
  //     },
  //   },
  //   port: 5174,
  // },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
})
