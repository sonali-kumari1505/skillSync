/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-primary)',
        surface: 'var(--bg-secondary)',
        border: 'var(--border-color)',
        brand: {
          50: '#f2e9e4',
          100: '#eadeda',
          200: '#dfcbc5',
          300: '#c9ada7',
          400: '#b19aa1',
          500: '#9a8c98',
          600: '#4a4e69',
          700: '#3d405a',
          800: '#303345',
          900: '#22223b',
          950: '#1a1a2f',
        },
        slate: {
          50: '#f8f3ef',
          100: '#f2e9e4',
          200: '#dfcbc5',
          300: '#c9ada7',
          400: '#b19aa1',
          500: '#9a8c98',
          600: '#747187',
          700: '#4a4e69',
          800: '#303345',
          900: '#22223b',
          950: '#1a1a2f',
        },
        violet: {
          50: '#f8f3ef',
          100: '#f2e9e4',
          200: '#dfcbc5',
          300: '#c9ada7',
          400: '#b19aa1',
          500: '#9a8c98',
          600: '#4a4e69',
          700: '#3d405a',
          800: '#303345',
          900: '#22223b',
          950: '#1a1a2f',
        },
        indigo: {
          50: '#f8f3ef',
          100: '#f2e9e4',
          200: '#dfcbc5',
          300: '#c9ada7',
          400: '#9a8c98',
          500: '#4a4e69',
          600: '#3d405a',
          700: '#303345',
          800: '#22223b',
          900: '#1a1a2f',
          950: '#151525',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace'
        ]
      }
    },
  },
  plugins: [],
}
