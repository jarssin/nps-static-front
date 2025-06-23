import React, { useState, useRef, useEffect } from "react";
import CommentSection from "./CommentSection";
import ThankYou from "./ThankYou";
import { usePhoneNumber } from "@/hooks/usePhoneNumber";
import { useVisitorId } from "@/hooks/useVisitorId";
import { submitSurvey } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import CsatQuestion from "./CSATQuestion";

const CSATSurvey = () => {
  const phone = usePhoneNumber();
  const visitorId = useVisitorId();
  const { toast } = useToast();
  const [journeyEvaluations, setJourneyEvaluations] = useState<
    Record<string, number | null>
  >({});
  const [comment, setComment] = useState("");
  const [step, setStep] = useState<"journey" | "comment" | "thanks">("journey");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<
    number | null
  >(null);
  const [isStepCompleted, setIsStepCompleted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

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
    setAutoAdvanceCountdown(20);
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

  const resetAutoAdvanceTimer = (nextStep: "comment" | "thanks") => {
    if (isStepCompleted) {
      clearTimers();
      setAutoAdvanceCountdown(null);
      setIsStepCompleted(false);
      startAutoAdvanceTimer();
    }
  };

  const handleStepTransition = async (
    nextStep: "journey" | "comment" | "thanks"
  ) => {
    clearTimers();
    setAutoAdvanceCountdown(null);
    setIsStepCompleted(false);
    setIsTransitioning(true);
    if (nextStep === "thanks") {
      try {
        await submitSurvey({
          phone,
          journeyEvaluations,
          comment,
          visitorId,
          type: "csat",
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

  const handleJourneyComplete = () => {
    handleStepTransition("comment");
    setTimeout(() => {
      startAutoAdvanceTimer();
    }, 300);
  };

  const handleCommentChange = (newComment: string) => {
    setComment(newComment);
    resetAutoAdvanceTimer("thanks");
  };

  const handleSubmit = () => handleStepTransition("thanks");
  const handleJourneyEvaluation = (journey: string, value: number) => {
    setJourneyEvaluations((prev) => ({ ...prev, [journey]: value }));
    if (!isStepCompleted) {
      startAutoAdvanceTimer();
    } else {
      resetAutoAdvanceTimer("comment");
    }
  };

  const handleReset = () => {
    clearTimers();
    setJourneyEvaluations({});
    setComment("");
    setAutoAdvanceCountdown(null);
    setIsStepCompleted(false);
    handleStepTransition("journey");
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div
          className={`transition-all duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {step === "journey" && (
            <CsatQuestion
              evaluations={journeyEvaluations}
              onChange={handleJourneyEvaluation}
              onComplete={handleJourneyComplete}
            />
          )}
          {step === "comment" && (
            <CommentSection
              comment={comment}
              onChange={handleCommentChange}
              onSubmit={handleSubmit}
              isVisible={step === "comment"}
              npsScore={null}
            />
          )}
          {step === "thanks" && <ThankYou onReset={handleReset} />}
        </div>
        {autoAdvanceCountdown !== null && (
          <div className="fixed top-4 right-4 bg-card border border-border rounded-lg p-3 shadow-lg animate-in slide-in-from-top-2 duration-300">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Avançando automaticamente em
              </p>
              <div className="text-lg font-bold text-primary">
                {autoAdvanceCountdown}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Interaja para reiniciar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSATSurvey;
