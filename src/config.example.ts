import type { Config } from '@/types'

export default {
  maintainers: [],
  i18n: {
    options: {
      debug: process.env.NODE_ENV === 'development',
      fallbackLng: 'en-US'
    },
    languages: [
      {
        iso: 'en-US',
        localeName: 'English',
        aliases: [
          'en',
          'english'
        ]
      },
      {
        iso: 'fr',
        localeName: 'Français',
        aliases: [
          'fr',
          'français',
          'french'
        ]
      }
    ]
  },
  apis: {
    rawgo: {
      baseUrl: ''
    }
  }
} satisfies Config
