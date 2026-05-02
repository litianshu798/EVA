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

const localeKey = (locale: string) =>
  locale === "zh" ? "zh" : locale === "pt" ? "pt" : "en";

const VIDEO_COPY = {
  zh: {
    studio: "AI 商品视频工作台",
    title: "上传商品图，生成带货视频",
    description: "适合详情页、短视频、广告首屏和新品上架，把产品静图转成更有购买欲的动态素材。",
    cleanImage: "建议上传清晰商品主图",
    model: "模型",
    ratio: "比例",
    duration: "时长",
    camera: "镜头",
    motion: "动作强度",
    scene: "场景",
    tone: "氛围",
    prompt: "提示词",
    generate: "生成视频",
    processing: "生成中...",
    wait: "请等待 2-3 分钟",
    credit: "积分",
    noCredit: "积分不足",
    uploadRequired: "请上传图片",
    promptRequired: "请输入提示词",
    loginRequired: "请先登录",
    error: "生成出错，请稍后再试",
  },
  en: {
    studio: "AI Product Video Studio",
    title: "Upload a product image. Generate vertical commerce video.",
    description: "Built for PDPs, short-form ads, launch pages, and social commerce motion assets.",
    cleanImage: "Use a clean product hero image",
    model: "Model",
    ratio: "Ratio",
    duration: "Duration",
    camera: "Camera",
    motion: "Motion",
    scene: "Scene",
    tone: "Tone",
    prompt: "Prompt",
    generate: "Generate Video",
    processing: "Processing...",
    wait: "Please wait 2-3 minutes",
    credit: "credit",
    noCredit: "No credit left",
    uploadRequired: "Please upload a photo",
    promptRequired: "Please enter a prompt",
    loginRequired: "Please login first",
    error: "An error occurred, please try again",
  },
  pt: {
    studio: "Estúdio de Vídeo de Produto com IA",
    title: "Envie uma imagem de produto e gere vídeo vertical de venda.",
    description: "Feito para PDPs, anúncios curtos, lançamentos e materiais de social commerce.",
    cleanImage: "Use uma imagem principal limpa do produto",
    model: "Modelo",
    ratio: "Proporção",
    duration: "Duração",
    camera: "Câmera",
    motion: "Movimento",
    scene: "Cena",
    tone: "Tom",
    prompt: "Prompt",
    generate: "Gerar vídeo",
    processing: "Processando...",
    wait: "Aguarde 2-3 minutos",
    credit: "crédito",
    noCredit: "Créditos insuficientes",
    uploadRequired: "Envie uma foto",
    promptRequired: "Digite um prompt",
    loginRequired: "Faça login primeiro",
    error: "Ocorreu um erro, tente novamente",
  },
} as const;

const VIDEO_CONFIGS = {
  duration: ["5s", "8s", "10s"],
  ratio: ["9:16", "1:1", "16:9"],
  camera: {
    zh: ["慢速推进", "环绕运镜", "手持 UGC", "微距穿梭", "定机位展示"],
    en: ["Slow push-in", "Orbit move", "Handheld UGC", "Macro travel", "Locked-off demo"],
    pt: ["Aproximação lenta", "Movimento orbital", "UGC handheld", "Travelling macro", "Demo com câmera fixa"],
  },
  motion: {
    zh: ["轻微自然动效", "中等产品动效", "强广告动效"],
    en: ["Subtle natural motion", "Medium product motion", "Strong ad motion"],
    pt: ["Movimento natural sutil", "Movimento médio do produto", "Movimento publicitário forte"],
  },
  scene: {
    zh: ["电商详情页", "短视频首屏", "社媒广告", "新品发布", "达人口播"],
    en: ["PDP detail", "Short-video hook", "Social ad", "Product launch", "Creator demo"],
    pt: ["Detalhe da PDP", "Hook para vídeo curto", "Anúncio social", "Lançamento", "Demo de creator"],
  },
  tone: {
    zh: ["高级商业", "真实生活", "科技未来", "清爽促销", "电影感"],
    en: ["Premium commerce", "Real lifestyle", "Futuristic tech", "Fresh promotion", "Cinematic"],
    pt: ["Comercial premium", "Lifestyle real", "Tecnologia futurista", "Promoção fresca", "Cinematográfico"],
  },
} as const;

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
  const [duration, setDuration] = useState<string>("5s");
  const [ratio, setRatio] = useState<string>("9:16");
  const [camera, setCamera] = useState<string>("Slow push-in");
  const [motion, setMotion] = useState<string>("Subtle natural motion");
  const [scene, setScene] = useState<string>("PDP detail");
  const [tone, setTone] = useState<string>("Premium commerce");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const [userSubscriptionInfo, setUserSubscriptionInfo] =
    useState<UserSubscriptionInfo | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const { user } = useAppContext();
  const copy = VIDEO_COPY[localeKey(locale)];
  const currentLocale = localeKey(locale);
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
    setCamera(VIDEO_CONFIGS.camera[currentLocale][0]);
    setMotion(VIDEO_CONFIGS.motion[currentLocale][0]);
    setScene(VIDEO_CONFIGS.scene[currentLocale][0]);
    setTone(VIDEO_CONFIGS.tone[currentLocale][0]);
  }, [currentLocale]);

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
      toast.warning(copy.uploadRequired);
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
        toast.warning(copy.noCredit);
        return;
      }
    }

    if (user === undefined || user === null) {
      toast.warning(copy.loginRequired);
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
      formData.append("version", selectedModel.version || "");
      formData.append("user_id", user?.uuid || "");
      formData.append("user_email", user?.email || "");
      formData.append("effect_link_name", selectedModel.link_name);
      const enhancedPrompt = [
        prompt.trim(),
        `${duration} ${ratio}`,
        camera,
        motion,
        scene,
        tone,
        "professional e-commerce product video",
      ].filter(Boolean).join(", ");
      formData.append("prompt", enhancedPrompt);
      formData.append("credit", selectedModel.credit.toString());
      formData.append("duration", duration);
      formData.append("ratio", ratio);
      formData.append("camera", camera);
      formData.append("motion", motion);
      formData.append("scene", scene);
      formData.append("tone", tone);

      if (prompt.trim() === "") {
        toast.warning(copy.promptRequired);
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
      toast.error(copy.error);
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

  const configSelectClass =
    "h-11 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white outline-none transition-colors hover:border-white/25 focus:border-white/60 focus:ring-2 focus:ring-white/10";
  const optionClass = "bg-gray-950 text-white";

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
                {copy.studio}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                {copy.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
                {copy.description}
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
                    {copy.cleanImage}
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
              <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
                    {copy.model}
                  </label>
                  <select
                    aria-label="Model"
                    value={selectedModelId}
                    onChange={(event) => setSelectedModelId(event.target.value)}
                    className={configSelectClass}
                  >
                    {(props.modelOptions || [selectedModel]).map((option) => (
                      <option className={optionClass} key={option.id.toString()} value={option.id.toString()}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
                    {copy.ratio}
                  </label>
                  <select
                    aria-label="Ratio"
                    value={ratio}
                    onChange={(event) => setRatio(event.target.value)}
                    className={configSelectClass}
                  >
                    {VIDEO_CONFIGS.ratio.map((option) => (
                      <option className={optionClass} key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
                    {copy.duration}
                  </label>
                  <select
                    aria-label="Duration"
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                    className={configSelectClass}
                  >
                    {VIDEO_CONFIGS.duration.map((option) => (
                      <option className={optionClass} key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                {[
                  [copy.camera, camera, setCamera, VIDEO_CONFIGS.camera[currentLocale]],
                  [copy.motion, motion, setMotion, VIDEO_CONFIGS.motion[currentLocale]],
                  [copy.scene, scene, setScene, VIDEO_CONFIGS.scene[currentLocale]],
                  [copy.tone, tone, setTone, VIDEO_CONFIGS.tone[currentLocale]],
                ].map(([label, value, setter, options]) => (
                  <div key={label as string}>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
                      {label as string}
                    </label>
                    <select
                      aria-label={label as string}
                      value={value as string}
                      onChange={(event) => (setter as React.Dispatch<React.SetStateAction<string>>)(event.target.value)}
                      className={configSelectClass}
                    >
                      {(options as readonly string[]).map((option) => (
                        <option className={optionClass} key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
                {copy.prompt}
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
                  ? prediction?.status || copy.processing
                  : copy.generate}
                {!generating && (
                  <span className="ml-2 text-gray-500">
                    {selectedModel.credit} {copy.credit}
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
                  {copy.wait}
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
