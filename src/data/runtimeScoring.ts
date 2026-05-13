import type { RuntimePersonality } from "./loadQuizData";
import { addScore, createInitialScore, getSortedResultScore, type Score } from "./scoring";

const resultByTopScore: Record<keyof Score, number> = {
  H: 1,
  A: 2,
  C: 3,
  G: 4,
  E: 5,
};

export function getRuntimeResult(
  answers: { questionId: number; optionIndex: number }[],
  personalities: Record<string, RuntimePersonality>,
): RuntimePersonality {
  const score = answers.reduce(
    (total, answer) => addScore(total, answer.questionId, answer.optionIndex),
    createInitialScore(),
  );

  const [topScore] = getSortedResultScore(score);
  const resultId = resultByTopScore[topScore[0]];
  const result = personalities[String(resultId)];

  if (!result) {
    throw new Error(`No personality found for result id '${resultId}'.`);
  }

  return result;
}
