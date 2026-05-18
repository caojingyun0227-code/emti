import React from 'react'
import { Question } from '../data/questions'

interface Props {
  question: Question
  onAnswer: (index: number) => void
}

export default function QuestionCard({ question, onAnswer }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">{question.text}</h2>
      <div className="space-y-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className="quiz-option w-full text-left p-4 rounded-2xl transition"
            onClick={() => onAnswer(idx)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
