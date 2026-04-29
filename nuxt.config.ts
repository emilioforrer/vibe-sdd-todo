// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/eslint',
  ],

  eslint: {
    config: {
      stylistic: false,
    },
  },

  googleFonts: {
    families: {
      Inter: [400, 500],
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
