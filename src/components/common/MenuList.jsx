import { useCatalog } from '../../CatalogContext'

export default function MenuList({ menu }) {
  const { slots } = useCatalog()
  return <div style={{ fontSize: 13 }}>{slots.map(s => <p key={s.k} style={{ margin: '4px 0' }}><b>{s.label}:</b> {(menu?.[s.k] || []).join(', ')}</p>)}</div>
}
