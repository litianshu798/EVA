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

const VIDEO_SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    title: "奢华美妆主视觉",
    titleEn: "Luxury Beauty Hero",
    type: "video",
    asset: "/resources/example1.mp4",
    style: "黑金棚拍 / 高光材质 / 礼盒套装",
    styleEn: "Black-gold studio / glossy material / gift set",
    prompt: "黑金高级棚拍背景，护肤礼盒套装作为主体，镜头缓慢推进，柔和轮廓光，玻璃质感反射，竖版电商广告视频",
    promptEn:
      "Black and gold premium studio background, skincare gift set as hero subject, slow camera push-in, soft rim lighting, glass reflections, vertical e-commerce ad video",
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
    type: "video",
    asset: "/resources/example3.mp4",
    style: "科技光轨 / 快速转场 / 新品首发",
    styleEn: "Light trails / fast cuts / launch motion",
    prompt: "未来感科技蓝图背景，无线耳机产品微距穿梭，快速切换材质细节，冷色边缘光，新品发售广告视频",
    promptEn:
      "Futuristic technical blueprint background, macro fly-through of wireless earbuds, quick cuts across material details, cool edge lighting, launch commercial video",
  },
  {
    title: "食品饮料场景图",
    titleEn: "Food & Beverage Motion",
    type: "video",
    style: "清爽冰感 / 水珠 / 夏季促销",
    asset: "/resources/example4.mp4",
    styleEn: "Icy fresh / droplets / summer campaign",
    prompt: "清爽冰块与水珠背景，罐装饮料居中，明亮夏季光线，飞溅液体慢动作，适合电商促销短视频",
    promptEn:
      "Refreshing ice cubes and water droplets background, canned drink centered, bright summer lighting, slow-motion splash, suitable for e-commerce campaign short video",
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
    titleEn: "Marketplace SKU Spin",
    type: "video",
    asset: "/resources/example6.mp4",
    style: "白底规范 / 360 展示 / 平台上架",
    styleEn: "White background / 360 spin / marketplace ready",
    prompt: "纯白无缝背景，单个产品居中，缓慢360度旋转，真实接触阴影，比例准确，适合商品详情页视频",
    promptEn:
      "Pure white seamless background, single product centered, slow 360-degree rotation, realistic contact shadow, accurate proportions, ready for product detail page video",
  },
];

const IMAGE_SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    title: "电商白底 SKU 图",
    titleEn: "Marketplace SKU White Shot",
    type: "image",
    asset: "/resources/example1.png",
    style: "白底规范 / 阴影真实 / 平台上架",
    styleEn: "White background / realistic shadow / marketplace ready",
    prompt: "纯白无缝背景，单个产品居中，真实接触阴影，比例准确，无多余道具，适合亚马逊与独立站上架",
    promptEn:
      "Pure white seamless background, single product centered, realistic contact shadow, accurate proportions, no extra props, ready for Amazon and DTC storefronts",
  },
  {
    title: "美妆套装主图",
    titleEn: "Beauty Set Hero Image",
    type: "image",
    asset: "/resources/example2.png",
    style: "高端棚拍 / 套装陈列 / 柔光",
    styleEn: "Premium studio / set composition / soft light",
    prompt: "浅米白高级棚拍背景，护肤套装按主次层级陈列，柔和阴影，包装文字清晰，电商首页主视觉",
    promptEn:
      "Warm off-white premium studio background, skincare set arranged with visual hierarchy, soft shadows, clear package typography, e-commerce homepage hero image",
  },
  {
    title: "服饰详情卖点图",
    titleEn: "Fashion Detail Selling Point",
    type: "image",
    asset: "/resources/example3.png",
    style: "材质细节 / 拼贴构图 / 卖点标注",
    styleEn: "Material detail / collage layout / selling points",
    prompt: "高级服饰产品详情图，主图加面料微距细节拼贴，干净留白，适合展示防皱、透气、剪裁卖点",
    promptEn:
      "Premium fashion product detail image, hero shot plus fabric macro detail collage, clean whitespace, suitable for wrinkle-resistant, breathable, tailored selling points",
  },
  {
    title: "食品饮料促销 Banner",
    titleEn: "Food & Beverage Promo Banner",
    type: "image",
    asset: "/resources/example4.png",
    style: "清爽冰感 / 水珠 / 夏季促销",
    styleEn: "Icy fresh / droplets / summer campaign",
    prompt: "清爽冰块与水珠背景，罐装饮料居中，明亮夏季光线，飞溅动效定格，适合电商促销Banner",
    promptEn:
      "Refreshing ice cubes and water droplets background, canned drink centered, bright summer lighting, frozen splash motion, suitable for e-commerce campaign banner",
  },
  {
    title: "科技新品海报",
    titleEn: "Tech Launch Poster",
    type: "image",
    asset: "/resources/example5.png",
    style: "科技蓝图 / 微距细节 / 发售物料",
    styleEn: "Tech blueprint / macro detail / launch creative",
    prompt: "未来感科技蓝图背景，无线耳机产品微距特写，金属与塑料材质清晰，边缘冷光，适合新品发售海报",
    promptEn:
      "Futuristic technical blueprint background, macro close-up of wireless earbuds, clear metal and plastic materials, cool edge lighting, suitable for a product launch poster",
  },
  {
    title: "家居生活方式图",
    titleEn: "Home Lifestyle Image",
    type: "image",
    asset: "/resources/example6.png",
    style: "真实场景 / 家居日光 / 使用氛围",
    styleEn: "Real scene / home daylight / in-use mood",
    prompt: "现代家居场景，自然日光，产品摆放在桌面使用环境中，背景轻微虚化，真实可信的生活方式摄影",
    promptEn:
      "Modern home scene, natural daylight, product placed in an in-use tabletop environment, slight background blur, authentic lifestyle photography",
  },
];

export default function CommerceShowcase({
  locale,
  variant = "video",
}: {
  locale: string;
  variant?: "video" | "image";
}) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const isZh = locale === "zh";
  const items = variant === "image" ? IMAGE_SHOWCASE_ITEMS : VIDEO_SHOWCASE_ITEMS;

  function copyPrompt(prompt: string, index: number) {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1400);
    });
  }

  return (
    <section className="w-full bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/60">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              AI Commerce Creative Library
            </div>
            <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-white md:text-4xl">
              {isZh ? "高转化电商素材样例库" : "High-converting commerce examples"}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-white/55">
            {isZh
              ? variant === "image"
                ? "覆盖商品主图、详情页卖点图、品牌海报、促销 Banner。没有现成素材的样例先保留占位，方便后续替换真实资产。"
                : "覆盖商品展示视频、场景短片、社媒动效、详情页 360 展示。没有现成素材的样例先保留占位，方便后续替换真实资产。"
              : variant === "image"
                ? "Covers hero shots, detail visuals, brand posters, and campaign banners. Empty samples keep clean slots for future assets."
                : "Covers product motion, lifestyle shorts, social clips, and 360 detail-page videos. Empty samples keep clean slots for future assets."}
          </p>
        </div>

        <div
          className={
            variant === "video"
              ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              : "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          }
        >
          {items.map((item, index) => {
            const title = isZh ? item.title : item.titleEn;
            const style = isZh ? item.style : item.styleEn;
            const prompt = isZh ? item.prompt : item.promptEn;
            const isCopied = copiedIndex === index;

            return (
              <article
                key={title}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.09] hover:shadow-2xl"
              >
                <div
                  className={`relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc,#eef2ff_45%,#fff7ed)] ${
                    variant === "video" ? "aspect-[9/16]" : "aspect-[4/3]"
                  }`}
                >
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
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 border-b border-dashed border-white/15 text-white/35">
                      {variant === "video" ? (
                        <Video className="h-8 w-8" />
                      ) : (
                        <ImageIcon className="h-8 w-8" />
                      )}
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

                <div className={variant === "video" ? "p-4" : "p-5"}>
                  <h3 className="text-sm font-semibold text-white md:text-base">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/35">
                    {style}
                  </p>
                  <p
                    className={`mt-4 line-clamp-3 text-sm leading-5 text-white/58 ${
                      variant === "video" ? "min-h-[80px]" : "min-h-[60px]"
                    }`}
                  >
                    {prompt}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyPrompt(prompt, index)}
                    className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-white/15 px-3 text-sm font-medium text-white/70 transition-colors hover:border-white/35 hover:text-white"
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
