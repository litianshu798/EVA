-- 数据库初始化脚本
-- 创建所有必需的表

-- 用户表：存储用户基本信息和登录相关数据
CREATE TABLE users (
  id SERIAL PRIMARY KEY,                    -- 用户唯一标识符（自增主键）
  uuid text NOT NULL,                       -- 用户UUID（全局唯一标识）
  email text NOT NULL,                      -- 用户邮箱地址
  nickname text NOT NULL,                   -- 用户昵称
  avatar_url text NOT NULL,                 -- 用户头像URL
  locale text NULL,                         -- 用户语言/地区设置
  signin_type text NULL,                    -- 登录类型（如：email, google, github等）
  signin_ip text NULL,                      -- 最后登录IP地址
  signin_provider text NULL,                -- 第三方登录提供商（如：google, github等）
  signin_openid text NULL,                  -- 第三方登录的OpenID
  password_hash text NULL,                  -- 账号密码登录的密码哈希
  invite_code text NULL,                    -- 用户的邀请码
  invited_by text NULL,                     -- 邀请人的用户UUID
  invited_at timestamp with time zone NULL, -- 被邀请注册的时间
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP, -- 账户创建时间
  update_time timestamp with time zone NULL -- 最后更新时间
);
CREATE UNIQUE INDEX idx_users_email_unique ON users (lower(email));
CREATE UNIQUE INDEX idx_users_uuid_unique ON users (uuid);
CREATE UNIQUE INDEX idx_users_invite_code_unique ON users (invite_code) WHERE invite_code IS NOT NULL;
CREATE INDEX idx_users_invited_by ON users (invited_by);

-- 积分使用记录表：跟踪用户在特定订阅周期内的积分使用情况
CREATE TABLE credit_usage (
  id SERIAL PRIMARY KEY,                    -- 记录唯一标识符（自增主键）
  user_id text NOT NULL,                    -- 用户ID（关联users表）
  user_subscriptions_id integer NOT NULL,   -- 用户订阅ID（关联user_subscriptions表）
  used_count integer NOT NULL,              -- 已使用的积分数量
  period_start timestamp with time zone NOT NULL, -- 计费周期开始时间
  period_end timestamp with time zone NOT NULL,   -- 计费周期结束时间
  is_subscription_active boolean NOT NULL,  -- 订阅是否处于活跃状态
  period_remain_count integer NULL,         -- 当前周期剩余积分数量
  created_at timestamp with time zone NULL, -- 记录创建时间
  updated_at timestamp with time zone NULL  -- 记录最后更新时间
);

-- 效果/功能表：存储AI效果的配置信息和元数据
CREATE TABLE effect (
  id SERIAL PRIMARY KEY,                    -- 效果唯一标识符（自增主键）
  name text NOT NULL,                       -- 效果名称
  type integer NOT NULL,                    -- 效果类型（如：1=图像生成，2=视频生成等）
  des text NULL,                            -- 效果描述
  platform text NOT NULL,                   -- 平台名称（如：Replicate, Fal等）
  link text NOT NULL,                       -- 相关链接
  api text NOT NULL,                        -- API端点地址
  is_open integer NOT NULL,                 -- 是否开放使用（1=开放，0=关闭）
  link_name text NOT NULL,                  -- 链接显示名称
  credit real NOT NULL,                     -- 使用该效果所需的积分数
  model text NULL,                          -- 使用的AI模型名称
  version text NULL,                        -- 模型版本
  pre_prompt text NULL,                     -- 预设提示词
  param_schema jsonb NULL,                  -- 前端参数面板配置（JSON Schema-like）
  created_at timestamp with time zone NULL -- 创建时间
);
INSERT INTO effect (id, name, type, des, platform, link, api, is_open, link_name, credit, model, version, pre_prompt, param_schema, created_at) VALUES (
  11, 'Seedance 2.0 Fast', 1, 'ByteDance fast image-to-video model for short commerce motion assets.', 'replicate',
  'https://replicate.com/bytedance/seedance-2.0-fast', 'bytedance/seedance-2.0-fast', 1, 'seedance-2-fast', 15,
  'bytedance/seedance-2.0-fast', NULL, NULL,
  '{"fields":[{"key":"aspect_ratio","label":"Aspect ratio","type":"select","default":"9:16","options":[{"label":"9:16","value":"9:16"},{"label":"16:9","value":"16:9"},{"label":"1:1","value":"1:1"}]},{"key":"duration","label":"Duration","type":"select","default":"5s","options":[{"label":"5s","value":"5s"},{"label":"8s","value":"8s"},{"label":"10s","value":"10s"}]},{"key":"resolution","label":"Resolution","type":"select","default":"720p","options":[{"label":"720p","value":"720p"},{"label":"1080p","value":"1080p"}]},{"key":"camera_fixed","label":"Fixed camera","type":"boolean","default":false}]}'::jsonb,
  NULL
);
INSERT INTO effect (id, name, type, des, platform, link, api, is_open, link_name, credit, model, version, pre_prompt, param_schema, created_at) VALUES (
  22, 'Nano Banana 2', 2, 'Google image model for high-quality product and campaign visuals.', 'replicate',
  'https://replicate.com/google/nano-banana-2', 'google/nano-banana-2', 1, 'nano-banana-2', 3,
  'google/nano-banana-2', NULL, NULL,
  '{"fields":[{"key":"aspect_ratio","label":"Aspect ratio","type":"select","default":"1:1","options":[{"label":"1:1","value":"1:1"},{"label":"2:3","value":"2:3"},{"label":"3:2","value":"3:2"},{"label":"3:4","value":"3:4"},{"label":"4:3","value":"4:3"},{"label":"4:5","value":"4:5"},{"label":"5:4","value":"5:4"},{"label":"9:16","value":"9:16"},{"label":"16:9","value":"16:9"},{"label":"21:9","value":"21:9"}]},{"key":"resolution","label":"Resolution","type":"select","default":"1K","options":[{"label":"1K","value":"1K"},{"label":"2K","value":"2K"},{"label":"4K","value":"4K"}]},{"key":"output_format","label":"Output format","type":"select","default":"png","options":[{"label":"PNG","value":"png"},{"label":"JPEG","value":"jpg"}]}]}'::jsonb,
  NULL
);

-- 效果执行结果表：存储用户使用AI效果后的生成结果和相关信息
CREATE TABLE effect_result (
  id SERIAL PRIMARY KEY,                    -- 结果唯一标识符（自增主键）
  result_id character varying(127) NULL,    -- 第三方平台返回的结果ID
  original_id character varying(127) NULL,  -- 原始请求ID（用于追踪）
  user_id text NOT NULL,                    -- 用户ID（关联users表）
  effect_id integer NOT NULL,               -- 效果ID（关联effect表）
  effect_name character varying(100) NULL,  -- 效果名称（冗余存储，便于查询）
  prompt text NULL,                         -- 用户输入的提示词
  url text NULL,                            -- 结果的URL地址
  status text NULL,                         -- 执行状态（如：pending, completed, failed等）
  original_url character varying(255) NULL, -- 原始文件URL（Replicate/Fal的结果地址）
  storage_type character varying(16) NULL,  -- 存储类型（如：r2, s3, cdn等）
  running_time real NULL,                   -- 执行耗时（秒）
  credit integer NOT NULL,                  -- 消耗的积分数
  request_params text NULL,                 -- 请求参数（JSON格式）
  created_at timestamp with time zone NULL, -- 创建时间
  updated_at timestamp with time zone NULL  -- 最后更新时间
);

-- 支付历史记录表：存储所有支付交易的详细信息
CREATE TABLE payment_history (
  id SERIAL PRIMARY KEY,                    -- 支付记录唯一标识符（自增主键）
  user_id text NOT NULL,                    -- 用户ID（关联users表）
  stripe_payment_intent_id character varying(100) NULL, -- Stripe支付意图ID
  amount numeric(10,2) NOT NULL,            -- 支付金额（精确到分）
  currency character varying(3) NOT NULL,   -- 货币代码（如：USD, EUR等）
  status character varying(50) NOT NULL,    -- 支付状态（如：succeeded, failed, pending等）
  stripe_subscription_id text NULL,         -- Stripe订阅ID（用于订阅支付）
  stripe_customer_id text NULL,             -- Stripe客户ID
  stripe_price_id text NULL,                -- Stripe价格ID
  subscription_plans_id bigint NULL,        -- 订阅计划ID（关联subscription_plans表）
  created_at timestamp with time zone NULL  -- 支付创建时间
);

-- 订阅计划表：定义不同的订阅套餐和价格方案
CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,                    -- 计划唯一标识符（自增主键）
  name character varying(100) NOT NULL,     -- 计划名称（如：Basic, Pro, Enterprise等）
  interval character varying(20) NOT NULL,  -- 计费周期（如：month, year）
  price numeric(10,2) NOT NULL,             -- 计划价格（精确到分）
  currency character varying(3) NOT NULL,   -- 货币代码（如：USD, EUR等）
  credit_per_interval integer NOT NULL,     -- 每个计费周期提供的积分数
  stripe_price_id character varying(100) NOT NULL, -- Stripe价格ID
  is_active boolean NULL,                   -- 计划是否活跃（可用于订阅）
  created_at timestamp with time zone NULL, -- 创建时间
  updated_at timestamp with time zone NULL  -- 最后更新时间
);

-- 用户订阅表：存储用户的订阅状态和周期信息
CREATE TABLE user_subscriptions (
  id SERIAL PRIMARY KEY,                    -- 订阅记录唯一标识符（自增主键）
  user_id text NOT NULL,                    -- 用户ID（关联users表）
  stripe_price_id text NOT NULL,            -- Stripe价格ID
  stripe_subscription_id character varying(100) NOT NULL, -- Stripe订阅ID
  stripe_customer_id character varying(100) NOT NULL,     -- Stripe客户ID
  subscription_plans_id bigint NULL,        -- 订阅计划ID（关联subscription_plans表）
  status character varying(50) NOT NULL,    -- 订阅状态（如：active, canceled, past_due等）
  current_period_start timestamp with time zone NOT NULL, -- 当前计费周期开始时间
  current_period_end timestamp with time zone NOT NULL,   -- 当前计费周期结束时间
  cancel_at_period_end boolean NULL,        -- 是否在周期结束时取消
  canceled_at timestamp with time zone NULL, -- 取消时间
  cancellation_reason text NULL,            -- 取消原因
  ends_at timestamp with time zone NULL,    -- 订阅结束时间
  created_at timestamp with time zone NULL, -- 创建时间
  updated_at timestamp with time zone NULL  -- 最后更新时间
);
