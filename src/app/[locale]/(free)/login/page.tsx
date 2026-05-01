"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Button,
  Input,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { Eye, EyeOff, Gift, Lock, Mail, User } from "lucide-react";
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
              <Input
                type="email"
                label={t("email")}
                labelPlacement="outside"
                variant="bordered"
                radius="lg"
                placeholder={t("emailPlaceholder")}
                value={email}
                onValueChange={setEmail}
                startContent={<Mail className="h-4 w-4 text-gray-400" />}
                classNames={{
                  label: "text-xs font-medium uppercase tracking-wider text-gray-500",
                  inputWrapper: "h-12 bg-white border-gray-200 hover:border-gray-300",
                }}
                isRequired
              />

              {mode === "register" && (
                <Input
                  label={t("nickname")}
                  labelPlacement="outside"
                  variant="bordered"
                  radius="lg"
                  placeholder={t("nicknamePlaceholder")}
                  value={nickname}
                  onValueChange={setNickname}
                  startContent={<User className="h-4 w-4 text-gray-400" />}
                  classNames={{
                    label: "text-xs font-medium uppercase tracking-wider text-gray-500",
                    inputWrapper: "h-12 bg-white border-gray-200 hover:border-gray-300",
                  }}
                />
              )}

              <Input
                type={showPassword ? "text" : "password"}
                label={t("password")}
                labelPlacement="outside"
                variant="bordered"
                radius="lg"
                placeholder={t("passwordPlaceholder")}
                value={password}
                onValueChange={setPassword}
                startContent={<Lock className="h-4 w-4 text-gray-400" />}
                endContent={
                  <button
                    type="button"
                    className="rounded-md p-1 text-gray-400 transition-colors hover:text-gray-700"
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
                minLength={8}
                classNames={{
                  label: "text-xs font-medium uppercase tracking-wider text-gray-500",
                  inputWrapper: "h-12 bg-white border-gray-200 hover:border-gray-300",
                }}
                isRequired
              />

              {mode === "register" && (
                <Input
                  label={t("inviteCodeOptional")}
                  labelPlacement="outside"
                  variant="bordered"
                  radius="lg"
                  placeholder={t("invitePlaceholder")}
                  value={inviteCode}
                  onValueChange={(value) => setInviteCode(value.toUpperCase())}
                  startContent={<Gift className="h-4 w-4 text-gray-400" />}
                  classNames={{
                    label: "text-xs font-medium uppercase tracking-wider text-gray-500",
                    inputWrapper: "h-12 bg-white border-gray-200 hover:border-gray-300",
                  }}
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
