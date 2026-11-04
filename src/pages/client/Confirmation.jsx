import Badge from '../../components/common/Badge'
import MenuList from '../../components/common/MenuList'
import { M } from '../../utils/format'
import { tot, paid, perHead } from '../../utils/pricing'

export default function Confirmation({ last: b }) {
  const rows = [['Event', b.t], ['Date', b.d], ['Venue', b.v], ['Guests', b.g], ['Rate per head', M(perHead(b))], ['Total', M(tot(b))],
    [`Down payment (${b.pay[0].m})`, M(paid(b))], ['Balance', M(tot(b) - paid(b))]]
  return (
    <div className="wrap" style={{ maxWidth: 560 }}>
      <div className="card">
        <h2>Booking submitted</h2>
        <p>Your reference number</p>
        <div className="big">{b.id}</div><Badge s={b.s} />
        {rows.map(([k, v]) => <div className="row" key={k}><span>{k}</span><b>{v}</b></div>)}
        <h3 style={{ marginTop: 16 }}>Your menu</h3>
        <MenuList menu={b.menu} />
        {b.out && <p className="lg">Your venue is outside Calbayog City proper. Pastora’s will quote the transportation fee.</p>}
        <p className="lg">Pastora’s will review your request and confirm it. You can check the status anytime.</p>
        <a className="btn" href="#my-bookings">View my bookings</a>{' '}<a className="btn alt" href="#home">Back home</a>
      </div>
    </div>
  )
}
