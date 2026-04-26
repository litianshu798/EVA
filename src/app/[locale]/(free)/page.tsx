import WorkerWrapper from "@/components/replicate/img-to-video/worker-wraper";
import TopHero from "@/components/landingpage/top";
import What from "@/components/landingpage/what";
import How from "@/components/landingpage/how";
import Faq from "@/components/landingpage/faq";
import FeatureHero from "@/components/landingpage/feature";
import { getMetadata } from "@/components/seo/seo";
import UserExample from "@/components/landingpage/example";
import Cta from "@/components/landingpage/cta";

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
    <main className="flex flex-col items-center">
      <div className="w-full">
        <TopHero multiLanguage={multiLanguage} locale={locale} />
      </div>
      <div className="w-full flex justify-center items-center py-8 px-3 md:px-0">
        <WorkerWrapper
          effectId={effectId}
          promotion={video}
          lang={multiLanguageOfGenerator}
        />
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
