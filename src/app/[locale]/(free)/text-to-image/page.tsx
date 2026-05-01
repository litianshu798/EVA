import React from "react";
import TopHero from "@/components/landingpage/top";
import WorkerWrapper from "@/components/replicate/text-to-image/worker-wraper";
import { getMetadata } from "@/components/seo/seo";
import CommerceShowcase from "@/components/landingpage/commerce-showcase";
import CommerceIntelligence from "@/components/landingpage/commerce-intelligence";
export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}) {
  return await getMetadata(
    params?.locale || "",
    "TextToImage.seo",
    "text-to-image"
  );
}

export default function TextToImage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const effectId = "2";
  const multiLanguage = "TextToImage";
  const outputDefaultImage = "/aipic.png";

  return (
    <main className="flex flex-col items-center bg-white">
      <div className="w-full flex justify-center border-b border-gray-100">
        <TopHero multiLanguage={multiLanguage} locale={locale} />
      </div>
      <div className="w-full bg-[linear-gradient(180deg,#ffffff,#f8fafc)] px-3 py-10 pb-16 md:px-0 md:py-14">
        <WorkerWrapper
          effectId={effectId}
          multiLanguage={multiLanguage}
          outputDefaultImage={outputDefaultImage}
        />
      </div>
      <div className="w-full py-20 md:py-28">
        <CommerceShowcase locale={locale} variant="image" />
      </div>
      <div className="w-full">
        <CommerceIntelligence locale={locale} variant="image" />
      </div>
    </main>
  );
}
