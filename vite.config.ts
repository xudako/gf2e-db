import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production'
  ? '/gf2e-db/'
  : '/',
  plugins: [react()],
})
