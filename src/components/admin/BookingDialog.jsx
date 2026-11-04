import Badge from '../common/Badge'
import MenuList from '../common/MenuList'
import { M } from '../../utils/format'
import { tot, paid, perHead } from '../../utils/pricing'

export default function BookingDialog({ b, onClose }) {
  if (!b) return null
  return (
    <dialog open style={{ position: 'fixed', inset: 0, margin: 'auto', height: 'fit-content', zIndex: 20 }}>
      <h3>{b.id}</h3><Badge s={b.s} />
      <p>{b.c}, {b.t}<br />{b.d} for {b.g} guests<br />Venue: {b.v || '-'}{b.out && ' (outside Calbayog City proper, transportation fee applies)'}<br />
        Rate {M(perHead(b))} per head, total {M(tot(b))}, paid {M(paid(b))}<br />Requests: {b.r || 'None'}</p>
      <MenuList menu={b.menu} />
      <p><button className="btn" onClick={onClose}>Close</button></p>
    </dialog>
  )
}
