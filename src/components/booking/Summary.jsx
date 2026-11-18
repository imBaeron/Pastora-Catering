import { M } from '../../utils/format'

export default function Summary({ perHead, guests, base, extras, total, picked, needed, out }) {
  return (
    <div className="card" style={{ position: 'sticky', top: 80 }}>
      <h3>Your summary</h3>
      <div className="row rate"><span>Rate per head</span><span>{M(perHead)}</span></div>
      <div className="row rate"><span>Guests</span><span>{guests}</span></div>
      <div className="row rate"><span>Menu</span><span>{picked} of {needed} dishes</span></div>
      <div className="row rate"><span>Food and service</span><span>{M(base)}</span></div>
      {extras > 0 && <div className="row rate"><span>Add-ons</span><span>{M(extras)}</span></div>}
      <div className="row"><b>Estimated total</b><b>{M(total)}</b></div>
      <div className="row"><span>Down payment (30%)</span><b className="price">{M(total * 0.3)}</b></div>
      <p className="lg">Includes rice, softdrinks, water service, setup, and uniformed waiters.{out && ' Transportation fee not included.'}</p>
    </div>
  )
}
