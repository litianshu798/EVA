export type ModelParameterOption = {
  label: string;
  value: string | number | boolean;
};

export type ModelParameterField = {
  key: string;
  label: string;
  type: "select" | "number" | "text" | "textarea" | "boolean";
  default?: string | number | boolean;
  options?: ModelParameterOption[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
};

export type ModelParameterSchema = {
  fields: ModelParameterField[];
};

export type ModelParameterValues = Record<string, string | number | boolean>;

export function parseModelParameterSchema(input?: unknown): ModelParameterSchema {
  if (!input) return { fields: [] };

  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      return normalizeSchema(parsed);
    } catch {
      return { fields: [] };
    }
  }

  return normalizeSchema(input);
}

export function normalizeSchema(input: unknown): ModelParameterSchema {
  if (
    !input ||
    typeof input !== "object" ||
    !Array.isArray((input as ModelParameterSchema).fields)
  ) {
    return { fields: [] };
  }

  return {
    fields: (input as ModelParameterSchema).fields.filter(
      (field) => field && typeof field.key === "string" && typeof field.label === "string"
    ),
  };
}

export function getDefaultParameterValues(schema: ModelParameterSchema) {
  return schema.fields.reduce<ModelParameterValues>((acc, field) => {
    if (field.default !== undefined) {
      acc[field.key] = field.default;
    } else if (field.type === "boolean") {
      acc[field.key] = false;
    } else if (field.type === "number") {
      acc[field.key] = field.min ?? 0;
    } else {
      acc[field.key] = "";
    }
    return acc;
  }, {});
}

export const FALLBACK_IMAGE_SCHEMA: ModelParameterSchema = {
  fields: [
    {
      key: "aspect_ratio",
      label: "Aspect ratio",
      type: "select",
      default: "1:1",
      options: [
        { label: "1:1", value: "1:1" },
        { label: "4:5", value: "4:5" },
        { label: "3:4", value: "3:4" },
        { label: "16:9", value: "16:9" },
        { label: "9:16", value: "9:16" },
      ],
    },
    {
      key: "output_format",
      label: "Output format",
      type: "select",
      default: "png",
      options: [
        { label: "PNG", value: "png" },
        { label: "JPG", value: "jpg" },
        { label: "WEBP", value: "webp" },
      ],
    },
  ],
};

export const FALLBACK_VIDEO_SCHEMA: ModelParameterSchema = {
  fields: [
    {
      key: "aspect_ratio",
      label: "Aspect ratio",
      type: "select",
      default: "9:16",
      options: [
        { label: "9:16", value: "9:16" },
        { label: "16:9", value: "16:9" },
        { label: "1:1", value: "1:1" },
      ],
    },
    {
      key: "duration",
      label: "Duration",
      type: "select",
      default: "5s",
      options: [
        { label: "5s", value: "5s" },
        { label: "8s", value: "8s" },
      ],
    },
  ],
};
