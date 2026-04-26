import React from "react";
import TopHero from "@/components/landingpage/top";
import WorkerWrapper from "@/components/replicate/text-to-image/worker-wraper";
import { getMetadata } from "@/components/seo/seo";
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
    <main className="flex flex-col items-center px-3 md:px-0">
      <div className="pt-12 pb-8 w-full flex justify-center bg-gray-50/60 border-b border-gray-100">
        <TopHero multiLanguage={multiLanguage} locale={locale} />
      </div>
      <div className="w-full flex justify-center items-center py-8 pb-16">
        <WorkerWrapper
          effectId={effectId}
          multiLanguage={multiLanguage}
          outputDefaultImage={outputDefaultImage}
        />
      </div>
    </main>
  );
}
