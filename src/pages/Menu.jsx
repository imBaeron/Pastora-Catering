import { useState } from 'react'
import RateCards from '../components/common/RateCards'
import Inclusions from '../components/common/Inclusions'
import AddOnsMenu from '../components/common/AddOnsMenu'
import { MENU, SLOTS, CAT_ICON } from '../data/menu'
import { MENU_BANNER, MENU_PICS } from '../data/images'
import { pic } from '../utils/placeholders'

const TABS = [['rates', '💰', 'Rates'], ['included', '✅', 'What’s included'], ['menu', '🍽️', 'Menu'], ['addons', '➕', 'Add-ons']]

export default function Menu({ user, menuTab, setMenuTab }) {
  const [cat, setCat] = useState('Beef')
  const slot = SLOTS.find(s => s.from.includes(cat))
  const pics = MENU_PICS[cat]

  return (
    <div className="wrap">
      <img className="banner" src={pic(MENU_BANNER.label, MENU_BANNER.c, MENU_BANNER.src)} alt={MENU_BANNER.label} />
      <h2 style={{ marginTop: 24 }}>Menu and rates</h2>

      <div className="tabs" role="tablist" aria-label="Menu sections">
        {TABS.map(([k, icon, name]) => (
          <button key={k} role="tab" aria-selected={menuTab === k} className={`tab ${menuTab === k ? 'on' : ''}`} onClick={() => setMenuTab(k)}>
            <span aria-hidden="true">{icon}</span> {name}
          </button>
        ))}
      </div>

      <div className="panel" role="tabpanel">
        {menuTab === 'rates' && <>
          <h3>Our rates</h3>
          <p>Rates are per head. The price depends on your event type and how many guests you have.</p>
          <RateCards />
        </>}

        {menuTab === 'included' && <>
          <h3>What’s included in every event</h3>
          <p>Every booking comes with the food and service below. Add more in the Add-ons tab.</p>
          <Inclusions />
        </>}

        {menuTab === 'menu' && <>
          <h3>Our dishes</h3>
          <p>Pick a category to see its dishes. For each event, you choose from these:</p>
          <div className="pills">{SLOTS.map(s => <span className="pill" key={s.k}>{s.n} {s.label.toLowerCase()}</span>)}</div>
          <div className="cats" role="group" aria-label="Menu categories">
            {Object.keys(MENU).map(c => (
              <button key={c} className={`cat ${c === cat ? 'on' : ''}`} aria-pressed={c === cat} onClick={() => setCat(c)}>
                <span aria-hidden="true">{CAT_ICON[c]}</span> {c}
              </button>
            ))}
          </div>
          <div className="split">
            <img src={pic(cat, pics.c, pics.src)} alt={`${cat} dishes`} loading="lazy" />
            <div>
              <h3><span aria-hidden="true">{CAT_ICON[cat]}</span> {cat}</h3>
              <p className="lg">{MENU[cat].length} dishes. Counts toward your {slot.n} {slot.label.toLowerCase()}.</p>
              <div className="dishes">{MENU[cat].map(i => <div className="dish" key={i}>{i}</div>)}</div>
            </div>
          </div>
        </>}

        {menuTab === 'addons' && <>
          <h3>Optional add-ons</h3>
          <p>Want more? Add one more dish of any food type, or extra services.</p>
          <AddOnsMenu />
        </>}
      </div>

      {user?.role !== 'admin' && <p style={{ marginTop: 24 }}><a className="btn" href="#calendar">Book Now</a></p>}
    </div>
  )
}
