export default function CreditInfo({ credit }: { credit: string }) {
  if (!credit || credit === "") {
    return null;
  }
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100">
      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
      <span className="text-xs text-gray-500 font-medium">
        {credit} credits
      </span>
    </div>
  );
}
