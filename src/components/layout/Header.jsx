// The top nav changes with the account type: guest, client, or admin.
const LINKS = {
  guest: [['home', 'Home'], ['menu', 'Menu & Rates'], ['login', 'Login']],
  client: [['home', 'Home'], ['menu', 'Menu & Rates'], ['calendar', 'Book'], ['my-bookings', 'My Bookings'], ['payments', 'Payments']],
  admin: [['home', 'Home'], ['dashboard', 'Dashboard'], ['bookings', 'Bookings'], ['admin-payments', 'Payments']]
}

export default function Header({ user, page, onLogout }) {
  const on = k => page === k || (k === 'calendar' && ['book', 'confirm'].includes(page))
  return (
    <header>
      <div className="nav">
        {/* Replace the P badge with <img src="/images/logo/logo.png" /> */}
        <a className="brand" href="#home"><span className="logo">P</span>Pastora’s Catering</a>
        {LINKS[user ? user.role : 'guest'].map(([k, n]) => <a key={k} className={`l ${on(k) ? 'on' : ''}`} href={`#${k}`}>{n}</a>)}
        {user && <><span className="chip">{user.name}</span><a className="l" href="#home" onClick={onLogout}>Log out</a></>}
      </div>
    </header>
  )
}
