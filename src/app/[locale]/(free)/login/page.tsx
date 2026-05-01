"use client";

import type { ReactNode } from "react";
import { FormEvent, useEffect, useState } from "react";
import {
  Button,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { Eye, EyeOff, Gift, Lock, LucideIcon, Mail, User } from "lucide-react";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type AuthMode = "login" | "register";

const authErrorMessageKey: Record<string, string> = {
  INVALID_INVITE_CODE: "invalidInviteCode",
  EMAIL_EXISTS: "emailExists",
  WEAK_PASSWORD: "weakPassword",
  SELF_INVITE_NOT_ALLOWED: "selfInvite",
};

function AuthField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  required,
  minLength,
  endContent,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  required?: boolean;
  minLength?: number;
  endContent?: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <span className="flex h-12 items-center rounded-xl border border-gray-200 bg-white px-3 transition-colors focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10">
        <Icon className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          minLength={minLength}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
        {endContent}
      </span>
    </label>
  );
}

export default function LoginPage() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("invite");

    if (code) {
      setInviteCode(code.toUpperCase());
      setMode("register");
    }
  }, []);

  const dashboardPath = `/${locale}/dashboard`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            nickname,
            invite_code: inviteCode,
          }),
        });
        const result = await response.json();

        if (!response.ok) {
          const key = authErrorMessageKey[result.code] || "registerFailed";
          toast.error(t(key));
          return;
        }

        toast.success(t("registerSuccess"));
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!signInResult?.ok) {
        toast.error(t("loginFailed"));
        return;
      }

      toast.success(t("loginSuccess"));
      router.push(dashboardPath);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-gray-50">
      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center justify-center px-4 py-10 md:px-8">
        <section className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden bg-gray-900 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <img
                  src="/logo.jpeg"
                  alt="EVA"
                  className="h-10 w-10 rounded-lg"
                />
                <div>
                  <p className="text-lg font-semibold leading-tight">EVA</p>
                  <p className="text-xs text-gray-400">E-Commerce AI</p>
                </div>
              </div>
              <h1 className="max-w-xs text-3xl font-bold leading-tight">
                {t("title")}
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-gray-300">
                {t("subtitle")}
              </p>
            </div>
            <div className="h-28 overflow-hidden rounded-xl border border-white/10">
              <video
                src="/bg2.mp4"
                className="h-full w-full object-cover opacity-80"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>

          <div className="p-5 sm:p-8 md:p-10">
            <div className="mb-7 md:hidden">
              <div className="mb-5 flex items-center gap-3">
                <img
                  src="/logo.jpeg"
                  alt="EVA"
                  className="h-10 w-10 rounded-lg"
                />
                <div>
                  <p className="text-lg font-semibold leading-tight text-gray-900">
                    EVA
                  </p>
                  <p className="text-xs text-gray-500">E-Commerce AI</p>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("title")}
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {t("subtitle")}
              </p>
            </div>

            <Tabs
              selectedKey={mode}
              onSelectionChange={(key) => setMode(String(key) as AuthMode)}
              aria-label="Auth mode"
              classNames={{
                tabList: "w-full bg-gray-100 p-1 rounded-xl",
                cursor: "bg-white shadow-sm rounded-lg",
                tab: "h-10 text-sm",
              }}
            >
              <Tab key="login" title={t("loginTab")} />
              <Tab key="register" title={t("registerTab")} />
            </Tabs>

            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <AuthField
                type="email"
                label={t("email")}
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={setEmail}
                icon={Mail}
                required
              />

              {mode === "register" && (
                <AuthField
                  label={t("nickname")}
                  placeholder={t("nicknamePlaceholder")}
                  value={nickname}
                  onChange={setNickname}
                  icon={User}
                />
              )}

              <AuthField
                type={showPassword ? "text" : "password"}
                label={t("password")}
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={setPassword}
                icon={Lock}
                minLength={8}
                required
                endContent={
                  <button
                    type="button"
                    className="ml-2 rounded-md p-1 text-gray-400 transition-colors hover:text-gray-700"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />

              {mode === "register" && (
                <AuthField
                  label={t("inviteCodeOptional")}
                  placeholder={t("invitePlaceholder")}
                  value={inviteCode}
                  onChange={(value) => setInviteCode(value.toUpperCase())}
                  icon={Gift}
                />
              )}

              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-gray-900 text-sm font-medium text-white"
                isLoading={isSubmitting}
              >
                {mode === "login" ? t("signIn") : t("register")}
              </Button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
