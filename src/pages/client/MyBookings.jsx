import Badge from '../../components/common/Badge'
import { M } from '../../utils/format'
import { tot, paid } from '../../utils/pricing'

export default function MyBookings({ bookings, user }) {
  const mine = bookings.filter(b => b.c === user.name)
  return (
    <div className="wrap" style={{ maxWidth: 720 }}>
      <h2>My bookings</h2>
      {mine.length === 0 && <p>No bookings yet. Choose a date to start one.</p>}
      {mine.map(b => (
        <div className="card" style={{ marginBottom: 12 }} key={b.id}>
          <div className="row"><b>{b.id}</b><Badge s={b.s} /></div>
          {b.t} on {b.d} for {b.g} guests
          <div className="row"><span>Total {M(tot(b))}</span><span>Paid {M(paid(b))}</span><span>Balance {M(tot(b) - paid(b))}</span></div>
        </div>
      ))}
      <a className="btn" href="#calendar">Book an event</a>
    </div>
  )
}
