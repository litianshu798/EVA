"use client";

import React, { useState } from "react";
import { Button, Chip, Tab, Tabs } from "@heroui/react";
import {
  Check,
  CircleDollarSign,
  Clock,
  Crown,
  Layers3,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import { FrequencyEnum } from "@/components/price/pricing-types";
import { frequencies, tiers } from "@/components/price/pricing-tiers";
import { useAppContext } from "@/contexts/app";

const localeKey = (locale: string) =>
  locale === "zh" ? "zh" : locale === "pt" ? "pt" : "en";

const PRICING_COPY = {
  zh: {
    eyebrow: "电商 AI 产能",
    title: "按电商生产节奏选择套餐",
    description: "无论是上新前的批量商品图、日常广告素材，还是品牌短视频动效，都可以按积分产能灵活规划。",
    badges: ["一次上新可覆盖主图+视频", "减少拍摄与外包成本", "付款后积分即时可用"],
    stats: ["素材方向", "高清输出", "节省拍摄沟通"],
    yearly: "年付",
    monthly: "月付",
    onetime: "单次购买",
    save: "省 30%",
    secure: "Stripe 安全支付，积分即时到账",
    popular: "推荐",
    choose: "选择套餐",
    suffix: {
      [FrequencyEnum.Yearly]: "按月折算",
      [FrequencyEnum.Monthly]: "每月",
      [FrequencyEnum.OneTime]: "一次性",
    },
    reasonsTitle: "为什么看起来更划算",
    includedTitle: "下单后获得",
    cards: [
      ["适合上新批次", "集中生成主图、详情页和促销短片。"],
      ["适合广告测试", "快速扩展不同风格与场景，提高素材测试速度。"],
      ["适合团队协作", "用积分规划产能，减少临时外包和反复沟通。"],
    ],
    reasons: [
      "一次拍摄外包通常覆盖不了多个渠道尺寸。",
      "gptimage 可以围绕同一 SKU 反复扩展场景和素材。",
      "素材测试速度越快，广告和上新损耗越低。",
    ],
    included: [
      "文生图与图生视频工具全开放",
      "积分可用于不同模型灵活消耗",
      "适配商品主图、详情页、社媒短视频",
      "生成记录保存在工作台，方便复用",
    ],
  },
  en: {
    eyebrow: "Commerce AI Capacity",
    title: "Plans built around commerce production",
    description: "Plan capacity for launch batches, daily ad creatives, product images, and premium motion assets with predictable credits.",
    badges: ["Images + videos for each launch", "Reduce shoot and outsourcing cost", "Credits available after checkout"],
    stats: ["asset directions", "HD output", "less creative ops"],
    yearly: "Yearly",
    monthly: "Monthly",
    onetime: "Pay as you go",
    save: "Save 30%",
    secure: "Secure Stripe checkout, credits ready after payment",
    popular: "Most Popular",
    choose: "Purchase",
    suffix: {
      [FrequencyEnum.Yearly]: "per month",
      [FrequencyEnum.Monthly]: "per month",
      [FrequencyEnum.OneTime]: "one time",
    },
    reasonsTitle: "Why the plans pay back quickly",
    includedTitle: "Included after checkout",
    cards: [
      ["Launch batches", "Generate hero shots, PDP visuals, and promo clips together."],
      ["Ad testing", "Explore more styles and scenarios for faster creative testing."],
      ["Team workflow", "Plan production with credits and reduce ad hoc outsourcing."],
    ],
    reasons: [
      "A single outsourced shoot rarely covers every channel size.",
      "gptimage can expand multiple scenes and assets around the same SKU.",
      "Faster creative testing lowers launch and ad waste.",
    ],
    included: [
      "Full access to image and video tools",
      "Credits work across available models",
      "Built for hero shots, PDPs, and social videos",
      "Workspace history for reuse and review",
    ],
  },
  pt: {
    eyebrow: "Capacidade de Commerce AI",
    title: "Planos pensados para a produção de e-commerce",
    description: "Planeje capacidade para lançamentos, criativos de anúncios, imagens de produto e vídeos premium com créditos previsíveis.",
    badges: ["Imagens + vídeos por lançamento", "Reduza custos de produção externa", "Créditos liberados após o pagamento"],
    stats: ["direções de asset", "saída HD", "menos operação criativa"],
    yearly: "Anual",
    monthly: "Mensal",
    onetime: "Avulso",
    save: "Economize 30%",
    secure: "Checkout seguro via Stripe, créditos prontos após pagamento",
    popular: "Mais popular",
    choose: "Comprar plano",
    suffix: {
      [FrequencyEnum.Yearly]: "por mês",
      [FrequencyEnum.Monthly]: "por mês",
      [FrequencyEnum.OneTime]: "pagamento único",
    },
    reasonsTitle: "Por que os planos se pagam rápido",
    includedTitle: "Incluído após a compra",
    cards: [
      ["Lotes de lançamento", "Gere imagem principal, visuais de PDP e vídeos promocionais juntos."],
      ["Teste de anúncios", "Explore estilos e cenários para acelerar testes criativos."],
      ["Fluxo de equipe", "Planeje produção com créditos e reduza terceirizações pontuais."],
    ],
    reasons: [
      "Uma sessão terceirizada raramente cobre todos os formatos de canal.",
      "gptimage expande várias cenas e assets em torno do mesmo SKU.",
      "Testes criativos mais rápidos reduzem perdas em anúncios e lançamentos.",
    ],
    included: [
      "Acesso completo às ferramentas de imagem e vídeo",
      "Créditos funcionam entre modelos disponíveis",
      "Feito para imagens hero, PDPs e vídeos sociais",
      "Histórico no workspace para revisar e reutilizar",
    ],
  },
} as const;

const TIER_COPY = {
  zh: {
    basic: {
      title: "Basic",
      description: "适合刚开始测试 AI 素材的店铺。",
      features: {
        yearly: ["每年 1800 积分", "全部工具可用", "邮件支持"],
        monthly: ["每月 150 积分", "全部工具可用", "邮件支持"],
        onetime: ["150 积分，有效期一个月", "全部工具可用", "邮件支持"],
      },
    },
    standard: {
      title: "Standard",
      description: "适合持续上新和日常广告素材生产。",
      features: {
        yearly: ["每年 7200 积分", "全部工具可用", "邮件支持"],
        monthly: ["每月 600 积分", "全部工具可用", "邮件支持"],
        onetime: ["600 积分，有效期一个月", "全部工具可用", "邮件支持"],
      },
    },
    premium: {
      title: "Premium",
      description: "适合品牌、团队和高频素材测试。",
      features: {
        yearly: ["每年 18000 积分", "全部工具可用", "邮件支持"],
        monthly: ["每月 1500 积分", "全部工具可用", "邮件支持"],
        onetime: ["1500 积分，有效期一个月", "全部工具可用", "邮件支持"],
      },
    },
  },
  en: null,
  pt: {
    basic: {
      title: "Basic",
      description: "Para lojas que querem começar a testar assets com IA.",
      features: {
        yearly: ["1800 créditos por ano", "Todas as ferramentas disponíveis", "Suporte por e-mail"],
        monthly: ["150 créditos por mês", "Todas as ferramentas disponíveis", "Suporte por e-mail"],
        onetime: ["150 créditos por um mês", "Todas as ferramentas disponíveis", "Suporte por e-mail"],
      },
    },
    standard: {
      title: "Standard",
      description: "Para lançamentos recorrentes e produção diária de anúncios.",
      features: {
        yearly: ["7200 créditos por ano", "Todas as ferramentas disponíveis", "Suporte por e-mail"],
        monthly: ["600 créditos por mês", "Todas as ferramentas disponíveis", "Suporte por e-mail"],
        onetime: ["600 créditos por um mês", "Todas as ferramentas disponíveis", "Suporte por e-mail"],
      },
    },
    premium: {
      title: "Premium",
      description: "Para marcas, equipes e testes criativos frequentes.",
      features: {
        yearly: ["18000 créditos por ano", "Todas as ferramentas disponíveis", "Suporte por e-mail"],
        monthly: ["1500 créditos por mês", "Todas as ferramentas disponíveis", "Suporte por e-mail"],
        onetime: ["1500 créditos por um mês", "Todas as ferramentas disponíveis", "Suporte por e-mail"],
      },
    },
  },
} as const;

export default function Pricing() {
  const [selectedFrequency, setSelectedFrequency] = React.useState(
    frequencies.find((f) => f.key === FrequencyEnum.Yearly) || frequencies[0]
  );
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const { user } = useAppContext();
  const router = useRouter();
  const locale = useLocale();
  const copy = PRICING_COPY[localeKey(locale)];
  const tierCopy = TIER_COPY[localeKey(locale)];
  const heroBadges: Array<[string, LucideIcon]> = [
    [copy.badges[0], Rocket],
    [copy.badges[1], TrendingUp],
    [copy.badges[2], Clock],
  ];

  const onFrequencyChange = (selectedKey: React.Key) => {
    const frequencyIndex = frequencies.findIndex((f) => f.key === selectedKey);
    setSelectedFrequency(frequencies[frequencyIndex]);
  };

  const handleCheckout = async (
    tierKey: string,
    plan_id: number,
    amount: number,
    interval: string
  ) => {
    try {
      setLoadingTier(tierKey);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id,
          amount,
          interval,
          user_uuid: user?.uuid,
          user_email: user?.email,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push(`/${locale}/login`);
        return;
      }

      if (response.status === 500) {
        toast.error(data.error || "Checkout failed. Please try again.");
        return;
      }

      if (!data?.session?.url) {
        toast.error("Invalid response from server");
        return;
      }

      router.push(data.session.url);
    } catch (e) {
      console.error("Checkout failed:", e);
      toast.error("Checkout failed. Please try again later.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <section className="w-full">
      <div className="relative overflow-hidden bg-gray-950 pb-28 pt-14 text-white md:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(34,211,238,0.24),transparent_30%),radial-gradient(circle_at_78%_8%,rgba(245,158,11,0.18),transparent_28%),linear-gradient(180deg,#020617,#111827)]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70 shadow-sm">
              <CircleDollarSign className="h-3.5 w-3.5 text-emerald-300" />
              {copy.eyebrow}
            </div>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white md:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
              {copy.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {heroBadges.map(([text, Icon]) => (
                <div
                  key={text as string}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/75"
                >
                  <Icon className="h-4 w-4 text-cyan-200" />
                  {text as string}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl">
            {[
              ["20+", copy.stats[0]],
              ["4K", copy.stats[1]],
              ["90%", copy.stats[2]],
            ].map(([value, label]) => (
              <div key={value} className="bg-white/[0.06] p-5 backdrop-blur">
                <div className="text-3xl font-bold text-white">{value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-white/45">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>

      <div className="mx-auto -mt-20 max-w-7xl px-4 md:px-8">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur md:p-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <Tabs
            classNames={{
              base: "md:w-auto",
              tabList:
                "min-w-max border border-white/10 bg-white/10 p-1 rounded-full shadow-sm",
              cursor: "bg-white rounded-full",
              tab: "h-10 px-4 whitespace-nowrap flex-shrink-0",
              tabContent:
                "whitespace-nowrap text-sm group-data-[selected=true]:text-gray-950 group-data-[selected=false]:text-white/60",
            }}
            radius="full"
            onSelectionChange={onFrequencyChange}
            defaultSelectedKey={FrequencyEnum.Yearly}
          >
            <Tab
              key={FrequencyEnum.Yearly}
              title={
                <div className="flex items-center gap-2">
                  <span>{copy.yearly}</span>
                  <Chip size="sm" className="bg-emerald-400/15 text-emerald-200">
                    {copy.save}
                  </Chip>
                </div>
              }
            />
            <Tab key={FrequencyEnum.Monthly} title={copy.monthly} />
            <Tab key={FrequencyEnum.OneTime} title={copy.onetime} />
          </Tabs>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/75">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            {copy.secure}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {tiers.map((tier) => {
            const localizedTier =
              tierCopy && tier.key in tierCopy
                ? tierCopy[tier.key as keyof typeof tierCopy]
                : null;
            return (
            <div
              key={tier.key}
              className={`relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                tier.mostPopular
                  ? "border-amber-300/40 bg-white/[0.10] ring-4 ring-amber-300/20"
                  : "border-white/10 bg-white/[0.055]"
              }`}
            >
              {tier.mostPopular && (
                <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#06b6d4,#f59e0b,#f43f5e)]" />
              )}
              {tier.mostPopular && (
                <div className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-950">
                  <Crown className="h-3.5 w-3.5 text-amber-300" />
                  {copy.popular}
                </div>
              )}
              <div className="mb-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  {tier.mostPopular ? (
                    <Zap className="h-5 w-5 text-amber-500" />
                  ) : tier.featured ? (
                    <Sparkles className="h-5 w-5 text-cyan-600" />
                  ) : (
                    <Layers3 className="h-5 w-5 text-cyan-200" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {localizedTier?.title || tier.title}
                </h3>
                <p className="mt-2 min-h-[48px] text-sm leading-6 text-white/52">
                  {localizedTier?.description || tier.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-2">
                  {typeof tier.price !== "string" &&
                    tier.previousPrice?.[selectedFrequency.key] && (
                      <span className="pb-1 text-lg text-white/35 line-through">
                        {tier.previousPrice[selectedFrequency.key]}
                      </span>
                    )}
                  <span className="text-5xl font-bold tracking-tight text-white">
                    {typeof tier.price === "string"
                      ? tier.price
                      : tier.price[selectedFrequency.key]}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/38">
                  {copy.suffix[selectedFrequency.key]}
                </p>
              </div>

              <ul className="mb-8 space-y-3">
                {(localizedTier?.features[selectedFrequency.key] || tier.features?.[selectedFrequency.key])?.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-white/62">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                fullWidth
                className={`h-12 rounded-xl text-sm font-semibold ${
                  tier.mostPopular
                    ? "bg-white text-gray-950 shadow-lg shadow-white/10"
                    : "bg-white/10 text-white hover:bg-white/15"
                }`}
                isLoading={loadingTier === tier.key}
                onPress={() =>
                  handleCheckout(
                    tier.key,
                    tier.id[selectedFrequency.key],
                    tier.amount[selectedFrequency.key],
                    tier.interval[selectedFrequency.key]
                  )
                }
              >
                {copy.choose}
              </Button>
            </div>
          )})}
        </div>
        </div>

        <div className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.05] p-5 md:grid-cols-3">
          {[
            ...copy.cards,
          ].map(([title, desc]) => (
            <div key={title} className="rounded-xl border border-white/10 bg-white/[0.06] p-5">
              <h4 className="text-sm font-semibold text-white">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-white/52">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-white">
              {copy.reasonsTitle}
            </h3>
            <div className="mt-5 space-y-4">
              {copy.reasons.map((text, index) => (
                <div key={text} className="flex gap-3 text-sm leading-6 text-white/62">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-300/15 text-xs font-bold text-emerald-200">
                    {index + 1}
                  </span>
                  {text}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-gray-950 p-6 text-white shadow-xl">
            <div className="mb-5 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/60">
              {copy.includedTitle}
            </div>
            <div className="grid gap-3">
              {copy.included.map((text) => (
                <div key={text} className="flex items-center gap-3 rounded-2xl bg-white/8 p-3 text-sm text-white/75">
                  <Check className="h-4 w-4 text-emerald-300" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
