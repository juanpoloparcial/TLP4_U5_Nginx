import { defineConfig } from 'vite'

export default defineConfig(async () => {
  const reactPlugin = await import('@vitejs/plugin-react')
  return {
    plugins: [
      (reactPlugin.default ?? reactPlugin)(),
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000/',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})