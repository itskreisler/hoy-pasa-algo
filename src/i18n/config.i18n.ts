import es from '@src/i18n/langs/es'
import { createI18n } from '@src/i18n/i18n'

export const i18n = createI18n({
    defaultLocale: 'es',
    messages: {
        es
    }
})

export const t = i18n.useTranslations('es')
