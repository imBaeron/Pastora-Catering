import { useState } from 'react'
import BookingTable from '../../components/admin/BookingTable'
import BookingDialog from '../../components/admin/BookingDialog'

export default function Bookings({ bookings, setBookings }) {
  const [q, setQ] = useState(''), [f, setF] = useState('All'), [sel, setSel] = useState(null)
  const act = (id, s) => setBookings(bookings.map(b => (b.id === id ? { ...b, s } : b)))
  const rows = bookings.filter(b => (f === 'All' || b.s === f) && (b.c + b.id + b.t).toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="wrap">
      <h2>Bookings</h2>
      <div className="card">
        <div className="row">
          <input style={{ maxWidth: 300 }} placeholder="Search booking, client, or event" value={q} onChange={e => setQ(e.target.value)} />
          <select style={{ maxWidth: 160 }} value={f} onChange={e => setF(e.target.value)}>
            {['All', 'Pending', 'Confirmed', 'Cancelled'].map(x => <option key={x}>{x}</option>)}
          </select>
        </div>
        <BookingTable rows={rows} onAct={act} onView={setSel} />
      </div>
      <BookingDialog b={sel} onClose={() => setSel(null)} />
    </div>
  )
}
