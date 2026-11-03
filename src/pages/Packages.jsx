import PackageCard from '../components/common/PackageCard'
import { P } from '../data/packages'

export default function Packages({ user, setPk, go }) {
  const choose = i => () => { setPk(i); go('calendar') }
  return (
    <div className="wrap">
      <h2>Catering packages</h2>
      <div className="grid">
        {P.map((p, i) => <PackageCard key={p.n} p={p} onChoose={user?.role === 'admin' ? null : choose(i)} />)}
      </div>
    </div>
  )
}
