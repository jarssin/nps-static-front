import { cn } from '@/lib/utils';

interface NPSQuestionProps {
  value: number | null;
  onChange: (value: number) => void;
  onComplete: () => void;
}

const NPSQuestion = ({ value, onChange, onComplete }: NPSQuestionProps) => {
  const handleRatingClick = (rating: number) => {
    onChange(rating);

    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6">
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
          Qual a probabilidade de você nos recomendar para um amigo ou colega?
        </h1>
        <p className="text-muted-foreground text-lg">
          Por favor, selecione uma nota de 1 a 10
        </p>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6">
          {Array.from({ length: 10 }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handleRatingClick(i + 1)}
              className={cn(
                "w-12 h-12 md:w-14 md:h-14 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                value === i + 1
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-card border border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              aria-label={`Avaliar ${i + 1} de 10`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="flex justify-between text-sm text-muted-foreground px-2">
          <span>Nada provável</span>
          <span>Extremamente provável</span>
        </div>
      </div>
    </div>
  );
};

export default NPSQuestion;
