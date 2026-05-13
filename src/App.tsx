import React, { useEffect, useMemo, useState } from 'react'
import StartPage from './components/StartPage'
import QuestionCard from './components/QuestionCard'
import ResultPage from './components/ResultPage'
import { buildQuiz } from './data/buildQuiz'
import { loadQuizData, type QuizData } from './data/loadQuizData'

type Step = 'loading' | 'start' | 'quiz' | 'result'

export default function App() {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [step, setStep] = useState<Step>('start')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadQuizData()
      .then((data) => {
        setQuizData(data)
        setStep((currentStep) => (currentStep === 'loading' ? 'quiz' : currentStep))
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : '数据加载失败')
      })
  }, [])

  const quiz = useMemo(
    () => (quizData ? buildQuiz(quizData.questions) : []),
    [quizData]
  )

  const handleStart = () => {
    setAnswers([])
    setCurrentIndex(0)
    setStep(quizData ? 'quiz' : 'loading')
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
      {error ? (
        <div className="max-w-2xl w-full rounded-3xl border border-red-300 bg-white p-8 text-red-700">
          数据库加载失败：{error}
        </div>
      ) : step === 'loading' ? (
        <div className="quiz-card max-w-2xl w-full rounded-3xl p-8 text-center shadow-2xl">
          正在从数据库加载题库...
        </div>
      ) : step === 'start' ? (
        <StartPage onStart={handleStart} />
      ) : step === 'result' && quizData ? (
        <ResultPage
          answers={answers}
          questions={quiz}
          personalities={quizData.personalities}
        />
      ) : (
        <QuestionCard
          question={quiz[currentIndex]}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  )
}
