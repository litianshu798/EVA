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
    <div className="flex flex-col w-full md:w-1/2 p-6 md:p-8 bg-gray-50">
      {error && error !== "" && (
        <div className="flex justify-center items-center text-red-500 text-sm mb-4">
          {error}
        </div>
      )}
      <div className="flex-1 flex items-center justify-center">
        {prediction ? (
          <>
            {prediction.output ? (
              <div className="flex justify-center items-center relative group rounded-xl w-full overflow-hidden">
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
                  className="object-contain max-w-full max-h-[420px] rounded-xl"
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
              <div className="flex flex-col items-center justify-center h-full w-full bg-white border border-dashed border-gray-200 rounded-xl gap-3 min-h-[280px]">
                <CircularProgress
                  color="primary"
                  aria-label="Loading..."
                  classNames={{ svg: "text-gray-900" }}
                />
                <span className="text-xs text-gray-500 font-medium capitalize">
                  {prediction.status}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full border border-dashed border-gray-200 rounded-xl bg-white min-h-[280px]">
            <img
              src={defaultImage}
              className="object-contain max-w-full max-h-[420px] rounded-xl py-6"
            />
          </div>
        )}
      </div>
    </div>
  );
}
