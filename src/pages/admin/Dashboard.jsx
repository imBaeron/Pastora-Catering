import { useState } from 'react'
import KpiCards from '../../components/admin/KpiCards'
import BookingTable from '../../components/admin/BookingTable'
import BookingDialog from '../../components/admin/BookingDialog'
import { M } from '../../utils/format'
import { tot } from '../../utils/pricing'

export default function Dashboard({ bookings, setBookings }) {
  const [sel, setSel] = useState(null)
  const act = (id, s) => setBookings(bookings.map(b => (b.id === id ? { ...b, s } : b)))
  const pending = bookings.filter(b => b.s === 'Pending')
  const confirmed = bookings.filter(b => b.s === 'Confirmed').sort((a, b) => (a.d > b.d ? 1 : -1))
  return (
    <div className="wrap">
      <h2>Dashboard</h2>
      <KpiCards bookings={bookings} />
      <div className="card" style={{ margin: '16px 0' }}>
        <h3>New booking requests</h3>
        <BookingTable rows={pending} onAct={act} onView={setSel} />
      </div>
      <div className="card">
        <h3>Upcoming confirmed events</h3>
        {confirmed.length === 0 && <p>None yet.</p>}
        {confirmed.map(b => <div className="row" key={b.id}><span><b>{b.d}</b> {b.t}, {b.c}</span><span>{b.g} guests, {M(tot(b))}</span></div>)}
      </div>
      <BookingDialog b={sel} onClose={() => setSel(null)} />
    </div>
  )
}
