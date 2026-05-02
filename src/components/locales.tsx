import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import type { Selection } from "@nextui-org/react";
import React from "react";
import { localesName } from "@/i18n/routing";
import { Icon } from "@iconify/react";

export default function Locales() {
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set(["text"]));
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const changeLanguage = (selectedLocale: string) => {
        if (selectedLocale !== locale) {
            let newPathName = pathname.replace(`/${locale}`, '');
            if (!newPathName.startsWith('/')) {
                newPathName = '/' + newPathName;
            }
            router.push(newPathName, { locale: selectedLocale as any });
        }
    };

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    variant="light"
                    aria-label="Change language"
                    className="h-10 min-w-0 gap-1 rounded-xl border border-white/10 bg-white/[0.06] px-2 text-sm text-white/60 hover:bg-white/10 hover:text-white md:border-0 md:bg-transparent"
                    startContent={<Icon icon="solar:global-linear" className="w-4 h-4 text-white/45" />}
                >
                    <span className="hidden sm:inline">
                        {localesName[locale] || locale.toUpperCase()}
                    </span>
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                className="min-w-[120px]"
            >
                {Object.keys(localesName).map((item) => (
                    <DropdownItem
                        key={item}
                        onClick={() => changeLanguage(item)}
                        className={`text-sm ${item === locale ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
                    >
                        {localesName[item]}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
}
