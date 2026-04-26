"use client";

import React, { useState, useEffect } from "react";
import { Button, Textarea, Select, SelectItem } from "@nextui-org/react";
import Prediction from "@/backend/type/domain/replicate";
import { useAppContext } from "@/contexts/app";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleApiErrors } from "@/components/replicate/common-logic/response";
import Output from "@/components/replicate/text-to-image/img-output";
import { UserSubscriptionInfo } from "@/backend/type/domain/user_subscription_info";
import CreditInfo from "@/components/landingpage/credit-info";
import { useTranslations } from "next-intl";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Worker(props: {
  model: string;
  effect_link_name: string;
  version: string | null;
  credit: number;
  promptTips?: string;
  defaultImage?: string;
  lang?: string;
}) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<string>("png");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const width = 1024;
  const height = 1024;
  const [userSubscriptionInfo, setUserSubscriptionInfo] =
    useState<UserSubscriptionInfo | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const { user } = useAppContext();
  const router = useRouter();
  const t = useTranslations(props.lang || "index");

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

  const handleGenerate = async () => {
    let newPrediction: Prediction;
    if (props.credit > 0) {
      if (
        typeof userSubscriptionInfo?.remain_count === "number" &&
        userSubscriptionInfo.remain_count < props.credit
      ) {
        toast.warning("No credit left");
        return;
      }
    }

    if (prompt.length === 0) {
      toast.warning("Please enter a prompt");
      return;
    }

    try {
      setGenerating(true);
      const response = await fetch("/api/predictions/text_to_image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: props.model,
          version: props.version,
          prompt,
          width,
          height,
          output_format: outputFormat,
          aspect_ratio: "custom",
          user_id: user?.uuid,
          user_email: user?.email,
          effect_link_name: props.effect_link_name,
          credit: props.credit,
        }),
      });
      newPrediction = await response.json();
      const canContinue = await handleApiErrors({
        response,
        newPrediction,
        router,
      });
      if (!canContinue) return;
      setPrediction(newPrediction);
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("An error occurred while generating the image.");
      setGenerating(false);
      return;
    }

    while (
      newPrediction.status !== "succeeded" &&
      newPrediction.status !== "failed"
    ) {
      await sleep(1500);
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        original_id: newPrediction.id,
        status: newPrediction.status,
        running_time: runningTime,
        updated_at: new Date(),
        original_image_url: "",
        object_key: newPrediction.id.substring(0, 8),
      }),
    });
    await sleep(4000);
    setGenerating(false);
    fetchUserSubscriptionInfo();
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
          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
            Prompt
          </label>
          <Textarea
            minRows={5}
            placeholder={props.promptTips || "Describe the product image you want to generate..."}
            radius="lg"
            variant="bordered"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            aria-label="Prompt(提示词)"
            classNames={{
              inputWrapper: "border-gray-200 bg-gray-50 hover:border-gray-300 focus-within:border-gray-900",
              input: "text-sm text-gray-800 placeholder:text-gray-400",
            }}
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
            Output Format
          </label>
          <Select
            placeholder="Choose a format"
            className="max-w-[160px]"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            aria-label="Output Format"
            size="sm"
            classNames={{
              trigger: "bg-gray-50 border border-gray-200 rounded-lg h-9",
              value: "text-sm text-gray-700",
            }}
          >
            <SelectItem key="webp" value="webp">WEBP</SelectItem>
            <SelectItem key="jpg" value="jpg">JPG</SelectItem>
            <SelectItem key="png" value="png">PNG</SelectItem>
          </Select>
        </div>

        {generating ? (
          <Button
            isLoading
            className="w-full bg-gray-900 text-white rounded-xl h-11 text-sm font-medium"
          >
            {prediction
              ? prediction.status === "succeeded"
                ? "Processing..."
                : prediction.status
              : "Processing..."}
          </Button>
        ) : (
          <Button
            className="w-full bg-gray-900 text-white rounded-xl h-11 text-sm font-medium hover:bg-gray-700 transition-colors duration-200"
            onClick={handleGenerate}
          >
            Generate Image
            <span className="ml-2 text-gray-400 text-xs">
              {props.credit} credit
            </span>
          </Button>
        )}
      </div>

      {/* Right Panel */}
      <Output
        error={error || ""}
        prediction={prediction}
        defaultImage={props.defaultImage || ""}
        showImage={null}
      />
    </div>
  );
}
