import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages: /WYC_GMS_01/ for https://akash-droid-dev.github.io/WYC_GMS_01/
  base: '/WYC_GMS_01/',
})
