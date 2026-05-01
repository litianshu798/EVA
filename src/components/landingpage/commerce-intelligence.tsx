import {
  BadgeCheck,
  Boxes,
  Clapperboard,
  Images,
  Layers3,
  LineChart,
  PackageCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type IntelligenceItem = [
  titleZh: string,
  titleEn: string,
  descZh: string,
  descEn: string,
  Icon: LucideIcon
];

const CONTENT = {
  home: {
    eyebrow: "Commerce Content OS",
    titleZh: "从单张商品图到全渠道营销资产",
    titleEn: "From one product photo to full-funnel commerce assets",
    descZh:
      "EVA 把商品理解、场景扩展、视频动效、图像生成和投放素材整理成一条连续工作流，适合电商团队高频生产。",
    descEn:
      "EVA turns product understanding, scene expansion, motion generation, image creation, and campaign asset prep into one continuous workflow for commerce teams.",
    items: [
      ["商品识别", "Product parsing", "识别主体、材质、包装层级和电商展示角度", "Parse subject, material, packaging hierarchy, and marketplace angles", PackageCheck],
      ["创意扩展", "Creative expansion", "自动生成白底、场景、海报、短视频方向", "Generate white shots, scenes, posters, and short-video directions", Wand2],
      ["批量资产", "Asset batches", "围绕 SKU 产出多尺寸、多平台素材组合", "Create multi-size, multi-channel asset sets around each SKU", Boxes],
      ["投放复用", "Campaign reuse", "让素材适配详情页、广告、社媒和独立站", "Adapt assets for PDPs, ads, social, and DTC storefronts", LineChart],
    ] as IntelligenceItem[],
  },
  image: {
    eyebrow: "Product Image Studio",
    titleZh: "专业商品图不止一张好看的图片",
    titleEn: "Professional product images are more than pretty pictures",
    descZh:
      "文生图页面专注商品图工作流：白底上架、场景图、卖点图、品牌海报、促销 Banner，各类素材有不同提示词策略。",
    descEn:
      "The image studio focuses on commerce image workflows: white shots, lifestyle scenes, selling-point visuals, brand posters, and campaign banners.",
    items: [
      ["主图规范", "Marketplace ready", "白底、阴影、比例、包装文字可读性优先", "Prioritize white background, shadows, scale, and readable packaging", Images],
      ["品牌氛围", "Brand mood", "用光影、背景和构图强化价格带与定位", "Use lighting, background, and composition to reinforce positioning", Sparkles],
      ["卖点拆解", "Selling points", "把材质、功能、使用场景做成详情页模块", "Turn materials, functions, and use cases into PDP modules", Layers3],
      ["审核友好", "Review friendly", "减少多余元素，贴近平台上架和广告规范", "Reduce clutter and stay closer to marketplace and ad policies", BadgeCheck],
    ] as IntelligenceItem[],
  },
};

export default function CommerceIntelligence({
  locale,
  variant = "home",
}: {
  locale: string;
  variant?: "home" | "image";
}) {
  const data = CONTENT[variant];
  const isZh = locale === "zh";

  return (
    <section className="w-full bg-gray-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-24">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/60">
            <Clapperboard className="h-3.5 w-3.5 text-cyan-300" />
            {data.eyebrow}
          </div>
          <h2 className="max-w-xl text-3xl font-bold tracking-tight md:text-5xl">
            {isZh ? data.titleZh : data.titleEn}
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 md:text-base">
            {isZh ? data.descZh : data.descEn}
          </p>
          <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            {[
              ["3x", isZh ? "素材类型" : "asset modes"],
              ["24h", isZh ? "上新节奏" : "launch rhythm"],
              ["SKU", isZh ? "批量生产" : "batch ready"],
            ].map(([value, label]) => (
              <div key={value} className="bg-white/[0.03] p-4">
                <div className="text-xl font-bold">{value}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-white/45">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.items.map(([titleZh, titleEn, descZh, descEn, Icon], index) => (
            <div
              key={titleEn as string}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Icon className="h-5 w-5 text-cyan-200" />
                </div>
                <span className="font-mono text-xs text-white/30">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-base font-semibold">
                {isZh ? titleZh : titleEn}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {isZh ? descZh : descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
