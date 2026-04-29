import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,ts}',
    './pages/**/*.vue',
    './app.vue',
    './composables/**/*.ts',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8E51FF',
        'primary-mid': '#AD46FF',
        'primary-end': '#E12AFB',
        border: '#E2E8F0',
        'border-glass': 'rgba(255,255,255,0.4)',
        'text-dark': '#314158',
        'text-medium': '#45556C',
        'text-subtle': '#62748E',
        'text-placeholder': '#90A1B9',
        track: '#E2E8F0',
        error: '#DC2626',
        'bg-start': '#F5F3FF',
        'bg-mid': '#FAF5FF',
        'bg-end': '#FDF4FF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass-sm': '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)',
        'glass-lg': '0 25px 50px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        sm: '14px',
        md: '16px',
        lg: '24px',
      },
    },
  },
} satisfies Config
