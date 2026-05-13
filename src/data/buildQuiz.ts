import type { Question } from './questions'

const LONG_IDS = [35, 56, 75]

const AGREE_IDS = [24, 34, 61, 68, 73, 78, 80]

const BINARY_IDS = [16, 25, 49]

const TANG_IDS = [19, 31, 40, 46, 53, 60]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function pickFrom(
  pool: Question[],
  ids: number[],
  count: number
): Question[] {
  return shuffle(
    pool.filter((q) => ids.includes(q.id))
  ).slice(0, count)
}

function pickExclude(
  pool: Question[],
  excludeIds: number[],
  count: number
): Question[] {
  return shuffle(
    pool.filter((q) => !excludeIds.includes(q.id))
  ).slice(0, count)
}

export function buildQuiz(
  pool: Question[]
): Question[] {
  /**
   * EMTI 出题结构
   *
   * 25 生活切片
   * 6 唐题
   * 6 认同题
   * 2 二选一
   * 1 超长题（3选1）
   *
   * 共 40 题
   */

  // 超长题随机一题
  const longQuestions = pool.filter((q) =>
    LONG_IDS.includes(q.id)
  )

  const selectedLong =
    shuffle(longQuestions)[0]

  // 分类抽题
  const agree = pickFrom(
    pool,
    AGREE_IDS,
    6
  )

  const binary = pickFrom(
    pool,
    BINARY_IDS,
    2
  )

  const tang = pickFrom(
    pool,
    TANG_IDS,
    6
  )

  // 去重
  const usedIds = new Set<number>([
    selectedLong.id,
    ...agree.map((q) => q.id),
    ...binary.map((q) => q.id),
    ...tang.map((q) => q.id),
  ])

  // 生活切片题
  const life = pickExclude(
    pool,
    [
      ...usedIds,
      ...LONG_IDS,
      ...AGREE_IDS,
      ...BINARY_IDS,
      ...TANG_IDS,
    ],
    25
  )

  // 打乱桶
  const buckets = {
    life: shuffle(life),
    tang: shuffle(tang),
    agree: shuffle(agree),
    binary: shuffle(binary),
  }

  const quiz: Question[] = []

  /**
   * 前15题
   * 进入状态
   */
  for (let i = 0; i < 15; i++) {
    if (
      (i === 4 || i === 10) &&
      buckets.tang.length
    ) {
      quiz.push(
        buckets.tang.pop()!
      )
    } else if (
      (i === 7 || i === 13) &&
      buckets.agree.length
    ) {
      quiz.push(
        buckets.agree.pop()!
      )
    } else {
      quiz.push(
        buckets.life.pop()!
      )
    }
  }

  /**
   * 中段 16–24
   * 超长题Boss区
   */
  const bossSlot =
    15 + Math.floor(Math.random() * 9)

  for (let i = 15; i < 24; i++) {
    if (i === bossSlot) {
      quiz.push(selectedLong)
    } else if (
      (i === 17 || i === 22) &&
      buckets.tang.length
    ) {
      quiz.push(
        buckets.tang.pop()!
      )
    } else if (
      i === 20 &&
      buckets.binary.length
    ) {
      quiz.push(
        buckets.binary.pop()!
      )
    } else {
      quiz.push(
        buckets.life.pop()!
      )
    }
  }

  /**
   * 后段 25–36
   * 校准人格
   */
  for (let i = 24; i < 36; i++) {
    if (
      (i === 26 || i === 31) &&
      buckets.agree.length
    ) {
      quiz.push(
        buckets.agree.pop()!
      )
    } else if (
      i === 29 &&
      buckets.binary.length
    ) {
      quiz.push(
        buckets.binary.pop()!
      )
    } else if (
      (i === 33 || i === 35) &&
      buckets.tang.length
    ) {
      quiz.push(
        buckets.tang.pop()!
      )
    } else {
      quiz.push(
        buckets.life.pop()!
      )
    }
  }

  /**
   * 最后4题
   * 收尾偏轻
   */
  while (quiz.length < 40) {
    if (buckets.life.length) {
      quiz.push(
        buckets.life.pop()!
      )
    } else if (
      buckets.tang.length
    ) {
      quiz.push(
        buckets.tang.pop()!
      )
    } else if (
      buckets.agree.length
    ) {
      quiz.push(
        buckets.agree.pop()!
      )
    } else if (
      buckets.binary.length
    ) {
      quiz.push(
        buckets.binary.pop()!
      )
    } else {
      break
    }
  }

  // 安全保险
  return quiz
    .filter(Boolean)
    .slice(0, 40)
}
