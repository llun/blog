import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

const config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './libs/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem'
    }
  },
  plugins: [forms]
} satisfies Config

export default config
