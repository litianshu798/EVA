import Price from "@/components/price/app";
import { getMetadata } from "@/components/seo/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}) {
  return await getMetadata(params?.locale || "", "Pricing.seo", "pricing");
}

export default function PricingPage() {
  return (
    <div className="mb-24 flex flex-col items-center bg-[linear-gradient(180deg,#f8fafc,#ffffff_36%)] pt-16 md:pt-24">
      <div className="flex w-full flex-col items-center">
        <Price />
      </div>
    </div>
  );
}
