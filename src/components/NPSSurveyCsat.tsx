import React, { useState, useRef } from 'react';
import CommentSection from './CommentSection';
import ThankYou from './ThankYou';
import { usePhoneNumber } from '@/hooks/usePhoneNumber';
import { useVisitorId } from '@/hooks/useVisitorId';
import { submitSurvey } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import JourneyEvaluationCsat from './JourneyEvaluation';

const NPSSurveyCsat = () => {
  const phone = usePhoneNumber();
  const visitorId = useVisitorId();
  const { toast } = useToast();
  const [journeyEvaluations, setJourneyEvaluations] = useState({});
  const [comment, setComment] = useState('');
  const [step, setStep] = useState<'journey' | 'comment' | 'thanks'>('journey');
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const handleJourneyComplete = () => handleStepTransition('comment');
  const handleCommentChange = (newComment) => setComment(newComment);
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
            <JourneyEvaluationCsat
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
      </div>
    </div>
  );
};

export default NPSSurveyCsat;
