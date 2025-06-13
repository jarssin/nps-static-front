import React, { useState } from 'react';
import CommentSection from './CommentSection';
import ThankYou from './ThankYou';
import { usePhoneNumber } from '@/hooks/usePhoneNumber';
import { useVisitorId } from '@/hooks/useVisitorId';
import { submitSurvey } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import CsatQuestion from './CsatQuestion';
import { useAutoAdvanceTimer } from '@/hooks/useAutoAdvanceTimer';

const NPSSurveyCsat = () => {
  const phone = usePhoneNumber();
  const visitorId = useVisitorId();
  const { toast } = useToast();
  const [journeyEvaluations, setJourneyEvaluations] = useState({});
  const [comment, setComment] = useState('');
  const [step, setStep] = useState<'journey' | 'comment' | 'thanks'>('journey');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleJourneyComplete = () => {
    handleStepTransition('comment');
    setTimeout(() => {
      startAutoAdvanceTimer('thanks');
    }, 300);
  };

  const handleCommentChange = (newComment: string) => {
    setComment(newComment);
    resetAutoAdvanceTimer('thanks');
  };
  const handleStepTransition = async (nextStep) => {
    setIsTransitioning(true);
    if (nextStep === 'thanks') {
      try {
        await submitSurvey({
          phone,
          journeyEvaluations,
          comment,
          visitorId,
          type: 'boolean',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to submit survey. Please try again.',
          variant: 'destructive',
        });
      }
    }
    setTimeout(() => {
      setStep(nextStep);
      setIsTransitioning(false);
    }, 200);
  };

  const {
    autoAdvanceCountdown,
    isStepCompleted,
    startAutoAdvanceTimer,
    resetAutoAdvanceTimer,
    cleanup,
  } = useAutoAdvanceTimer(handleStepTransition, step);

  React.useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const handleSubmit = () => handleStepTransition('thanks');
  const handleJourneyEvaluation = (journey, value) =>
    setJourneyEvaluations((prev) => ({ ...prev, [journey]: value }));

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div
          className={`transition-all duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {step === 'journey' && (
            <CsatQuestion
              evaluations={journeyEvaluations}
              onChange={handleJourneyEvaluation}
              onComplete={handleJourneyComplete}
            />
          )}
          {step === 'comment' && (
            <CommentSection
              comment={comment}
              onChange={handleCommentChange}
              onSubmit={handleSubmit}
              isVisible={step === 'comment'}
              npsScore={null}
            />
          )}
          {step === 'thanks' && (
            <ThankYou onReset={() => window.location.reload()} />
          )}
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

export default NPSSurveyCsat;
