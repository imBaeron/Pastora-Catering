import { M } from '../../utils/format'
import { paid } from '../../utils/pricing'

export default function KpiCards({ bookings }) {
  const k = [
    ['Total bookings', bookings.length],
    ['Pending', bookings.filter(b => b.s === 'Pending').length],
    ['Confirmed', bookings.filter(b => b.s === 'Confirmed').length],
    ['Payments collected', M(bookings.reduce((s, b) => s + paid(b), 0))],
    ['Total clients', new Set(bookings.map(b => b.c)).size]]
  return <div className="grid kpi">{k.map(([n, v]) => <div className="card" key={n}><b>{v}</b><span>{n}</span></div>)}</div>
}
