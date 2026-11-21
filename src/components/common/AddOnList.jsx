import { M } from '../../utils/format'

// Lists the add-ons a booking includes, with the cost of each (prices as frozen on the booking).
export default function AddOnList({ b }) {
  const rows = (b.addonLines || []).map(x => [
    x.type === 'Extra dish' ? `Extra ${x.name.replace(/^One more | dish$/g, '')}: ${x.item}` : `${x.name}${x.qty > 1 ? ` × ${x.qty}` : ''}`,
    x.cost])
  if (!rows.length) return null
  return (
    <>
      <h3 style={{ marginTop: 16 }}>Add-ons</h3>
      <div style={{ fontSize: 13 }}>{rows.map(([n, v]) => <div className="row" style={{ margin: '4px 0' }} key={n}><span>{n}</span><span>{M(v)}</span></div>)}</div>
    </>
  )
}
