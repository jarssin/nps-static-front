interface SurveySubmission {
  phone: string;
  score?: number | null;
  journeyEvaluations: Record<string, number | boolean | null>;
  comment: string;
  visitorId: string;
  type: 'csat' | 'nps';
}

export const submitSurvey = async (data: SurveySubmission): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:8080/create-survey?type=${data.type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit survey');
    }
  } catch (error) {
    console.error('Error submitting survey:', error);
    throw error;
  }
};
