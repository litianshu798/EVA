"use client";

import { toast } from "sonner";

interface ErrorHandlingParams {
  response: Response;
  newPrediction: any;
  router: any;
}

export const handleApiErrors = async ({
  response,
  newPrediction,
  router,
}: ErrorHandlingParams): Promise<boolean> => {
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const copy = ERROR_COPY[getLocale()];

  if (response.status === 401) {
    toast.error(copy.login);
    await sleep(1000);
    router.push(getLoginPath());
    return false;
  }

  if (response.status === 402) {
    toast.error(copy.credit);
    await sleep(1000);
    router.push("/pricing");
    return false;
  }

  if (response.status === 403) {
    toast.error(copy.monthlyLimit);
    await sleep(1000);
    return false;
  }

  if (response.status !== 201) {
    toast.error(
      newPrediction.detail ||
      copy.generate
    );
    return false;
  }

  return true;
};

function getLoginPath() {
  if (typeof window === "undefined") return "/login";

  const locale = getLocale();
  if (locale === "zh" || locale === "en" || locale === "pt") {
    return `/${locale}/login`;
  }

  return "/login";
}

function getLocale() {
  if (typeof window === "undefined") return "en";
  const locale = window.location.pathname.split("/")[1];
  return locale === "zh" || locale === "pt" ? locale : "en";
}

const ERROR_COPY = {
  zh: {
    login: "请先登录。",
    credit: "积分不足，请购买积分或订阅套餐。",
    monthlyLimit: "当前月度积分用量已超出限制。",
    generate: "生成时出错，请稍后再试。",
  },
  en: {
    login: "Please login first.",
    credit: "Your credit is not enough, please purchase credits or subscribe one plan.",
    monthlyLimit: "Your current monthly credit usage is exceeded.",
    generate: "An error occurred while generating.",
  },
  pt: {
    login: "Faça login primeiro.",
    credit: "Créditos insuficientes. Compre créditos ou assine um plano.",
    monthlyLimit: "Seu limite mensal de créditos foi excedido.",
    generate: "Ocorreu um erro durante a geração.",
  },
} as const;
