"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import Prediction from "@/backend/type/domain/replicate";
import { useAppContext } from "@/contexts/app";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleApiErrors } from "@/components/replicate/common-logic/response";
import Output from "@/components/replicate/text-to-image/img-output";
import { UserSubscriptionInfo } from "@/backend/type/domain/user_subscription_info";
import CreditInfo from "@/components/landingpage/credit-info";
import { useLocale, useTranslations } from "next-intl";
import { ModelOption } from "@/components/replicate/model-option";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Worker(props: {
  model: string;
  effect_link_name: string;
  version: string | null;
  credit: number;
  promptTips?: string;
  defaultImage?: string;
  lang?: string;
  modelOptions?: ModelOption[];
  defaultModelId?: number;
}) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<string>("png");
  const [selectedModelId, setSelectedModelId] = useState<string>(
    props.defaultModelId?.toString() || props.modelOptions?.[0]?.id.toString() || ""
  );
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const width = 1024;
  const height = 1024;
  const [userSubscriptionInfo, setUserSubscriptionInfo] =
    useState<UserSubscriptionInfo | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const { user } = useAppContext();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations(props.lang || "index");
  const selectedModel =
    props.modelOptions?.find((option) => option.id.toString() === selectedModelId) ||
    props.modelOptions?.[0] || {
      id: props.defaultModelId || 0,
      name: props.model,
      model: props.model,
      version: props.version,
      link_name: props.effect_link_name,
      credit: props.credit,
      pre_prompt: "",
    };

  useEffect(() => {
    if (user?.uuid) {
      fetchUserSubscriptionInfo();
    }
  }, [user?.uuid]);

  const fetchUserSubscriptionInfo = async () => {
    if (!user?.uuid) return;
    const userSubscriptionInfo = await fetch(
      "/api/user/get_user_subscription_info",
      {
        method: "POST",
        body: JSON.stringify({ user_id: user.uuid }),
      }
    ).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch user subscription info");
      return res.json();
    });
    setUserSubscriptionInfo(userSubscriptionInfo);
    setIsSubscribed(userSubscriptionInfo.subscription_status === "active");
  };

  const handleGenerate = async () => {
    let newPrediction: Prediction;
    if (selectedModel.credit > 0) {
      if (
        typeof userSubscriptionInfo?.remain_count === "number" &&
        userSubscriptionInfo.remain_count < selectedModel.credit
      ) {
        toast.warning("No credit left");
        return;
      }
    }

    if (prompt.length === 0) {
      toast.warning("Please enter a prompt");
      return;
    }

    if (!user?.uuid) {
      toast.warning("Please login first");
      await sleep(1000);
      router.push(`/${locale}/login`);
      return;
    }

    try {
      setGenerating(true);
      const response = await fetch("/api/predictions/text_to_image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel.model,
          version: selectedModel.version,
          prompt,
          width,
          height,
          output_format: outputFormat,
          aspect_ratio: "custom",
          user_id: user?.uuid,
          user_email: user?.email,
          effect_link_name: selectedModel.link_name,
          credit: selectedModel.credit,
        }),
      });
      newPrediction = await response.json();
      const canContinue = await handleApiErrors({
        response,
        newPrediction,
        router,
      });
      if (!canContinue) return;
      setPrediction(newPrediction);
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("An error occurred while generating the image.");
      setGenerating(false);
      return;
    }

    while (
      newPrediction.status !== "succeeded" &&
      newPrediction.status !== "failed"
    ) {
      await sleep(1500);
      const response = await fetch("/api/predictions/" + newPrediction.id);
      newPrediction = await response.json();
      if (response.status !== 200) {
        setError(newPrediction.detail);
        return;
      }
      setPrediction(newPrediction);
    }

    const runningTime =
      (newPrediction.created_at
        ? new Date().getTime() - new Date(newPrediction.created_at).getTime()
        : -1) / 1000;
    fetch("/api/effect_result/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        original_id: newPrediction.id,
        status: newPrediction.status,
        running_time: runningTime,
        updated_at: new Date(),
        original_image_url: "",
        object_key: newPrediction.id.substring(0, 8),
      }),
    });
    await sleep(4000);
    setGenerating(false);
    fetchUserSubscriptionInfo();
  };

  const isZh = locale === "zh";

  return (
    <section className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(14,165,233,0.14),transparent_32%),radial-gradient(circle_at_85%_12%,rgba(244,114,182,0.12),transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)]" />

      <div className="relative grid gap-6 p-4 md:grid-cols-[1.05fr_0.95fr] md:p-8 lg:p-10">
        <div className="rounded-3xl border border-gray-200 bg-white/90 p-5 shadow-xl backdrop-blur md:p-7">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-gray-950 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white">
                AI Image Studio
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-950 md:text-5xl">
                {t("top.subTitle")}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                {t("top.description")}
              </p>
            </div>
            <CreditInfo credit={userSubscriptionInfo?.remain_count?.toString() || ""} />
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_150px]">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
                Model
              </label>
              <select
                aria-label="Model"
                value={selectedModelId}
                onChange={(event) => setSelectedModelId(event.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors hover:border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              >
                {(props.modelOptions || [selectedModel]).map((option) => (
                  <option key={option.id.toString()} value={option.id.toString()}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
                Format
              </label>
              <select
                aria-label="Output Format"
                value={outputFormat}
                onChange={(event) => setOutputFormat(event.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors hover:border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              >
                <option value="webp">WEBP</option>
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </div>
          </div>

          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
            Prompt
          </label>
          <textarea
            placeholder={props.promptTips || "Describe the product image you want to generate..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            aria-label="Prompt(提示词)"
            className="min-h-[260px] w-full resize-none rounded-3xl border border-gray-200 bg-gray-50 px-5 py-5 text-base leading-7 text-gray-950 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              {(isZh
                ? ["电商白底", "详情页卖点", "场景海报", "促销 Banner"]
                : ["White shot", "PDP detail", "Lifestyle poster", "Promo banner"]
              ).map((tag) => (
                <span key={tag} className="rounded-full bg-gray-100 px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
            <Button
              isLoading={generating}
              className="h-12 rounded-xl bg-gray-950 px-8 text-sm font-semibold text-white hover:bg-gray-800"
              onClick={handleGenerate}
            >
              {generating ? prediction?.status || "Processing..." : "Generate Image"}
              {!generating && (
                <span className="ml-2 text-white/55">
                  {selectedModel.credit} credit
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/75 p-4 shadow-xl backdrop-blur">
          <Output
            error={error || ""}
            prediction={prediction}
            defaultImage={props.defaultImage || ""}
            showImage={null}
          />
        </div>
      </div>
    </section>
  );
}
