import { Button } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";
import { useTranslations } from "next-intl";

export default function Output({
  error,
  prediction,
  defaultImage,
  showImage,
}: {
  error: string;
  prediction: any;
  defaultImage: string;
  showImage: string | null;
}) {
  const t = useTranslations("PhotoToCartoon.generator");
  return (
    <div className="flex h-full w-full flex-col bg-transparent">
      {error && error !== "" && (
        <div className="flex justify-center items-center text-red-500 text-sm mb-4">
          {error}
        </div>
      )}
      <div className="flex-1 flex items-center justify-center">
        {prediction ? (
          <>
            {prediction.output ? (
              <div className="group relative flex min-h-[520px] w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gray-950/60">
                <img
                  src={
                    showImage
                      ? showImage
                      : Array.isArray(prediction.output) &&
                        prediction.output.length > 1
                      ? prediction.output[1]
                      : prediction.output
                  }
                  alt="Result"
                  className="max-h-[560px] max-w-full rounded-2xl object-contain p-4"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    className="bg-gray-900/80 backdrop-blur-sm text-white text-sm rounded-lg px-4 py-2 border-0"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = showImage
                        ? showImage
                        : Array.isArray(prediction.output) &&
                          prediction.output.length > 1
                        ? prediction.output[1]
                        : prediction.output;
                      link.setAttribute("download", "");
                      link.setAttribute("target", "_blank");
                      link.click();
                    }}
                  >
                    {t("output.downloadButton")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[520px] w-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/15 bg-gray-950/60">
                <CircularProgress
                  color="primary"
                  aria-label="Loading..."
                  classNames={{ svg: "text-white" }}
                />
                <span className="text-xs font-medium capitalize text-white/60">
                  {prediction.status}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex min-h-[520px] w-full items-center justify-center rounded-3xl border border-dashed border-white/15 bg-gray-950/60">
            <img
              src={defaultImage}
              className="max-h-[560px] max-w-full rounded-2xl object-contain p-4"
            />
          </div>
        )}
      </div>
    </div>
  );
}
