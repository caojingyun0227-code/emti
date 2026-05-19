import type { RuntimePersonality } from "./loadQuizData";
import { calculateResult } from "./scoring";

export function getRuntimeResult(
  answers: { questionId: number; optionIndex: number }[],
  personalities: Record<string, RuntimePersonality>,
): RuntimePersonality {
  const result = calculateResult(answers);
  const resultId = result.personality?.id;
  const personality = resultId ? personalities[String(resultId)] : undefined;

  if (!personality) {
    throw new Error(`No personality found for result id '${resultId}'.`);
  }

  return personality;
}
