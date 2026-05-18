import React from 'react'

interface Props {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: Props) {
  const safeTotal = Math.max(total, 1)
  const progress = Math.min(100, Math.max(0, (current / safeTotal) * 100))
  const questionLabel = `\u7b2c ${current} / ${total} \u9898`
  const progressLabel = `\u7b54\u9898\u8fdb\u5ea6\uff1a\u7b2c ${current} \u9898\uff0c\u5171 ${total} \u9898`

  return (
    <div className="mb-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-emerald-950/75">
        <span>{questionLabel}</span>
      </div>
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-white/45"
        aria-label={progressLabel}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={current}
      >
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
