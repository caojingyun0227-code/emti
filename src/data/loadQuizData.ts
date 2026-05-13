import { supabase } from "../lib/supabase";
import type { Question } from "./questions";

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

type QuestionRow = {
  id: number;
  text: string;
  options: string[];
};

type PersonalityRow = {
  id: number;
  name: string;
  core: string;
  keywords: string[];
  description: string;
};

export type QuizData = {
  questions: Question[];
  personalities: Record<string, RuntimePersonality>;
};

const requiredLongQuestionIds = [35, 56, 75];

export async function loadQuizData(): Promise<QuizData> {
  const [questionsResult, personalitiesResult] = await Promise.all([
    supabase.from("questions").select("id, text, options").order("id"),
    supabase.from("personalities").select("id, name, core, keywords, description").order("id"),
  ]);

  if (questionsResult.error) {
    throw new Error(`Failed to load questions: ${questionsResult.error.message}`);
  }

  if (personalitiesResult.error) {
    throw new Error(`Failed to load personalities: ${personalitiesResult.error.message}`);
  }

  const questionRows = (questionsResult.data ?? []) as QuestionRow[];
  const personalityRows = (personalitiesResult.data ?? []) as PersonalityRow[];

  if (!questionRows.length) {
    throw new Error("Supabase table 'questions' is empty.");
  }

  if (!personalityRows.length) {
    throw new Error("Supabase table 'personalities' is empty.");
  }

  if (questionRows.length < 40) {
    throw new Error(
      `Supabase questions only has ${questionRows.length} rows. buildQuiz needs a complete question bank before it can draw a 40-question quiz.`,
    );
  }

  const questionIds = new Set(questionRows.map((question) => question.id));
  const hasLongQuestion = requiredLongQuestionIds.some((id) => questionIds.has(id));

  if (!hasLongQuestion) {
    throw new Error(
      `Supabase questions is missing all long-question ids: ${requiredLongQuestionIds.join(", ")}.`,
    );
  }

  return {
    questions: questionRows as Question[],
    personalities: Object.fromEntries(
      personalityRows.map((personality) => [
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
    ),
  };
}
