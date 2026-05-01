"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Copy, Gift, Link as LinkIcon, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface InvitedUser {
  uuid: string;
  email: string;
  nickname: string;
  avatar_url: string;
  created_at?: string;
  invited_at?: string;
}

export default function InvitesPage() {
  const t = useTranslations("Invites");
  const locale = useLocale();
  const router = useRouter();
  const { status } = useSession();
  const [inviteCode, setInviteCode] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const inviteUrl = useMemo(() => {
    if (!inviteCode || typeof window === "undefined") return "";

    return `${window.location.origin}/${locale}/login?invite=${inviteCode}`;
  }, [inviteCode, locale]);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      setIsLoading(false);
      return;
    }

    async function fetchInvites() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/invites");
        if (response.status === 401) {
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch invites");
        }

        const result = await response.json();
        setInviteCode(result.invite_code || "");
        setInvitedUsers(result.invited_users || []);
      } catch (error) {
        console.error("Failed to fetch invites:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInvites();
  }, [status]);

  async function copyText(value: string) {
    if (!value) return;

    await navigator.clipboard.writeText(value);
    toast.success(t("copied"));
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-gray-50">
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-700">
              <Gift className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              {t("loginRequired")}
            </h1>
            <Button
              className="mt-6 h-10 rounded-xl bg-gray-900 px-5 text-white"
              startContent={<LogIn className="h-4 w-4" />}
              onPress={() => router.push(`/${locale}/login`)}
            >
              {t("loginButton")}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            {t("subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-72 items-center justify-center rounded-2xl border border-gray-200 bg-white">
            <Spinner label={t("loading")} />
          </div>
        ) : (
          <>
            <section className="mb-8 grid gap-4 md:grid-cols-[280px_1fr]">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Gift className="h-4 w-4" />
                  {t("codeLabel")}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-2xl font-bold tracking-wider text-gray-900">
                    {inviteCode}
                  </span>
                  <Button
                    isIconOnly
                    className="rounded-xl bg-gray-100 text-gray-700"
                    onPress={() => copyText(inviteCode)}
                    aria-label={t("copy")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <LinkIcon className="h-4 w-4" />
                  {t("linkLabel")}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={inviteUrl}
                    readOnly
                    className="h-10 min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 font-mono text-xs text-gray-700 outline-none"
                  />
                  <Button
                    className="h-10 rounded-xl bg-gray-900 px-5 text-white"
                    startContent={<Copy className="h-4 w-4" />}
                    onPress={() => copyText(inviteUrl)}
                  >
                    {t("copy")}
                  </Button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("invitedTitle")}
                </h2>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                  {invitedUsers.length}
                </span>
              </div>

              {invitedUsers.length > 0 ? (
                <Table
                  aria-label="Invited users"
                  removeWrapper
                  classNames={{
                    th: "bg-gray-50 text-gray-600",
                    td: "text-gray-700",
                  }}
                >
                  <TableHeader>
                    <TableColumn>{t("table.user")}</TableColumn>
                    <TableColumn>{t("table.email")}</TableColumn>
                    <TableColumn>{t("table.registeredAt")}</TableColumn>
                    <TableColumn>{t("table.invitedAt")}</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {invitedUsers.map((invitedUser) => (
                      <TableRow key={invitedUser.uuid}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              size="sm"
                              name={invitedUser.nickname || invitedUser.email}
                              src={invitedUser.avatar_url}
                            />
                            <span className="font-medium text-gray-900">
                              {invitedUser.nickname || invitedUser.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{invitedUser.email}</TableCell>
                        <TableCell>
                          {invitedUser.created_at
                            ? new Date(invitedUser.created_at).toLocaleString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {invitedUser.invited_at
                            ? new Date(invitedUser.invited_at).toLocaleString()
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500">
                  {t("empty")}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
