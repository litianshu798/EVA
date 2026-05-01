import Worker from "@/components/replicate/img-to-video/worker";
import { getEffectById, listEffectByType } from "@/backend/service/effect";
import { Effect } from "@/backend/type/type";
import { toModelOption } from "@/components/replicate/model-option";

export default async function WorkerWraper(params: {
  effectId: string;
  promotion: string;
  lang: string;
}) {
  const effect: Effect | null = await getEffectById(Number(params.effectId));
  if (!effect) return null;
  const effects = await listEffectByType(1);
  const modelOptions = effects.length > 0 ? effects : [effect];

  return (
    <div className="flex w-full flex-col">
      <Worker
        modelOptions={modelOptions.map(toModelOption)}
        defaultModelId={effect.id}
        model={effect.model}
        credit={effect.credit}
        version={effect.version}
        effect_link_name={effect.link_name}
        prompt={effect.pre_prompt}
        promotion={params.promotion}
        lang={params.lang}
      />
    </div>
  );
}
