
// locales/server.ts
import { createI18nServer } from 'next-international/server'
 
export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer({
  en: () => import('./en'),
  fr: () => import('./fr'),
  de: () => import('./de'),
  es: () => import('./es'),
  pt: () => import('./pt'),
})
