import { createClient } from "@supabase/supabase-js";

const personalitiesModule = await import("../src/data/personalities.ts");
const questionsModule = await import("../src/data/questions.ts");

const PERSONALITIES =
  personalitiesModule.PERSONALITIES ??
  personalitiesModule.personalities ??
  personalitiesModule.default;

const QUESTION_POOL =
  questionsModule.QUESTION_POOL ??
  questionsModule.questions ??
  questionsModule.default;

if (!Array.isArray(PERSONALITIES)) {
  throw new Error(
    `Could not load PERSONALITIES. Available exports: ${Object.keys(personalitiesModule).join(", ")}`,
  );
}

if (!Array.isArray(QUESTION_POOL)) {
  throw new Error(
    `Could not load QUESTION_POOL. Available exports: ${Object.keys(questionsModule).join(", ")}`,
  );
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const personalityRows = PERSONALITIES;

const { error: personalitiesError } = await supabase
  .from("personalities")
  .upsert(personalityRows, { onConflict: "id" });

if (personalitiesError) {
  throw personalitiesError;
}

const { error: questionsError } = await supabase
  .from("questions")
  .upsert(QUESTION_POOL, { onConflict: "id" });

if (questionsError) {
  throw questionsError;
}

console.log(
  `Seeded ${QUESTION_POOL.length} questions and ${personalityRows.length} personalities.`,
);
