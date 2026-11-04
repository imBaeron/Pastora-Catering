import { useState } from 'react'
import Badge from '../../components/common/Badge'
import MenuList from '../../components/common/MenuList'
import { FOOD_EXTRAS, SERVICE } from '../../data/menu'
import { M } from '../../utils/format'
import { tot, paid, perHead } from '../../utils/pricing'

function BookingCard({ b }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="row"><b>{b.id}</b><Badge s={b.s} /></div>
      {b.t} on {b.d} for {b.g} guests
      <div className="row"><span>Total {M(tot(b))}</span><span>Paid {M(paid(b))}</span><span>Balance {M(tot(b) - paid(b))}</span></div>
      <button className="btn alt sm" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Hide details' : 'View details'}</button>

      {open && (
        <div style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
          <h3>Event</h3>
          <div className="row"><span>Date</span><b>{b.d}</b></div>
          {b.h && <div className="row"><span>Start time</span><b>{b.h}</b></div>}
          <div className="row"><span>Venue</span><b>{b.v || '-'}</b></div>
          <div className="row"><span>Guests</span><b>{b.g}</b></div>
          {b.out && <p className="lg">Venue is outside Calbayog City proper. Pastora’s will quote the transportation fee.</p>}

          <h3 style={{ marginTop: 16 }}>Your menu</h3>
          <MenuList menu={b.menu} />
          <p className="lg">Also included: {[...FOOD_EXTRAS, ...SERVICE].join(', ').toLowerCase()}.</p>

          <h3 style={{ marginTop: 16 }}>Special requests</h3>
          <p>{b.r || 'None'}</p>

          <h3>Pricing and payments</h3>
          <div className="row"><span>Rate per head</span><b>{M(perHead(b))}</b></div>
          <div className="row"><span>Total</span><b>{M(tot(b))}</b></div>
          {b.pay.map((x, i) => <div className="row lg" key={i}><span>{x.d}, {x.m}</span><span>{M(x.a)}</span></div>)}
          {b.pay.length === 0 && <p className="lg">No payments recorded yet.</p>}
          <div className="row"><span>Balance</span><b>{M(tot(b) - paid(b))}</b></div>
        </div>
      )}
    </div>
  )
}

export default function MyBookings({ bookings, user }) {
  const mine = bookings.filter(b => b.c === user.name)
  return (
    <div className="wrap" style={{ maxWidth: 720 }}>
      <h2>My bookings</h2>
      {mine.length === 0 && <p>No bookings yet. Choose a date to start one.</p>}
      {mine.map(b => <BookingCard key={b.id} b={b} />)}
      <a className="btn" href="#calendar">Book an event</a>
    </div>
  )
}
