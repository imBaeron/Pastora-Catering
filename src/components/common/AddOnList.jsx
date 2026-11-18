import { ADDON_DISHES, ADDON_SERVICES } from '../../data/addOns'
import { M } from '../../utils/format'

// Lists the add-ons a booking includes, with the cost of each.
export default function AddOnList({ b }) {
  const { dishes = {}, services = {} } = b.addons || {}
  const rows = [
    ...Object.entries(dishes).map(([c, item]) => { const a = ADDON_DISHES.find(x => x.k === c); return [`Extra ${a.label}: ${item}`, a.p * b.g] }),
    ...Object.entries(services).map(([k, q]) => { const a = ADDON_SERVICES.find(x => x.k === k); return [`${a.n}${q > 1 ? ` × ${q}` : ''}`, a.p * q * (a.basis === 'head' ? b.g : 1)] })]
  if (!rows.length) return null
  return (
    <>
      <h3 style={{ marginTop: 16 }}>Add-ons</h3>
      <div style={{ fontSize: 13 }}>{rows.map(([n, v]) => <div className="row" style={{ margin: '4px 0' }} key={n}><span>{n}</span><span>{M(v)}</span></div>)}</div>
    </>
  )
}
