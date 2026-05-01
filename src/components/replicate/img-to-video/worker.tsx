"use client";

import React, { useEffect, useState } from "react";
import { Button, CircularProgress } from "@nextui-org/react";
import Prediction from "@/backend/type/domain/replicate";
import { useAppContext } from "@/contexts/app";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { UserSubscriptionInfo } from "@/backend/type/domain/user_subscription_info";
import DeleteButton from "@/components/button/delete-button";
import { handleApiErrors } from "@/components/replicate/common-logic/response";
import { useRouter } from "next/navigation";
import CreditInfo from "@/components/landingpage/credit-info";
import { ModelOption } from "@/components/replicate/model-option";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Worker(props: {
  lang: string;
  credit: number;
  prompt: string;
  model: string;
  version: string;
  effect_link_name: string;
  promotion: string;
  modelOptions?: ModelOption[];
  defaultModelId?: number;
}) {
  const t = useTranslations(props.lang);
  const [selectedModelId, setSelectedModelId] = useState<string>(
    props.defaultModelId?.toString() || props.modelOptions?.[0]?.id.toString() || ""
  );
  const [prompt, setPrompt] = useState(props.prompt);
  const [generating, setGenerating] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const [userSubscriptionInfo, setUserSubscriptionInfo] =
    useState<UserSubscriptionInfo | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const { user } = useAppContext();
  const selectedModel =
    props.modelOptions?.find((option) => option.id.toString() === selectedModelId) ||
    props.modelOptions?.[0] || {
      id: props.defaultModelId || 0,
      name: props.model,
      model: props.model,
      version: props.version,
      link_name: props.effect_link_name,
      credit: props.credit,
      pre_prompt: props.prompt || "",
    };

  useEffect(() => {
    if (selectedModel.pre_prompt) {
      setPrompt(selectedModel.pre_prompt);
    }
  }, [selectedModel.id, selectedModel.pre_prompt]);

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

  const convertImageToFile = async (): Promise<File | null> => {
    if (!image) {
      toast.warning("Please upload a photo");
      return null;
    }
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      return new File([blob], "input.jpg", { type: "image/jpeg" });
    } catch (error) {
      console.error("Error converting image:", error);
      return null;
    }
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

    if (user === undefined || user === null) {
      toast.warning("Please login first");
      await sleep(1000);
      router.push(`/${locale}/login`);
      return;
    }

    try {
      setGenerating(true);
      setError(null);

      const imageFile = await convertImageToFile();
      if (!imageFile) {
        setGenerating(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("model", selectedModel.model);
      formData.append("user_id", user?.uuid || "");
      formData.append("user_email", user?.email || "");
      formData.append("effect_link_name", selectedModel.link_name);
      formData.append("prompt", prompt);
      formData.append("credit", selectedModel.credit.toString());

      if (prompt === "" || prompt === null || prompt === undefined) {
        toast.warning("Please enter a prompt");
        setGenerating(false);
        return;
      }
      const response = await fetch("/api/predictions/img_to_video", {
        method: "POST",
        body: formData,
      });

      newPrediction = await response.json();
      const canContinue = await handleApiErrors({
        response,
        newPrediction,
        router,
      });
      if (!canContinue) {
        setGenerating(false);
        return;
      }
      setPrediction(newPrediction);
    } catch (error) {
      console.error("Error occurred, please try again", error);
      toast.error("An error occurred, please try again");
      setGenerating(false);
      return;
    }

    while (
      newPrediction.status !== "succeeded" &&
      newPrediction.status !== "failed"
    ) {
      await sleep(5000);
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        original_id: newPrediction.id,
        status: newPrediction.status,
        running_time: runningTime,
        updated_at: new Date(),
        original_image_url: "",
        object_key: newPrediction.id,
      }),
    });
    await sleep(4000);
    setGenerating(false);
    fetchUserSubscriptionInfo();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
  };

  const isZh = locale === "zh";

  return (
    <section className="relative w-full overflow-hidden border-b border-white/10 bg-gray-950 shadow-2xl">
      <div className="absolute inset-0">
        <video
          src="/bg.mp4"
          className="h-full w-full object-cover opacity-35"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.22),transparent_35%),linear-gradient(135deg,rgba(2,6,23,0.92),rgba(17,24,39,0.78)_55%,rgba(0,0,0,0.9))]" />
      </div>

      <div className="relative grid gap-6 p-4 md:grid-cols-[1.08fr_0.92fr] md:p-8 lg:p-10 xl:p-12">
        <div className="rounded-3xl border border-white/10 bg-gray-900/88 p-5 text-white shadow-2xl backdrop-blur md:p-7">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-gray-950 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white">
                AI Video Studio
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                {isZh ? "上传商品图，生成竖版带货视频" : "Upload a product image. Generate vertical commerce video."}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
                {isZh
                  ? "适合详情页、短视频、广告首屏和新品上架，把产品静图转成更有购买欲的动态素材。"
                  : "Built for PDPs, short-form ads, launch pages, and social commerce motion assets."}
              </p>
            </div>
            <CreditInfo credit={userSubscriptionInfo?.remain_count?.toString() || ""} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
            <label className="relative flex min-h-[310px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/[0.06] transition-colors hover:bg-white/[0.09]">
              {image ? (
                <div className="relative h-full min-h-[310px] w-full">
                  <img
                    src={image}
                    alt="Uploaded"
                    className="h-full w-full object-contain"
                  />
                  <DeleteButton onClick={handleDeleteImage} />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 p-5 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-950">
                    +
                  </div>
                  <span className="text-sm font-medium text-white">
                    {t("input.upload-tips")}
                  </span>
                  <span className="text-xs leading-5 text-white/45">
                    {isZh ? "建议上传清晰商品主图" : "Use a clean product hero image"}
                  </span>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </label>

            <div className="flex min-h-[310px] flex-col">
              <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_120px]">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
                    Model
                  </label>
                  <select
                    aria-label="Model"
                    value={selectedModelId}
                    onChange={(event) => setSelectedModelId(event.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white outline-none transition-colors hover:border-white/25 focus:border-white/60 focus:ring-2 focus:ring-white/10"
                  >
                    {(props.modelOptions || [selectedModel]).map((option) => (
                      <option key={option.id.toString()} value={option.id.toString()}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
                    Ratio
                  </label>
                  <div className="flex h-11 items-center rounded-xl border border-white/10 bg-white/10 px-3 text-sm font-medium text-white/75">
                    9:16
                  </div>
                </div>
              </div>

              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
                Prompt
              </label>
              <textarea
                className="min-h-[170px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-4 text-sm leading-6 text-white outline-none transition-colors placeholder:text-white/35 hover:border-white/25 focus:border-white/60 focus:ring-2 focus:ring-white/10"
                placeholder={t("input.promptTips")}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <Button
                isLoading={generating}
                className="mt-4 h-12 w-full rounded-xl bg-white text-sm font-semibold text-gray-950 hover:bg-white/90"
                onClick={handleGenerate}
              >
                {generating
                  ? prediction?.status || "Processing..."
                  : t("input.createButton")}
                {!generating && (
                  <span className="ml-2 text-white/55">
                    {selectedModel.credit} credit
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex min-h-[560px] items-center justify-center rounded-3xl border border-white/15 bg-white/[0.07] p-5 backdrop-blur-md">
        {error && (
          <div className="flex justify-center items-center text-red-500 text-sm">
            {error}
          </div>
        )}
        {prediction ? (
          <>
            {prediction.output ? (
              <div className="relative mx-auto aspect-[9/16] h-full max-h-[600px] overflow-hidden rounded-[34px] border-[10px] border-gray-950 bg-gray-950 shadow-2xl">
                <video src={prediction.output} className="h-full w-full object-cover" controls />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    className="bg-gray-900/80 backdrop-blur-sm text-white text-sm rounded-lg px-4 py-2 border-0"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = prediction.output || "";
                      link.setAttribute("download", "");
                      link.setAttribute("target", "_blank");
                      link.click();
                    }}
                  >
                    {t("output.downloadButton")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-[34px] border border-dashed border-white/15 bg-gray-950/50">
                <CircularProgress
                  color="primary"
                  aria-label="Loading..."
                  classNames={{ svg: "text-white" }}
                />
                <span className="text-xs font-medium capitalize text-white/60">
                  {prediction.status}
                </span>
                <span className="text-xs text-white/40">
                  Please wait 2–3 minutes
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="relative mx-auto aspect-[9/16] h-full max-h-[560px] overflow-hidden rounded-[34px] border-[10px] border-gray-950 bg-gray-950 shadow-2xl">
            <video
              src={props.promotion}
              className="h-full w-full object-cover"
              loop
              autoPlay
              muted
              playsInline
            />
          </div>
        )}
      </div>
      </div>
    </section>
  );
}
