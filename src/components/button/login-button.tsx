"use client";

import { Button } from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function () {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();

  return (
    <Button
      className="rounded-full bg-white px-5 font-medium capitalize text-gray-950"
      onClick={() => router.push(`/${locale}/login`)}
    >
      {t("login")}
    </Button>
  );
}
