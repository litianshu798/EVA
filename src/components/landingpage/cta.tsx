"use client";
import { useTranslations } from "next-intl";

export default function CreateButton(params: { multiLanguage: string }) {
  const tCreateButton = useTranslations(params.multiLanguage);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
      <div className="bg-gray-900 rounded-3xl px-8 py-16 md:py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
          {tCreateButton("cta.title")}
        </h2>
        <p className="text-base text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
          {tCreateButton("cta.description")}
        </p>
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          {tCreateButton("cta.cta")}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
