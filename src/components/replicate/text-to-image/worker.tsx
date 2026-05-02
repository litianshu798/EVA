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

const localeKey = (locale: string) =>
  locale === "zh" ? "zh" : locale === "pt" ? "pt" : "en";

const IMAGE_COPY = {
  zh: {
    studio: "AI 商品图工作台",
    model: "模型",
    format: "格式",
    ratio: "比例",
    style: "风格",
    lighting: "光线",
    background: "背景",
    quality: "质量",
    prompt: "提示词",
    negative: "负面词",
    generate: "生成图片",
    processing: "生成中...",
    credit: "积分",
    noCredit: "积分不足",
    promptRequired: "请输入提示词",
    loginRequired: "请先登录",
    error: "生成图片时出错，请稍后再试。",
    placeholder: "描述商品、场景、构图和想要的电商用途...",
    negativePlaceholder: "不想出现的内容，例如：低清晰度、变形文字、多余手指、杂乱背景",
    tags: ["电商白底", "详情页卖点", "场景海报", "促销 Banner", "社媒广告"],
  },
  en: {
    studio: "AI Product Image Studio",
    model: "Model",
    format: "Format",
    ratio: "Ratio",
    style: "Style",
    lighting: "Lighting",
    background: "Background",
    quality: "Quality",
    prompt: "Prompt",
    negative: "Negative prompt",
    generate: "Generate Image",
    processing: "Processing...",
    credit: "credit",
    noCredit: "No credit left",
    promptRequired: "Please enter a prompt",
    loginRequired: "Please login first",
    error: "An error occurred while generating the image.",
    placeholder: "Describe the product, scene, composition, and commerce use case...",
    negativePlaceholder: "Things to avoid, e.g. low resolution, distorted text, extra fingers, cluttered background",
    tags: ["White shot", "PDP detail", "Lifestyle poster", "Promo banner", "Social ad"],
  },
  pt: {
    studio: "Estúdio de Imagem de Produto com IA",
    model: "Modelo",
    format: "Formato",
    ratio: "Proporção",
    style: "Estilo",
    lighting: "Iluminação",
    background: "Fundo",
    quality: "Qualidade",
    prompt: "Prompt",
    negative: "Prompt negativo",
    generate: "Gerar imagem",
    processing: "Processando...",
    credit: "crédito",
    noCredit: "Créditos insuficientes",
    promptRequired: "Digite um prompt",
    loginRequired: "Faça login primeiro",
    error: "Ocorreu um erro ao gerar a imagem.",
    placeholder: "Descreva o produto, a cena, a composição e o uso comercial...",
    negativePlaceholder: "O que evitar, ex.: baixa resolução, texto distorcido, dedos extras, fundo poluído",
    tags: ["Fundo branco", "Detalhe da PDP", "Cena lifestyle", "Banner promocional", "Anúncio social"],
  },
} as const;

const RATIO_OPTIONS = [
  { value: "1:1", label: "1:1", width: 1024, height: 1024 },
  { value: "4:5", label: "4:5", width: 1024, height: 1280 },
  { value: "3:4", label: "3:4", width: 960, height: 1280 },
  { value: "16:9", label: "16:9", width: 1280, height: 720 },
  { value: "9:16", label: "9:16", width: 720, height: 1280 },
];

const IMAGE_CONFIGS = {
  style: {
    zh: ["高级棚拍", "电商白底", "生活方式", "品牌海报", "微距细节"],
    en: ["Premium studio", "Marketplace white", "Lifestyle", "Brand poster", "Macro detail"],
    pt: ["Estúdio premium", "Fundo branco", "Lifestyle", "Pôster de marca", "Detalhe macro"],
  },
  lighting: {
    zh: ["柔和棚灯", "自然日光", "电影逆光", "高对比广告光"],
    en: ["Soft studio", "Natural daylight", "Cinematic backlight", "High-contrast ad light"],
    pt: ["Luz suave de estúdio", "Luz natural", "Contraluz cinematográfico", "Luz publicitária contrastada"],
  },
  background: {
    zh: ["纯色高级背景", "真实使用场景", "促销活动场景", "平台合规留白"],
    en: ["Premium solid backdrop", "Real usage scene", "Campaign scene", "Marketplace whitespace"],
    pt: ["Fundo sólido premium", "Cena real de uso", "Cena de campanha", "Respiro para marketplace"],
  },
  quality: {
    zh: ["高清商业摄影", "超写实", "干净可读包装", "广告级精修"],
    en: ["Commercial HD photo", "Hyper-realistic", "Readable packaging", "Ad-grade retouch"],
    pt: ["Foto comercial HD", "Hiper-realista", "Embalagem legível", "Retoque publicitário"],
  },
} as const;

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
  const [ratio, setRatio] = useState<string>("1:1");
  const [style, setStyle] = useState<string>("Premium studio");
  const [lighting, setLighting] = useState<string>("Soft studio");
  const [background, setBackground] = useState<string>("Premium solid backdrop");
  const [quality, setQuality] = useState<string>("Commercial HD photo");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>(
    props.defaultModelId?.toString() || props.modelOptions?.[0]?.id.toString() || ""
  );
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userSubscriptionInfo, setUserSubscriptionInfo] =
    useState<UserSubscriptionInfo | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const { user } = useAppContext();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations(props.lang || "index");
  const copy = IMAGE_COPY[localeKey(locale)];
  const ratioOption = RATIO_OPTIONS.find((option) => option.value === ratio) || RATIO_OPTIONS[0];
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
        toast.warning(copy.noCredit);
        return;
      }
    }

    if (prompt.trim().length === 0) {
      toast.warning(copy.promptRequired);
      return;
    }

    if (!user?.uuid) {
      toast.warning(copy.loginRequired);
      await sleep(1000);
      router.push(`/${locale}/login`);
      return;
    }

    try {
      setGenerating(true);
      const enhancedPrompt = [
        prompt.trim(),
        style,
        lighting,
        background,
        quality,
        "professional e-commerce product image",
      ].filter(Boolean).join(", ");
      const response = await fetch("/api/predictions/text_to_image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel.model,
          version: selectedModel.version,
          prompt: enhancedPrompt,
          width: ratioOption.width,
          height: ratioOption.height,
          output_format: outputFormat,
          aspect_ratio: ratio,
          negative_prompt: negativePrompt.trim(),
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
      toast.error(copy.error);
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

  const currentLocale = localeKey(locale);

  useEffect(() => {
    setStyle(IMAGE_CONFIGS.style[currentLocale][0]);
    setLighting(IMAGE_CONFIGS.lighting[currentLocale][0]);
    setBackground(IMAGE_CONFIGS.background[currentLocale][0]);
    setQuality(IMAGE_CONFIGS.quality[currentLocale][0]);
  }, [currentLocale]);

  const configSelectClass =
    "h-11 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white outline-none transition-colors hover:border-white/25 focus:border-white/60 focus:ring-2 focus:ring-white/10";
  const optionClass = "bg-gray-950 text-white";

  return (
    <section className="relative w-full overflow-hidden border-b border-white/10 bg-gray-950 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(14,165,233,0.2),transparent_32%),radial-gradient(circle_at_85%_12%,rgba(244,114,182,0.16),transparent_28%),linear-gradient(135deg,#020617,#111827_55%,#030712)]" />

      <div className="relative grid gap-6 p-4 md:grid-cols-[1.05fr_0.95fr] md:p-8 lg:p-10 xl:p-12">
        <div className="rounded-3xl border border-white/10 bg-gray-900/88 p-5 text-white shadow-2xl backdrop-blur md:p-7">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-gray-950 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white">
                {copy.studio}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                {t("top.subTitle")}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
                {t("top.description")}
              </p>
            </div>
            <CreditInfo credit={userSubscriptionInfo?.remain_count?.toString() || ""} />
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                aria-label="Aspect ratio"
                value={ratio}
                onChange={(event) => setRatio(event.target.value)}
                className={configSelectClass}
              >
                {RATIO_OPTIONS.map((option) => (
                  <option className={optionClass} key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
                {copy.format}
              </label>
              <select
                aria-label="Output format"
                value={outputFormat}
                onChange={(event) => setOutputFormat(event.target.value)}
                className={configSelectClass}
              >
                <option className={optionClass} value="webp">WEBP</option>
                <option className={optionClass} value="jpg">JPG</option>
                <option className={optionClass} value="png">PNG</option>
              </select>
            </div>
            {[
              [copy.style, style, setStyle, IMAGE_CONFIGS.style[currentLocale]],
              [copy.lighting, lighting, setLighting, IMAGE_CONFIGS.lighting[currentLocale]],
              [copy.background, background, setBackground, IMAGE_CONFIGS.background[currentLocale]],
              [copy.quality, quality, setQuality, IMAGE_CONFIGS.quality[currentLocale]],
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

          <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
                {copy.prompt}
              </label>
              <textarea
                placeholder={props.promptTips || copy.placeholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                aria-label="Prompt"
                className="min-h-[260px] w-full resize-none rounded-3xl border border-white/10 bg-white/[0.07] px-5 py-5 text-base leading-7 text-white outline-none transition-colors placeholder:text-white/35 hover:border-white/25 focus:border-white/60 focus:ring-2 focus:ring-white/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
                {copy.negative}
              </label>
              <textarea
                placeholder={copy.negativePlaceholder}
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                aria-label="Negative prompt"
                className="min-h-[260px] w-full resize-none rounded-3xl border border-white/10 bg-white/[0.055] px-4 py-4 text-sm leading-6 text-white outline-none transition-colors placeholder:text-white/30 hover:border-white/25 focus:border-white/60 focus:ring-2 focus:ring-white/10"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex flex-wrap gap-2 text-xs">
              {copy.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-white/58">
                  {tag}
                </span>
              ))}
            </div>
            <Button
              isLoading={generating}
              className="h-12 rounded-xl bg-white px-8 text-sm font-semibold text-gray-950 hover:bg-white/90"
              onClick={handleGenerate}
            >
              {generating ? prediction?.status || copy.processing : copy.generate}
              {!generating && (
                <span className="ml-2 text-gray-500">
                  {selectedModel.credit} {copy.credit}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] p-4 shadow-xl backdrop-blur">
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
