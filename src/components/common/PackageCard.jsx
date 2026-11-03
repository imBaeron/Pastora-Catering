import { M } from '../../utils/format'
import { ph } from '../../utils/placeholders'

export default function PackageCard({ p, onChoose }) {
  return (
    <div className="card pk">
      <img src={ph(p.n, p.c)} alt={p.n} />
      <div>
        <h3>{p.n}</h3><p>{p.d}</p>
        <ul>{p.items.map(x => <li key={x}>{x}</li>)}</ul>
        <span className="price">{M(p.p)}</span> per guest
        {onChoose && <p><button className="btn sm" onClick={onChoose}>Choose this package</button></p>}
      </div>
    </div>
  )
}
