import { useState } from 'react'
import { P } from '../../data/packages'
import { A } from '../../data/addOns'
import { T, Y, TODAY } from '../../data/constants'
import { M } from '../../utils/format'
import { tot } from '../../utils/pricing'

export default function Booking({ user, date, pk, bookings, setBookings, setLast, setDate, go }) {
  const [f, setF] = useState({ t: T[0], v: '', h: '11:00', g: 50, p: pk, a: [], r: '', y: Y[0] })
  const set = (k, v) => setF({ ...f, [k]: v })
  const toggle = i => set('a', f.a.includes(i) ? f.a.filter(x => x !== i) : [...f.a, i])
  const guests = +f.g || 0
  const total = tot({ pkg: f.p, g: guests, add: f.a }), base = P[f.p].p * guests

  const submit = e => {
    e.preventDefault()
    const b = { id: 'PCS-' + (1001 + bookings.length), c: user.name, t: f.t, d: date, g: guests, pkg: f.p, add: f.a, s: 'Pending', v: f.v, r: f.r, pay: [] }
    b.pay.push({ m: f.y, a: Math.round(tot(b) * 0.3), d: TODAY })
    setBookings([...bookings, b]); setLast(b); setDate(null); go('confirm')
  }

  return (
    <div className="wrap">
      <h2>Booking details</h2>
      <form className="two" onSubmit={submit}>
        <div className="card">
          <p>Event date: <b>{date}</b> <a href="#calendar">Change</a></p>
          <label>Event type<select value={f.t} onChange={e => set('t', e.target.value)}>{T.map(x => <option key={x}>{x}</option>)}</select></label>
          <label>Venue<input required placeholder="Venue address" value={f.v} onChange={e => set('v', e.target.value)} /></label>
          <label>Start time<input type="time" value={f.h} onChange={e => set('h', e.target.value)} /></label>
          <label>Estimated guests<input type="number" min="20" value={f.g} onChange={e => set('g', e.target.value)} /></label>
          <label>Catering package</label>
          {P.map((p, i) => (
            <label className="opt" key={p.n}>
              <input type="radio" name="p" checked={f.p === i} onChange={() => set('p', i)} />
              <span><b>{p.n}</b> {M(p.p)} per guest<br />{p.d}</span>
            </label>
          ))}
          <label>Optional add-ons</label>
          {A.map((a, i) => (
            <label className="opt" key={a.n}>
              <input type="checkbox" checked={f.a.includes(i)} onChange={() => toggle(i)} />
              <span>{a.n} ({M(a.p)})</span>
            </label>
          ))}
          <label>Special requests<textarea rows="3" placeholder="Allergies, themes, or other notes" value={f.r} onChange={e => set('r', e.target.value)} /></label>
          <label>Down payment method<select value={f.y} onChange={e => set('y', e.target.value)}>{Y.map(x => <option key={x}>{x}</option>)}</select></label>
        </div>
        <div className="card" style={{ position: 'sticky', top: 80 }}>
          <h3>Summary</h3>
          <div className="row"><span>{P[f.p].n} × {guests}</span><span>{M(base)}</span></div>
          <div className="row"><span>Add-ons</span><span>{M(total - base)}</span></div>
          <div className="row"><b>Estimated total</b><b>{M(total)}</b></div>
          <div className="row"><span>Down payment (30%)</span><b className="price">{M(total * 0.3)}</b></div>
          <button className="btn" style={{ width: '100%', marginTop: 12 }}>Submit booking</button>
        </div>
      </form>
    </div>
  )
}
