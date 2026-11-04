import { useState } from 'react'
import useHash from './hooks/useHash'
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
import { SEED } from './data/bookings'
import { ACCOUNTS } from './data/accounts'

// role: who may open the page (omit = anyone)
const ROUTES = {
  home: { V: Home }, menu: { V: Menu }, login: { V: Login },
  calendar: { V: Calendar, role: 'client' }, book: { V: Booking, role: 'client' }, confirm: { V: Confirmation, role: 'client' },
  'my-bookings': { V: MyBookings, role: 'client' }, payments: { V: Payments, role: 'client' },
  dashboard: { V: Dashboard, role: 'admin' }, bookings: { V: AdminBookings, role: 'admin' }, 'admin-payments': { V: AdminPayments, role: 'admin' }
}

export default function App() {
  const h = useHash()
  const [user, setUser] = useState(null)
  const [accounts, setAccounts] = useState(ACCOUNTS)
  const [bookings, setBookings] = useState(SEED)
  const [date, setDate] = useState(null)
  const [last, setLast] = useState(null)
  const go = p => { location.hash = p }

  let page = ROUTES[h] ? h : 'home', redirect = null
  const need = ROUTES[page].role
  if (need && !user) { redirect = page; page = 'login' }        // guests must log in first
  else if (need && user.role !== need) page = 'home'              // wrong account type
  if (page === 'book' && !date) page = 'calendar'
  if (page === 'confirm' && !last) page = 'home'

  const View = ROUTES[page].V
  return (
    <>
      <Header user={user} page={page} onLogout={() => setUser(null)} />
      <View {...{ user, setUser, accounts, setAccounts, bookings, setBookings, date, setDate, last, setLast, go, redirect }} />
      <Footer />
    </>
  )
}
