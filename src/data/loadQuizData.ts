import { QUESTION_POOL, type Question } from "./questions";
import { PERSONALITIES } from "./personalities";

export type RuntimePersonality = {
  id: number;
  name: string;
  core: string;
  keywords: string[];
  code: string;
  title: string;
  subtitle: string;
  description: string;
  strengths: string[];
};

export type QuizData = {
  questions: Question[];
  personalities: Record<string, RuntimePersonality>;
};

function getLocalPersonalities(): Record<string, RuntimePersonality> {
  return Object.fromEntries(
    PERSONALITIES.map((personality) => [
      String(personality.id),
      {
        id: personality.id,
        name: personality.name,
        core: personality.core,
        keywords: personality.keywords,
        code: String(personality.id),
        title: personality.name,
        subtitle: personality.core,
        description: personality.description,
        strengths: personality.keywords,
      },
    ]),
  );
}

export function getLocalQuizData(): QuizData {
  return {
    questions: QUESTION_POOL,
    personalities: getLocalPersonalities(),
  };
}

export async function loadQuizData(): Promise<QuizData> {
  return getLocalQuizData();
}
