import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      // 👇 多入口打包
      input: {
        main: path.resolve(__dirname, 'index.html'),  // 主页面入口（确保存在 index.html）
        background: path.resolve(__dirname, 'src/lib/background.ts'), // 额外入口
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background.js'
          }
          return 'assets/main.js'
        },
        assetFileNames: 'assets/style.css',
      }
    }
  }
})
