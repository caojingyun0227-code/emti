import React from 'react'

interface Props {
  onStart: () => void
}

export default function StartPage({ onStart }: Props) {
  return (
    <section className="landing-cover" aria-label="EMTI home page">
      <img
        className="landing-cover-image"
        src={`${import.meta.env.BASE_URL}emti-cover.png`}
        alt="EMTI emotion personality test"
      />
      <button
        className="landing-start-hotspot"
        type="button"
        onClick={onStart}
        aria-label="Start quiz"
      >
        <span>立即开始</span>
      </button>
    </section>
  )
}
