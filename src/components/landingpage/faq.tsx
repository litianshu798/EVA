import React from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Faq(params: { multiLanguage: string; grid: boolean }) {
  const t = useTranslations(params.multiLanguage);

  const faqs = [
    { title: t("FAQ.Q1"), content: t("FAQ.A1") },
    { title: t("FAQ.Q2"), content: t("FAQ.A2") },
    { title: t("FAQ.Q3"), content: t("FAQ.A3") },
    { title: t("FAQ.Q4"), content: t("FAQ.A4") },
    { title: t("FAQ.Q5"), content: t("FAQ.A5") },
    { title: t("FAQ.Q6"), content: t("FAQ.A6") },
  ];

  const firstHalf = faqs.slice(0, Math.ceil(faqs.length / 2));
  const secondHalf = faqs.slice(Math.ceil(faqs.length / 2));

  const FaqItem = ({ item, i }: { item: { title: string; content: string }; i: number }) => (
    <details
      key={i}
      className="group border-b border-gray-100 last:border-0"
    >
      <summary className="cursor-pointer w-full px-0 py-5 flex justify-between items-center list-none">
        <h3 className="text-sm font-medium text-gray-900 pr-6 leading-relaxed">
          {item.title}
        </h3>
        <Icon
          icon="solar:alt-arrow-down-linear"
          width={16}
          className="flex-shrink-0 transform transition-transform duration-200 group-open:rotate-180 text-gray-400"
        />
      </summary>
      <div className="pb-5 text-sm text-gray-500 leading-relaxed">
        {item.content}
      </div>
    </details>
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-4 md:px-8">
      <div className="flex w-full flex-col items-center gap-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10 tracking-tight">
          {t("FAQ.title")}
        </h2>
        <div
          className={`grid grid-cols-1 gap-0 w-full border border-gray-100 rounded-2xl overflow-hidden ${
            params.grid ? "md:grid-cols-2" : "md:grid-cols-1"
          }`}
        >
          <div className="bg-white px-8 py-2">
            {firstHalf.map((item, i) => (
              <FaqItem key={i} item={item} i={i} />
            ))}
          </div>
          <div className="bg-white px-8 py-2 border-t md:border-t-0 md:border-l border-gray-100">
            {secondHalf.map((item, i) => (
              <FaqItem key={i} item={item} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
