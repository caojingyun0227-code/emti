import { QUESTION_POOL } from './questions'

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

export function buildQuiz() {
  const anchors = QUESTION_POOL.filter(
    q => q.id >= 101 && q.id <= 116
  )

  const life = QUESTION_POOL.filter(
    q => q.id >= 1 && q.id <= 25
  )

  const meme = QUESTION_POOL.filter(
    q => q.id >= 201 && q.id <= 212
  )

  const enhance = QUESTION_POOL.filter(
    q => q.id >= 301 && q.id <= 309
  )

  const long = QUESTION_POOL.filter(q =>
    [35, 56, 75].includes(q.id)
  )

  const selected = [
    ...shuffle(anchors).slice(0, 12),
    ...shuffle(life).slice(0, 8),
    ...shuffle(meme).slice(0, 4),
    ...shuffle(enhance).slice(0, 5),
    ...shuffle(long).slice(0, 1),
  ]

  return shuffle(selected)
}
