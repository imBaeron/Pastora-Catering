import { RATE_TABLE } from '../../data/rates'

export default function RateTable() {
  return (
    <div className="card tw rt"><table>
      <thead><tr><th>Guest count</th><th>Birthdays, fiestas, baptisms, dedications, house/office blessings, and others</th><th>Weddings and special events</th></tr></thead>
      <tbody>{RATE_TABLE.map(([a, b, c]) => <tr key={a}><td><b>{a}</b></td><td>{b}</td><td>{c}</td></tr>)}</tbody>
    </table></div>
  )
}
