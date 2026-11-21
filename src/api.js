// Put this at src/api.js. All talking to the server goes through here.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

let token = localStorage.getItem('pc_token') || ''
export const setToken = t => { token = t || ''; t ? localStorage.setItem('pc_token', t) : localStorage.removeItem('pc_token') }
export const hasToken = () => !!token

async function call(path, method = 'GET', body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

export const api = {
  catalog: () => call('/catalog'),
  calendar: () => call('/calendar'),
  login: (email, password) => call('/auth/login', 'POST', { email, password }),
  register: (name, email, password) => call('/auth/register', 'POST', { name, email, password }),
  me: () => call('/auth/me'),
  bookings: () => call('/bookings'),
  createBooking: b => call('/bookings', 'POST', b),
  pay: (ref, method) => call(`/bookings/${ref}/payments`, 'POST', { method }),
  setStatus: (ref, status) => call(`/bookings/${ref}/status`, 'PATCH', { status })
}
