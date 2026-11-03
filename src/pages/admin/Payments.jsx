import { Y } from '../../data/constants'
import { M } from '../../utils/format'
import { tot, paid } from '../../utils/pricing'

export default function Payments({ bookings }) {
  const all = bookings.flatMap(b => b.pay.map(x => ({ ...x, b })))
  const by = Y.map(m => [m, all.filter(x => x.m === m).reduce((s, x) => s + x.a, 0)])
  const mx = Math.max(...by.map(x => x[1]), 1)
  const owed = bookings.filter(b => b.s !== 'Cancelled').reduce((s, b) => s + tot(b) - paid(b), 0)
  return (
    <div className="wrap">
      <h2>Payments</h2>
      <div className="grid kpi">
        <div className="card"><b>{M(all.reduce((s, x) => s + x.a, 0))}</b><span>Total collected</span></div>
        <div className="card"><b>{M(owed)}</b><span>Outstanding balance</span></div>
        <div className="card"><b>{all.length}</b><span>Transactions</span></div>
      </div>
      <div className="card" style={{ margin: '16px 0' }}>
        <h3>Revenue by payment method</h3>
        {by.map(([m, v]) => <div key={m}><div className="row"><span>{m}</span><b>{M(v)}</b></div>
          <div className="trkb"><div className="bar" style={{ width: `${(v / mx) * 100}%` }} /></div></div>)}
      </div>
      <div className="card"><h3>Transactions</h3><div className="tw"><table>
        <thead><tr><th>Booking</th><th>Client</th><th>Method</th><th>Amount</th><th>Date</th></tr></thead>
        <tbody>{all.map((x, i) => <tr key={i}><td>{x.b.id}</td><td>{x.b.c}</td><td>{x.m}</td><td>{M(x.a)}</td><td>{x.d}</td></tr>)}</tbody>
      </table></div></div>
    </div>
  )
}
