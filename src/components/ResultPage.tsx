import React from 'react'
import { Question } from '../data/questions'
import type { RuntimePersonality } from '../data/loadQuizData'
import {
  addScore,
  createInitialScore,
  getSortedResultScore,
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

const imageByPersonalityId: Record<number, string> = {
  13: 'personality-01.png',
  3: 'personality-02.png',
  2: 'personality-03.png',
  4: 'personality-04.png',
  16: 'personality-05.png',
  1: 'personality-06.png',
  11: 'personality-07.png',
  15: 'personality-08.png',
  6: 'personality-09.png',
  14: 'personality-10.png',
  9: 'personality-11.png',
  8: 'personality-12.png',
  12: 'personality-13.png',
  5: 'personality-14.png',
  10: 'personality-15.png',
  7: 'personality-16.png',
}

export default function ResultPage({ answers, questions, personalities }: Props) {
  const scores = answers.reduce(
    (score, optionIndex, index) =>
      addScore(score, questions[index]?.id ?? 0, optionIndex),
    createInitialScore()
  )
  const sorted = getSortedResultScore(scores)
  const top = personalities[String(resultByTopScore[sorted[0][0]])]
  const imageName = top ? imageByPersonalityId[top.id] : undefined

  return (
    <div className="quiz-card result-card max-w-5xl w-full rounded-3xl p-8 shadow-2xl">
      <div className="result-content">
        <div className="result-text">
          <h1 className="text-3xl font-bold mb-4">你的主导人格</h1>
          {top && (
            <>
              <h2 className="text-2xl font-semibold mb-2">{top.name}</h2>
              <p className="mb-4">{top.core}</p>
              <p>{top.description}</p>
            </>
          )}
        </div>

        {top && imageName && (
          <img
            className="result-personality-image"
            src={`${import.meta.env.BASE_URL}personality-images/${imageName}`}
            alt={`${top.name} 人格图片`}
          />
        )}
      </div>
    </div>
  )
}
