import React, { useEffect, useMemo, useState } from 'react'
import StartPage from './components/StartPage'
import QuestionCard from './components/QuestionCard'
import ProgressBar from './components/ProgressBar'
import ResultPage from './components/ResultPage'
import { buildQuiz } from './data/buildQuiz'
import { loadQuizData, type QuizData } from './data/loadQuizData'

type Step = 'loading' | 'start' | 'quiz' | 'result'

const FALLBACK_SECONDS_PER_QUESTION = 18
const LOAD_ERROR_TEXT = '\u6570\u636e\u52a0\u8f7d\u5931\u8d25'
const DATABASE_LOAD_FAILED_TEXT = '\u6570\u636e\u5e93\u52a0\u8f7d\u5931\u8d25\uff1a'
const LOADING_QUIZ_TEXT = '\u6b63\u5728\u4ece\u6570\u636e\u5e93\u52a0\u8f7d\u9898\u5e93...'
const COMPLETING_TEXT = '\u5373\u5c06\u5b8c\u6210'
const LESS_THAN_ONE_MINUTE_TEXT = '\u9884\u8ba1\u8fd8\u9700\u4e0d\u5230 1 \u5206\u949f'
const ABOUT_MINUTES_TEXT = '\u9884\u8ba1\u8fd8\u9700\u7ea6'

export default function App() {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [step, setStep] = useState<Step>('start')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [quizStartedAt, setQuizStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    loadQuizData()
      .then((data) => {
        setQuizData(data)
        setStep((currentStep) => (currentStep === 'loading' ? 'quiz' : currentStep))
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : LOAD_ERROR_TEXT)
      })
  }, [])

  useEffect(() => {
    if (step !== 'quiz') {
      return
    }

    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [step])

  const quiz = useMemo(
    () => (quizData ? buildQuiz(quizData.questions) : []),
    [quizData]
  )

  const handleStart = () => {
    const startedAt = Date.now()

    setAnswers([])
    setCurrentIndex(0)
    setQuizStartedAt(startedAt)
    setNow(startedAt)
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

  const remainingText = useMemo(() => {
    const remainingQuestions = Math.max(quiz.length - currentIndex, 0)
    const elapsedSeconds = quizStartedAt
      ? Math.max(0, Math.round((now - quizStartedAt) / 1000))
      : 0
    const secondsPerQuestion =
      answers.length > 0
        ? Math.max(8, elapsedSeconds / answers.length)
        : FALLBACK_SECONDS_PER_QUESTION
    const remainingSeconds = Math.ceil(remainingQuestions * secondsPerQuestion)

    if (remainingSeconds <= 0) {
      return COMPLETING_TEXT
    }

    if (remainingSeconds < 60) {
      return LESS_THAN_ONE_MINUTE_TEXT
    }

    return `${ABOUT_MINUTES_TEXT} ${Math.ceil(remainingSeconds / 60)} \u5206\u949f`
  }, [answers.length, currentIndex, now, quiz.length, quizStartedAt])

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
          {DATABASE_LOAD_FAILED_TEXT}
          {error}
        </div>
      ) : step === 'loading' ? (
        <div className="quiz-card max-w-2xl w-full rounded-3xl p-8 text-center shadow-2xl">
          {LOADING_QUIZ_TEXT}
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
        <div className="quiz-card max-w-2xl w-full rounded-3xl p-6 shadow-2xl">
          <ProgressBar
            current={Math.min(currentIndex + 1, quiz.length)}
            total={quiz.length}
            remainingText={remainingText}
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
