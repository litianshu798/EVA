import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
});

export const localesName: Record<string, string> = {
    zh: '中文',
    en: 'English',
}

export const { Link, redirect, usePathname, useRouter} =
    createSharedPathnamesNavigation(routing);
