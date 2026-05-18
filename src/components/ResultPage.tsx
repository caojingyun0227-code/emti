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

const RESULT_TITLE = '\u4f60\u7684\u4e3b\u5bfc\u4eba\u683c'
const SAVE_IMAGE_TEXT = '\u4fdd\u5b58\u7ed3\u679c\u56fe\u7247'
const SAVE_IMAGE_ARIA = '\u5c06\u7ed3\u679c\u9875\u4fdd\u5b58\u4e3a\u56fe\u7247'

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
  const chars = Array.from(text)
  const lines: string[] = []
  let line = ''

  for (const char of chars) {
    const nextLine = `${line}${char}`
    if (context.measureText(nextLine).width > maxWidth && line) {
      lines.push(line)
      line = char

      if (lines.length >= maxLines) {
        return lines
      }
    } else {
      line = nextLine
    }
  }

  if (line && lines.length < maxLines) {
    lines.push(line)
  }

  return lines
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

export default function ResultPage({ answers, questions, personalities }: Props) {
  const scores = answers.reduce(
    (score, optionIndex, index) =>
      addScore(score, questions[index]?.id ?? 0, optionIndex),
    createInitialScore()
  )
  const sorted = getSortedResultScore(scores)
  const top = personalities[String(resultByTopScore[sorted[0][0]])]
  const imageName = top ? imageByPersonalityId[top.id] : undefined
  const imageSrc = imageName
    ? `${import.meta.env.BASE_URL}personality-images/${imageName}`
    : undefined

  const handleSaveImage = async () => {
    if (!top) {
      return
    }

    const measuringCanvas = document.createElement('canvas')
    const measuringContext = measuringCanvas.getContext('2d')

    if (!measuringContext) {
      return
    }

    measuringContext.font = '500 32px "Microsoft YaHei", "PingFang SC", sans-serif'
    const coreLines = getWrappedLines(measuringContext, top.core, 570, 4)
    const afterCoreY = 350 + coreLines.length * 48
    const descriptionStartY = Math.max(afterCoreY + 36, imageSrc ? 515 : 420)

    measuringContext.font = '400 30px "Microsoft YaHei", "PingFang SC", sans-serif'
    const descriptionLines = getWrappedLines(measuringContext, top.description, 940, 16)
    const contentBottomY = descriptionStartY + descriptionLines.length * 46
    const cardBottomY = Math.max(contentBottomY + 84, imageSrc ? 555 : 0)
    const canvasBottomY = cardBottomY + 64

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    canvas.width = 1200
    canvas.height = canvasBottomY

    context.fillStyle = '#fff0f5'
    context.fillRect(0, 0, canvas.width, canvas.height)

    drawRoundedRect(context, 72, 56, 1056, cardBottomY - 56, 48)
    context.fillStyle = '#e2f6db'
    context.fill()
    context.strokeStyle = '#90c997'
    context.lineWidth = 3
    context.stroke()

    context.fillStyle = '#183326'
    context.font = '700 58px "Microsoft YaHei", "PingFang SC", sans-serif'
    context.fillText(RESULT_TITLE, 130, 170)

    context.font = '700 48px "Microsoft YaHei", "PingFang SC", sans-serif'
    context.fillText(top.name, 130, 260)

    if (imageSrc) {
      try {
        const image = await loadImage(imageSrc)
        drawRoundedRect(context, 780, 170, 280, 280, 36)
        context.save()
        context.clip()
        context.drawImage(image, 780, 170, 280, 280)
        context.restore()
      } catch {
        // Keep the generated text card available even if the image cannot load.
      }
    }

    context.font = '500 32px "Microsoft YaHei", "PingFang SC", sans-serif'
    drawTextLines(context, coreLines, 130, 330, 48)

    context.font = '400 30px "Microsoft YaHei", "PingFang SC", sans-serif'
    drawTextLines(context, descriptionLines, 130, descriptionStartY, 46)

    const link = document.createElement('a')
    link.download = `emti-${top.name}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="quiz-card result-card max-w-5xl w-full rounded-3xl p-8 shadow-2xl">
      <div className="result-content">
        <div className="result-text">
          <h1 className="text-3xl font-bold mb-4">{RESULT_TITLE}</h1>
          {top && (
            <>
              <h2 className="text-2xl font-semibold mb-2">{top.name}</h2>
              <p className="mb-4">{top.core}</p>
              <p>{top.description}</p>
            </>
          )}
        </div>

        {top && imageSrc && (
          <img
            className="result-personality-image"
            src={imageSrc}
            alt={`${top.name} personality`}
          />
        )}
      </div>

      {top && (
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
      )}
    </div>
  )
}
