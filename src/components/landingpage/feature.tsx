import React from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";

export default function FeatureHero(params: { multiLanguage: string }) {
  const t = useTranslations(params.multiLanguage);
  const features = [
    {
      icon: "solar:hourglass-line-duotone",
      title: t("Features.feature1.title"),
      description: t("Features.feature1.description"),
    },
    {
      icon: "solar:shield-check-line-duotone",
      title: t("Features.feature2.title"),
      description: t("Features.feature2.description"),
    },
    {
      icon: "solar:gallery-wide-line-duotone",
      title: t("Features.feature3.title"),
      description: t("Features.feature3.description"),
    },
    {
      icon: "solar:chart-line-duotone",
      title: t("Features.feature4.title"),
      description: t("Features.feature4.description"),
    },
    {
      icon: "solar:smartphone-2-line-duotone",
      title: t("Features.feature5.title"),
      description: t("Features.feature5.description"),
    },
    {
      icon: "solar:shield-check-line-duotone",
      title: t("Features.feature6.title"),
      description: t("Features.feature6.description"),
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-7xl px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-16 tracking-tight">
          {t("Features.heading")}
        </h2>
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 w-full bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100">
                  <Icon icon={feature.icon} width={18} height={18} className="text-gray-700" />
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
