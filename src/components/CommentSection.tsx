import React, { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/hooks/useConfig";

interface CommentSectionProps {
  comment: string;
  onChange: (comment: string) => void;
  onSubmit: () => void;
  isVisible: boolean;
  npsScore: number | null;
}

const CommentSection = ({
  comment,
  onChange,
  onSubmit,
  isVisible,
  npsScore,
}: CommentSectionProps) => {
  const config = useConfig();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isVisible && textareaRef.current) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isVisible]);

  const getPromptText = () => {
    if (npsScore === null) return "Por favor, compartilhe seu feedback...";
    if (npsScore >= 9) return config.texts.comment.prompts.promoter;
    if (npsScore >= 7) return config.texts.comment.prompts.passive;
    return config.texts.comment.prompts.detractor;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-2xl mx-auto px-6 animate-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
            {config.texts.comment.title}
          </h2>
          <p className="text-muted-foreground mb-2">{getPromptText()}</p>
          <p className="text-sm text-muted-foreground">
            {config.texts.comment.subtitle}
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            ref={textareaRef}
            value={comment}
            onChange={(e) => onChange(e.target.value)}
            placeholder={config.texts.comment.placeholder}
            className="min-h-32 resize-none text-base focus:ring-2 focus:ring-primary"
            maxLength={config.settings.maxCommentLength || 500}
          />

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {comment.length}/{config.settings.maxCommentLength || 500}{" "}
              caracteres
            </span>

            <Button
              type="submit"
              size="lg"
              className="px-8 transition-all duration-200 hover:scale-105"
            >
              Enviar Feedback
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
