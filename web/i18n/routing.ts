import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru', 'id', 'th', 'vi', 'pt'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});
