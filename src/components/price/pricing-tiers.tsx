import type { Frequency, Tier } from "./pricing-types";

import { FrequencyEnum, TiersEnum } from "./pricing-types";

export const frequencies: Array<Frequency> = [
  {
    key: FrequencyEnum.Monthly,
    label: "Pay Monthly",
    priceSuffix: "per month",
  },
  { key: FrequencyEnum.Yearly, label: "Pay Yearly", priceSuffix: "per month" },
  {
    key: FrequencyEnum.OneTime,
    label: "Pay One Time",
    priceSuffix: "one time",
  },
];

export const tiers: Array<Tier> = [
  {
    key: TiersEnum.Basic,
    id: {
      [FrequencyEnum.Monthly]: 2,
      [FrequencyEnum.Yearly]: 5,
      [FrequencyEnum.OneTime]: 1,
    },
    amount: {
      [FrequencyEnum.Monthly]: 4390,
      [FrequencyEnum.Yearly]: 36876,
      [FrequencyEnum.OneTime]: 4390,
    },
    interval: {
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.Yearly]: "year",
      [FrequencyEnum.OneTime]: "month",
    },
    title: "Basic",
    price: {
      yearly: "R$43.9",
      monthly: "R$43.9",
      onetime: "R$43.9",
    },
    previousPrice: {
      yearly: "",
      monthly: "",
      onetime: "",
    },
    href: "#",
    featured: false,
    mostPopular: false,
    description: "For starters and hobbyists that want to try out.",
    features: {
      yearly: ["1800 credits per year", "All tools available", "Email support"],
      monthly: [
        "150 credits per month",
        "All tools available",
        "Email support",
      ],
      onetime: [
        "150 credits one month",
        "All tools available",
        "Email support",
      ],
    },
    buttonText: "Purchase",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  {
    key: TiersEnum.Standard,
    id: {
      [FrequencyEnum.Yearly]: 6,
      [FrequencyEnum.Monthly]: 3,
      [FrequencyEnum.OneTime]: 9,
    },
    amount: {
      [FrequencyEnum.Yearly]: 136800,
      [FrequencyEnum.Monthly]: 12900,
      [FrequencyEnum.OneTime]: 14300,
    },
    interval: {
      [FrequencyEnum.Yearly]: "year",
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.OneTime]: "month",
    },
    title: "Standard",
    description: "For enthusiasts that want to try out.",
    href: "#",
    mostPopular: true,
    price: {
      yearly: "R$114.0",
      monthly: "R$129.0",
      onetime: "R$143.0",
    },
    previousPrice: {
      yearly: "R$129.0",
      monthly: "R$143.0",
      onetime: "",
    },
    featured: false,
    features: {
      yearly: ["7200 credits per year", "All tools available", "Email support"],
      monthly: [
        "600 credits per month",
        "All tools available",
        "Email support",
      ],
      onetime: [
        "600 credits one month",
        "All tools available",
        "Email support",
      ],
    },
    buttonText: "Purchase",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  {
    key: TiersEnum.Premium,
    id: {
      [FrequencyEnum.Yearly]: 8,
      [FrequencyEnum.Monthly]: 4,
      [FrequencyEnum.OneTime]: 11,
    },
    amount: {
      [FrequencyEnum.Yearly]: 279600,
      [FrequencyEnum.Monthly]: 25600,
      [FrequencyEnum.OneTime]: 29200,
    },
    interval: {
      [FrequencyEnum.Yearly]: "year",
      [FrequencyEnum.Monthly]: "month",
      [FrequencyEnum.OneTime]: "month",
    },
    title: "Premium",
    href: "#",
    featured: true,
    mostPopular: false,
    description: "For professionals that want to try out.",
    price: {
      yearly: "R$233.0",
      monthly: "R$256.0",
      onetime: "R$292.0",
    },
    previousPrice: {
      yearly: "R$256.9",
      monthly: "R$292.9",
      onetime: "",
    },
    priceSuffix: "",
    features: {
      yearly: ["18000 credits per year", "All tools available", "Email support"],
      monthly: [
        "1500 credits per month",
        "All tools available",
        "Email support",
      ],
      onetime: [
        "1500 credits one month",
        "All tools available",
        "Email support",
      ],
    },
    buttonText: "Purchase",
    buttonColor: "default",
    buttonVariant: "flat",
  },
];
