import { SLOTS } from '../../data/menu'

export default function MenuList({ menu }) {
  return <div style={{ fontSize: 13 }}>{SLOTS.map(s => <p key={s.k} style={{ margin: '4px 0' }}><b>{s.label}:</b> {(menu?.[s.k] || []).join(', ')}</p>)}</div>
}
