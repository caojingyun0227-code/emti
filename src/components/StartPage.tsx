import React from 'react'

interface Props {
  onStart: () => void
}

const moods = [
  { className: 'mood mood-ball mood-pink mood-top-left', face: '⌒‿⌒' },
  { className: 'mood mood-burst mood-red mood-top-red', face: '｀へ´' },
  { className: 'mood mood-blob mood-blue mood-top-blue', face: 'ಠ︵ಠ' },
  { className: 'mood mood-sun mood-yellow mood-top-sun', face: '˘◡˘' },
  { className: 'mood mood-ghost mood-white mood-top-ghost', face: 'o' },
  { className: 'mood mood-cloud mood-rose mood-top-cloud', face: '˘ ˘' },
  { className: 'mood mood-drop mood-purple mood-left-purple', face: '¬_¬' },
  { className: 'mood mood-blob mood-yellow mood-left-yellow', face: '´︵`' },
  { className: 'mood mood-ball mood-gray mood-left-gray', face: '>︵<' },
  { className: 'mood mood-ball mood-pink mood-bottom-run', face: '｀‿´' },
  { className: 'mood mood-caterpillar mood-green mood-bottom-green', face: '• •' },
  { className: 'mood mood-blob mood-red mood-bottom-red', face: 'ಠ_ಠ' },
  { className: 'mood mood-drop mood-purple mood-bottom-purple', face: '˘︵˘' },
  { className: 'mood mood-star mood-yellow mood-bottom-star', face: 'ಠ' },
  { className: 'mood mood-cloud mood-blue mood-bottom-blue', face: '｀´' },
  { className: 'mood mood-cloud mood-pink mood-bottom-pink', face: '•︵•' },
  { className: 'mood mood-blob mood-green mood-right-green', face: '•︵•' },
  { className: 'mood mood-ghost mood-lavender mood-right-office', face: 'T︵T' },
]

const sparkles = Array.from({ length: 30 }, (_, index) => ({
  className: `sparkle sparkle-${index + 1}`,
}))

export default function StartPage({ onStart }: Props) {
  return (
    <section className="landing-page" aria-label="EMTI 情绪人格测试首页">
      <div className="landing-art" aria-hidden="true">
        {sparkles.map((sparkle) => (
          <span key={sparkle.className} className={sparkle.className} />
        ))}
        {moods.map((mood) => (
          <span key={mood.className} className={mood.className}>
            <span className="mood-face">{mood.face}</span>
          </span>
        ))}
        <span className="question-mark question-mark-left">?</span>
        <span className="question-mark question-mark-right">?</span>
        <span className="dots dots-left">...</span>
        <span className="scribble scribble-center" />
        <span className="briefcase" />
      </div>

      <div className="landing-copy">
        <h1>EMTI 情绪人格测试</h1>
        <button className="start-text-button" type="button" onClick={onStart}>
          立即开始
        </button>
      </div>
    </section>
  )
}
