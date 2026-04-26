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
  NavbarMenuToggle,
  Link,
  cn,
} from "@nextui-org/react";
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
          base: cn("border-b border-gray-100 bg-white/95 backdrop-blur-sm text-gray-900"),
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
            alt="EVA"
            className="w-8 h-8 md:w-9 md:h-9 mr-2.5 rounded-md"
            loading="lazy"
          />
          <div className="hidden lg:flex flex-col leading-none">
            <span className="text-base font-bold text-gray-900 tracking-tight">EVA</span>
            <span className="text-[10px] text-gray-400 tracking-widest uppercase font-medium">E-Commerce AI</span>
          </div>
        </NavbarBrand>

        <NavbarContent className="hidden md:flex" justify="center">
          <NavbarItem onClick={() => handleTagClick("home")}>
            <Link
              aria-current="page"
              className={cn(
                "text-sm mx-4 transition-colors duration-200",
                activeTag === "home"
                  ? "text-gray-900 font-semibold"
                  : "text-gray-500 hover:text-gray-900"
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
                  ? "text-gray-900 font-semibold"
                  : "text-gray-500 hover:text-gray-900"
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
                  ? "text-gray-900 font-semibold"
                  : "text-gray-500 hover:text-gray-900"
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
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 mr-2"
              >
                My Creations
              </a>
              <UserButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </NavbarContent>

        <NavbarMenuToggle className="text-gray-700 md:hidden" />

        <NavbarMenu
          className="top-[calc(var(--navbar-height)_-_1px)] max-h-fit bg-white pb-6 pt-6 shadow-sm border-t border-gray-100"
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
          <div className="flex flex-col w-full px-6 gap-1">
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
                      ? "text-gray-900 font-semibold"
                      : "text-gray-500"
                  )}
                  href={`/${locale}/${path}`}
                  size="lg"
                >
                  {t(tag)}
                </Link>
              </NavbarMenuItem>
            ))}

            <div className="pt-4 border-t border-gray-100 mt-2">
              <a
                href={`/${locale}/dashboard`}
                className="block py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                My Creations
              </a>
            </div>
            <div className="mt-3">
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
