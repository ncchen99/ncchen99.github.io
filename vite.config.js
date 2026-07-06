import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ncchen99.github.io is a user page served from the domain root.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
