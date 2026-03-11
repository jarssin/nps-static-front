import React, { useEffect } from "react";
import { useConfig } from "../hooks/useConfig";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const config = useConfig();

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty(
      "--primary",
      config.theme.primaryColor.replace("hsl(", "").replace(")", "")
    );
    root.style.setProperty(
      "--primary-foreground",
      config.theme.primaryForegroundColor.replace("hsl(", "").replace(")", "")
    );

    root.style.setProperty(
      "--secondary",
      config.theme.secondaryColor.replace("hsl(", "").replace(")", "")
    );
    root.style.setProperty(
      "--secondary-foreground",
      config.theme.secondaryForegroundColor.replace("hsl(", "").replace(")", "")
    );

    root.style.setProperty(
      "--card",
      config.theme.cardColor.replace("hsl(", "").replace(")", "")
    );
    root.style.setProperty(
      "--muted",
      config.theme.mutedColor.replace("hsl(", "").replace(")", "")
    );
    root.style.setProperty(
      "--muted-foreground",
      config.theme.mutedForegroundColor.replace("hsl(", "").replace(")", "")
    );
    root.style.setProperty(
      "--border",
      config.theme.borderColor.replace("hsl(", "").replace(")", "")
    );

    document.body.style.backgroundColor = config.theme.backgroundColor;
  }, [config]);

  return <>{children}</>;
};

export default ThemeProvider;
