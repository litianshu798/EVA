"use client";

import { Copy, ImageIcon, Sparkles, Video } from "lucide-react";
import { useState } from "react";

interface ShowcaseItem {
  title: string;
  titleEn: string;
  type: "image" | "video";
  asset?: string;
  prompt: string;
  promptEn: string;
  style: string;
  styleEn: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    title: "奢华美妆主视觉",
    titleEn: "Luxury Beauty Hero",
    type: "image",
    asset: "/resources/example3.webp",
    style: "黑金棚拍 / 高光材质 / 礼盒套装",
    styleEn: "Black-gold studio / glossy material / gift set",
    prompt: "黑金高级棚拍背景，护肤礼盒套装作为主体，柔和轮廓光，玻璃质感反射，精致电商主视觉，8K商业摄影",
    promptEn:
      "Black and gold premium studio background, skincare gift set as hero subject, soft rim lighting, glass reflections, refined e-commerce hero visual, 8K commercial photography",
  },
  {
    title: "家居生活方式视频",
    titleEn: "Home Lifestyle Video",
    type: "video",
    asset: "/resources/example2.mp4",
    style: "真实场景 / 阳光氛围 / 缓慢推进",
    styleEn: "Real scene / sunlight mood / slow dolly",
    prompt: "温暖现代家居场景，自然晨光穿过窗帘，产品在桌面缓慢推进展示，生活方式广告片质感，干净高级",
    promptEn:
      "Warm modern home scene, natural morning light through curtains, slow dolly showcase of the product on a table, lifestyle commercial quality, clean and premium",
  },
  {
    title: "3C 产品发售海报",
    titleEn: "Tech Launch Poster",
    type: "image",
    asset: "/resources/text-to-image.jpg",
    style: "科技蓝图 / 微距细节 / 发售物料",
    styleEn: "Tech blueprint / macro detail / launch creative",
    prompt: "未来感科技蓝图背景，无线耳机产品微距特写，金属与塑料材质清晰，边缘冷光，适合新品发售海报",
    promptEn:
      "Futuristic technical blueprint background, macro close-up of wireless earbuds, clear metal and plastic materials, cool edge lighting, suitable for a product launch poster",
  },
  {
    title: "食品饮料场景图",
    titleEn: "Food & Beverage Scene",
    type: "image",
    style: "清爽冰感 / 水珠 / 夏季促销",
    styleEn: "Icy fresh / droplets / summer campaign",
    prompt: "清爽冰块与水珠背景，罐装饮料居中，明亮夏季光线，飞溅动效定格，适合电商促销Banner",
    promptEn:
      "Refreshing ice cubes and water droplets background, canned drink centered, bright summer lighting, frozen splash motion, suitable for e-commerce campaign banner",
  },
  {
    title: "服饰动态 Lookbook",
    titleEn: "Fashion Lookbook Motion",
    type: "video",
    asset: "/resources/example5.mp4",
    style: "模特动线 / 影棚布光 / 社媒短片",
    styleEn: "Model motion / studio lighting / social short",
    prompt: "高级影棚布光，模特穿着外套缓慢转身，布料纹理清晰，镜头轻微环绕，时尚品牌Lookbook短片",
    promptEn:
      "Premium studio lighting, model wearing a coat slowly turns, clear fabric texture, subtle orbit camera movement, fashion brand lookbook short video",
  },
  {
    title: "电商白底 SKU 图",
    titleEn: "Marketplace SKU White Shot",
    type: "image",
    style: "白底规范 / 阴影真实 / 平台上架",
    styleEn: "White background / realistic shadow / marketplace ready",
    prompt: "纯白无缝背景，单个产品居中，真实接触阴影，比例准确，无多余道具，适合亚马逊与独立站上架",
    promptEn:
      "Pure white seamless background, single product centered, realistic contact shadow, accurate proportions, no extra props, ready for Amazon and DTC storefronts",
  },
];

export default function CommerceShowcase({ locale }: { locale: string }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const isZh = locale === "zh";

  function copyPrompt(prompt: string, index: number) {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1400);
    });
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-600">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              AI Commerce Creative Library
            </div>
            <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-gray-950 md:text-4xl">
              {isZh ? "高转化电商素材样例库" : "High-converting commerce examples"}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-gray-500">
            {isZh
              ? "覆盖商品主图、场景图、品牌海报、短视频动效。没有现成素材的样例先保留占位，方便后续替换真实资产。"
              : "Covers hero images, lifestyle scenes, brand posters, and motion assets. Empty samples keep a clean slot for future real assets."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SHOWCASE_ITEMS.map((item, index) => {
            const title = isZh ? item.title : item.titleEn;
            const style = isZh ? item.style : item.styleEn;
            const prompt = isZh ? item.prompt : item.promptEn;
            const isCopied = copiedIndex === index;

            return (
              <article
                key={title}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,#f8fafc,#eef2ff_45%,#fff7ed)]">
                  {item.asset ? (
                    item.type === "video" ? (
                      <video
                        src={item.asset}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={item.asset}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    )
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 border-b border-dashed border-gray-200 text-gray-400">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-xs font-medium uppercase tracking-widest">
                        {isZh ? "素材占位" : "Asset Placeholder"}
                      </span>
                    </div>
                  )}
                  <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm backdrop-blur">
                    {item.type === "video" ? (
                      <Video className="h-3.5 w-3.5 text-rose-500" />
                    ) : (
                      <ImageIcon className="h-3.5 w-3.5 text-emerald-600" />
                    )}
                    {item.type === "video" ? "Video" : "Image"}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-semibold text-gray-950">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                    {style}
                  </p>
                  <p className="mt-4 line-clamp-3 min-h-[60px] text-sm leading-5 text-gray-600">
                    {prompt}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyPrompt(prompt, index)}
                    className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-950"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {isCopied ? (isZh ? "已复制" : "Copied") : "Prompt"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
