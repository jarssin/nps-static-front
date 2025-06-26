import { useState, useEffect, useRef } from "react";
import NPSQuestion from "./NPSQuestion";
import LikeDislikeQuestion from "./LikeDislikeQuestion";
import CommentSection from "./CommentSection";
import ThankYou from "./ThankYou";
import { usePhoneNumber } from "@/hooks/usePhoneNumber";
import { useVisitorId } from "@/hooks/useVisitorId";
import { submitSurvey } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useConfig } from "@/hooks/useConfig";
import ThemeProvider from "./ThemeProvider";
import Header from "./Header";

const NPSSurvey = () => {
  const config = useConfig();
  const phone = usePhoneNumber();
  const visitorId = useVisitorId();
  const { toast } = useToast();
  const [score, setScore] = useState<number | null>(null);
  const scoreRef = useRef<number | null>(null);
  const [journeyEvaluations, setJourneyEvaluations] = useState<
    Record<string, boolean | null>
  >({});
  const [comment, setComment] = useState("");
  const [step, setStep] = useState<"nps" | "journey" | "comment" | "thanks">(
    "nps"
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<
    number | null
  >(null);
  const [isStepCompleted, setIsStepCompleted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const startAutoAdvanceTimer = () => {
    clearTimers();
    setAutoAdvanceCountdown(config.settings.autoAdvanceTimeout);
    setIsStepCompleted(true);

    countdownRef.current = setInterval(() => {
      setAutoAdvanceCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearTimers();
          setAutoAdvanceCountdown(null);
          setIsStepCompleted(false);
          handleStepTransition("thanks");
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetAutoAdvanceTimer = () => {
    if (isStepCompleted) {
      clearTimers();
      setAutoAdvanceCountdown(null);
      setIsStepCompleted(false);
      startAutoAdvanceTimer();
    }
  };

  const handleStepTransition = async (
    nextStep: "nps" | "journey" | "comment" | "thanks"
  ) => {
    clearTimers();
    setAutoAdvanceCountdown(null);
    setIsStepCompleted(false);
    setIsTransitioning(true);

    if (nextStep === "thanks") {
      try {
        await submitSurvey({
          phone,
          score: scoreRef.current,
          journeyEvaluations,
          comment,
          visitorId,
          type: "nps",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit survey. Please try again.",
          variant: "destructive",
        });
      }
    }

    setTimeout(() => {
      setStep(nextStep);
      setIsTransitioning(false);
    }, 200);
  };

  const handleNPSComplete = () => {
    handleStepTransition("journey");
    setTimeout(() => {
      startAutoAdvanceTimer();
    }, 300);
  };

  const handleJourneyComplete = () => {
    handleStepTransition("comment");
    setTimeout(() => {
      startAutoAdvanceTimer();
    }, 300);
  };

  const handleJourneyEvaluation = (journey: string, value: boolean) => {
    setJourneyEvaluations((prev) => ({
      ...prev,
      [journey]: value,
    }));
    resetAutoAdvanceTimer();
  };

  const handleCommentChange = (newComment: string) => {
    setComment(newComment);
    resetAutoAdvanceTimer();
  };

  const handleSubmit = () => {
    handleStepTransition("thanks");
  };

  const handleReset = () => {
    clearTimers();
    setScore(null);
    scoreRef.current = null;
    setJourneyEvaluations({});
    setComment("");
    setAutoAdvanceCountdown(null);
    setIsStepCompleted(false);
    handleStepTransition("nps");
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return (
    <ThemeProvider>
      <div
        className="min-h-screen bg-background flex items-center justify-center p-4"
        style={{ backgroundColor: config.theme.backgroundColor }}
      >
        <div className="w-full max-w-5xl">
          {step === "nps" && config.name == "Panificadora Boa União" && (
            <Header />
          )}

          <div
            className={`transition-all duration-300 ${
              isTransitioning
                ? "opacity-0 transform translate-y-4"
                : "opacity-100 transform translate-y-0"
            }`}
          >
            {step === "nps" && (
              <div className="animate-in fade-in-50 slide-in-from-right-4 duration-500">
                <NPSQuestion
                  value={score}
                  onChange={setScore}
                  onComplete={handleNPSComplete}
                />
              </div>
            )}

            {step === "journey" && (
              <div className="animate-in fade-in-50 slide-in-from-right-4 duration-500">
                <LikeDislikeQuestion
                  evaluations={journeyEvaluations}
                  onChange={handleJourneyEvaluation}
                  onComplete={handleJourneyComplete}
                />
              </div>
            )}

            {step === "comment" && (
              <div className="animate-in fade-in-50 slide-in-from-right-4 duration-500">
                <CommentSection
                  comment={comment}
                  onChange={handleCommentChange}
                  onSubmit={handleSubmit}
                  isVisible={step === "comment"}
                  npsScore={score}
                />
              </div>
            )}

            {step === "thanks" && (
              <div className="animate-in fade-in-50 scale-in-95 duration-500">
                <ThankYou onReset={handleReset} />
              </div>
            )}
          </div>

          {autoAdvanceCountdown !== null && (
            <div className="fixed top-4 right-4 bg-card border border-border rounded-lg p-3 shadow-lg animate-in slide-in-from-top-2 duration-300">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  {config.texts.autoAdvance.message}
                </p>
                <div className="text-lg font-bold text-primary">
                  {autoAdvanceCountdown}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {config.texts.autoAdvance.instruction}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <div
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  step === "nps" ? "bg-primary scale-125" : "bg-muted scale-100"
                }`}
              />
              <div
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  step === "journey"
                    ? "bg-primary scale-125"
                    : "bg-muted scale-100"
                }`}
              />
              <div
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  step === "comment"
                    ? "bg-primary scale-125"
                    : "bg-muted scale-100"
                }`}
              />
              <div
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  step === "thanks"
                    ? "bg-primary scale-125"
                    : "bg-muted scale-100"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default NPSSurvey;
