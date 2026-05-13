import React from 'react'

interface Props {
  onStart: () => void
}

export default function StartPage({ onStart }: Props) {
  return (
    <div className="max-w-2xl w-full bg-zinc-900 rounded-3xl p-8 text-center shadow-2xl">
      <h1 className="text-4xl font-bold mb-6">EMTI 测试</h1>
      <p className="mb-6 text-zinc-400">测试你的 16 种人格倾向</p>
      <button
        className="px-6 py-3 rounded-2xl bg-zinc-700 hover:bg-zinc-600 transition"
        onClick={onStart}
      >
        开始测试
      </button>
    </div>
  )
}