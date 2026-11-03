import Badge from '../common/Badge'
import { P } from '../../data/packages'
import { A } from '../../data/addOns'
import { M } from '../../utils/format'
import { tot, paid } from '../../utils/pricing'

export default function BookingDialog({ b, onClose }) {
  if (!b) return null
  return (
    <dialog open style={{ position: 'fixed', inset: 0, margin: 'auto', height: 'fit-content', zIndex: 20 }}>
      <h3>{b.id}</h3><Badge s={b.s} />
      <p>{b.c}, {b.t}<br />{b.d} for {b.g} guests<br />Venue: {b.v || '-'}<br />Package: {P[b.pkg].n}<br />
        Add-ons: {b.add.map(i => A[i].n).join(', ') || 'None'}<br />Requests: {b.r || 'None'}<br />
        Total {M(tot(b))}, paid {M(paid(b))}</p>
      <button className="btn" onClick={onClose}>Close</button>
    </dialog>
  )
}
