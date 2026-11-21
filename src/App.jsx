import { useState, useEffect } from 'react'
import { api, hasToken, setToken } from './api'
import useHash from './hooks/useHash'
import useTheme from './hooks/useTheme'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Login from './pages/Login'
import Calendar from './pages/client/Calendar'
import Booking from './pages/client/Booking'
import Confirmation from './pages/client/Confirmation'
import MyBookings from './pages/client/MyBookings'
import Payments from './pages/client/Payments'
import Dashboard from './pages/admin/Dashboard'
import AdminBookings from './pages/admin/Bookings'
import AdminPayments from './pages/admin/Payments'

// role: who may open the page (omit = anyone)
const ROUTES = {
  home: { V: Home }, menu: { V: Menu }, login: { V: Login },
  calendar: { V: Calendar, role: 'client' }, book: { V: Booking, role: 'client' }, confirm: { V: Confirmation, role: 'client' },
  'my-bookings': { V: MyBookings, role: 'client' }, payments: { V: Payments, role: 'client' },
  dashboard: { V: Dashboard, role: 'admin' }, bookings: { V: AdminBookings, role: 'admin' }, 'admin-payments': { V: AdminPayments, role: 'admin' }
}

export default function App() {
  const h = useHash()
  const [theme, toggleTheme] = useTheme()
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(!hasToken())      // false while we restore a saved login
  const [bookings, setBookings] = useState([])
  const [date, setDate] = useState(null)
  const [last, setLast] = useState(null)
  const [menuTab, setMenuTab] = useState('rates')
  const go = p => { location.hash = p }

  // Restore the login after a page refresh.
  useEffect(() => {
    if (!hasToken()) return
    api.me().then(setUser).catch(() => setToken('')).finally(() => setReady(true))
  }, [])
  // Load this person's bookings (everyone's, for the admin) whenever someone logs in.
  useEffect(() => {
    if (user) api.bookings().then(setBookings).catch(() => setBookings([]))
  }, [user])
  const logout = () => { setToken(''); setBookings([]); setUser(null) }
  if (!ready) return <p style={{ padding: 24 }}>Loading…</p>

  let page = ROUTES[h] ? h : 'home', redirect = null
  const need = ROUTES[page].role
  if (need && !user) { redirect = page; page = 'login' }        // guests must log in first
  else if (need && user.role !== need) page = 'home'              // wrong account type
  if (page === 'book' && !date) page = 'calendar'
  if (page === 'confirm' && !last) page = 'home'

  const View = ROUTES[page].V
  return (
    <>
      <Header user={user} page={page} onLogout={logout} theme={theme} onToggleTheme={toggleTheme} />
      <View {...{ user, setUser, bookings, setBookings, date, setDate, last, setLast, menuTab, setMenuTab, go, redirect }} />
      <Footer />
    </>
  )
}
