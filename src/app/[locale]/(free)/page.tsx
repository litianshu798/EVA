import WorkerWrapper from "@/components/replicate/img-to-video/worker-wraper";
import TopHero from "@/components/landingpage/top";
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
  const whatImage = "/resources/example3.webp";
  const howImage = "/resources/example2.webp";

  const effectId = "1";
  const multiLanguage = "HomePage";
  const multiLanguageOfGenerator = "HomePage.generator";

  return (
    <main className="flex flex-col items-center bg-white">
      <div className="w-full">
        <TopHero multiLanguage={multiLanguage} locale={locale} />
      </div>
      <div className="w-full border-y border-gray-100 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] px-3 py-10 md:px-0 md:py-14">
        <WorkerWrapper
          effectId={effectId}
          promotion={video}
          lang={multiLanguageOfGenerator}
        />
      </div>
      <div className="pt-20 md:pt-28 w-full">
        <CommerceShowcase locale={locale} variant="video" />
      </div>
      <div className="pt-24 md:pt-32 w-full">
        <CommerceIntelligence locale={locale} variant="home" />
      </div>
      <div className="pt-24 md:pt-32 w-full flex justify-center">
        <UserExample multiLanguage={multiLanguage} images={images} />
      </div>

      <div className="pt-24 md:pt-32 w-full">
        <What multiLanguage={multiLanguage} image={whatImage} />
      </div>

      <div className="pt-24 md:pt-32 w-full">
        <How multiLanguage={multiLanguage} image={howImage} />
      </div>

      <div className="pt-24 md:pt-32 w-full">
        <FeatureHero multiLanguage={multiLanguage} />
      </div>

      <div className="pt-24 md:pt-32 w-full">
        <Faq multiLanguage={multiLanguage} grid={true} />
      </div>

      <div className="pt-24 md:pt-32 pb-24 w-full">
        <Cta multiLanguage={multiLanguage} />
      </div>
    </main>
  );
}
