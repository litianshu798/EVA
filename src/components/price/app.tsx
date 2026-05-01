"use client";

import React, { useState } from "react";
import { Button, Chip, Tab, Tabs } from "@heroui/react";
import { Check, CircleDollarSign, Layers3, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import { FrequencyEnum } from "@/components/price/pricing-types";
import { frequencies, tiers } from "@/components/price/pricing-tiers";
import { useAppContext } from "@/contexts/app";

export default function Pricing() {
  const [selectedFrequency, setSelectedFrequency] = React.useState(
    frequencies.find((f) => f.key === FrequencyEnum.Yearly) || frequencies[0]
  );
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const { user } = useAppContext();
  const router = useRouter();
  const locale = useLocale();
  const isZh = locale === "zh";

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
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-600 shadow-sm">
              <CircleDollarSign className="h-3.5 w-3.5 text-emerald-600" />
              Commerce AI Capacity
            </div>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-950 md:text-6xl">
              {isZh ? "按电商生产节奏选择套餐" : "Plans built around commerce production"}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
              {isZh
                ? "无论是上新前的批量商品图、日常广告素材，还是品牌短视频动效，都可以按积分产能灵活规划。"
                : "Plan capacity for launch batches, daily ad creatives, product images, and premium motion assets with predictable credits."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 shadow-sm">
            {[
              ["20+", isZh ? "素材方向" : "asset directions"],
              ["4K", isZh ? "高清输出" : "HD output"],
              ["SKU", isZh ? "批量生产" : "batch workflow"],
            ].map(([value, label]) => (
              <div key={value} className="bg-white p-5">
                <div className="text-2xl font-bold text-gray-950">{value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-gray-400">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <Tabs
            classNames={{
              tabList: "border border-gray-200 bg-white p-1 rounded-full shadow-sm",
              cursor: "bg-gray-950 rounded-full",
              tab: "h-10 px-4",
              tabContent:
                "text-sm group-data-[selected=true]:text-white group-data-[selected=false]:text-gray-600",
            }}
            radius="full"
            onSelectionChange={onFrequencyChange}
            defaultSelectedKey={FrequencyEnum.Yearly}
          >
            <Tab
              key={FrequencyEnum.Yearly}
              title={
                <div className="flex items-center gap-2">
                  <span>{isZh ? "年付" : "Yearly"}</span>
                  <Chip size="sm" className="bg-emerald-100 text-emerald-700">
                    {isZh ? "省 30%" : "Save 30%"}
                  </Chip>
                </div>
              }
            />
            <Tab key={FrequencyEnum.Monthly} title={isZh ? "月付" : "Monthly"} />
            <Tab key={FrequencyEnum.OneTime} title={isZh ? "单次购买" : "Pay as you go"} />
          </Tabs>

          <div className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-4 py-2 text-sm text-white">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            {isZh ? "Stripe 安全支付，积分即时到账" : "Secure Stripe checkout, credits ready after payment"}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.key}
              className={`relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                tier.mostPopular
                  ? "border-gray-950 ring-4 ring-gray-950/5"
                  : "border-gray-200"
              }`}
            >
              {tier.mostPopular && (
                <div className="absolute right-5 top-5 rounded-full bg-gray-950 px-3 py-1 text-xs font-medium text-white">
                  {isZh ? "推荐" : "Most Popular"}
                </div>
              )}
              <div className="mb-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                  {tier.mostPopular ? (
                    <Zap className="h-5 w-5 text-amber-500" />
                  ) : tier.featured ? (
                    <Sparkles className="h-5 w-5 text-cyan-600" />
                  ) : (
                    <Layers3 className="h-5 w-5 text-gray-700" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-950">
                  {tier.title}
                </h3>
                <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-500">
                  {tier.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-2">
                  {typeof tier.price !== "string" &&
                    tier.previousPrice?.[selectedFrequency.key] && (
                      <span className="pb-1 text-lg text-gray-400 line-through">
                        {tier.previousPrice[selectedFrequency.key]}
                      </span>
                    )}
                  <span className="text-5xl font-bold tracking-tight text-gray-950">
                    {typeof tier.price === "string"
                      ? tier.price
                      : tier.price[selectedFrequency.key]}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  {selectedFrequency.priceSuffix}
                </p>
              </div>

              <ul className="mb-8 space-y-3">
                {tier.features?.[selectedFrequency.key].map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-gray-600">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                fullWidth
                className={`h-11 rounded-xl text-sm font-medium ${
                  tier.mostPopular
                    ? "bg-gray-950 text-white"
                    : "bg-gray-100 text-gray-950"
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
                {isZh ? "选择套餐" : tier.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 md:grid-cols-3">
          {[
            [isZh ? "适合上新批次" : "Launch batches", isZh ? "集中生成主图、详情页和促销短片。" : "Generate hero shots, PDP visuals, and promo clips together."],
            [isZh ? "适合广告测试" : "Ad testing", isZh ? "快速扩展不同风格与场景，提高素材测试速度。" : "Explore more styles and scenarios for faster creative testing."],
            [isZh ? "适合团队协作" : "Team workflow", isZh ? "用积分规划产能，减少临时外包和反复沟通。" : "Plan production with credits and reduce ad hoc outsourcing."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-xl bg-white p-5">
              <h4 className="text-sm font-semibold text-gray-950">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
