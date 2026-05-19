import { PERSONALITIES } from './personalities'

export interface Answer {
  questionId: number
  optionIndex: number
}

export interface Scores {
  H: number
  A: number
  C: number
  G: number
  E: number
}

export interface EmotionScores {
  joy: number
  anger: number
  sadness: number
  emptiness: number
  melancholy: number
}

function addScore(
  scores: Scores,
  key: keyof Scores,
  value: number
) {
  scores[key] += value
}

export function calculateResult(
  answers: Answer[]
) {
  const scores: Scores = {
    H: 0,
    A: 0,
    C: 0,
    G: 0,
    E: 0,
  }

  answers.forEach(answer => {
    const { questionId, optionIndex } = answer

    switch (questionId) {
      case 101:
        addScore(scores, 'H', 6 - optionIndex)
        break

      case 102:
        addScore(scores, 'A', optionIndex + 2)
        break

      case 103:
        addScore(scores, 'C', optionIndex + 1)
        break

      case 104:
        addScore(scores, 'G', optionIndex + 1)
        break

      case 105:
        addScore(scores, 'E', optionIndex + 2)
        break

      case 106:
        addScore(scores, 'H', 2)
        addScore(scores, 'C', optionIndex + 1)
        break

      case 107:
        addScore(scores, 'H', 5 - optionIndex)
        addScore(scores, 'C', 2)
        break

      case 108:
        addScore(scores, 'H', 3)
        addScore(scores, 'G', 5 - optionIndex)
        break

      case 109:
        addScore(scores, 'H', 2)
        addScore(scores, 'E', optionIndex + 1)
        break

      case 110:
        addScore(scores, 'A', optionIndex + 2)
        addScore(scores, 'C', optionIndex + 1)
        break

      case 111:
        addScore(scores, 'A', 2)
        addScore(scores, 'G', optionIndex + 1)
        break

      case 112:
        addScore(scores, 'A', 2)
        addScore(scores, 'E', optionIndex + 1)
        break

      case 113:
        addScore(scores, 'C', optionIndex + 1)
        addScore(scores, 'G', optionIndex + 1)
        break

      case 114:
        addScore(scores, 'C', optionIndex + 1)
        addScore(scores, 'E', optionIndex + 2)
        break

      case 115:
        addScore(scores, 'G', optionIndex + 2)
        addScore(scores, 'E', optionIndex + 2)
        break

      case 116:
        addScore(scores, 'H', 2)
        addScore(scores, 'A', 2)
        addScore(scores, 'C', 2)
        addScore(scores, 'G', 2)
        addScore(scores, 'E', optionIndex + 2)
        break

      case 301:
        scores.A += optionIndex + 1
        scores.C += optionIndex
        break

      case 302:
        scores.H += 5 - optionIndex
        scores.C += 2
        break

      case 303:
        scores.H += 2
        scores.G += 5 - optionIndex
        break

      case 304:
        scores.C += optionIndex
        scores.G += optionIndex
        break

      case 305:
        scores.C += optionIndex
        scores.E += optionIndex
        break

      case 306:
        scores.G += optionIndex + 1
        scores.E += optionIndex + 2
        break

      case 307:
        scores.A += optionIndex
        scores.G += optionIndex
        break

      case 308:
        scores.H += 2
        scores.A += 2
        scores.C += 2
        scores.G += 2
        scores.E += optionIndex
        break

      case 309:
        scores.H += 2
        scores.C += optionIndex
        break
    }
  })

  const personalityScores = [
    {
      id: 1,
      score: scores.H * 1.2,
    },
    {
      id: 2,
      score: scores.A * 1.2,
    },
    {
      id: 3,
      score: scores.C * 1.2,
    },
    {
      id: 4,
      score: scores.G * 1.2,
    },
    {
      id: 5,
      score: scores.E * 1.2,
    },
    { id: 6, score: scores.H + scores.C },
    { id: 7, score: scores.H * 1.3 + scores.C },
    { id: 8, score: scores.H + scores.G },
    { id: 9, score: scores.H + scores.E },
    { id: 10, score: scores.A + scores.C },
    { id: 11, score: scores.A + scores.G },
    { id: 12, score: scores.A + scores.E },
    { id: 13, score: scores.C + scores.G },
    { id: 14, score: scores.C + scores.E },
    { id: 15, score: scores.G * 1.3 + scores.E * 1.4 },
    {
      id: 16,
      score:
        (scores.H +
          scores.A +
          scores.C +
          scores.G +
          scores.E) /
        2,
    },
  ]

  const sorted = personalityScores.sort(
    (a, b) => b.score - a.score
  )

  const getPersonality = (id: number) =>
    PERSONALITIES.find(personality => personality.id === id)

  const emotionScores: EmotionScores = {
    joy: scores.H,
    anger: scores.A,
    sadness: scores.C,
    emptiness: scores.E,
    melancholy: scores.G,
  }

  return {
    personality: getPersonality(sorted[0].id),
    emotionScores,
  }
}
