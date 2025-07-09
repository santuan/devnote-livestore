import { useStorage } from '@vueuse/core'
import { createI18n } from 'vue-i18n'
import de from './locales/de.json'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import ja from './locales/ja.json'
import ru from './locales/ru.json'
import zh from './locales/zh.json' // Import the Chinese translation

const locale = useStorage('locale', 'es')

export const i18n = createI18n({
  legacy: false,
  locale: locale.value,
  fallbackLocale: 'en',
  messages: {
    de,
    en,
    es,
    fr,
    ja,
    ru,
    zh, // Add zh to the messages object
  },
})
