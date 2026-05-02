import { Effect } from "@/backend/type/type";
import { ModelParameterSchema, parseModelParameterSchema } from "./model-parameter-schema";

export interface ModelOption {
  id: number;
  name: string;
  model: string;
  version: string | null;
  link_name: string;
  credit: number;
  pre_prompt: string;
  param_schema: ModelParameterSchema;
}

export function toModelOption(effect: Effect): ModelOption {
  return {
    id: effect.id,
    name: effect.name,
    model: effect.model,
    version: effect.version || null,
    link_name: effect.link_name,
    credit: effect.credit,
    pre_prompt: effect.pre_prompt || "",
    param_schema: parseModelParameterSchema(effect.param_schema),
  };
}
