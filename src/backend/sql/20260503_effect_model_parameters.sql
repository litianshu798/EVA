-- Replicate model sync and parameter-dashboard schema.
-- type: 1 = image-to-video/video generation, 2 = text-to-image/image generation.

ALTER TABLE effect ADD COLUMN IF NOT EXISTS param_schema jsonb NULL;

-- Hide older seed examples from the default picker; keep records for history compatibility.
UPDATE effect
SET is_open = 0
WHERE link_name IN ('kling-v12', 'flux-1-pro');

INSERT INTO effect (
  id, name, type, des, platform, link, api, is_open, link_name, credit, model, version, pre_prompt, param_schema, created_at
) VALUES
(
  21,
  'GPT Image 2',
  2,
  'OpenAI text-to-image model with quality, format, background, and moderation controls.',
  'replicate',
  'https://replicate.com/openai/gpt-image-2',
  'openai/gpt-image-2',
  1,
  'gpt-image-2',
  4,
  'openai/gpt-image-2',
  NULL,
  NULL,
  $${
    "fields": [
      {"key":"aspect_ratio","label":"Aspect ratio","type":"select","default":"1:1","options":[{"label":"Auto","value":"auto"},{"label":"1:1","value":"1:1"},{"label":"2:3","value":"2:3"},{"label":"3:2","value":"3:2"},{"label":"3:4","value":"3:4"},{"label":"4:3","value":"4:3"},{"label":"4:5","value":"4:5"},{"label":"5:4","value":"5:4"},{"label":"9:16","value":"9:16"},{"label":"16:9","value":"16:9"},{"label":"21:9","value":"21:9"}]},
      {"key":"quality","label":"Quality","type":"select","default":"auto","options":[{"label":"Auto","value":"auto"},{"label":"Low","value":"low"},{"label":"Medium","value":"medium"},{"label":"High","value":"high"}]},
      {"key":"number_of_images","label":"Images","type":"number","default":1,"min":1,"max":10,"step":1},
      {"key":"output_format","label":"Output format","type":"select","default":"png","options":[{"label":"PNG","value":"png"},{"label":"JPEG","value":"jpeg"},{"label":"WEBP","value":"webp"}]},
      {"key":"background","label":"Background","type":"select","default":"auto","options":[{"label":"Auto","value":"auto"},{"label":"Opaque","value":"opaque"},{"label":"Transparent","value":"transparent"}]},
      {"key":"moderation","label":"Moderation","type":"select","default":"auto","options":[{"label":"Auto","value":"auto"},{"label":"Low","value":"low"}]}
    ]
  }$$::jsonb,
  NOW()
),
(
  22,
  'Nano Banana 2',
  2,
  'Google image model for high-quality product and campaign visuals.',
  'replicate',
  'https://replicate.com/google/nano-banana-2',
  'google/nano-banana-2',
  1,
  'nano-banana-2',
  3,
  'google/nano-banana-2',
  NULL,
  NULL,
  $${
    "fields": [
      {"key":"aspect_ratio","label":"Aspect ratio","type":"select","default":"1:1","options":[{"label":"1:1","value":"1:1"},{"label":"2:3","value":"2:3"},{"label":"3:2","value":"3:2"},{"label":"3:4","value":"3:4"},{"label":"4:3","value":"4:3"},{"label":"4:5","value":"4:5"},{"label":"5:4","value":"5:4"},{"label":"9:16","value":"9:16"},{"label":"16:9","value":"16:9"},{"label":"21:9","value":"21:9"}]},
      {"key":"resolution","label":"Resolution","type":"select","default":"1K","options":[{"label":"1K","value":"1K"},{"label":"2K","value":"2K"},{"label":"4K","value":"4K"}]},
      {"key":"output_format","label":"Output format","type":"select","default":"png","options":[{"label":"PNG","value":"png"},{"label":"JPEG","value":"jpg"}]}
    ]
  }$$::jsonb,
  NOW()
),
(
  23,
  'Seedream 5 Lite',
  2,
  'ByteDance lightweight image generation model for fast commerce creatives.',
  'replicate',
  'https://replicate.com/bytedance/seedream-5-lite',
  'bytedance/seedream-5-lite',
  1,
  'seedream-5-lite',
  2,
  'bytedance/seedream-5-lite',
  NULL,
  NULL,
  $${
    "fields": [
      {"key":"aspect_ratio","label":"Aspect ratio","type":"select","default":"1:1","options":[{"label":"1:1","value":"1:1"},{"label":"4:3","value":"4:3"},{"label":"3:4","value":"3:4"},{"label":"16:9","value":"16:9"},{"label":"9:16","value":"9:16"}]},
      {"key":"size","label":"Size","type":"select","default":"regular","options":[{"label":"Regular","value":"regular"},{"label":"Big","value":"big"}]},
      {"key":"seed","label":"Seed","type":"number","default":-1,"min":-1,"max":2147483647,"step":1}
    ]
  }$$::jsonb,
  NOW()
),
(
  24,
  'Wan 2.7 Image',
  2,
  'Wan image model with sampling controls for product and campaign images.',
  'replicate',
  'https://replicate.com/wan-video/wan-2.7-image',
  'wan-video/wan-2.7-image',
  1,
  'wan-2-7-image',
  3,
  'wan-video/wan-2.7-image',
  NULL,
  NULL,
  $${
    "fields": [
      {"key":"aspect_ratio","label":"Aspect ratio","type":"select","default":"1:1","options":[{"label":"1:1","value":"1:1"},{"label":"4:3","value":"4:3"},{"label":"3:4","value":"3:4"},{"label":"16:9","value":"16:9"},{"label":"9:16","value":"9:16"}]},
      {"key":"guidance_scale","label":"Guidance scale","type":"number","default":3.5,"min":1,"max":10,"step":0.5},
      {"key":"num_inference_steps","label":"Inference steps","type":"number","default":28,"min":1,"max":50,"step":1},
      {"key":"seed","label":"Seed","type":"number","default":-1,"min":-1,"max":2147483647,"step":1}
    ]
  }$$::jsonb,
  NOW()
),
(
  11,
  'Seedance 2.0 Fast',
  1,
  'ByteDance fast image-to-video model for short commerce motion assets.',
  'replicate',
  'https://replicate.com/bytedance/seedance-2.0-fast',
  'bytedance/seedance-2.0-fast',
  1,
  'seedance-2-fast',
  15,
  'bytedance/seedance-2.0-fast',
  NULL,
  NULL,
  $${
    "fields": [
      {"key":"aspect_ratio","label":"Aspect ratio","type":"select","default":"9:16","options":[{"label":"9:16","value":"9:16"},{"label":"16:9","value":"16:9"},{"label":"1:1","value":"1:1"}]},
      {"key":"duration","label":"Duration","type":"select","default":"5s","options":[{"label":"5s","value":"5s"},{"label":"8s","value":"8s"},{"label":"10s","value":"10s"}]},
      {"key":"resolution","label":"Resolution","type":"select","default":"720p","options":[{"label":"720p","value":"720p"},{"label":"1080p","value":"1080p"}]},
      {"key":"camera_fixed","label":"Fixed camera","type":"boolean","default":false}
    ]
  }$$::jsonb,
  NOW()
),
(
  12,
  'Veo 3.1 Fast',
  1,
  'Google fast video generation model for vertical and horizontal ad clips.',
  'replicate',
  'https://replicate.com/google/veo-3.1-fast',
  'google/veo-3.1-fast',
  1,
  'veo-3-1-fast',
  25,
  'google/veo-3.1-fast',
  NULL,
  NULL,
  $${
    "fields": [
      {"key":"aspect_ratio","label":"Aspect ratio","type":"select","default":"9:16","options":[{"label":"9:16","value":"9:16"},{"label":"16:9","value":"16:9"}]},
      {"key":"duration","label":"Duration","type":"select","default":"8s","options":[{"label":"8s","value":"8s"}]},
      {"key":"resolution","label":"Resolution","type":"select","default":"720p","options":[{"label":"720p","value":"720p"},{"label":"1080p","value":"1080p"}]},
      {"key":"negative_prompt","label":"Negative prompt","type":"textarea","default":"","placeholder":"Things to avoid in the video"}
    ]
  }$$::jsonb,
  NOW()
),
(
  13,
  'Wan 2.5 I2V',
  1,
  'Wan image-to-video model with duration, resolution, and sampling controls.',
  'replicate',
  'https://replicate.com/wan-video/wan-2.5-i2v',
  'wan-video/wan-2.5-i2v',
  1,
  'wan-2-5-i2v',
  12,
  'wan-video/wan-2.5-i2v',
  NULL,
  NULL,
  $${
    "fields": [
      {"key":"duration","label":"Duration","type":"select","default":"5s","options":[{"label":"5s","value":"5s"},{"label":"8s","value":"8s"}]},
      {"key":"resolution","label":"Resolution","type":"select","default":"720p","options":[{"label":"480p","value":"480p"},{"label":"720p","value":"720p"},{"label":"1080p","value":"1080p"}]},
      {"key":"guidance_scale","label":"Guidance scale","type":"number","default":5,"min":1,"max":10,"step":0.5},
      {"key":"num_inference_steps","label":"Inference steps","type":"number","default":30,"min":1,"max":60,"step":1},
      {"key":"seed","label":"Seed","type":"number","default":-1,"min":-1,"max":2147483647,"step":1}
    ]
  }$$::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  des = EXCLUDED.des,
  platform = EXCLUDED.platform,
  link = EXCLUDED.link,
  api = EXCLUDED.api,
  is_open = EXCLUDED.is_open,
  link_name = EXCLUDED.link_name,
  credit = EXCLUDED.credit,
  model = EXCLUDED.model,
  version = EXCLUDED.version,
  pre_prompt = EXCLUDED.pre_prompt,
  param_schema = EXCLUDED.param_schema;
