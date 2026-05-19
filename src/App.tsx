import React, { useMemo, useState } from 'react'
import StartPage from './components/StartPage'
import QuestionCard from './components/QuestionCard'
import ProgressBar from './components/ProgressBar'
import ResultPage from './components/ResultPage'
import { buildQuiz } from './data/buildQuiz'
import { getLocalQuizData } from './data/loadQuizData'

type Step = 'start' | 'quiz' | 'result'

export default function App() {
  const [quizData] = useState(() => getLocalQuizData())
  const [step, setStep] = useState<Step>('start')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const quiz = useMemo(
    () => buildQuiz(),
    []
  )

  const handleStart = () => {
    setAnswers([])
    setCurrentIndex(0)
    setStep('quiz')
  }

  const handleAnswer = (optionIndex: number) => {
    setAnswers([...answers, optionIndex])
    if (currentIndex + 1 < quiz.length) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setStep('result')
    }
  }

  const appStyle =
    step === 'start'
      ? undefined
      : {
          backgroundImage: `url(${import.meta.env.BASE_URL}quiz-background.png)`,
        }

  return (
    <div
      className={`app-shell ${step === 'start' ? 'app-shell-start' : 'app-shell-test'}`}
      style={appStyle}
    >
      {step === 'start' ? (
        <StartPage onStart={handleStart} />
      ) : step === 'result' ? (
        <ResultPage
          answers={answers}
          questions={quiz}
          personalities={quizData.personalities}
        />
      ) : (
        <div className="quiz-card max-w-2xl w-full rounded-3xl p-6 shadow-2xl">
          <ProgressBar
            current={Math.min(currentIndex + 1, quiz.length)}
            total={quiz.length}
          />
          <QuestionCard
            question={quiz[currentIndex]}
            onAnswer={handleAnswer}
          />
        </div>
      )}
    </div>
  )
}
