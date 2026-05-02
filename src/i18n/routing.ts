import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    locales: ['zh', 'en', 'pt'],
    defaultLocale: 'en',
});

export const localesName: Record<string, string> = {
    zh: '中文',
    en: 'English',
    pt: 'Português',
}

export const { Link, redirect, usePathname, useRouter} =
    createSharedPathnamesNavigation(routing);
