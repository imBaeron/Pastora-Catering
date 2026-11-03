import Badge from '../common/Badge'
import { P } from '../../data/packages'

export default function BookingTable({ rows, onAct, onView }) {
  if (!rows.length) return <p>No bookings to show.</p>
  return (
    <div className="tw"><table>
      <thead><tr><th>ID</th><th>Client</th><th>Event</th><th>Package</th><th>Schedule</th><th>Guests</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{rows.map(b => (
        <tr key={b.id}>
          <td>{b.id}</td><td>{b.c}</td><td>{b.t}</td><td>{P[b.pkg].n}</td><td>{b.d}</td><td>{b.g}</td><td><Badge s={b.s} /></td>
          <td>
            <button className="btn alt sm" onClick={() => onView(b)}>View</button>{' '}
            <button className="btn sm" onClick={() => onAct(b.id, 'Confirmed')}>Confirm</button>{' '}
            <button className="btn alt sm" onClick={() => onAct(b.id, 'Cancelled')}>Cancel</button>
          </td>
        </tr>
      ))}</tbody>
    </table></div>
  )
}
