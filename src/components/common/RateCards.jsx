import { RATE_TABLE } from '../../data/rates'

// Two cards instead of one wide table: easier to scan, especially on phones.
const COLS = [
  { title: 'Standard events', who: 'Birthdays, fiestas, baptisms, dedications, house/office blessings, and others', i: 1 },
  { title: 'Weddings and special events', who: 'Weddings and other special events', i: 2 }]

export default function RateCards() {
  return (
    <div className="grid">
      {COLS.map(c => (
        <div className="card" key={c.title}>
          <h3>{c.title}</h3>
          <p className="lg">{c.who}</p>
          {RATE_TABLE.map(r => (
            <div className="row rate" key={r[0]}>
              <span>{r[0]}</span>
              {r[c.i].startsWith('₱') ? <b>{r[c.i].replace(' per head', '')}<small> per head</small></b> : <span className="lg">{r[c.i]}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
