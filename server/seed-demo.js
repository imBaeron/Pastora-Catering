// Run once after the three SQL files:  npm run seed
// Creates the demo accounts (with properly hashed passwords), blocked dates and the 5 sample bookings
// that used to live in src/data/accounts.js, constants.js and bookings.js.
import bcrypt from 'bcryptjs'
import { pool, q } from './db.js'

const id = async (sql, p) => (await q(sql, p)).rows[0]?.id

async function account(name, email, password, role) {
  const found = await id('SELECT account_id AS id FROM account WHERE email = $1', [email])
  if (found) return found
  return id(`INSERT INTO account (role_id, full_name, email, password_hash)
    VALUES ((SELECT role_id FROM role WHERE role_name = $1), $2, $3, $4) RETURNING account_id AS id`,
    [role, name, email, await bcrypt.hash(password, 10)])
}

const admin = await account('Pastora Owner', 'admin@pastoras.com', 'admin123', 'Admin')
const maria = await account('Maria Santos', 'client@pastoras.com', 'client123', 'Client')
const jose = await account('Jose Reyes', 'jose@example.com', 'client123', 'Client')
const ana = await account('Ana Cruz', 'ana@example.com', 'client123', 'Client')
const liza = await account('Liza Gomez', 'liza@example.com', 'client123', 'Client')
const rico = await account('Rico Diaz', 'rico@example.com', 'client123', 'Client')

for (const d of ['2026-11-25', '2026-12-24', '2026-12-25'])
  await q(`INSERT INTO blocked_date (created_by, blocked_date, reason) VALUES ($1,$2,'Unavailable') ON CONFLICT DO NOTHING`, [admin, d])

if ((await q('SELECT 1 FROM booking LIMIT 1')).rowCount === 0) {
  const MENU = ['Caldereta', 'Pork Menudo', 'Fried Chicken with Gravy Sauce', 'Spaghetti', 'Puto', 'Latik', 'Buko Pandan']
  const rate = async (type, g) => id(`SELECT pr.price_per_head AS id FROM pricing_rate pr JOIN event_type et USING (event_category_id)
    WHERE et.type_name = $1 AND pr.min_guests <= $2 ORDER BY pr.min_guests DESC LIMIT 1`, [type, g])

  const samples = [
    { c: maria, t: 'Wedding', d: '2026-11-14', g: 120, s: 'Confirmed', v: 'Calbayog City', out: false,
      dish: 'Beef Salpicao', svc: { 'Extra waiter': 2 }, pay: [['Bank Transfer', 18000, '2026-10-20']] },
    { c: jose, t: 'Birthday', d: '2026-11-21', g: 50, s: 'Pending', v: 'Brgy. Obrero', out: false, pay: [['GCash', 5000, '2026-11-01']] },
    { c: ana, t: 'House/Office Blessing', d: '2026-11-28', g: 80, s: 'Confirmed', v: 'Catbalogan City', out: true,
      svc: { 'Extra round of softdrinks': 1, 'Sound system': 1 }, pay: [['Cash', 10000, '2026-10-25'], ['GCash', 8000, '2026-10-30']] },
    { c: liza, t: 'Baptism', d: '2026-12-05', g: 40, s: 'Pending', v: 'Parish hall', out: false, pay: [] },
    { c: rico, t: 'Dedication', d: '2026-12-12', g: 60, s: 'Cancelled', v: 'Church grounds', out: false, pay: [] }]

  for (const s of samples) {
    const bid = await id(`INSERT INTO booking (client_id, event_type_id, status_id, confirmed_by, event_date, start_time, venue, guest_count, price_per_head, is_outside_city)
      VALUES ($1,(SELECT event_type_id FROM event_type WHERE type_name=$2),(SELECT status_id FROM booking_status WHERE status_name=$3),
              $4,$5,'11:00',$6,$7,$8,$9) RETURNING booking_id AS id`,
      [s.c, s.t, s.s, s.s === 'Confirmed' ? admin : null, s.d, s.v, s.g, await rate(s.t, s.g), s.out])
    await q('UPDATE booking SET booking_reference_no = $2 WHERE booking_id = $1', [bid, 'PCS-' + (1000 + bid)])
    for (const m of MENU) await q(`INSERT INTO booking_menu_item SELECT $1, menu_item_id FROM menu_item WHERE item_name = $2`, [bid, m])
    if (s.dish) await q(`INSERT INTO booking_addon (booking_id, addon_id, menu_item_id, quantity, unit_price)
      SELECT $1, ao.addon_id, mi.menu_item_id, 1, ao.price FROM menu_item mi JOIN add_on ao ON ao.menu_category_id = mi.menu_category_id WHERE mi.item_name = $2`, [bid, s.dish])
    for (const [name, qty] of Object.entries(s.svc || {}))
      await q(`INSERT INTO booking_addon (booking_id, addon_id, quantity, unit_price) SELECT $1, addon_id, $3, price FROM add_on WHERE addon_name = $2`, [bid, name, qty])
    for (const [m, a, d] of s.pay)
      await q(`INSERT INTO payment (booking_id, method_id, amount, payment_date) VALUES ($1,(SELECT method_id FROM payment_method WHERE method_name=$2),$3,$4)`, [bid, m, a, d])
  }
}
console.log('Seeded. Demo logins: admin@pastoras.com / admin123, client@pastoras.com / client123')
await pool.end()
