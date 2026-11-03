import { useState } from 'react'
import { BLK, TODAY } from '../../data/constants'

export default function Calendar({ date, setDate, go, bookings }) {
  const [[y, m], setCm] = useState([2026, 10])
  const first = new Date(y, m, 1).getDay(), n = new Date(y, m + 1, 0).getDate()
  const off = new Set([...BLK, ...bookings.filter(b => b.s === 'Confirmed').map(b => b.d)])
  const mv = d => { const t = new Date(y, m + d); setCm([t.getFullYear(), t.getMonth()]) }
  const days = []
  for (let i = 1; i <= n; i++) {
    const k = `${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const x = k < TODAY || off.has(k)
    days.push(<button key={k} className={`d ${x ? 'x' : ''} ${k === date ? 's' : ''}`} disabled={x} onClick={() => setDate(k)}>{i}</button>)
  }
  return (
    <div className="wrap" style={{ maxWidth: 560 }}>
      <h2>Choose your event date</h2>
      <div className="card">
        <div className="row">
          <button className="btn alt sm" onClick={() => mv(-1)} aria-label="Previous month">‹</button>
          <h3 style={{ margin: 0 }}>{new Date(y, m).toLocaleString('en', { month: 'long', year: 'numeric' })}</h3>
          <button className="btn alt sm" onClick={() => mv(1)} aria-label="Next month">›</button>
        </div>
        <div className="cal">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div className="h" key={d}>{d}</div>)}
          {Array.from({ length: first }, (_, i) => <i key={'b' + i} />)}
          {days}
        </div>
        <p className="lg">Crossed-out dates are unavailable.</p>
        <div className="row">
          <span>{date ? <>Selected: <b>{date}</b></> : 'Select an available date'}</span>
          <button className="btn" disabled={!date} onClick={() => go('book')}>Continue</button>
        </div>
      </div>
    </div>
  )
}
