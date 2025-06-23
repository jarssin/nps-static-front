import { cn } from '@/lib/utils';

interface JourneyEvaluationProps {
  evaluations: Record<string, number |null>;
  onChange: (journey: string, value: number) => void;
  onComplete: () => void;
}

const journeys = [
  'Atendimento do Vendedor',
  'Custo benefício',
  'Variedade',
  'Tempo de espera',
  'Atendimento do Caixa',
  'Formas de Pagamento',
];

const CsatQuestion = ({
  evaluations,
  onChange,
  onComplete,
}: JourneyEvaluationProps) => {
  const handleEvaluation = (journey: string, value: number) => {
    onChange(journey, value);

    // Check if all journeys have been evaluated
    const updatedEvaluations = { ...evaluations, [journey]: value };
    const allEvaluated = journeys.every(
      (j) =>
        updatedEvaluations[j] !== null && updatedEvaluations[j] !== undefined
    );

    if (allEvaluated) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const completedCount = journeys.filter(
    (j) => evaluations[j] !== null && evaluations[j] !== undefined
  ).length;

  return (
    <div className="w-full max-w-3xl mx-auto px-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
          Deixe sua opinião
        </h1>
        <p className="text-muted-foreground text-lg mb-2">
          Avalie cada aspecto da sua experiência (1 = ruim, 5 = excelente)
        </p>
        <p className="text-sm text-muted-foreground">
          {completedCount}/{journeys.length} avaliações concluídas
        </p>
      </div>

      <div className="space-y-4">
        {journeys.map((journey) => (
          <div
            key={journey}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground flex-1">
                {journey}
              </h3>
              <div className="flex gap-2 ml-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleEvaluation(journey, num)}
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 text-base font-bold',
                      evaluations[journey] === num
                        ? 'bg-primary text-white border-primary scale-110 shadow'
                        : 'bg-muted text-muted-foreground border-border hover:bg-primary/10'
                    )}
                    aria-label={`Nota ${num} para ${journey}`}
                  >
                    {num}
                  </button>
                ))}
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

export default CsatQuestion;
