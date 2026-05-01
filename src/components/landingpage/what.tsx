import React from "react";
import { useTranslations } from "next-intl";

export default function What(params: { multiLanguage: string; image: string }) {
  const t = useTranslations(params.multiLanguage);

  return (
    <section className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-7xl px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-16 tracking-tight">
          {t("what.title")}
        </h2>
        <div className="flex flex-col md:flex-row-reverse items-center justify-between w-full gap-12 md:gap-20">
          <div className="md:w-1/2">
            <p className="text-base md:text-lg text-white/55 mb-8 leading-relaxed">
              {t("what.description")}
            </p>
            <ul className="space-y-6">
              {[
                { title: t("what.itemTitle1"), desc: t("what.itemDescription1") },
                { title: t("what.itemTitle2"), desc: t("what.itemDescription2") },
                { title: t("what.itemTitle3"), desc: t("what.itemDescription3") },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-cyan-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-2/5">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 aspect-square">
              <img
                src={params.image}
                alt="Product showcase"
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
