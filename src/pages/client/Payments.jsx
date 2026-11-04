import { useState } from 'react'
import Badge from '../../components/common/Badge'
import { Y, TODAY } from '../../data/constants'
import { M } from '../../utils/format'
import { tot, paid } from '../../utils/pricing'

function PayCard({ b, onPay }) {
  const [m, setM] = useState(Y[0])
  const bal = tot(b) - paid(b)
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="row"><b>{b.id}</b><Badge s={b.s} /></div>
      {b.t} on {b.d}, {b.g} guests
      <div className="row"><span>Total {M(tot(b))}</span><span>Paid {M(paid(b))}</span><b>Balance {M(bal)}</b></div>
      {b.pay.map((x, i) => <div className="row lg" key={i}><span>{x.d}, {x.m}</span><span>{M(x.a)}</span></div>)}
      {bal > 0
        ? <div className="row"><select style={{ maxWidth: 180 }} value={m} onChange={e => setM(e.target.value)}>{Y.map(y => <option key={y}>{y}</option>)}</select>
            <button className="btn sm" onClick={() => onPay(b.id, m)}>Pay balance {M(bal)}</button></div>
        : <p className="lg">Fully paid.</p>}
    </div>
  )
}

export default function Payments({ bookings, setBookings, user }) {
  const mine = bookings.filter(b => b.c === user.name && b.s !== 'Cancelled')
  const pay = (id, m) => setBookings(bookings.map(b => (b.id === id ? { ...b, pay: [...b.pay, { m, a: tot(b) - paid(b), d: TODAY }] } : b)))
  return (
    <div className="wrap" style={{ maxWidth: 720 }}>
      <h2>Payments</h2>
      {mine.length === 0 && <p>No payments due. Book an event to get started.</p>}
      {mine.map(b => <PayCard key={b.id} b={b} onPay={pay} />)}
      <p className="lg">Prototype: payments are simulated and not processed.</p>
    </div>
  )
}
