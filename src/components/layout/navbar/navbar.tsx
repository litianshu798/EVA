"use client";

import type { NavbarProps } from "@nextui-org/react";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  cn,
} from "@nextui-org/react";
import { Menu, X } from "lucide-react";
import Locales from "../../locales";
import { useLocale } from "next-intl";
import LoginButton from "@/components/button/login-button";
import UserButton from "../../button/user-button";
import { useAppContext } from "@/contexts/app";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const BasicNavbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ classNames = {}, ...props }, ref) => {
    const { data: session } = useSession();
    const locale = useLocale();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { user, setUser } = useAppContext();
    const [activeTag, setActiveTag] = useState("home");
    const pathname = usePathname();
    const t = useTranslations("Nav");

    useEffect(() => {
      if (session && session.user) {
        setUser(session.user);
      }
      if (pathname.endsWith("/")) {
        setActiveTag("home");
      } else if (pathname.includes("text-to-image")) {
        setActiveTag("text-to-image");
      } else if (pathname.includes("pricing")) {
        setActiveTag("pricing");
      }
    }, [pathname, session, setUser]);

    const handleTagClick = (tag: string) => {
      setActiveTag(tag);
      setIsMenuOpen(false);
    };

    return (
      <Navbar
        ref={ref}
        {...props}
        classNames={{
          base: cn("border-b border-white/10 bg-gray-950/90 backdrop-blur-sm text-white"),
          wrapper:
            "w-full max-w-7xl lg:px-0 justify-center md:h-[72px] h-[60px]",
          item: "md:flex",
          ...classNames,
        }}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarBrand>
          <img
            src="/logo.jpeg"
            alt="gptimage"
            className="w-8 h-8 md:w-9 md:h-9 mr-2.5 rounded-md"
            loading="lazy"
          />
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-base font-bold text-white tracking-tight">gptimage</span>
            <span className="text-[10px] text-white/40 tracking-widest uppercase font-medium">AI Commerce Studio</span>
          </div>
        </NavbarBrand>

        <NavbarContent className="hidden md:flex" justify="center">
          <NavbarItem onClick={() => handleTagClick("home")}>
            <Link
              aria-current="page"
              className={cn(
                "text-sm mx-4 transition-colors duration-200",
                activeTag === "home"
                  ? "text-white font-semibold"
                  : "text-white/50 hover:text-white"
              )}
              href={`/${locale}`}
              size="md"
            >
              {t("home")}
            </Link>
          </NavbarItem>
          <NavbarItem onClick={() => handleTagClick("text-to-image")}>
            <Link
              className={cn(
                "text-sm mx-4 transition-colors duration-200",
                activeTag === "text-to-image"
                  ? "text-white font-semibold"
                  : "text-white/50 hover:text-white"
              )}
              href={`/${locale}/text-to-image`}
              size="md"
            >
              {t("text-to-image")}
            </Link>
          </NavbarItem>
          <NavbarItem onClick={() => handleTagClick("pricing")}>
            <Link
              className={cn(
                "text-sm mx-4 transition-colors duration-200",
                activeTag === "pricing"
                  ? "text-white font-semibold"
                  : "text-white/50 hover:text-white"
              )}
              href={`/${locale}/pricing`}
              size="md"
            >
              {t("pricing")}
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent
          className="hidden md:flex justify-center items-center"
          justify="end"
        >
          <Locales />
          {user ? (
            <div className="flex flex-row gap-3 items-center">
              <a
                href={`/${locale}/dashboard`}
                className="text-sm text-white/50 hover:text-white transition-colors duration-200 mr-2"
              >
                My Creations
              </a>
              <UserButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </NavbarContent>

        <NavbarContent className="flex basis-auto gap-2 md:hidden" justify="end">
          <Locales />
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white transition-colors hover:bg-white/10"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </NavbarContent>

        <NavbarMenu
          className="top-[calc(var(--navbar-height)_-_1px)] max-h-[calc(100dvh-var(--navbar-height))] bg-gray-950 pb-6 pt-6 shadow-2xl border-t border-white/10"
          motionProps={{
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            transition: {
              ease: "easeOut",
              duration: 0.15,
            },
          }}
        >
          <div className="flex w-full flex-col gap-2 px-6">
            {[
              { tag: "home", path: "" },
              { tag: "text-to-image", path: "text-to-image" },
              { tag: "pricing", path: "pricing" },
            ].map(({ tag, path }) => (
              <NavbarMenuItem
                key={tag}
                className="w-full"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleTagClick(tag);
                }}
              >
                <Link
                  className={cn(
                    "py-2 block text-sm",
                    activeTag === tag
                      ? "text-white font-semibold"
                      : "text-white/55"
                  )}
                  href={`/${locale}/${path}`}
                  size="lg"
                >
                  {t(tag)}
                </Link>
              </NavbarMenuItem>
            ))}

            <div className="pt-4 border-t border-white/10 mt-2">
              <a
                href={`/${locale}/dashboard`}
                className="block py-2 text-sm text-white/55 hover:text-white transition-colors"
              >
                My Creations
              </a>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              {user ? <UserButton /> : <LoginButton />}
            </div>
          </div>
        </NavbarMenu>
      </Navbar>
    );
  }
);

BasicNavbar.displayName = "BasicNavbar";

export default BasicNavbar;
