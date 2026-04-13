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
        'neon-purple': '#d946ef',
        'neon-violet': '#8b5cf6',
        'dark-bg': '#0d0015',
        'dark-card': '#1a0033',
      },
      fontFamily: {
        retro: ['"Press Start 2P"', 'monospace'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-sm': '0 0 6px #d946ef, 0 0 12px #a21caf',
        'neon-md': '0 0 10px #d946ef, 0 0 24px #a21caf, 0 0 40px #7e22ce',
        'neon-lg': '0 0 16px #d946ef, 0 0 40px #a21caf, 0 0 70px #6b21a8',
      },
    },
  },
} satisfies Config
