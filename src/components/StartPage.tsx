import React from 'react'

interface Props {
  onStart: () => void
}

export default function StartPage({ onStart }: Props) {
  return (
    <section className="landing-cover" aria-label="EMTI 情绪人格测试首页">
      <img
        className="landing-cover-image"
        src={`${import.meta.env.BASE_URL}emti-cover.png`}
        alt="EMTI 情绪人格测试"
      />
      <button
        className="landing-start-hotspot"
        type="button"
        onClick={onStart}
        aria-label="立即开始"
      />
    </section>
  )
}
