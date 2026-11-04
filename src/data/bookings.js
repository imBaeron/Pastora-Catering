import { DEFAULT_MENU as menu } from './menu'

export const SEED = [
  { id: 'PCS-1001', c: 'Maria Santos', t: 'Wedding', d: '2026-11-14', g: 120, menu, out: false, s: 'Confirmed', v: 'Calbayog City', pay: [{ m: 'Bank Transfer', a: 18000, d: '2026-10-20' }] },
  { id: 'PCS-1002', c: 'Jose Reyes', t: 'Birthday', d: '2026-11-21', g: 50, menu, out: false, s: 'Pending', v: 'Brgy. Obrero', pay: [{ m: 'GCash', a: 5000, d: '2026-11-01' }] },
  { id: 'PCS-1003', c: 'Ana Cruz', t: 'House/Office Blessing', d: '2026-11-28', g: 80, menu, out: true, s: 'Confirmed', v: 'Catbalogan City', pay: [{ m: 'Cash', a: 10000, d: '2026-10-25' }, { m: 'GCash', a: 8000, d: '2026-10-30' }] },
  { id: 'PCS-1004', c: 'Liza Gomez', t: 'Baptism', d: '2026-12-05', g: 40, menu, out: false, s: 'Pending', v: 'Parish hall', pay: [] },
  { id: 'PCS-1005', c: 'Rico Diaz', t: 'Dedication', d: '2026-12-12', g: 60, menu, out: false, s: 'Cancelled', v: 'Church grounds', pay: [] }]
