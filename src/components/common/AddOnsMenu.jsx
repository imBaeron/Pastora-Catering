import { ADDON_DISHES, ADDON_SERVICES } from '../../data/addOns'
import { M } from '../../utils/format'

export default function AddOnsMenu() {
  return (
    <div className="grid">
      <div className="card"><h3>🍽️ Extra dishes</h3>
        <p className="lg">Add one more dish of each food type.</p>
        {ADDON_DISHES.map(a => (
          <div className="row rate" key={a.k}><span>One more {a.label} dish</span><b>{M(a.p)}<small> per head</small></b></div>
        ))}
      </div>
      <div className="card"><h3>➕ Services and extras</h3>
        <p className="lg">Choose these when you book. Pastora’s confirms the final prices.</p>
        {ADDON_SERVICES.map(a => (
          <div className="row rate" key={a.k}><span>{a.n}</span><b>{M(a.p)}<small> {a.note}</small></b></div>
        ))}
      </div>
    </div>
  )
}
