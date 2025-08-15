import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(() => {
  // Si corre en GitHub Actions, usar la ruta base '/<repo>/' automáticamente para Pages.
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
  const isCI = process.env.GITHUB_ACTIONS === 'true'
  const base = isCI && repo ? `/${repo}/` : '/'

  return {
    base,
    plugins: [react(), tailwind()],
  }
})
