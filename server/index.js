import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool, q } from './db.js'

const app = express()
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

const fail = (res, code, msg) => res.status(code).json({ error: msg })
const wrap = fn => (req, res) => fn(req, res).catch(e => { console.error(e); fail(res, 500, 'Server error') })
const ymd = d => d.toISOString().slice(0, 10)

// ---------- auth ----------
const sign = a => jwt.sign({ id: a.account_id, role: a.role_name }, process.env.JWT_SECRET, { expiresIn: '7d' })
const publicUser = a => ({ id: a.account_id, name: a.full_name, email: a.email, role: a.role_name.toLowerCase() })

const auth = (role) => (req, res, next) => {
  try {
    const t = (req.headers.authorization || '').replace('Bearer ', '')
    const p = jwt.verify(t, process.env.JWT_SECRET)
    if (role && p.role.toLowerCase() !== role) return fail(res, 403, 'Not allowed')
    req.user = p; next()
  } catch { fail(res, 401, 'Please log in') }
}

app.post('/api/auth/register', wrap(async (req, res) => {
  const { name = '', email = '', password = '' } = req.body
  const mail = email.trim().toLowerCase()
  if (!name.trim() || !mail || password.length < 6) return fail(res, 400, 'Name, email and a 6+ character password are required.')
  const dup = await q('SELECT 1 FROM account WHERE email = $1', [mail])
  if (dup.rowCount) return fail(res, 409, 'An account with this email already exists.')
  const hash = await bcrypt.hash(password, 10)
  const r = await q(
    `INSERT INTO account (role_id, full_name, email, password_hash)
     VALUES ((SELECT role_id FROM role WHERE role_name = 'Client'), $1, $2, $3) RETURNING account_id`, [name.trim(), mail, hash])
  const a = (await q(`SELECT a.*, r.role_name FROM account a JOIN role r USING (role_id) WHERE account_id = $1`, [r.rows[0].account_id])).rows[0]
  res.json({ token: sign(a), user: publicUser(a) })
}))

app.post('/api/auth/login', wrap(async (req, res) => {
  const mail = (req.body.email || '').trim().toLowerCase()
  const r = await q(`SELECT a.*, r.role_name FROM account a JOIN role r USING (role_id) WHERE email = $1 AND is_active`, [mail])
  const a = r.rows[0]
  if (!a || !(await bcrypt.compare(req.body.password || '', a.password_hash))) return fail(res, 401, 'Incorrect email or password.')
  res.json({ token: sign(a), user: publicUser(a) })
}))

app.get('/api/auth/me', auth(), wrap(async (req, res) => {
  const r = await q(`SELECT a.*, r.role_name FROM account a JOIN role r USING (role_id) WHERE account_id = $1`, [req.user.id])
  r.rows[0] ? res.json(publicUser(r.rows[0])) : fail(res, 401, 'Please log in')
}))

// ---------- catalog: everything that used to be hardcoded in src/data ----------
app.get('/api/catalog', wrap(async (_req, res) => {
  const [types, cats, rates, slots, mcats, items, addons, methods] = await Promise.all([
    q(`SELECT et.type_name, ec.category_name FROM event_type et JOIN event_category ec USING (event_category_id) ORDER BY et.event_type_id`),
    q(`SELECT category_name, min_guests FROM event_category`),
    q(`SELECT ec.category_name, pr.min_guests, pr.price_per_head FROM pricing_rate pr JOIN event_category ec USING (event_category_id) ORDER BY pr.min_guests DESC`),
    q(`SELECT slot_id, slot_name, dishes_allowed FROM menu_slot ORDER BY slot_id`),
    q(`SELECT menu_category_id, slot_id, category_name FROM menu_category ORDER BY menu_category_id`),
    q(`SELECT mc.category_name, mi.item_name FROM menu_item mi JOIN menu_category mc USING (menu_category_id) WHERE mi.is_available ORDER BY mi.menu_item_id`),
    q(`SELECT ao.*, mc.category_name FROM add_on ao LEFT JOIN menu_category mc USING (menu_category_id) ORDER BY ao.addon_id`),
    q(`SELECT method_name FROM payment_method ORDER BY method_id`)
  ])
  const rateMap = {}
  rates.rows.forEach(r => (rateMap[r.category_name] ||= []).push([r.min_guests, r.price_per_head]))
  const menu = {}
  items.rows.forEach(r => (menu[r.category_name] ||= []).push(r.item_name))
  res.json({
    eventTypes: types.rows.map(r => [r.type_name, r.category_name]),
    minGuests: Object.fromEntries(cats.rows.map(r => [r.category_name, r.min_guests])),
    rates: rateMap,                                    // { Standard: [[100,250],[70,280],[1,300]...] } highest first
    slots: slots.rows.map(s => ({ k: String(s.slot_id), label: s.slot_name, n: s.dishes_allowed,
      from: mcats.rows.filter(c => c.slot_id === s.slot_id).map(c => c.category_name) })),
    menu,
    addonDishes: addons.rows.filter(a => a.addon_type === 'Extra dish').map(a => ({
      k: a.category_name, label: a.addon_name.replace('One more ', '').replace(' dish', ''), p: a.price, addonId: a.addon_id })),
    addonServices: addons.rows.filter(a => a.addon_type === 'Service').map(a => ({
      k: String(a.addon_id), n: a.addon_name, p: a.price, basis: a.pricing_basis === 'per_head' ? 'head' : 'flat', max: a.max_quantity,
      note: a.pricing_basis === 'per_head' ? 'per guest, per round' : 'flat rate' })),
    paymentMethods: methods.rows.map(m => m.method_name),
    today: ymd(new Date())
  })
}))

// Dates the calendar should cross out.
app.get('/api/calendar', wrap(async (_req, res) => {
  const [b, c] = await Promise.all([
    q(`SELECT to_char(blocked_date,'YYYY-MM-DD') d FROM blocked_date`),
    q(`SELECT to_char(event_date,'YYYY-MM-DD') d FROM booking WHERE status_id = (SELECT status_id FROM booking_status WHERE status_name='Confirmed')`)
  ])
  res.json({ blocked: b.rows.map(r => r.d), confirmed: c.rows.map(r => r.d) })
}))

// ---------- reading bookings (shaped like the objects the React pages already use) ----------
const BOOKING_SQL = `
SELECT b.booking_id, b.booking_reference_no AS id, a.full_name AS c, et.type_name AS t,
  to_char(b.event_date,'YYYY-MM-DD') AS d, b.guest_count AS g, bs.status_name AS s, b.venue AS v,
  to_char(b.start_time,'HH24:MI') AS h, b.special_requests AS r, b.is_outside_city AS out, b.price_per_head AS rate,
  COALESCE((SELECT json_agg(json_build_object('slot', mc.slot_id, 'item', mi.item_name))
    FROM booking_menu_item x JOIN menu_item mi USING (menu_item_id) JOIN menu_category mc USING (menu_category_id)
    WHERE x.booking_id = b.booking_id), '[]') AS menu_rows,
  COALESCE((SELECT json_agg(json_build_object('addonId', ba.addon_id, 'name', ao.addon_name, 'type', ao.addon_type, 'cat', mc.category_name,
      'item', mi.item_name, 'qty', ba.quantity, 'unit', ba.unit_price, 'basis', ao.pricing_basis))
    FROM booking_addon ba JOIN add_on ao USING (addon_id)
    LEFT JOIN menu_item mi ON mi.menu_item_id = ba.menu_item_id
    LEFT JOIN menu_category mc ON mc.menu_category_id = mi.menu_category_id
    WHERE ba.booking_id = b.booking_id), '[]') AS addon_rows,
  COALESCE((SELECT json_agg(json_build_object('m', pm.method_name, 'a', p.amount, 'd', to_char(p.payment_date,'YYYY-MM-DD')) ORDER BY p.payment_date, p.payment_id)
    FROM payment p JOIN payment_method pm USING (method_id) WHERE p.booking_id = b.booking_id), '[]') AS pay
FROM booking b
JOIN account a ON a.account_id = b.client_id
JOIN event_type et USING (event_type_id)
JOIN booking_status bs USING (status_id)`

function shape(r) {
  const menu = {}
  r.menu_rows.forEach(m => (menu[m.slot] ||= []).push(m.item))
  const addons = { dishes: {}, services: {} }
  let extras = 0
  r.addon_rows.forEach(x => {
    extras += x.unit * x.qty * (x.basis === 'per_head' ? r.g : 1)
    if (x.type === 'Extra dish') addons.dishes[x.cat] = x.item
    else addons.services[x.addonId] = x.qty
  })
  const addonLines = r.addon_rows.map(x => ({ type: x.type, name: x.name, item: x.item, qty: x.qty,
    cost: x.unit * x.qty * (x.basis === 'per_head' ? r.g : 1) }))
  const paid = r.pay.reduce((s, p) => s + p.a, 0)
  const total = r.rate * r.g + extras
  return { id: r.id, c: r.c, t: r.t, d: r.d, g: r.g, s: r.s, v: r.v, h: r.h, r: r.r, out: r.out,
    menu, addons, addonLines, pay: r.pay, rate: r.rate, addonTotal: extras, total, paid }
}

app.get('/api/bookings', auth(), wrap(async (req, res) => {
  const mine = req.user.role.toLowerCase() !== 'admin'
  const r = await q(`${BOOKING_SQL} ${mine ? 'WHERE b.client_id = $1' : ''} ORDER BY b.booking_id`, mine ? [req.user.id] : [])
  res.json(r.rows.map(shape))
}))

// ---------- creating a booking ----------
app.post('/api/bookings', auth('client'), wrap(async (req, res) => {
  const b = req.body, guests = parseInt(b.guests, 10)
  const cn = await pool.connect()
  try {
    // event type, minimum guests and price per head all come from the database, never from the browser
    const et = (await cn.query(`SELECT et.event_type_id, et.event_category_id, ec.min_guests FROM event_type et
      JOIN event_category ec USING (event_category_id) WHERE et.type_name = $1`, [b.eventType])).rows[0]
    if (!et) return fail(res, 400, 'Unknown event type.')
    if (!(guests >= et.min_guests)) return fail(res, 400, `This event needs at least ${et.min_guests} guests.`)
    if (!b.venue?.trim()) return fail(res, 400, 'Venue is required.')
    if (!b.date || b.date < ymd(new Date())) return fail(res, 400, 'Pick a future date.')
    const off = await cn.query(`SELECT 1 FROM blocked_date WHERE blocked_date = $1
      UNION SELECT 1 FROM booking WHERE event_date = $1 AND status_id = (SELECT status_id FROM booking_status WHERE status_name='Confirmed')`, [b.date])
    if (off.rowCount) return fail(res, 409, 'That date is no longer available.')
    const rate = (await cn.query(`SELECT price_per_head FROM pricing_rate WHERE event_category_id = $1 AND min_guests <= $2
      ORDER BY min_guests DESC LIMIT 1`, [et.event_category_id, guests])).rows[0].price_per_head

    // menu: exactly the allowed number of dishes per slot, each from that slot's categories
    const slots = (await cn.query(`SELECT slot_id, dishes_allowed FROM menu_slot`)).rows
    const dishRows = (await cn.query(`SELECT mi.menu_item_id, mi.item_name, mc.slot_id, mc.category_name, mc.menu_category_id
      FROM menu_item mi JOIN menu_category mc USING (menu_category_id) WHERE mi.is_available`)).rows
    const menuIds = [], chosenNames = new Set()
    for (const s of slots) {
      const names = b.menu?.[s.slot_id] || []
      if (new Set(names).size !== s.dishes_allowed) return fail(res, 400, 'Please complete your menu.')
      for (const n of names) {
        const d = dishRows.find(x => x.slot_id === s.slot_id && x.item_name === n)
        if (!d) return fail(res, 400, `Invalid dish: ${n}`)
        menuIds.push(d.menu_item_id); chosenNames.add(n)
      }
    }

    // add-ons
    const addons = (await cn.query(`SELECT * FROM add_on`)).rows
    const lines = []   // { addon_id, menu_item_id, quantity, unit_price }
    for (const [cat, name] of Object.entries(b.addons?.dishes || {})) {
      const ao = addons.find(a => a.addon_type === 'Extra dish' && dishRows.find(d => d.menu_category_id === a.menu_category_id)?.category_name === cat)
      const d = dishRows.find(x => x.category_name === cat && x.item_name === name)
      if (!ao || !d || chosenNames.has(name)) return fail(res, 400, `Invalid extra dish: ${name}`)
      lines.push({ addon_id: ao.addon_id, menu_item_id: d.menu_item_id, quantity: 1, unit_price: ao.price })
    }
    for (const [id, qty] of Object.entries(b.addons?.services || {})) {
      const ao = addons.find(a => a.addon_id === +id && a.addon_type === 'Service')
      if (!ao || !(qty > 0) || qty > ao.max_quantity) return fail(res, 400, 'Invalid add-on.')
      lines.push({ addon_id: ao.addon_id, menu_item_id: null, quantity: qty, unit_price: ao.price })
    }
    const extras = lines.reduce((s, l) => s + l.unit_price * l.quantity * (addons.find(a => a.addon_id === l.addon_id).pricing_basis === 'per_head' ? guests : 1), 0)
    const total = rate * guests + extras

    const method = (await cn.query(`SELECT method_id FROM payment_method WHERE method_name = $1`, [b.paymentMethod])).rows[0]
    if (!method) return fail(res, 400, 'Unknown payment method.')

    await cn.query('BEGIN')
    const ins = await cn.query(`INSERT INTO booking (client_id, event_type_id, status_id, event_date, start_time, venue, guest_count,
        price_per_head, is_outside_city, special_requests)
      VALUES ($1,$2,(SELECT status_id FROM booking_status WHERE status_name='Pending'),$3,$4,$5,$6,$7,$8,$9) RETURNING booking_id`,
      [req.user.id, et.event_type_id, b.date, b.startTime || '11:00', b.venue.trim(), guests, rate, !!b.outside, b.requests || null])
    const bid = ins.rows[0].booking_id
    await cn.query(`UPDATE booking SET booking_reference_no = $2 WHERE booking_id = $1`, [bid, 'PCS-' + (1000 + bid)])
    for (const id of menuIds) await cn.query(`INSERT INTO booking_menu_item VALUES ($1,$2)`, [bid, id])
    for (const l of lines) await cn.query(`INSERT INTO booking_addon (booking_id, addon_id, menu_item_id, quantity, unit_price) VALUES ($1,$2,$3,$4,$5)`,
      [bid, l.addon_id, l.menu_item_id, l.quantity, l.unit_price])
    await cn.query(`INSERT INTO payment (booking_id, method_id, amount) VALUES ($1,$2,$3)`, [bid, method.method_id, Math.round(total * 0.3)])  // 30% down payment
    await cn.query('COMMIT')
    const out = await q(`${BOOKING_SQL} WHERE b.booking_id = $1`, [bid])
    res.json(shape(out.rows[0]))
  } catch (e) {
    await cn.query('ROLLBACK').catch(() => {})
    throw e
  } finally { cn.release() }
}))

// ---------- payments ----------
// Client pays the remaining balance (simulated, like the prototype).
app.post('/api/bookings/:ref/payments', auth('client'), wrap(async (req, res) => {
  const r = await q(`${BOOKING_SQL} WHERE b.booking_reference_no = $1 AND b.client_id = $2`, [req.params.ref, req.user.id])
  if (!r.rowCount) return fail(res, 404, 'Booking not found.')
  const b = shape(r.rows[0]), bal = b.total - b.paid
  if (bal <= 0) return fail(res, 400, 'Already fully paid.')
  const m = await q(`SELECT method_id FROM payment_method WHERE method_name = $1`, [req.body.method])
  if (!m.rowCount) return fail(res, 400, 'Unknown payment method.')
  await q(`INSERT INTO payment (booking_id, method_id, amount) VALUES ($1,$2,$3)`, [r.rows[0].booking_id, m.rows[0].method_id, bal])
  res.json(shape((await q(`${BOOKING_SQL} WHERE b.booking_id = $1`, [r.rows[0].booking_id])).rows[0]))
}))

// ---------- admin: confirm / cancel ----------
app.patch('/api/bookings/:ref/status', auth('admin'), wrap(async (req, res) => {
  const { status } = req.body
  if (!['Pending', 'Confirmed', 'Cancelled', 'Completed'].includes(status)) return fail(res, 400, 'Invalid status.')
  try {
    const r = await q(`UPDATE booking SET status_id = (SELECT status_id FROM booking_status WHERE status_name = $1),
        confirmed_by = CASE WHEN $1 = 'Confirmed' THEN $2::int ELSE confirmed_by END
      WHERE booking_reference_no = $3 RETURNING booking_id`, [status, req.user.id, req.params.ref])
    if (!r.rowCount) return fail(res, 404, 'Booking not found.')
    res.json(shape((await q(`${BOOKING_SQL} WHERE b.booking_id = $1`, [r.rows[0].booking_id])).rows[0]))
  } catch (e) {
    if (e.code === '23505') return fail(res, 409, 'Another booking is already confirmed for that date.')  // one_confirmed_booking_per_date
    throw e
  }
}))

app.listen(process.env.PORT || 4000, () => console.log(`API running on http://localhost:${process.env.PORT || 4000}`))
