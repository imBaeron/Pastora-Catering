import { useState } from 'react'
import { EVENT_TYPES, catOf, MIN_GUESTS, rate } from '../../data/rates'
import { MENU, SLOTS } from '../../data/menu'
import { Y, TODAY } from '../../data/constants'
import { M } from '../../utils/format'
import { tot } from '../../utils/pricing'

export default function Booking({ user, date, bookings, setBookings, setLast, setDate, go }) {
  const [f, setF] = useState({ t: 'Birthday', v: '', h: '11:00', g: 50, out: false, r: '', y: Y[0], menu: {} })
  const set = (k, v) => setF({ ...f, [k]: v })
  const cat = catOf(f.t), min = MIN_GUESTS[cat], guests = +f.g || 0
  const perHead = rate(cat, guests), total = perHead * guests

  // Select dishes: 1-dish slots swap the choice, 2-dish slots allow up to n.
  const pick = (s, item) => {
    const cur = f.menu[s.k] || []
    const next = s.n === 1 ? [item] : cur.includes(item) ? cur.filter(x => x !== item) : cur.length < s.n ? [...cur, item] : cur
    set('menu', { ...f.menu, [s.k]: next })
  }
  const missing = SLOTS.filter(s => (f.menu[s.k] || []).length < s.n).length
  const valid = missing === 0 && guests >= min

  const submit = e => {
    e.preventDefault()
    if (!valid) return
    const b = { id: 'PCS-' + (1001 + bookings.length), c: user.name, t: f.t, d: date, g: guests, menu: f.menu, out: f.out, s: 'Pending', v: f.v, h: f.h, r: f.r, pay: [] }
    b.pay.push({ m: f.y, a: Math.round(tot(b) * 0.3), d: TODAY })
    setBookings([...bookings, b]); setLast(b); setDate(null); go('confirm')
  }

  return (
    <div className="wrap">
      <h2>Booking details</h2>
      <form className="two" onSubmit={submit}>
        <div className="card">
          <p>Event date: <b>{date}</b> <a href="#calendar">Change</a></p>
          <label>Event type<select value={f.t} onChange={e => set('t', e.target.value)}>{EVENT_TYPES.map(([n]) => <option key={n}>{n}</option>)}</select></label>
          <label>Number of guests<input type="number" min={min} value={f.g} onChange={e => set('g', e.target.value)} /></label>
          {guests < min && <p className="err">Weddings and special events need at least {min} guests.</p>}
          <label>Venue<input required placeholder="Venue address" value={f.v} onChange={e => set('v', e.target.value)} /></label>
          <label className="opt"><input type="checkbox" checked={f.out} onChange={e => set('out', e.target.checked)} />
            <span>The venue is outside Calbayog City proper (a transportation fee applies and will be quoted by Pastora’s)</span></label>
          <label>Start time<input type="time" value={f.h} onChange={e => set('h', e.target.value)} /></label>

          <h3 style={{ marginTop: 20 }}>Build your menu</h3>
          {SLOTS.map(s => {
            const cur = f.menu[s.k] || []
            return (
              <div key={s.k} style={{ marginTop: 12 }}>
                <label>{s.label} <span className="lg">(choose {s.n}, {cur.length} selected)</span></label>
                {s.from.map(c => (
                  <div key={c}>
                    {s.from.length > 1 && <p className="lg" style={{ margin: '6px 0 0' }}>{c}</p>}
                    <div className="chips">{MENU[c].map(i => {
                      const on = cur.includes(i), full = !on && s.n > 1 && cur.length >= s.n
                      return (
                        <label key={i} className={`chip-opt ${on ? 'on' : ''} ${full ? 'dis' : ''}`}>
                          <input type={s.n === 1 ? 'radio' : 'checkbox'} name={s.k} checked={on} disabled={full} onChange={() => pick(s, i)} />{i}
                        </label>
                      )
                    })}</div>
                  </div>
                ))}
              </div>
            )
          })}

          <label style={{ marginTop: 20 }}>Special requests<textarea rows="3" placeholder="Allergies, themes, or other notes" value={f.r} onChange={e => set('r', e.target.value)} /></label>
          <label>Down payment method<select value={f.y} onChange={e => set('y', e.target.value)}>{Y.map(x => <option key={x}>{x}</option>)}</select></label>
        </div>
        <div className="card" style={{ position: 'sticky', top: 80 }}>
          <h3>Summary</h3>
          <div className="row"><span>Rate per head</span><span>{M(perHead)}</span></div>
          <div className="row"><span>Guests</span><span>{guests}</span></div>
          <div className="row"><b>Estimated total</b><b>{M(total)}</b></div>
          <div className="row"><span>Down payment (30%)</span><b className="price">{M(total * 0.3)}</b></div>
          <p className="lg">Includes rice, softdrinks, water service, setup, and uniformed waiters.{f.out && ' Transportation fee not included.'}</p>
          <button className="btn" style={{ width: '100%' }} disabled={!valid}>Submit booking</button>
          {missing > 0 && <p className="lg">Choose {missing} more menu {missing > 1 ? 'categories' : 'category'} to continue.</p>}
        </div>
      </form>
    </div>
  )
}
