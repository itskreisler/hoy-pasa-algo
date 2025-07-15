import { createI18n } from '@kreisler/i18n'
import { es } from '@src/i18n/langs/es'

export const { getAvailableLocales, getDefaultLocale, useTranslations } = createI18n({
    defaultLocale: 'es',
    messages: { es }
})

export const i18n = (locale = getDefaultLocale()) => useTranslations(locale)
export const t = useTranslations(getDefaultLocale())
