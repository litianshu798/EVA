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
    <div className="flex flex-col items-center bg-gray-950 pb-24">
      <div className="flex w-full flex-col items-center">
        <Price />
      </div>
    </div>
  );
}
