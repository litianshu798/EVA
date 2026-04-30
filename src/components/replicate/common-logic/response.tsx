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

  if (response.status === 401) {
    toast.error("Please login first.");
    await sleep(1000);
    router.push(getLoginPath());
    return false;
  }

  if (response.status === 402) {
    toast.error("Your credit is not enough, please purchase credits or subscribe one plan.");
    await sleep(1000);
    router.push("/pricing");
    return false;
  }

  if (response.status === 403) {
    toast.error("Your current monthly credit usage is exceeded");
    await sleep(1000);
    return false;
  }

  if (response.status !== 201) {
    toast.error(
      newPrediction.detail ||
      "An error occurred while generating the image."
    );
    return false;
  }

  return true;
};

function getLoginPath() {
  if (typeof window === "undefined") return "/login";

  const locale = window.location.pathname.split("/")[1];
  if (locale === "zh" || locale === "en") {
    return `/${locale}/login`;
  }

  return "/login";
}
