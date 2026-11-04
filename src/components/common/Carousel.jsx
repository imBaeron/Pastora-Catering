import { useState, useEffect } from 'react'
import { SLIDES } from '../../data/menu'
import { ph } from '../../utils/placeholders'

export default function Carousel() {
  const [i, setI] = useState(0)
  const n = SLIDES.length
  useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % n), 5000)
    return () => clearInterval(t)
  }, [n])
  return (
    <div className="car">
      <div className="trk" style={{ transform: `translateX(-${i * 100}%)` }}>
        {SLIDES.map(([name, c]) => (
          <div className="slide" key={name}>
            <img src={ph(name + ' photo', c)} alt={name} />
            <div className="cap"><b>{name}</b><br />Placeholder photo</div>
          </div>
        ))}
      </div>
      <button className="ar l" onClick={() => setI((i - 1 + n) % n)} aria-label="Previous">‹</button>
      <button className="ar r" onClick={() => setI((i + 1) % n)} aria-label="Next">›</button>
      <div className="dots">{SLIDES.map((_, k) => <i key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}</div>
    </div>
  )
}
