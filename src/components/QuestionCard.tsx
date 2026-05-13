import React from 'react'
import { Question } from '../data/questions'

interface Props {
  question: Question
  onAnswer: (index: number) => void
}

export default function QuestionCard({ question, onAnswer }: Props) {
  return (
    <div className="max-w-2xl w-full bg-zinc-900 rounded-3xl p-6 shadow-2xl">
      <h2 className="text-xl font-semibold mb-6">{question.text}</h2>
      <div className="space-y-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className="w-full text-left p-4 rounded-2xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition"
            onClick={() => onAnswer(idx)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
