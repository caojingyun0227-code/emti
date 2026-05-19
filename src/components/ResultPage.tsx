import React from 'react'
import { Question } from '../data/questions'
import type { RuntimePersonality } from '../data/loadQuizData'
import { calculateResult, type EmotionScores } from '../data/scoring'
import type { Personality } from '../data/personalities'

interface Props {
  answers: number[]
  questions: Question[]
  personalities: Record<string, RuntimePersonality>
}

type ResultPersonality = Personality | RuntimePersonality
type EmotionKey = keyof EmotionScores

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

const RESULT_TITLE = '\u4f60\u662f\uff1a'
const INTERPRETATION_TITLE = '\u4eba\u683c\u89e3\u8bfb'
const EMOTION_TITLE = '\u4f60\u7684\u60c5\u7eea\u6784\u6210'
const STATUS_TITLE = '\u6700\u8fd1\u72b6\u6001'
const SAVE_IMAGE_TEXT = '\u4fdd\u5b58\u7ed3\u679c\u56fe\u7247'
const SAVE_IMAGE_ARIA = '\u5c06\u7ed3\u679c\u9875\u4fdd\u5b58\u4e3a\u56fe\u7247'

const emotionMeta: Array<{ key: EmotionKey; label: string; icon: string; color: string }> = [
  { key: 'joy', label: '\u6109\u60a6', icon: '\u2600\ufe0f', color: '#f3b33d' },
  { key: 'anger', label: '\u6124\u6012', icon: '\ud83d\udd25', color: '#e65f4f' },
  { key: 'sadness', label: '\u60b2\u4f24', icon: '\ud83c\udf27', color: '#5d90c9' },
  { key: 'emptiness', label: '\u7a7a\u865a', icon: '\ud83d\udc7b', color: '#9175d8' },
  { key: 'melancholy', label: '\u5fe7\u90c1', icon: '\ud83c\udf19', color: '#667085' },
]

function hasReportFields(personality: ResultPersonality): personality is Personality {
  return 'hiddenTrait' in personality
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.lineTo(x + width - radius, y)
  context.quadraticCurveTo(x + width, y, x + width, y + radius)
  context.lineTo(x + width, y + height - radius)
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  context.lineTo(x + radius, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - radius)
  context.lineTo(x, y + radius)
  context.quadraticCurveTo(x, y, x + radius, y)
  context.closePath()
}

function getWrappedLines(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines = Number.POSITIVE_INFINITY
) {
  const lines: string[] = []

  text.split('\n').forEach(paragraph => {
    const chars = Array.from(paragraph)
    let line = ''

    chars.forEach(char => {
      const nextLine = `${line}${char}`

      if (context.measureText(nextLine).width > maxWidth && line) {
        lines.push(line)
        line = char
      } else {
        line = nextLine
      }
    })

    if (line) {
      lines.push(line)
    }
  })

  return lines.slice(0, maxLines)
}

function drawTextLines(
  context: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number
) {
  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight)
  })
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function getEmotionRows(emotionScores: EmotionScores) {
  const total = Math.max(
    1,
    Object.values(emotionScores).reduce((sum, value) => sum + value, 0)
  )

  return emotionMeta.map(item => ({
    ...item,
    value: emotionScores[item.key],
    percent: Math.round((emotionScores[item.key] / total) * 100),
  }))
}

function getStatusLines(rows: ReturnType<typeof getEmotionRows>) {
  const dominant = [...rows].sort((a, b) => b.percent - a.percent)[0]
  const statusByEmotion: Record<EmotionKey, string> = {
    joy: '\u8fd8\u80fd\u7b11\uff0c\u6682\u65f6\u6ca1\u6709\u5b8c\u5168\u4e0b\u7ebf',
    anger: '\u706b\u6c14\u6709\u70b9\u5360\u5185\u5b58',
    sadness: '\u95f4\u6b47\u6389\u7535\uff0c\u4f46\u8fd8\u5728\u8fd0\u884c',
    emptiness: '\u4eba\u5728\u7ebf\uff0c\u7075\u9b42\u6b63\u5728\u6f2b\u6e38',
    melancholy: '\u80cc\u666f\u7a0b\u5e8f\u6709\u70b9\u591a',
  }

  return [
    ['\u7cfb\u7edf\u72b6\u6001', '\u221a \u4ecd\u5728\u8fd0\u884c'],
    ['\u4e3b\u8981\u540e\u53f0', statusByEmotion[dominant.key]],
    ['\u60c5\u7eea\u7f13\u5b58', dominant.percent >= 35 ? '\u504f\u9ad8' : '\u6b63\u5e38\u6ce2\u52a8'],
    ['\u9884\u8ba1\u6062\u590d', dominant.key === 'joy' ? '\u8f83\u5feb' : '\u968f\u673a'],
  ]
}

function getPunchline(personality: ResultPersonality) {
  if (hasReportFields(personality)) {
    return personality.hiddenTrait
  }

  return personality.core
}

export default function ResultPage({ answers, questions, personalities }: Props) {
  const result = calculateResult(
    answers.map((optionIndex, index) => ({
      questionId: questions[index]?.id ?? 0,
      optionIndex,
    }))
  )
  const localPersonality = result.personality
  const runtimePersonality = localPersonality
    ? personalities[String(localPersonality.id)]
    : undefined
  const personality = (runtimePersonality ?? localPersonality) as ResultPersonality | undefined
  const emotionRows = getEmotionRows(result.emotionScores)
  const statusLines = getStatusLines(emotionRows)
  const imageName = personality ? imageByPersonalityId[personality.id] : undefined
  const imageSrc = imageName
    ? `${import.meta.env.BASE_URL}personality-images/${imageName}`
    : undefined

  const handleSaveImage = async () => {
    if (!personality) {
      return
    }

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    canvas.width = 1200
    canvas.height = 1500

    context.fillStyle = '#fff0f5'
    context.fillRect(0, 0, canvas.width, canvas.height)

    drawRoundedRect(context, 72, 56, 1056, 1368, 48)
    context.fillStyle = '#e2f6db'
    context.fill()
    context.strokeStyle = '#90c997'
    context.lineWidth = 3
    context.stroke()

    context.fillStyle = '#183326'
    context.font = '700 52px "Microsoft YaHei", "PingFang SC", sans-serif'
    context.fillText(RESULT_TITLE, 130, 150)

    context.font = '700 50px "Microsoft YaHei", "PingFang SC", sans-serif'
    const nameLines = getWrappedLines(context, personality.name, imageSrc ? 610 : 900, 4)
    drawTextLines(context, nameLines, 130, 230, 62)

    if (imageSrc) {
      try {
        const image = await loadImage(imageSrc)
        drawRoundedRect(context, 795, 150, 250, 250, 36)
        context.save()
        context.clip()
        context.drawImage(image, 795, 150, 250, 250)
        context.restore()
      } catch {
        // Keep the generated report available even if the image asset cannot load.
      }
    }

    context.font = '500 30px "Microsoft YaHei", "PingFang SC", sans-serif'
    const punchlineY = 250 + nameLines.length * 62
    drawTextLines(context, getWrappedLines(context, getPunchline(personality), 900, 3), 130, punchlineY, 42)

    context.font = '700 34px "Microsoft YaHei", "PingFang SC", sans-serif'
    context.fillText(INTERPRETATION_TITLE, 130, 505)

    context.font = '400 28px "Microsoft YaHei", "PingFang SC", sans-serif'
    const descriptionLines = getWrappedLines(context, personality.description, 940, 10)
    drawTextLines(context, descriptionLines, 130, 560, 42)

    context.font = '700 34px "Microsoft YaHei", "PingFang SC", sans-serif'
    context.fillText(EMOTION_TITLE, 130, 1010)

    emotionRows.forEach((row, index) => {
      const y = 1065 + index * 54
      context.font = '500 26px "Microsoft YaHei", "PingFang SC", sans-serif'
      context.fillStyle = '#183326'
      context.fillText(`${row.label} ${row.icon}`, 130, y)
      context.fillText(`${row.percent}%`, 960, y)

      drawRoundedRect(context, 300, y - 24, 610, 20, 10)
      context.fillStyle = 'rgba(24, 51, 38, 0.14)'
      context.fill()

      drawRoundedRect(context, 300, y - 24, Math.max(10, 610 * (row.percent / 100)), 20, 10)
      context.fillStyle = row.color
      context.fill()
    })

    context.font = '700 34px "Microsoft YaHei", "PingFang SC", sans-serif'
    context.fillStyle = '#183326'
    context.fillText(STATUS_TITLE, 130, 1360 - 160)

    context.font = '400 26px "Microsoft YaHei", "PingFang SC", sans-serif'
    statusLines.forEach(([label, value], index) => {
      context.fillText(`${label}: ${value}`, 130, 1245 + index * 40)
    })

    const link = document.createElement('a')
    link.download = `emti-${personality.name}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  if (!personality) {
    return (
      <div className="quiz-card result-card max-w-5xl w-full rounded-3xl p-8 shadow-2xl">
        \u7ed3\u679c\u751f\u6210\u5931\u8d25
      </div>
    )
  }

  return (
    <div className="quiz-card result-card max-w-5xl w-full rounded-3xl p-8 shadow-2xl">
      <div className="result-content">
        <div className="result-text">
          <p className="text-lg font-semibold text-emerald-950/70">{RESULT_TITLE}</p>
          <h1 className="mb-4 text-4xl font-black leading-tight sm:text-5xl">
            {personality.name}
          </h1>
          <p className="mb-6 text-xl font-semibold leading-relaxed">
            {getPunchline(personality)}
          </p>
        </div>

        {imageSrc && (
          <img
            className="result-personality-image"
            src={imageSrc}
            alt={`${personality.name} personality`}
          />
        )}
      </div>

      <section className="result-section">
        <h2>{INTERPRETATION_TITLE}</h2>
        <p>{personality.description}</p>
      </section>

      <section className="result-section">
        <h2>{EMOTION_TITLE}</h2>
        <div className="emotion-list">
          {emotionRows.map(row => (
            <div className="emotion-row" key={row.key}>
              <div className="emotion-label">
                <span>{row.label}</span>
                <span>{row.icon}</span>
              </div>
              <div className="emotion-track" aria-hidden="true">
                <div
                  className="emotion-fill"
                  style={{ width: `${Math.max(4, row.percent)}%`, backgroundColor: row.color }}
                />
              </div>
              <span className="emotion-percent">{row.percent}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="result-section">
        <h2>{STATUS_TITLE}</h2>
        <div className="status-panel">
          {statusLines.map(([label, value]) => (
            <div className="status-line" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      {hasReportFields(personality) && (
        <section className="result-section result-details">
          <div>
            <span>\u4f18\u52bf</span>
            <p>{personality.strength}</p>
          </div>
          <div>
            <span>\u77ed\u677f</span>
            <p>{personality.weakness}</p>
          </div>
          <div>
            <span>\u751f\u5b58\u65b9\u5f0f</span>
            <p>{personality.survivalStyle}</p>
          </div>
        </section>
      )}

      <div className="result-actions">
        <button
          className="result-save-button"
          type="button"
          aria-label={SAVE_IMAGE_ARIA}
          onClick={handleSaveImage}
        >
          {SAVE_IMAGE_TEXT}
        </button>
      </div>
    </div>
  )
}
