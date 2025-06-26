import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useConfig } from "@/hooks/useConfig";

interface ThankYouProps {
  onReset: () => void;
}

const ThankYou = ({ onReset }: ThankYouProps) => {
  const config = useConfig();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onReset]);

  return (
    <div className="w-full max-w-lg mx-auto px-6 text-center animate-in fade-in-50 duration-500">
      <div className="mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
          {config.texts.thankYou.title}
        </h2>
        <p className="text-lg text-muted-foreground mb-4">
          {config.texts.thankYou.message}
        </p>
        <p className="text-sm text-muted-foreground">
          Retornando à pesquisa em {countdown} segundo
          {countdown !== 1 ? "s" : ""}...
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
