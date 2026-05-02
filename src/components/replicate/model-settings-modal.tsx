"use client";

import { Button } from "@nextui-org/react";
import { X } from "lucide-react";
import type {
  ModelParameterSchema,
  ModelParameterValues,
} from "@/components/replicate/model-parameter-schema";

export default function ModelSettingsModal({
  title,
  subtitle,
  open,
  onClose,
  schema,
  values,
  onChange,
  applyLabel,
}: {
  title: string;
  subtitle: string;
  open: boolean;
  onClose: () => void;
  schema: ModelParameterSchema;
  values: ModelParameterValues;
  onChange: (key: string, value: string | number | boolean) => void;
  applyLabel: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-3 backdrop-blur-sm sm:items-center">
      <div className="max-h-[86dvh] w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-gray-950 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="mt-1 truncate text-xs text-white/45">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Close settings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(86dvh-128px)] overflow-y-auto p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {schema.fields.map((field) => (
              <div
                key={field.key}
                className={field.type === "textarea" ? "sm:col-span-2" : ""}
              >
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    value={String(values[field.key] ?? field.default ?? "")}
                    onChange={(event) => onChange(field.key, event.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white outline-none transition-colors hover:border-white/25 focus:border-white/60 focus:ring-2 focus:ring-white/10"
                  >
                    {(field.options || []).map((option) => (
                      <option
                        className="bg-gray-950 text-white"
                        key={String(option.value)}
                        value={String(option.value)}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "boolean" ? (
                  <button
                    type="button"
                    onClick={() => onChange(field.key, !values[field.key])}
                    className={`flex h-11 w-full items-center justify-between rounded-xl border px-3 text-sm transition-colors ${
                      values[field.key]
                        ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-100"
                        : "border-white/10 bg-white/10 text-white/60"
                    }`}
                  >
                    <span>{values[field.key] ? "On" : "Off"}</span>
                    <span
                      className={`h-5 w-9 rounded-full p-0.5 transition-colors ${
                        values[field.key] ? "bg-cyan-300" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`block h-4 w-4 rounded-full bg-white transition-transform ${
                          values[field.key] ? "translate-x-4" : ""
                        }`}
                      />
                    </span>
                  </button>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={String(values[field.key] ?? "")}
                    placeholder={field.placeholder}
                    onChange={(event) => onChange(field.key, event.target.value)}
                    className="min-h-[96px] w-full resize-none rounded-xl border border-white/10 bg-white/[0.07] px-3 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-white/30 hover:border-white/25 focus:border-white/60 focus:ring-2 focus:ring-white/10"
                  />
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    value={String(values[field.key] ?? "")}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      onChange(
                        field.key,
                        field.type === "number"
                          ? Number(event.target.value)
                          : event.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 hover:border-white/25 focus:border-white/60 focus:ring-2 focus:ring-white/10"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          <Button
            className="h-11 w-full rounded-xl bg-white text-sm font-semibold text-gray-950"
            onPress={onClose}
          >
            {applyLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
