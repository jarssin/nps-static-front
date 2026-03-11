import configData from "../config.json";

interface SurveySubmission {
  phone: string;
  score?: number | null;
  journeyEvaluations: Record<string, number | boolean | null>;
  comment: string;
  visitorId: string;
  type: "csat" | "nps";
}

export const submitSurvey = async (data: SurveySubmission): Promise<void> => {
  const config = configData.customers[configData.activeCustomer];

  try {
    const response = await fetch(
      `${config.settings.apiUrl}?type=${data.type}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to submit survey");
    }
  } catch (error) {
    console.error("Error submitting survey:", error);
    throw error;
  }
};
