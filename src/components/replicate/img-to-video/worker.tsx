"use client";

import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Select, SelectItem } from "@nextui-org/react";
import Prediction from "@/backend/type/domain/replicate";
import { useAppContext } from "@/contexts/app";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { UserSubscriptionInfo } from "@/backend/type/domain/user_subscription_info";
import DeleteButton from "@/components/button/delete-button";
import { handleApiErrors } from "@/components/replicate/common-logic/response";
import { useRouter } from "next/navigation";
import CreditInfo from "@/components/landingpage/credit-info";
import { ModelOption } from "@/components/replicate/model-option";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Worker(props: {
  lang: string;
  credit: number;
  prompt: string;
  model: string;
  version: string;
  effect_link_name: string;
  promotion: string;
  modelOptions?: ModelOption[];
  defaultModelId?: number;
}) {
  const t = useTranslations(props.lang);
  const [selectedModelId, setSelectedModelId] = useState<string>(
    props.defaultModelId?.toString() || props.modelOptions?.[0]?.id.toString() || ""
  );
  const [prompt, setPrompt] = useState(props.prompt);
  const [generating, setGenerating] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const [userSubscriptionInfo, setUserSubscriptionInfo] =
    useState<UserSubscriptionInfo | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const { user } = useAppContext();
  const selectedModel =
    props.modelOptions?.find((option) => option.id.toString() === selectedModelId) ||
    props.modelOptions?.[0] || {
      id: props.defaultModelId || 0,
      name: props.model,
      model: props.model,
      version: props.version,
      link_name: props.effect_link_name,
      credit: props.credit,
      pre_prompt: props.prompt || "",
    };

  useEffect(() => {
    if (selectedModel.pre_prompt) {
      setPrompt(selectedModel.pre_prompt);
    }
  }, [selectedModel.id, selectedModel.pre_prompt]);

  useEffect(() => {
    if (user?.uuid) {
      fetchUserSubscriptionInfo();
    }
  }, [user?.uuid]);

  const fetchUserSubscriptionInfo = async () => {
    if (!user?.uuid) return;
    const userSubscriptionInfo = await fetch(
      "/api/user/get_user_subscription_info",
      {
        method: "POST",
        body: JSON.stringify({ user_id: user.uuid }),
      }
    ).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch user subscription info");
      return res.json();
    });
    setUserSubscriptionInfo(userSubscriptionInfo);
    setIsSubscribed(userSubscriptionInfo.subscription_status === "active");
  };

  const convertImageToFile = async (): Promise<File | null> => {
    if (!image) {
      toast.warning("Please upload a photo");
      return null;
    }
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      return new File([blob], "input.jpg", { type: "image/jpeg" });
    } catch (error) {
      console.error("Error converting image:", error);
      return null;
    }
  };

  const handleGenerate = async () => {
    let newPrediction: Prediction;
    if (selectedModel.credit > 0) {
      if (
        typeof userSubscriptionInfo?.remain_count === "number" &&
        userSubscriptionInfo.remain_count < selectedModel.credit
      ) {
        toast.warning("No credit left");
        return;
      }
    }

    if (user === undefined || user === null) {
      toast.warning("Please login first");
      await sleep(1000);
      router.push(`/${locale}/login`);
      return;
    }

    try {
      setGenerating(true);
      setError(null);

      const imageFile = await convertImageToFile();
      if (!imageFile) {
        setGenerating(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("model", selectedModel.model);
      formData.append("user_id", user?.uuid || "");
      formData.append("user_email", user?.email || "");
      formData.append("effect_link_name", selectedModel.link_name);
      formData.append("prompt", prompt);
      formData.append("credit", selectedModel.credit.toString());

      if (prompt === "" || prompt === null || prompt === undefined) {
        toast.warning("Please enter a prompt");
        setGenerating(false);
        return;
      }
      const response = await fetch("/api/predictions/img_to_video", {
        method: "POST",
        body: formData,
      });

      newPrediction = await response.json();
      const canContinue = await handleApiErrors({
        response,
        newPrediction,
        router,
      });
      if (!canContinue) {
        setGenerating(false);
        return;
      }
      setPrediction(newPrediction);
    } catch (error) {
      console.error("Error occurred, please try again", error);
      toast.error("An error occurred, please try again");
      setGenerating(false);
      return;
    }

    while (
      newPrediction.status !== "succeeded" &&
      newPrediction.status !== "failed"
    ) {
      await sleep(5000);
      const response = await fetch("/api/predictions/" + newPrediction.id);
      newPrediction = await response.json();
      if (response.status !== 200) {
        setError(newPrediction.detail);
        return;
      }
      setPrediction(newPrediction);
    }

    const runningTime =
      (newPrediction.created_at
        ? new Date().getTime() - new Date(newPrediction.created_at).getTime()
        : -1) / 1000;
    fetch("/api/effect_result/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        original_id: newPrediction.id,
        status: newPrediction.status,
        running_time: runningTime,
        updated_at: new Date(),
        original_image_url: "",
        object_key: newPrediction.id,
      }),
    });
    await sleep(4000);
    setGenerating(false);
    fetchUserSubscriptionInfo();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
  };

  return (
    <div className="container mx-auto flex flex-col md:flex-row my-2 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 p-6 md:p-8 md:border-r border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900">
            {t("input.title")}
          </h2>
          <CreditInfo
            credit={userSubscriptionInfo?.remain_count?.toString() || ""}
          />
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
            Model
          </label>
          <Select
            aria-label="Model"
            selectedKeys={selectedModelId ? [selectedModelId] : []}
            onSelectionChange={(keys) => {
              const [key] = Array.from(keys);
              if (key) setSelectedModelId(String(key));
            }}
            radius="lg"
            variant="bordered"
            classNames={{
              trigger:
                "h-11 border-gray-200 bg-white hover:border-gray-300 data-[open=true]:border-gray-900",
              value: "text-sm text-gray-800",
            }}
          >
            {(props.modelOptions || [selectedModel]).map((option) => (
              <SelectItem key={option.id.toString()} value={option.id.toString()}>
                {option.name}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Image Upload */}
        <label className="relative flex flex-col items-center justify-center h-56 bg-gray-50 border border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors duration-200">
          {image ? (
            <div className="relative w-full h-full">
              <img
                src={image}
                alt="Uploaded"
                className="h-full w-full object-contain rounded-xl"
              />
              <DeleteButton onClick={handleDeleteImage} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-400">
                {t("input.upload-tips")}
              </span>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
          />
        </label>

        {/* Prompt */}
        <div className="mt-5">
          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
            Prompt(提示词)
          </label>
          <textarea
            className="w-full p-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition duration-200 resize-none"
            placeholder={t("input.promptTips")}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
        </div>

        {/* Generate Button */}
        {generating ? (
          <Button
            isLoading
            className="w-full mt-5 bg-gray-900 text-white rounded-xl h-11 text-sm font-medium"
          >
            {prediction
              ? prediction.status === "succeeded"
                ? "Processing..."
                : prediction.status
              : "Processing..."}
          </Button>
        ) : (
          <Button
            className="w-full mt-5 bg-gray-900 text-white rounded-xl h-11 text-sm font-medium hover:bg-gray-700 transition-colors duration-200"
            onClick={handleGenerate}
          >
            {t("input.createButton")}
            <span className="ml-2 text-gray-400 text-xs">
              {selectedModel.credit} credit
            </span>
          </Button>
        )}
      </div>

      {/* Right Panel - Output */}
      <div className="flex w-full md:w-1/2 p-6 md:p-8 mt-0 bg-gray-50">
        {error && (
          <div className="flex justify-center items-center text-red-500 text-sm">
            {error}
          </div>
        )}
        {prediction ? (
          <>
            {prediction.output ? (
              <div className="flex justify-center items-center relative group rounded-xl w-full overflow-hidden">
                <video
                  src={prediction.output}
                  className="w-full h-auto rounded-xl"
                  controls
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    className="bg-gray-900/80 backdrop-blur-sm text-white text-sm rounded-lg px-4 py-2 border-0"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = prediction.output || "";
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
              <div className="flex flex-col items-center justify-center h-full w-full bg-white border border-dashed border-gray-200 rounded-xl gap-3">
                <CircularProgress
                  color="primary"
                  aria-label="Loading..."
                  classNames={{ svg: "text-gray-900" }}
                />
                <span className="text-xs text-gray-500 font-medium capitalize">
                  {prediction.status}
                </span>
                <span className="text-xs text-gray-400">
                  Please wait 2–3 minutes
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="hidden md:flex items-center justify-center w-full h-full rounded-xl overflow-hidden">
            <video
              src={props.promotion}
              className="w-full h-full object-cover rounded-xl"
              loop
              autoPlay
              muted
              playsInline
            />
          </div>
        )}
      </div>
    </div>
  );
}
