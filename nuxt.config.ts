export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      titleTemplate: '%s · PULANG',
      meta: [
        { name: 'description', content: 'Prototype alur booking PULANG ke UTTARA.' },
        { name: 'theme-color', content: '#000000' },
      ],
    },
  },
  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/base.css',
    '~/assets/css/components.css',
  ],
  routeRules: {
    '/': { redirect: '/booking' },
  },
  compatibilityDate: '2026-10-03',
  typescript: { typeCheck: true, strict: true },
  eslint: { config: { stylistic: true } },
})
