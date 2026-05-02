import WorkerWrapper from "@/components/replicate/img-to-video/worker-wraper";
import What from "@/components/landingpage/what";
import How from "@/components/landingpage/how";
import Faq from "@/components/landingpage/faq";
import FeatureHero from "@/components/landingpage/feature";
import { getMetadata } from "@/components/seo/seo";
import UserExample from "@/components/landingpage/example";
import Cta from "@/components/landingpage/cta";
import CommerceShowcase from "@/components/landingpage/commerce-showcase";
import CommerceIntelligence from "@/components/landingpage/commerce-intelligence";

export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}) {
  return await getMetadata(params?.locale || "", "HomePage.seo", "");
}

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const images = [
    {
      img: "/resources/example1.webp",
      video: "/resources/example1.mp4",
    },
    {
      img: "/resources/example2.webp",
      video: "/resources/example2.mp4",
    },
    {
      img: "/resources/example5.webp",
      video: "/resources/example5.mp4",
    },
  ];

  const video = "/aivideo.mp4";
  const whatImage = "/resources/brandmarket.png";
  const howImage = "/resources/example6.png";

  const effectId = "1";
  const multiLanguage = "HomePage";
  const multiLanguageOfGenerator = "HomePage.generator";

  return (
    <main className="flex flex-col items-center bg-gray-950">
      <div className="w-full">
        <WorkerWrapper
          effectId={effectId}
          promotion={video}
          lang={multiLanguageOfGenerator}
        />
      </div>
      <div className="w-full bg-gray-950 pt-20 md:pt-28">
        <CommerceShowcase locale={locale} variant="video" />
      </div>
      <div className="w-full bg-gray-950 pt-24 md:pt-32">
        <CommerceIntelligence locale={locale} variant="home" />
      </div>
      <div className="w-full bg-gray-950 pt-24 md:pt-32 flex justify-center">
        <UserExample multiLanguage={multiLanguage} images={images} />
      </div>

      <div className="w-full bg-gray-950 pt-24 md:pt-32">
        <What multiLanguage={multiLanguage} image={whatImage} />
      </div>

      <div className="w-full bg-gray-950 pt-24 md:pt-32">
        <How multiLanguage={multiLanguage} image={howImage} />
      </div>

      <div className="w-full bg-gray-950 pt-24 md:pt-32">
        <FeatureHero multiLanguage={multiLanguage} />
      </div>

      <div className="w-full bg-gray-950 pt-24 md:pt-32">
        <Faq multiLanguage={multiLanguage} grid={true} />
      </div>

      <div className="w-full bg-gray-950 pt-24 md:pt-32 pb-24">
        <Cta multiLanguage={multiLanguage} />
      </div>
    </main>
  );
}
