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
  runtimeConfig: {
    backendBaseUrl: process.env.NUXT_BACKEND_BASE_URL || 'http://127.0.0.1:18080',
    sessionPassword: process.env.NUXT_SESSION_PASSWORD || '',
    paymentOrigins: process.env.NUXT_PAYMENT_ORIGINS || 'http://127.0.0.1:18080,http://localhost:18080',
    public: {
      bookingMode: process.env.NUXT_PUBLIC_BOOKING_MODE === 'api' ? 'api' : 'mock',
      operationsMode: process.env.NUXT_PUBLIC_OPERATIONS_MODE === 'api' ? 'api' : 'mock',
    },
  },
  routeRules: {
    '/': { redirect: '/booking' },
  },
  compatibilityDate: '2026-10-03',
  typescript: { typeCheck: true, strict: true },
  eslint: { config: { stylistic: true } },
})
