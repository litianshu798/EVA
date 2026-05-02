"use client";

import { Copy, ImageIcon, Sparkles, Video } from "lucide-react";
import { useState } from "react";

interface ShowcaseItem {
  title: string;
  titleEn: string;
  titlePt?: string;
  type: "image" | "video";
  asset?: string;
  prompt: string;
  promptEn: string;
  promptPt?: string;
  style: string;
  styleEn: string;
  stylePt?: string;
}

const VIDEO_SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    title: "模特第一视角",
    titleEn: "Model's first perspective",
    titlePt: "Primeira perspectiva da modelo",
    type: "video",
    asset: "/resources/example1.mp4",
    style: "写实直拍 / 侧窗柔光/ 特写镜头",
    styleEn: "Black-gold studio / glossy material / gift set",
    stylePt: "Filmagem realista / luz lateral suave / close-up",
    prompt: "极致超写实模拟智能手机高清画质，自然柔和的侧窗光与温暖琥珀色调，红发绿眼女子穿白色背心戴三条金链，固定机位从中近景缓慢推向特写，35mm广角加浅景深，背景厨房柔焦；她自然眨眼、微笑，面部肌肉运动，雀斑在光下清晰可见，同时用葡萄牙语说“我们看起来真的很真实对吧？靠近点，很奇怪吧？但它是真实的……或者说接近真实”，背景伴有轻快流行乐或低保真音轨，人声清晰带呼吸停顿。",
    promptEn:
      "Extreme photorealistic smartphone-grade quality, soft side window light with warm amber tones, a freckled redhead green-eyed woman in a white tank top and three thin gold chains; fixed camera slowly pushes from medium close-up to close-up, 35mm wide lens with shallow depth of field and kitchen background bokeh. She naturally blinks, smiles with full facial muscle movement, as the lens closes in on her realistic freckles, speaking Portuguese: “Eu entendo, a gente parece real mesmo, né? Aproxima aqui. É estranho, né? Mas é real... ou quase.” Background light pop or lo-fi track with clear vocals and natural breath pauses.",
    promptPt:
      "Qualidade hiper-realista de smartphone, luz lateral suave com tom âmbar, mulher ruiva de olhos verdes usando regata branca e correntes douradas; câmera fixa aproxima de plano médio para close, lente 35mm e fundo de cozinha desfocado. Ela pisca, sorri naturalmente e fala em português com pausas reais: “Eu entendo, a gente parece real mesmo, né? Aproxima aqui. É estranho, né? Mas é real... ou quase.” Trilha pop leve ou lo-fi.",
  },
  {
    title: "产品实拍介绍",
    titleEn: "Product real shot introduction",
    titlePt: "Apresentação real do produto",
    type: "video",
    asset: "/resources/example2.mp4",
    style: "真实场景 / 阳光氛围 / 缓慢推进",
    styleEn: "Real scene / sunlight mood / slow dolly",
    stylePt: "Cena real / luz solar / aproximação lenta",
    prompt: "镜头缓缓推进。模特微微调整重心，双手插兜，夹克自然地垂落在胸前。提示：镜头缓缓推进，模特双手插兜微微调整重心，棒球夹克面料自然垂落，阳光投射出柔和的阴影，背景中棕榈树轻轻摇曳，温暖的电影感光线，浅景深，胶片颗粒，8K",
    promptEn:
      "The camera slowly pushes in. Themodel subtly shifts weight, handsin pockets, jacket settlingnaturally across the torso.Prompt: slow push in, modelsubtly shifting weight with handsin pockets, varsity jacket fabricadjusting naturally, sunlightcasting soft shadows, palm treesmoving gently in background,warm cinematic lighting, shallowdepth of field, film grain, 8k",
    promptPt:
      "A câmera aproxima lentamente. O modelo ajusta o peso do corpo, mãos nos bolsos, e a jaqueta assenta naturalmente no torso. Luz solar com sombras suaves, palmeiras ao fundo em leve movimento, iluminação cinematográfica quente, profundidade de campo rasa, grão de filme, 8K.",
  },
  {
    title: "工业级产品宣传视频",
    titleEn: "Industrial-grade product promotional video",
    titlePt: "Vídeo promocional industrial do produto",
    type: "video",
    asset: "/resources/example3.mp4",
    style: "工业级长镜头 / 镜头切换 / 微距视角",
    styleEn: "Industrial-grade telephoto lens / Lens switching / Macro perspective",
    stylePt: "Plano industrial / macro extremo / movimento contínuo",
    prompt: `“描述”：一镜到底的工业电影长镜头。一双米白色运动鞋在刺眼的聚光灯下。镜头猛烈地深入编织鞋面，缩小至微观尺度。风格”：超写实CGI，极致微距动作，4K摄影机：高速前移，无限微距变焦，手持抖动，无剪辑。“照明”：外部暗光，内部织物明亮高对比度照明。“运动”：镜头高速穿过阻挡路径的巨大交叉纤维，倾斜和摇晃以躲避碰撞，湍急的纤维从眼前掠过。紧张气氛迅速累积，随后镜头高速拉近，直接进入场景 `,
    promptEn: `"DESCRIPTION":"SINGLECONTINUOUS INDUSTRIAL CINEMATICSHOT. OFF-WHITE SNEAKERS UNDERHARSH SPOTLIGHT. CAMERAVIOLENTLY PLUNGES INTO THEWOVEN UPPER.SHRINKING TO
MICROSCOPIC SCALE."
STYLE":"HYPER-REALISTIC CGIEXTREME MACRO ACTION, 4KCAMERA":"HIGH-SPEED FORWARDDOLLY, INFINITE MACRO ZOOM,HANDHELD SHAKE, NO CUTS","LIGHTING":"DARK SPOTLIGHTOUTSIDE, BRIGHT HIGH-CONTRASTLIGHTING INSIDE FABRIC""MOTION":"CAMERA RACESTHROUGH GIANT CROSSING FIBERSBLOCKING THE PATH,TILTING ANDSHAKING TO DODGENEAR-COLLISIONS, TURBULENT MISTRUSHING PAST. TENSION BUILDINGRAPIDLY BEFORE A STRAIGHTHIGH-SPEED ZOOM BURSTINGDIRECTLY INTO SCENE 2",TEXT:"NONE"`,
    promptPt:
      "Plano cinematográfico industrial contínuo. Tênis off-white sob holofote intenso; a câmera mergulha no cabedal tecido e reduz até escala microscópica. CGI hiper-realista, ação macro extrema, avanço rápido, zoom infinito, leve tremor de mão, luz interna de alto contraste, fibras gigantes cruzando o caminho, sem texto.",
  },
  {
    title: "产品讲解介绍",
    titleEn: "Product Explanation and Introduction",
    titlePt: "Explicação e apresentação do produto",
    type: "video",
    style: "柔光效果 / 讲解介绍 / 模拟场景",
    asset: "/resources/example4.mp4",
    styleEn: "Soft Light Effect / Explanation and Introduction / Simulated Scene",
    stylePt: "Luz suave / explicação / cena simulada",
    prompt: "高精3D超写实质感，黑曜石鞋底发出炽热橙红与亮黄色内光，网眼编织和光滑胶面细节清晰，大量细小发光灰烬粒子悬浮飘动；镜头从宏观粒子旋涡追踪至鞋面微距，再环绕360度旋转展示全貌，鞋子在镜面地板上缓慢自转，粒子汇聚成鞋体后ZoomX字样、Swoosh标依次高光闪现，背景为暗黑虚化，氛围高能未来感，搭配重低音呼啸声、电子脉冲与合成器节奏。",
    promptEn:
      `High-end 3D photorealistic texture with a deep obsidian shoe sole glowing in vibrant lava orange and radiant yellow, intricate mesh weaving and glossy surfaces, surrounded by floating glowing ember-like particles. The camera starts inside a swirling vortex of particles, then zooms tight on the ZoomX lettering and mesh, followed by a sweeping 360-degree orbital rotation. The shoe slowly spins on a dark mirror-like reflective floor as particles coalesce into its form, with crisp white Swoosh and silver branding flashing. Deep bass whooshes, low electronic hum, and a pulsing synth track complete the high-tech futuristic energy.`,
    promptPt:
      "Textura 3D fotorrealista de alta qualidade com uma sola de tênis em obsidiana profunda, brilhando em um vibrante laranja lava e amarelo radiante, trama de malha intrincada e superfícies brilhantes, cercada por partículas flutuantes e brilhantes semelhantes a brasas. A câmera começa dentro de um vórtice giratório de partículas, então dá um zoom na inscrição ZoomX e na malha, seguido por uma rotação orbital de 360 ​​graus. O tênis gira lentamente sobre um piso escuro e espelhado enquanto as partículas se unem para formar sua imagem, com o Swoosh branco nítido e a marca prateada piscando. Graves profundos, um zumbido eletrônico baixo e uma trilha pulsante de sintetizador completam a energia futurista de alta tecnologia.",
  },
  {
    title: "模特商品展示",
    titleEn: "Fashion Lookbook Motion",
    titlePt: "Lookbook de moda em movimento",
    type: "video",
    asset: "/resources/example5.mp4",
    style: "模特动线 / 影棚布光 / 社媒短片",
    styleEn: "Model motion / studio lighting / social short",
    stylePt: "Movimento de modelo / luz de estúdio / social short",
    prompt: "极致写实，灰褐衬衫、灰大衣与牛仔蓝，自然肤质微透光；逆光黄金时刻，发丝与肩膀呈金色轮廓光，脸部柔光无硬影。低角度后跟移拍，轻微手持感，85mm浅景深，城市背景融为柔焦。女子戴圆框墨镜、右手拿白咖啡杯、左手插兜，棕色长发随风飘动，从正面行走转为回眸后望。无台词，环境混音配低保真爵士或 chill-hop。",
    promptEn:
      "Photorealistic with rich textures: taupe shirt, gray trench, denim jeans, natural glowing skin. Golden hour backlit by the sun with a strong rim light on hair and shoulders, soft fill on the face. Low-to-mid angle tracking backward with slight handheld motion, 85mm lens, shallow depth of field, creamy urban bokeh. A woman in round sunglasses walks holding a white coffee cup, left hand in pocket, windblown brown hair, transitioning from forward stroll to a look-back over her shoulder. No dialogue, ambient city sounds with lo‑fi jazz or chill-hop.",
    promptPt:
      "Fotorealista, camisa taupe, trench cinza e jeans; pele natural luminosa. Contraluz de golden hour com recorte forte no cabelo e ombros, preenchimento suave no rosto. Travelling para trás em ângulo baixo-médio, leve câmera de mão, lente 85mm, fundo urbano desfocado. Mulher com óculos redondos caminha com copo de café e olha para trás. Sem fala, jazz lo-fi.",
  },
  {
    title: "沙漠编织幻境",
    titleEn: "Desert Knit Mirage",
    titlePt: "Miragem de tricô no deserto",
    type: "video",
    asset: "/resources/example6.mp4",
    style: "高定时装质感 / 写实背景",
    styleEn: "Haute couture quality / Realistic background",
    stylePt: "Alta-costura / fundo realista",
    prompt: "超写实高定时尚画质，乳白与象牙色为底，点缀宝蓝、深紫与淡紫几何针织，男子身处荒芜沙漠，厚卷发，超大不规则高领毛衣，自然侧逆光强调纱线立体感。缓慢推进的中景镜头，85mm 浅景深，远山与沙地虚化，无对话，伴随沙漠风声、羊毛织物轻响与环境电子氛围乐。",
    promptEn:
      "Photorealistic high-end fashion editorial, creamy off-white base with bold patches of royal blue, deep violet, and lavender. A curly-haired young man in an oversized irregular turtleneck knit stands in a barren desert, soft natural side‑front light emphasizing the yarn’s 3D texture. Slow cinematic zoom from a medium shot, 85mm shallow depth of field, distant mountains and desert floor in bokeh. No dialogue, desert wind, soft wool rustle, and ambient electronic track.",
    promptPt:
      "Editorial de moda premium fotorealista, base off-white com blocos em azul royal, violeta profundo e lavanda. Homem jovem de cabelo cacheado usa tricô oversized no deserto; luz natural lateral destaca a textura 3D do fio. Zoom cinematográfico lento, lente 85mm, montanhas desfocadas, vento do deserto e trilha eletrônica ambiente.",
  },
];

const IMAGE_SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    title: "电商白底 SKU 图",
    titleEn: "Marketplace SKU White Shot",
    titlePt: "SKU em fundo branco para marketplace",
    type: "image",
    asset: "/resources/example1.png",
    style: "白底规范 / 阴影真实 / 平台上架",
    styleEn: "White background / realistic shadow / marketplace ready",
    stylePt: "Fundo branco / sombra realista / pronto para marketplace",
    prompt: "纯白无缝背景，单个产品居中，真实接触阴影，比例准确，无多余道具，适合亚马逊与独立站上架",
    promptEn:
      "Pure white seamless background, single product centered, realistic contact shadow, accurate proportions, no extra props, ready for Amazon and DTC storefronts",
    promptPt:
      "Fundo branco contínuo, produto único centralizado, sombra de contato realista, proporções corretas, sem objetos extras, pronto para Amazon e loja DTC",
  },
  {
    title: "美妆套装主图",
    titleEn: "Beauty Set Hero Image",
    titlePt: "Imagem hero de kit de beleza",
    type: "image",
    asset: "/resources/example2.png",
    style: "高端棚拍 / 套装陈列 / 柔光",
    styleEn: "Premium studio / set composition / soft light",
    stylePt: "Estúdio premium / composição de kit / luz suave",
    prompt: "浅米白高级棚拍背景，护肤套装按主次层级陈列，柔和阴影，包装文字清晰，电商首页主视觉",
    promptEn:
      "Warm off-white premium studio background, skincare set arranged with visual hierarchy, soft shadows, clear package typography, e-commerce homepage hero image",
    promptPt:
      "Fundo de estúdio premium off-white quente, kit de skincare organizado com hierarquia visual, sombras suaves, texto da embalagem legível, imagem hero para e-commerce",
  },
  {
    title: "服饰详情卖点图",
    titleEn: "Fashion Detail Selling Point",
    titlePt: "Detalhe de moda com pontos de venda",
    type: "image",
    asset: "/resources/example3.png",
    style: "材质细节 / 拼贴构图 / 卖点标注",
    styleEn: "Material detail / collage layout / selling points",
    stylePt: "Detalhe de material / colagem / argumentos de venda",
    prompt: "高级服饰产品详情图，主图加面料微距细节拼贴，干净留白，适合展示防皱、透气、剪裁卖点",
    promptEn:
      "Premium fashion product detail image, hero shot plus fabric macro detail collage, clean whitespace, suitable for wrinkle-resistant, breathable, tailored selling points",
    promptPt:
      "Imagem premium de detalhe de moda, foto principal com colagem macro do tecido, respiro limpo, ideal para destacar tecido anti-rugas, respirável e corte refinado",
  },
  {
    title: "食品饮料促销 Banner",
    titleEn: "Food & Beverage Promo Banner",
    titlePt: "Banner promocional de alimentos e bebidas",
    type: "image",
    asset: "/resources/example4.png",
    style: "清爽冰感 / 水珠 / 夏季促销",
    styleEn: "Icy fresh / droplets / summer campaign",
    stylePt: "Gelado e fresco / gotas / campanha de verão",
    prompt: "清爽冰块与水珠背景，罐装饮料居中，明亮夏季光线，飞溅动效定格，适合电商促销Banner",
    promptEn:
      "Refreshing ice cubes and water droplets background, canned drink centered, bright summer lighting, frozen splash motion, suitable for e-commerce campaign banner",
    promptPt:
      "Fundo com cubos de gelo e gotas d'água, bebida em lata centralizada, luz clara de verão, respingo congelado em movimento, ideal para banner promocional de e-commerce",
  },
  {
    title: "科技新品海报",
    titleEn: "Tech Launch Poster",
    titlePt: "Pôster de lançamento tech",
    type: "image",
    asset: "/resources/example5.png",
    style: "科技蓝图 / 微距细节 / 发售物料",
    styleEn: "Tech blueprint / macro detail / launch creative",
    stylePt: "Blueprint tech / macro / lançamento",
    prompt: "未来感科技蓝图背景，无线耳机产品微距特写，金属与塑料材质清晰，边缘冷光，适合新品发售海报",
    promptEn:
      "Futuristic technical blueprint background, macro close-up of wireless earbuds, clear metal and plastic materials, cool edge lighting, suitable for a product launch poster",
    promptPt:
      "Fundo de blueprint tecnológico futurista, close macro de fones sem fio, metal e plástico bem definidos, luz fria nas bordas, ideal para pôster de lançamento",
  },
  {
    title: "家居生活方式图",
    titleEn: "Home Lifestyle Image",
    titlePt: "Imagem lifestyle para casa",
    type: "image",
    asset: "/resources/example6.png",
    style: "真实场景 / 家居日光 / 使用氛围",
    styleEn: "Real scene / home daylight / in-use mood",
    stylePt: "Cena real / luz natural em casa / uso cotidiano",
    prompt: "现代家居场景，自然日光，产品摆放在桌面使用环境中，背景轻微虚化，真实可信的生活方式摄影",
    promptEn:
      "Modern home scene, natural daylight, product placed in an in-use tabletop environment, slight background blur, authentic lifestyle photography",
    promptPt:
      "Cena moderna de casa com luz natural, produto em uso sobre a mesa, fundo levemente desfocado, fotografia lifestyle autêntica",
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
  const isPt = locale === "pt";
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
              {isPt ? "Biblioteca Criativa de Commerce AI" : "AI Commerce Creative Library"}
            </div>
            <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-white md:text-4xl">
              {isZh ? "高转化电商素材样例库" : isPt ? "Exemplos de commerce com alta conversão" : "High-converting commerce examples"}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-white/55">
            {isZh
              ? variant === "image"
                ? "覆盖商品主图、详情页卖点图、品牌海报、促销 Banner。没有现成素材的样例先保留占位，方便后续替换真实资产。"
                : "覆盖商品展示视频、场景短片、社媒动效、详情页 360 展示。没有现成素材的样例先保留占位，方便后续替换真实资产。"
              : isPt
                ? variant === "image"
                  ? "Cobre imagem principal, detalhes de PDP, pôsteres de marca e banners de campanha. Amostras sem asset ficam como espaços limpos para substituição futura."
                  : "Cobre vídeos de produto, cenas lifestyle, motion para social e exibição 360 de PDP. Amostras sem asset ficam como espaços limpos para substituição futura."
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
            const title = isZh ? item.title : isPt ? item.titlePt || item.titleEn : item.titleEn;
            const style = isZh ? item.style : isPt ? item.stylePt || item.styleEn : item.styleEn;
            const prompt = isZh ? item.prompt : isPt ? item.promptPt || item.promptEn : item.promptEn;
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
                        {isZh ? "素材占位" : isPt ? "Espaço para asset" : "Asset Placeholder"}
                      </span>
                    </div>
                  )}
                  <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm backdrop-blur">
                    {item.type === "video" ? (
                      <Video className="h-3.5 w-3.5 text-rose-500" />
                    ) : (
                      <ImageIcon className="h-3.5 w-3.5 text-emerald-600" />
                    )}
                    {item.type === "video" ? (isPt ? "Vídeo" : "Video") : (isPt ? "Imagem" : "Image")}
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
                    {isCopied ? (isZh ? "已复制" : isPt ? "Copiado" : "Copied") : "Prompt"}
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
