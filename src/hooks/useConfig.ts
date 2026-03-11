import { useMemo } from "react";
import configData from "../config.json";

export type CustomerConfig = {
  name: string;
  logo: string;
  theme: {
    backgroundColor: string;
    primaryColor: string;
    primaryForegroundColor: string;
    secondaryColor: string;
    secondaryForegroundColor: string;
    cardColor: string;
    mutedColor: string;
    mutedForegroundColor: string;
    borderColor: string;
    fontFamily: {
      title: string;
      subtitle: string;
    };
  };
  texts: {
    header: {
      title: string;
      subtitle: string;
      tagline: string;
    };
    nps: {
      question: string;
      subtitle: string;
      labels: {
        unlikely: string;
        likely: string;
      };
    };
    csat: {
      question: string;
      subtitle: string;
    };
    journey: {
      title: string;
      subtitle: string;
      aspects: string[];
    };
    comment: {
      title: string;
      prompts: {
        promoter: string;
        passive: string;
        detractor: string;
      };
      placeholder: string;
      subtitle: string;
    };
    thankYou: {
      title: string;
      message: string;
    };
    autoAdvance: {
      message: string;
      instruction: string;
    };
  };
  settings: {
    autoAdvanceTimeout: number;
    thankYouTimeout: number;
    maxCommentLength: number;
    apiUrl: string;
  };
};

export const useConfig = (): CustomerConfig => {
  const config = useMemo(() => {
    const activeCustomer = configData.activeCustomer;
    const customerConfig =
      configData.customers[activeCustomer as keyof typeof configData.customers];

    if (!customerConfig) {
      throw new Error(`Customer configuration not found: ${activeCustomer}`);
    }

    return customerConfig as CustomerConfig;
  }, []);

  return config;
};
