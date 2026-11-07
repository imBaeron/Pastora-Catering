import RateTable from '../components/common/RateTable'
import Inclusions from '../components/common/Inclusions'
import { MENU, SLOTS } from '../data/menu'
import { MENU_BANNER, MENU_PICS } from '../data/images'
import { pic } from '../utils/placeholders'

export default function Menu({ user }) {
  return (
    <div className="wrap">
      <img className="banner" src={pic(MENU_BANNER.label, MENU_BANNER.c, MENU_BANNER.src)} alt={MENU_BANNER.label} />
      <h2 style={{ marginTop: 24 }}>Menu and rates</h2>
      <RateTable />
      <h2 className="sec">What’s included</h2>
      <Inclusions />
      <h2 className="sec">Our menu</h2>
      <p>For each event, choose {SLOTS.map(s => `${s.n} ${s.label.toLowerCase()}`).join(', ')}.</p>
      <div className="grid">
        {Object.entries(MENU).map(([cat, items]) => (
          <div className="card mc" key={cat}>
            <img src={pic(cat, MENU_PICS[cat].c, MENU_PICS[cat].src)} alt={`${cat} dishes`} loading="lazy" />
            <div><h3>{cat}</h3><ul>{items.map(i => <li key={i}>{i}</li>)}</ul></div>
          </div>
        ))}
      </div>
      {user?.role !== 'admin' && <p style={{ marginTop: 24 }}><a className="btn" href="#calendar">Book Now</a></p>}
    </div>
  )
}
