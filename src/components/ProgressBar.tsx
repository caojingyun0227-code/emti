import React from 'react'

interface Props {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: Props) {
  return (
    <div className="w-full bg-zinc-700 h-4 rounded-full overflow-hidden my-3">
      <div
        className="bg-green-500 h-4"
        style={{ width: `${(current/total)*100}%` }}
      ></div>
    </div>
  )
}