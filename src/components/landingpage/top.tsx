"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

const PROMPT_TEMPLATES = {
  video: [
    {
      label: "白底展示",
      labelEn: "White BG",
      prompt: "Pure white background, product slowly rotating 360 degrees, soft studio lighting, high-end commercial photography style, ultra HD",
      promptZh: "纯白色背景，产品缓慢360度旋转展示，柔和棚拍灯光，高端商业摄影风格，超高清",
    },
    {
      label: "场景氛围",
      labelEn: "Lifestyle",
      prompt: "Elegant lifestyle scene, natural daylight, minimalist modern interior, product as hero shot, cinematic motion, shallow depth of field",
      promptZh: "优雅生活场景，自然日光，极简现代室内，产品主体特写，电影感运镜，浅景深",
    },
    {
      label: "户外场景",
      labelEn: "Outdoor",
      prompt: "Outdoor natural environment, golden hour lighting, gentle breeze effect, product showcased with dynamic camera movement, premium brand feel",
      promptZh: "户外自然环境，黄金时段光线，微风效果，动感镜头运动展示产品，高端品牌质感",
    },
    {
      label: "悬浮特效",
      labelEn: "Floating FX",
      prompt: "Product floating in mid-air with subtle particle effects, dark premium background with rim lighting, luxury brand commercial style",
      promptZh: "产品悬浮于空中，微粒光效环绕，深色高端背景加边缘轮廓光，奢华品牌广告风格",
    },
  ],
  image: [
    {
      label: "电商白底",
      labelEn: "E-com White",
      prompt: "Pure white seamless background, professional product photography, even studio lighting, sharp focus, e-commerce ready, 4K resolution",
      promptZh: "纯白无缝背景，专业产品摄影，均匀棚拍灯光，清晰对焦，适配电商平台，4K分辨率",
    },
    {
      label: "极简高端",
      labelEn: "Minimal",
      prompt: "Ultra minimalist composition, light gray background, single product centered, shadows for depth, luxury packaging feel, editorial style",
      promptZh: "极简构图，浅灰色背景，单品居中，光影投影增加层次感，奢华包装质感，编辑风格",
    },
    {
      label: "生活场景",
      labelEn: "In-Use Scene",
      prompt: "Product in natural use scenario, warm home environment, lifestyle photography, bokeh background, authentic and aspirational mood",
      promptZh: "产品在真实使用场景中，温馨家居环境，生活方式摄影，背景虚化，真实感与向往感并存",
    },
    {
      label: "品牌质感",
      labelEn: "Brand Mood",
      prompt: "Dark moody background, dramatic lighting, high contrast product hero shot, premium brand identity, fashion editorial aesthetic",
      promptZh: "深色氛围背景，戏剧性光影，高对比度产品主体，高端品牌识别感，时尚大片美学",
    },
  ],
};

export default function TopHero(params: {
  multiLanguage: string;
  locale: string;
}) {
  const t = useTranslations(params.multiLanguage);
  const [activeTab, setActiveTab] = useState<"video" | "image">("video");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const isZh = params.locale === "zh";

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1800);
    });
  };

  const templates = PROMPT_TEMPLATES[activeTab];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/bg.mp4"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20 md:py-28 w-full max-w-7xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-xs font-medium text-white/80 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          E-Commerce AI Platform
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight text-white max-w-3xl">
          {t("top.subTitle")}
        </h1>
        <p className="mt-5 text-base md:text-lg text-white/70 max-w-2xl leading-relaxed">
          {t("top.description")}
        </p>

        {/* Prompt Templates */}
        <div className="mt-12 w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            {isZh ? "可复制提示词模板" : "Prompt Templates — Click to Copy"}
          </p>
          <div className="flex rounded-lg border border-white/20 overflow-hidden">
            <button
              onClick={() => setActiveTab("video")}
              className={`px-4 py-1.5 text-xs font-medium transition-colors duration-150 ${
                activeTab === "video"
                  ? "bg-white text-gray-900"
                  : "bg-white/10 text-white/60 hover:text-white"
              }`}
            >
              {isZh ? "视频提示词" : "Video"}
            </button>
            <button
              onClick={() => setActiveTab("image")}
              className={`px-4 py-1.5 text-xs font-medium transition-colors duration-150 border-l border-white/20 ${
                activeTab === "image"
                  ? "bg-white text-gray-900"
                  : "bg-white/10 text-white/60 hover:text-white"
              }`}
            >
              {isZh ? "图像提示词" : "Image"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {templates.map((tpl, idx) => {
            const displayPrompt = isZh ? tpl.promptZh : tpl.prompt;
            const displayLabel = isZh ? tpl.label : tpl.labelEn;
            const isCopied = copiedIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => handleCopy(displayPrompt, idx)}
                className="group relative text-left p-4 rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/30 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1.5 bg-white/10 px-2 py-0.5 rounded">
                      {displayLabel}
                    </span>
                    <p className="text-xs text-white/70 leading-relaxed line-clamp-2">
                      {displayPrompt}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                    {isCopied ? (
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                </div>
                {isCopied && (
                  <div className="absolute inset-0 rounded-xl border border-green-400/30 bg-green-500/10 flex items-center justify-center pointer-events-none">
                    <span className="text-xs font-medium text-green-300">
                      {isZh ? "已复制" : "Copied!"}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
}
