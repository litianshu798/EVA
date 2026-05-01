import { Effect } from "@/backend/type/type";

export interface ModelOption {
  id: number;
  name: string;
  model: string;
  version: string | null;
  link_name: string;
  credit: number;
  pre_prompt: string;
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
  };
}
