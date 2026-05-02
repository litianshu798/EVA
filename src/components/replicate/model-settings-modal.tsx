"use client";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import type {
  ModelParameterSchema,
  ModelParameterValues,
} from "@/components/replicate/model-parameter-schema";

export default function ModelSettingsModal({
  title,
  subtitle,
  open,
  onOpenChange,
  trigger,
  schema,
  values,
  onChange,
  applyLabel,
}: {
  title: string;
  subtitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  schema: ModelParameterSchema;
  values: ModelParameterValues;
  onChange: (key: string, value: string | number | boolean) => void;
  applyLabel: string;
}) {
  return (
    <Popover
      isOpen={open}
      onOpenChange={onOpenChange}
      placement="bottom-start"
      offset={10}
      showArrow
      classNames={{
        base: "z-[80]",
        content:
          "w-[calc(100vw-24px)] max-w-[560px] rounded-2xl border border-white/10 bg-gray-950 p-0 text-white shadow-2xl",
      }}
    >
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent>
        <div className="w-full">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="mt-1 truncate text-xs text-white/45">{subtitle}</p>
          </div>
        </div>

        <div className="max-h-[58dvh] overflow-y-auto p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {schema.fields.map((field) => (
              <div
                key={field.key}
                className={field.type === "textarea" ? "sm:col-span-2" : ""}
              >
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-white/45">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    value={String(values[field.key] ?? field.default ?? "")}
                    onChange={(event) => onChange(field.key, event.target.value)}
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white outline-none transition-colors hover:border-white/25 focus:border-white/60 focus:ring-2 focus:ring-white/10"
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
                    className={`flex h-10 w-full items-center justify-between rounded-xl border px-3 text-sm transition-colors ${
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
                    className="min-h-[84px] w-full resize-none rounded-xl border border-white/10 bg-white/[0.07] px-3 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-white/30 hover:border-white/25 focus:border-white/60 focus:ring-2 focus:ring-white/10"
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
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 hover:border-white/25 focus:border-white/60 focus:ring-2 focus:ring-white/10"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-3">
          <Button
            className="h-10 w-full rounded-xl bg-white text-sm font-semibold text-gray-950"
            onPress={() => onOpenChange(false)}
          >
            {applyLabel}
          </Button>
        </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
