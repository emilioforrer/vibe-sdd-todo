// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
  ],

  googleFonts: {
    families: {
      'Press Start 2P': true,
      'Space Mono': [400, 700],
    },
    display: 'swap',
    preload: true,
  },

  css: ['~/assets/css/main.css'],

  // SPA mode — no server required for localStorage-only MVP
  ssr: false,

  typescript: {
    strict: true,
    shim: false,
  },

  compatibilityDate: '2024-04-03',
})
