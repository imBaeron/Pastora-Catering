import RateTable from '../components/common/RateTable'
import Inclusions from '../components/common/Inclusions'
import { MENU, SLOTS } from '../data/menu'

export default function Menu({ user }) {
  return (
    <div className="wrap">
      <h2>Menu and rates</h2>
      <RateTable />
      <h2 style={{ marginTop: 32 }}>What’s included</h2>
      <Inclusions />
      <h2 style={{ marginTop: 32 }}>Our menu</h2>
      <p>For each event, choose {SLOTS.map(s => `${s.n} ${s.label.toLowerCase()}`).join(', ')}.</p>
      <div className="grid">
        {Object.entries(MENU).map(([cat, items]) => (
          <div className="card" key={cat}><h3>{cat}</h3><ul>{items.map(i => <li key={i}>{i}</li>)}</ul></div>
        ))}
      </div>
      {user?.role !== 'admin' && <p style={{ marginTop: 24 }}><a className="btn" href="#calendar">Book Now</a></p>}
    </div>
  )
}
