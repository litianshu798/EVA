import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware({
    locales: routing.locales,
    defaultLocale: routing.defaultLocale,
    localePrefix: 'as-needed',
    localeDetection: true
});

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
