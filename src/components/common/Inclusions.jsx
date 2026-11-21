import { FOOD_EXTRAS, SERVICE } from '../../data/menu'
import { useCatalog } from '../../CatalogContext'

export default function Inclusions() {
  const { slots } = useCatalog()
  return (
    <div className="grid">
      <div className="card"><h3>Food</h3>
        <ul className="checks">{slots.map(s => <li key={s.k}>{s.n} {s.label.toLowerCase()}</li>)}{FOOD_EXTRAS.map(x => <li key={x}>{x}</li>)}</ul></div>
      <div className="card"><h3>Setup and service</h3>
        <ul className="checks">{SERVICE.map(x => <li key={x}>{x}</li>)}</ul>
        <p className="lg">A transportation fee applies for events outside Calbayog City proper.</p></div>
    </div>
  )
}
