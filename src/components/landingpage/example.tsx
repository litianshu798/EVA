"use client";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

export default function UserExample(params: {
  multiLanguage: string;
  images: { img: string; video: string }[];
}) {
  const t = useTranslations(params.multiLanguage);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <div className="flex flex-col w-full items-center max-w-7xl px-4 md:px-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12 tracking-tight">
        {t("userExample.title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">
        {params.images?.map((src, index) => (
          <div
            key={index}
            onClick={() => setSelectedVideo(src.video)}
            className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-video cursor-pointer"
          >
            <img
              src={src.img}
              alt={t("userExample.title")}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {src.video && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors duration-200">
                <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                  <svg
                    className="w-5 h-5 text-gray-900 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative bg-white rounded-2xl p-1 max-w-2xl w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full h-auto rounded-xl"
            />
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
