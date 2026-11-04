import { SLOTS, FOOD_EXTRAS, SERVICE } from '../../data/menu'

export default function Inclusions() {
  return (
    <div className="grid">
      <div className="card"><h3>Food</h3>
        <ul>{SLOTS.map(s => <li key={s.k}>{s.n} {s.label.toLowerCase()}</li>)}{FOOD_EXTRAS.map(x => <li key={x}>{x}</li>)}</ul></div>
      <div className="card"><h3>Setup and service</h3>
        <ul>{SERVICE.map(x => <li key={x}>{x}</li>)}</ul>
        <p className="lg">A transportation fee applies for events outside Calbayog City proper.</p></div>
    </div>
  )
}
