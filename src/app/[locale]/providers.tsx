// app/[locale]/providers.tsx
'use client'

import { I18nProviderClient } from '../../../locales/client'
import { PropsWithChildren } from 'react'

export function Providers({ 
  children, 
  locale 
}: PropsWithChildren<{ locale: string }>) {
  // Validation supplémentaire côté client
  const validLocales = ['en', 'fr', 'de', 'es', 'pt'];
  const safeLocale = validLocales.includes(locale) ? locale : 'fr';
  
  return (
    <I18nProviderClient locale={safeLocale}>
      {children}
    </I18nProviderClient>
  )
}