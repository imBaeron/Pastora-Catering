import { useState } from 'react'
import { EVENT_TYPES, catOf, MIN_GUESTS, rate } from '../../data/rates'
import { MENU, SLOTS, SLOT_ICON, CAT_ICON } from '../../data/menu'
import { ADDON_DISHES, ADDON_SERVICES } from '../../data/addOns'
import { Y, TODAY } from '../../data/constants'
import { M } from '../../utils/format'
import { tot, addonTotal } from '../../utils/pricing'
import StepTabs from '../../components/booking/StepTabs'
import DishPicker from '../../components/booking/DishPicker'
import Summary from '../../components/booking/Summary'

export default function Booking({ user, date, bookings, setBookings, setLast, setDate, go }) {
  const [f, setF] = useState({ t: 'Birthday', v: '', h: '11:00', g: 50, out: false, r: '', y: Y[0], menu: {}, ad: { dishes: {}, services: {} } })
  const [step, setStep] = useState(1)
  const [slotKey, setSlotKey] = useState(SLOTS[0].k)
  const [addCat, setAddCat] = useState(ADDON_DISHES[0].k)
  const set = (k, v) => setF({ ...f, [k]: v })

  const cat = catOf(f.t), min = MIN_GUESTS[cat], guests = +f.g || 0
  const perHead = rate(cat, guests), base = perHead * guests
  const extras = addonTotal({ g: guests, addons: f.ad }), total = base + extras
  const chosen = Object.values(f.menu).flat()
  const picked = SLOTS.reduce((s, x) => s + (f.menu[x.k] || []).length, 0), needed = SLOTS.reduce((s, x) => s + x.n, 0)
  const addCount = Object.keys(f.ad.dishes).length + Object.keys(f.ad.services).length
  const detailsDone = guests >= min && f.v.trim() !== ''
  const menuDone = picked === needed
  const valid = detailsDone && menuDone

  // Menu: 1-dish categories swap the choice, 2-dish categories allow up to n.
  // An extra dish can't repeat a dish already on the menu, so any clash is dropped.
  const pick = (s, item) => {
    const cur = f.menu[s.k] || []
    const next = s.n === 1 ? [item] : cur.includes(item) ? cur.filter(x => x !== item) : cur.length < s.n ? [...cur, item] : cur
    const menu = { ...f.menu, [s.k]: next }
    const taken = Object.values(menu).flat()
    const dishes = Object.fromEntries(Object.entries(f.ad.dishes).filter(([, d]) => !taken.includes(d)))
    setF({ ...f, menu, ad: { ...f.ad, dishes } })
  }
  const toggleDish = (c, item) => {
    const d = { ...f.ad.dishes }
    if (d[c] === item) delete d[c]; else d[c] = item
    set('ad', { ...f.ad, dishes: d })
  }
  const setQty = (k, q) => {
    const sv = { ...f.ad.services }
    if (q > 0) sv[k] = q; else delete sv[k]
    set('ad', { ...f.ad, services: sv })
  }

  const submit = () => {
    if (!valid) return
    const b = { id: 'PCS-' + (1001 + bookings.length), c: user.name, t: f.t, d: date, g: guests, menu: f.menu, addons: f.ad, out: f.out, s: 'Pending', v: f.v, h: f.h, r: f.r, pay: [] }
    b.pay.push({ m: f.y, a: Math.round(tot(b) * 0.3), d: TODAY })
    setBookings([...bookings, b]); setLast(b); setDate(null); go('confirm')
  }
  const onSubmit = e => { e.preventDefault(); if (step < 4) setStep(step + 1); else submit() }

  const slot = SLOTS.find(s => s.k === slotKey), si = SLOTS.indexOf(slot), cur = f.menu[slot.k] || []
  const addDish = ADDON_DISHES.find(a => a.k === addCat)
  const steps = [{ name: 'Event', done: detailsDone }, { name: 'Menu', done: menuDone }, { name: 'Add-ons', done: addCount > 0 }, { name: 'Review', done: false }]

  return (
    <div className="wrap">
      <h2>Book your event</h2>
      <StepTabs steps={steps} step={step} onGo={setStep} />
      <form className="two" onSubmit={onSubmit}>
        <div className="panel">

          {step === 1 && <>
            <h3>Event details</h3>
            <p className="lg">Event date: <b>{date}</b> <a href="#calendar">Change</a></p>
            <label>Event type<select value={f.t} onChange={e => set('t', e.target.value)}>{EVENT_TYPES.map(([n]) => <option key={n}>{n}</option>)}</select></label>
            <label>Number of guests<input type="number" min={min} value={f.g} onChange={e => set('g', e.target.value)} /></label>
            {guests < min && <p className="err">Weddings and special events need at least {min} guests.</p>}
            <label>Venue<input placeholder="Venue address" value={f.v} onChange={e => set('v', e.target.value)} /></label>
            <label className="opt"><input type="checkbox" checked={f.out} onChange={e => set('out', e.target.checked)} />
              <span>The venue is outside Calbayog City proper (a transportation fee applies and will be quoted by Pastora’s)</span></label>
            <label>Start time<input type="time" value={f.h} onChange={e => set('h', e.target.value)} /></label>
          </>}

          {step === 2 && <>
            <h3>Build your menu</h3>
            <p className="lg">Your event includes the dishes below. Pick a category, then tap the dishes you want. {picked} of {needed} chosen.</p>
            <div className="cats" role="group" aria-label="Menu categories">
              {SLOTS.map(s => {
                const n = (f.menu[s.k] || []).length
                return (
                  <button type="button" key={s.k} className={`cat ${s.k === slotKey ? 'on' : ''}`} aria-pressed={s.k === slotKey} onClick={() => setSlotKey(s.k)}>
                    <span aria-hidden="true">{SLOT_ICON[s.k]}</span> {s.label} <span className="count">{n === s.n ? '✓' : `${n}/${s.n}`}</span>
                  </button>
                )
              })}
            </div>
            <h3><span aria-hidden="true">{SLOT_ICON[slot.k]}</span> {slot.label}</h3>
            <p className="lg">Choose {slot.n}. {cur.length} selected.</p>
            {slot.from.map(c => (
              <div key={c}>
                {slot.from.length > 1 && <h4>{CAT_ICON[c]} {c}</h4>}
                <DishPicker name={slot.k} options={MENU[c]} selected={cur} max={slot.n} radio={slot.n === 1} onPick={i => pick(slot, i)} />
              </div>
            ))}
            {si < SLOTS.length - 1 && <p><button type="button" className="btn alt sm" onClick={() => setSlotKey(SLOTS[si + 1].k)}>Next category: {SLOTS[si + 1].label} →</button></p>}
          </>}

          {step === 3 && <>
            <h3>Optional add-ons</h3>
            <p className="lg">Skip anything you don’t need. You can still review everything on the next step.</p>
            <h4>🍽️ One more dish</h4>
            <div className="cats" role="group" aria-label="Extra dish categories">
              {ADDON_DISHES.map(a => (
                <button type="button" key={a.k} className={`cat ${a.k === addCat ? 'on' : ''}`} aria-pressed={a.k === addCat} onClick={() => setAddCat(a.k)}>
                  <span aria-hidden="true">{CAT_ICON[a.k]}</span> {a.label}{f.ad.dishes[a.k] && <span className="count"> ✓</span>}
                </button>
              ))}
            </div>
            <p className="lg">One more {addDish.label} dish: +{M(addDish.p)} per head.</p>
            <DishPicker name="extra" options={MENU[addCat]} selected={f.ad.dishes[addCat] ? [f.ad.dishes[addCat]] : []} max={1}
              isTaken={i => chosen.includes(i)} onPick={i => toggleDish(addCat, i)} />
            <h4 style={{ marginTop: 24 }}>➕ Services and extras</h4>
            <div className="card">
              {ADDON_SERVICES.map(a => {
                const q = f.ad.services[a.k] || 0
                return (
                  <div className="row rate" key={a.k}>
                    <span>{a.n} <span className="lg">({M(a.p)} {a.note})</span></span>
                    <span className="step">
                      <button type="button" className="btn alt sm" disabled={q === 0} onClick={() => setQty(a.k, q - 1)} aria-label={`Fewer: ${a.n}`}>−</button>
                      <b>{q}</b>
                      <button type="button" className="btn alt sm" disabled={q >= a.max} onClick={() => setQty(a.k, q + 1)} aria-label={`More: ${a.n}`}>+</button>
                    </span>
                  </div>
                )
              })}
            </div>
          </>}

          {step === 4 && <>
            <h3>Review and confirm</h3>
            <div className="card">
              {[['Event details', detailsDone, 1, detailsDone ? `${f.t}, ${guests} guests` : 'Add a venue and a valid guest count'],
                ['Menu', menuDone, 2, `${picked} of ${needed} dishes chosen`],
                ['Add-ons', true, 3, addCount ? `${addCount} selected` : 'None (optional)']].map(([n, ok, st, note]) => (
                <div className="row rate" key={n}>
                  <span><b>{ok ? '✓' : '!'}</b> {n} <span className="lg">{note}</span></span>
                  <button type="button" className="btn alt sm" onClick={() => setStep(st)}>{ok ? 'Edit' : 'Fix'}</button>
                </div>
              ))}
            </div>
            <label>Special requests<textarea rows="3" placeholder="Allergies, themes, or other notes" value={f.r} onChange={e => set('r', e.target.value)} /></label>
            <label>Down payment method<select value={f.y} onChange={e => set('y', e.target.value)}>{Y.map(x => <option key={x}>{x}</option>)}</select></label>
          </>}

          <div className="row" style={{ marginTop: 24 }}>
            {step > 1 ? <button type="button" className="btn alt" onClick={() => setStep(step - 1)}>Back</button> : <span />}
            {step < 4 ? <button type="button" className="btn" onClick={() => setStep(step + 1)}>Next</button>
              : <button className="btn" disabled={!valid}>Submit booking</button>}
          </div>
          {step === 4 && !valid && <p className="err">Complete the items marked ! above to submit.</p>}
        </div>

        <Summary perHead={perHead} guests={guests} base={base} extras={extras} total={total} picked={picked} needed={needed} out={f.out} />
      </form>
    </div>
  )
}
