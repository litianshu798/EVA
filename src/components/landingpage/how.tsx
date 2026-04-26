import React from "react";
import { useTranslations } from "next-intl";

export default function How(params: { multiLanguage: string; image: string }) {
  const t = useTranslations(params.multiLanguage);

  const steps = [
    t("how.item1"),
    t("how.item2"),
    t("how.item3"),
  ];

  return (
    <section className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-7xl px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-16 tracking-tight">
          {t("how.title")}
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-12 md:gap-20">
          <div className="md:w-1/2">
            <p className="text-base md:text-lg text-gray-500 mb-8 leading-relaxed">
              {t("how.description")}
            </p>
            <ol className="space-y-6">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-semibold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed pt-0.5">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <div className="md:w-2/5">
            <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-square">
              <img
                src={params.image}
                alt="How to use"
                width={500}
                height={500}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
