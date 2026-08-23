export default defineNuxtConfig({
  compatibilityDate: '2026-08-23',
  modules: ['@nuxt/ui'],
  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap' }
      ]
    }
  },

  runtimeConfig: {
    fonnteToken: process.env.WHATSAPP_API_TOKEN_FONNTE,
    fonnteUrl: process.env.WHATSAPP_API_URL,
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    sessionSecret: process.env.SESSION_SECRET || 'super-secret-key-change-in-prod',
    s3AccessKey: process.env.S3_ACCESS_KEY || '',
    s3SecretKey: process.env.S3_SECRET_KEY || '',
    s3Bucket: process.env.S3_BUCKET || 'flashsale-bucket-ktc6wa',
    s3Endpoint: process.env.S3_ENDPOINT || 'https://kencana.basic.box.cloudeka.id',
    s3Region: process.env.S3_REGION || 'kencana',
    public: {}
  },

  nitro: {
    preset: 'vercel',
    experimental: {
      wasm: false
    }
  }
})
