import React from "react";
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
    <main className="flex flex-col items-center bg-gray-950">
      <div className="w-full">
        <WorkerWrapper
          effectId={effectId}
          multiLanguage={multiLanguage}
          outputDefaultImage={outputDefaultImage}
        />
      </div>
      <div className="w-full bg-gray-950 py-20 md:py-28">
        <CommerceShowcase locale={locale} variant="image" />
      </div>
      <div className="w-full bg-gray-950">
        <CommerceIntelligence locale={locale} variant="image" />
      </div>
    </main>
  );
}
