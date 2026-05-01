import Worker from "@/components/replicate/text-to-image/worker";
import { getEffectById, listEffectByType } from "@/backend/service/effect";
import { Effect } from "@/backend/type/type";
import { toModelOption } from "@/components/replicate/model-option";

export default async function WorkerWraper(params: {
  effectId: string;
  multiLanguage: string;
  outputDefaultImage: string;
}) {
  const effect: Effect | null = await getEffectById(Number(params.effectId));
  if (!effect) return null;
  const effects = await listEffectByType(2);
  const modelOptions = effects.length > 0 ? effects : [effect];

  return (
    <div className="flex w-full flex-col">
      <Worker
        modelOptions={modelOptions.map(toModelOption)}
        defaultModelId={effect.id}
        model={effect.model}
        effect_link_name={effect.link_name}
        version={effect.version}
        credit={effect.credit}
        defaultImage={params.outputDefaultImage}
        lang={params.multiLanguage}
      />
    </div>
  );
}
