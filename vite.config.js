import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' 

// 自动根据环境设置 base 路径（支持 GitHub Pages）
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const base = isGithubPages ? '/Profile/' : '/';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets')
    }
  },
  base,
  build: {
    sourcemap: false,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]' // 确保音频文件正确输出
      }
    }
  }
})