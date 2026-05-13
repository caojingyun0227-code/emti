import React from 'react'
import { Question } from '../data/questions'
import type { RuntimePersonality } from '../data/loadQuizData'
import {
  addScore,
  createInitialScore,
  getSortedScore,
  type Score,
} from '../data/scoring'

interface Props {
  answers: number[]
  questions: Question[]
  personalities: Record<string, RuntimePersonality>
}

const resultByTopScore: Record<keyof Score, number> = {
  H: 1,
  A: 2,
  C: 3,
  G: 4,
  E: 5,
}

export default function ResultPage({ answers, questions, personalities }: Props) {
  const scores = answers.reduce(
    (score, optionIndex, index) =>
      addScore(score, questions[index]?.id ?? 0, optionIndex),
    createInitialScore()
  )
  const sorted = getSortedScore(scores)
  const top = personalities[String(resultByTopScore[sorted[0][0]])]

  return (
    <div className="max-w-3xl w-full bg-zinc-900 rounded-3xl p-8 shadow-2xl">
      <h1 className="text-3xl font-bold mb-4">你的主导人格</h1>
      {top && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">{top.name}</h2>
          <p className="mb-4 text-zinc-300">{top.core}</p>
          <p className="text-zinc-400">{top.description}</p>
        </div>
      )}
    </div>
  )
}
