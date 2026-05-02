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
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
        {label}
      </span>
      <span className="flex h-12 items-center rounded-xl border border-white/10 bg-white/[0.07] px-3 transition-colors focus-within:border-white/55 focus-within:ring-2 focus-within:ring-white/10">
        <Icon className="mr-3 h-4 w-4 flex-shrink-0 text-white/38" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          minLength={minLength}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
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
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gray-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(245,158,11,0.14),transparent_28%),linear-gradient(135deg,#020617,#111827_55%,#030712)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center justify-center px-4 py-10 md:px-8">
        <section className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur md:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden border-r border-white/10 bg-white/[0.04] p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <img
                  src="/logo.jpeg"
                  alt="gptimage"
                  className="h-10 w-10 rounded-lg"
                />
                <div>
                  <p className="text-lg font-semibold leading-tight">gptimage</p>
                  <p className="text-xs text-white/45">AI Commerce Studio</p>
                </div>
              </div>
              <h1 className="max-w-xs text-3xl font-bold leading-tight">
                {t("title")}
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/58">
                {t("subtitle")}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  "Product images",
                  "Vertical videos",
                  "Invite rewards",
                  "Secure checkout",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/70"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="h-32 overflow-hidden rounded-2xl border border-white/10">
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

          <div className="p-5 text-white sm:p-8 md:p-10">
            <div className="mb-7 md:hidden">
              <div className="mb-5 flex items-center gap-3">
                <img
                  src="/logo.jpeg"
                  alt="gptimage"
                  className="h-10 w-10 rounded-lg"
                />
                <div>
                  <p className="text-lg font-semibold leading-tight text-white">
                    gptimage
                  </p>
                  <p className="text-xs text-white/45">AI Commerce Studio</p>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white">
                {t("title")}
              </h1>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {t("subtitle")}
              </p>
            </div>

            <Tabs
              selectedKey={mode}
              onSelectionChange={(key) => setMode(String(key) as AuthMode)}
              aria-label="Auth mode"
              classNames={{
                tabList: "w-full bg-white/10 p-1 rounded-xl",
                cursor: "bg-white shadow-sm rounded-lg",
                tab: "h-10 text-sm",
                tabContent:
                  "group-data-[selected=true]:text-gray-950 group-data-[selected=false]:text-white/60",
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
                    className="ml-2 rounded-md p-1 text-white/40 transition-colors hover:text-white"
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
                className="h-12 w-full rounded-xl bg-white text-sm font-semibold text-gray-950 hover:bg-white/90"
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
