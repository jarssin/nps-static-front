
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JourneyEvaluationProps {
  evaluations: Record<string, boolean | null>;
  onChange: (journey: string, value: boolean) => void;
  onComplete: () => void;
}

const journeys = [
  'Atendimento do Vendedor',
  'Custo benefício',
  'Variedade',
  'Tempo de espera',
  'Atendimento do Caixa',
  'Formas de Pagamento'
];

const JourneyEvaluation = ({ evaluations, onChange, onComplete }: JourneyEvaluationProps) => {
  const handleEvaluation = (journey: string, value: boolean) => {
    onChange(journey, value);

    // Check if all journeys have been evaluated
    const updatedEvaluations = { ...evaluations, [journey]: value };
    const allEvaluated = journeys.every(j => updatedEvaluations[j] !== null && updatedEvaluations[j] !== undefined);

    if (allEvaluated) {
      // Small delay before moving to next section for better UX
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const completedCount = journeys.filter(j => evaluations[j] !== null && evaluations[j] !== undefined).length;

  return (
    <div className="w-full max-w-3xl mx-auto px-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
          Deixe sua opinião
        </h1>
        <p className="text-muted-foreground text-lg mb-2">
          Avalie cada aspecto da sua experiência
        </p>
        <p className="text-sm text-muted-foreground">
          {completedCount}/{journeys.length} avaliações concluídas
        </p>
      </div>

      <div className="space-y-4">
        {journeys.map((journey) => (
          <div key={journey} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground flex-1">
                {journey}
              </h3>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEvaluation(journey, false)}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    evaluations[journey] === false
                      ? "bg-red-500 text-white shadow-lg scale-105"
                      : "bg-muted hover:bg-red-100 text-muted-foreground hover:text-red-600"
                  )}
                  aria-label={`Não gostei de ${journey}`}
                >
                  <ThumbsDown className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleEvaluation(journey, true)}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    evaluations[journey] === true
                      ? "bg-green-500 text-white shadow-lg scale-105"
                      : "bg-muted hover:bg-green-100 text-muted-foreground hover:text-green-600"
                  )}
                  aria-label={`Gostei de ${journey}`}
                >
                  <ThumbsUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {completedCount > 0 && (
        <div className="mt-6">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / journeys.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyEvaluation;
