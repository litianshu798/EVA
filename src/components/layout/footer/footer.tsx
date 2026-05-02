import React from "react";
import { Divider, Link } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { getDomain } from "@/config/domain";

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations("Footer");

  const domain = getDomain();

  const footerNavigation = {
    supportOptions: [
      {
        name: t("recommend.item.item1"),
        href: `${domain}/${locale}`,
      },
    ],
    multiLanguage: [
      { name: "中文", href: `${domain}/zh` },
      { name: "English", href: `${domain}/en` },
      { name: "Português", href: `${domain}/pt` },
    ],

    legal: [
      { name: t("legal.item.item1"), href: "/legal/privacy-policy" },
      { name: t("legal.item.item2"), href: "/legal/terms-of-service" },
      { name: "Partners", href: "/partners" },
    ],
    social: [
      { name: "Facebook", href: "#", icon: "fontisto:facebook" },
      { name: "Instagram", href: "#", icon: "fontisto:instagram" },
      { name: "Twitter", href: "#", icon: "fontisto:twitter" },
      { name: "GitHub", href: "#", icon: "fontisto:github" },
    ],
  };

  return (
    <footer className="flex w-full flex-col items-center border-t border-white/10 bg-gray-950">
      <div className="max-w-7xl w-full px-6 pb-10 pt-16 lg:px-8 text-white/55 mx-auto">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4 md:pr-8">
            <div className="flex items-center justify-center xl:justify-start gap-2">
              <img
                src="/logo.jpeg"
                alt="gptimage"
                className="w-7 h-7 rounded-md"
                loading="lazy"
              />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold text-white">gptimage</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">AI Commerce Studio</span>
              </div>
            </div>
            <p className="text-sm text-white/45 text-center xl:text-left leading-relaxed">
              {t("description")}
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-4 md:gap-8">
              <div className="mt-10 md:mt-0">
                <p className="text-xs font-semibold text-white uppercase tracking-wider text-center xl:text-left mb-4">
                  {t("recommend.title")}
                </p>
                <ul className="space-y-3">
                  {footerNavigation.supportOptions.map((item) => (
                    <li key={item.name} className="text-center xl:text-left">
                      <Link
                        className="text-sm text-white/45 hover:text-white transition-colors"
                        href={item.href}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <p className="text-xs font-semibold text-white uppercase tracking-wider text-center xl:text-left mb-4">
                  {t("multiLanguage.title")}
                </p>
                <ul className="space-y-3">
                  {footerNavigation.multiLanguage.map((item) => (
                    <li key={item.name} className="text-center xl:text-left">
                      <Link
                        className="text-sm text-white/45 hover:text-white transition-colors"
                        href={item.href}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <p className="text-xs font-semibold text-white uppercase tracking-wider text-center xl:text-left mb-4">
                  {t("legal.title")}
                </p>
                <ul className="space-y-3">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name} className="text-center xl:text-left">
                      <Link
                        className="text-sm text-white/45 hover:text-white transition-colors"
                        href={item.href}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <p className="text-xs font-semibold text-white uppercase tracking-wider text-center xl:text-left mb-4">
                  {t("contact.title")}
                </p>
                <ul className="space-y-3">
                  <li className="text-center xl:text-left">
                    <Link
                      href={`mailto:support@8ilx.com`}
                      className="text-sm text-white/45 hover:text-white transition-colors inline-flex items-center gap-1.5"
                    >
                      <Icon icon="mdi:email" className="w-4 h-4" />
                      support@8ilx.com
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Divider className="mt-12 bg-white/10" />
        <div className="flex justify-center pt-8">
          <p className="text-xs text-gray-400">
            &copy; 2025 gptimage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
