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
    title: "模特第一视角",
    titleEn: "Model's first perspective",
    type: "video",
    asset: "/resources/example1.mp4",
    style: "写实直拍 / 侧窗柔光/ 特写镜头",
    styleEn: "Black-gold studio / glossy material / gift set",
    prompt: "极致超写实模拟智能手机高清画质，自然柔和的侧窗光与温暖琥珀色调，红发绿眼女子穿白色背心戴三条金链，固定机位从中近景缓慢推向特写，35mm广角加浅景深，背景厨房柔焦；她自然眨眼、微笑，面部肌肉运动，雀斑在光下清晰可见，同时用葡萄牙语说“我们看起来真的很真实对吧？靠近点，很奇怪吧？但它是真实的……或者说接近真实”，背景伴有轻快流行乐或低保真音轨，人声清晰带呼吸停顿。",
    promptEn:
      "Extreme photorealistic smartphone-grade quality, soft side window light with warm amber tones, a freckled redhead green-eyed woman in a white tank top and three thin gold chains; fixed camera slowly pushes from medium close-up to close-up, 35mm wide lens with shallow depth of field and kitchen background bokeh. She naturally blinks, smiles with full facial muscle movement, as the lens closes in on her realistic freckles, speaking Portuguese: “Eu entendo, a gente parece real mesmo, né? Aproxima aqui. É estranho, né? Mas é real... ou quase.” Background light pop or lo-fi track with clear vocals and natural breath pauses.",
  },
  {
    title: "产品实拍介绍",
    titleEn: "Product real shot introduction",
    type: "video",
    asset: "/resources/example2.mp4",
    style: "真实场景 / 阳光氛围 / 缓慢推进",
    styleEn: "Real scene / sunlight mood / slow dolly",
    prompt: "镜头缓缓推进。模特微微调整重心，双手插兜，夹克自然地垂落在胸前。提示：镜头缓缓推进，模特双手插兜微微调整重心，棒球夹克面料自然垂落，阳光投射出柔和的阴影，背景中棕榈树轻轻摇曳，温暖的电影感光线，浅景深，胶片颗粒，8K",
    promptEn:
      "The camera slowly pushes in. Themodel subtly shifts weight, handsin pockets, jacket settlingnaturally across the torso.Prompt: slow push in, modelsubtly shifting weight with handsin pockets, varsity jacket fabricadjusting naturally, sunlightcasting soft shadows, palm treesmoving gently in background,warm cinematic lighting, shallowdepth of field, film grain, 8k",
  },
  {
    title: "工业级产品宣传视频",
    titleEn: "Industrial-grade product promotional video",
    type: "video",
    asset: "/resources/example3.mp4",
    style: "工业级长镜头 / 镜头切换 / 微距视角",
    styleEn: "Industrial-grade telephoto lens / Lens switching / Macro perspective",
    prompt: `“描述”：一镜到底的工业电影长镜头。一双米白色运动鞋在刺眼的聚光灯下。镜头猛烈地深入编织鞋面，缩小至微观尺度。风格”：超写实CGI，极致微距动作，4K摄影机：高速前移，无限微距变焦，手持抖动，无剪辑。“照明”：外部暗光，内部织物明亮高对比度照明。“运动”：镜头高速穿过阻挡路径的巨大交叉纤维，倾斜和摇晃以躲避碰撞，湍急的纤维从眼前掠过。紧张气氛迅速累积，随后镜头高速拉近，直接进入场景 `,
    promptEn: `"DESCRIPTION":"SINGLECONTINUOUS INDUSTRIAL CINEMATICSHOT. OFF-WHITE SNEAKERS UNDERHARSH SPOTLIGHT. CAMERAVIOLENTLY PLUNGES INTO THEWOVEN UPPER.SHRINKING TO
MICROSCOPIC SCALE."
STYLE":"HYPER-REALISTIC CGIEXTREME MACRO ACTION, 4KCAMERA":"HIGH-SPEED FORWARDDOLLY, INFINITE MACRO ZOOM,HANDHELD SHAKE, NO CUTS","LIGHTING":"DARK SPOTLIGHTOUTSIDE, BRIGHT HIGH-CONTRASTLIGHTING INSIDE FABRIC""MOTION":"CAMERA RACESTHROUGH GIANT CROSSING FIBERSBLOCKING THE PATH,TILTING ANDSHAKING TO DODGENEAR-COLLISIONS, TURBULENT MISTRUSHING PAST. TENSION BUILDINGRAPIDLY BEFORE A STRAIGHTHIGH-SPEED ZOOM BURSTINGDIRECTLY INTO SCENE 2",TEXT:"NONE"`,
  },
  {
    title: "产品讲解介绍",
    titleEn: "Product Explanation and Introduction",
    type: "video",
    style: "柔光效果 / 讲解介绍 / 模拟场景",
    asset: "/resources/example4.mp4",
    styleEn: "Soft Light Effect / Explanation and Introduction / Simulated Scene",
    prompt: "整体风格为高分辨率屏幕录制的数字锐利感与手机UGC轻微压缩的真实纹理混合，最终AI生成片段呈现光滑的超写实数字光泽；主持人是带有胡茬的年轻男子，固定于画面下方中央的中近景，背景为冷蓝色，使用柔和的电影感三点布光加蓝色轮廓光，而上方的竖屏片段则模拟社交媒体UGC的手持运镜，画面中多位女模特在不同居家场景中微笑展示护肤品、香水和运动鞋，光线包含自然日光、环形柔光和暖色台灯，整体色彩鲜艳、高对比，肤色温暖，产品颜色饱和，氛围快节奏、具有科普和革命性科技感；场景分解包括主持人手势指向顶部、AI女性模特逼真口型与微笑、生成模特持产品说话的视频，最终展示厨房、咖啡厅和外盒开箱等不同环境，背景为有节奏的电子乐，字幕出现“Eu criei uma influenciadora de IA”等黄色文字。",
    promptEn:
      `The overall style blends the sharp digital feel of high-resolution screen recording with the slightly compressed realistic textures of mobile UGC, resulting in AI-generated clips that present a smooth, hyper-realistic digital sheen. The host is a young man with stubble, fixed in a medium-close-up shot at the bottom center of the screen against a cool blue background, using soft, cinematic three-point lighting with blue rim lighting. The vertical clips above simulate handheld camera movements typical of social media UGC, featuring multiple female models smiling and showcasing skincare products, perfumes, and sneakers in various home settings. The lighting includes natural sunlight, ring lighting, and warm-toned lamps, creating a vibrant, high-contrast color scheme with warm skin tones and saturated product colors. The atmosphere is fast-paced and conveys a sense of educational and revolutionary technology. Scene breakdowns include the host gesturing upwards, the AI ​​female models' realistic lip movements and smiles, and the generated video of the models speaking while holding products. The final scene showcases different environments such as a kitchen, a coffee shop, and unboxing, accompanied by rhythmic electronic music and yellow text such as "Eu criei uma influenciadora de IA" in the subtitles.`,
  },
  {
    title: "模特商品展示",
    titleEn: "Fashion Lookbook Motion",
    type: "video",
    asset: "/resources/example5.mp4",
    style: "模特动线 / 影棚布光 / 社媒短片",
    styleEn: "Model motion / studio lighting / social short",
    prompt: "极致写实，灰褐衬衫、灰大衣与牛仔蓝，自然肤质微透光；逆光黄金时刻，发丝与肩膀呈金色轮廓光，脸部柔光无硬影。低角度后跟移拍，轻微手持感，85mm浅景深，城市背景融为柔焦。女子戴圆框墨镜、右手拿白咖啡杯、左手插兜，棕色长发随风飘动，从正面行走转为回眸后望。无台词，环境混音配低保真爵士或 chill-hop。",
    promptEn:
      "Photorealistic with rich textures: taupe shirt, gray trench, denim jeans, natural glowing skin. Golden hour backlit by the sun with a strong rim light on hair and shoulders, soft fill on the face. Low-to-mid angle tracking backward with slight handheld motion, 85mm lens, shallow depth of field, creamy urban bokeh. A woman in round sunglasses walks holding a white coffee cup, left hand in pocket, windblown brown hair, transitioning from forward stroll to a look-back over her shoulder. No dialogue, ambient city sounds with lo‑fi jazz or chill-hop.",
  },
  {
    title: "沙漠编织幻境",
    titleEn: "Desert Knit Mirage",
    type: "video",
    asset: "/resources/example6.mp4",
    style: "高定时装质感 / 写实背景",
    styleEn: "Haute couture quality / Realistic background",
    prompt: "超写实高定时尚画质，乳白与象牙色为底，点缀宝蓝、深紫与淡紫几何针织，男子身处荒芜沙漠，厚卷发，超大不规则高领毛衣，自然侧逆光强调纱线立体感。缓慢推进的中景镜头，85mm 浅景深，远山与沙地虚化，无对话，伴随沙漠风声、羊毛织物轻响与环境电子氛围乐。",
    promptEn:
      "Photorealistic high-end fashion editorial, creamy off-white base with bold patches of royal blue, deep violet, and lavender. A curly-haired young man in an oversized irregular turtleneck knit stands in a barren desert, soft natural side‑front light emphasizing the yarn’s 3D texture. Slow cinematic zoom from a medium shot, 85mm shallow depth of field, distant mountains and desert floor in bokeh. No dialogue, desert wind, soft wool rustle, and ambient electronic track.",
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
