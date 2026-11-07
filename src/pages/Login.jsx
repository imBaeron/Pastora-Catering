import { useState } from 'react'
import { LOGIN_PIC } from '../data/images'
import { pic } from '../utils/placeholders'

// One login for everyone. The account's role decides which interface appears.
export default function Login({ accounts, setAccounts, setUser, go, redirect }) {
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const set = (k, v) => setF({ ...f, [k]: v })
  const signIn = a => { setUser(a); go(redirect || 'home') }

  const submit = e => {
    e.preventDefault()
    const email = f.email.trim().toLowerCase()
    if (mode === 'login') {
      const a = accounts.find(x => x.email === email && x.password === f.password)
      return a ? signIn(a) : setErr('Incorrect email or password.')
    }
    if (accounts.some(x => x.email === email)) return setErr('An account with this email already exists.')
    const a = { name: f.name.trim(), email, password: f.password, role: 'client' }
    setAccounts([...accounts, a]); signIn(a)
  }

  return (
    <div className="wrap">
      <div className="split" style={{ maxWidth: 880, margin: 'auto' }}>
      <img className="login-img" src={pic(LOGIN_PIC.label, LOGIN_PIC.c, LOGIN_PIC.src)} alt={LOGIN_PIC.label} />
      <form className="card" onSubmit={submit}>
        <h2>{mode === 'login' ? 'Log in' : 'Create an account'}</h2>
        {redirect && <p className="lg">Log in to continue.</p>}
        {mode === 'register' && <label>Full name<input required value={f.name} onChange={e => set('name', e.target.value)} /></label>}
        <label>Email<input type="email" required value={f.email} onChange={e => set('email', e.target.value)} /></label>
        <label>Password<input type="password" required value={f.password} onChange={e => set('password', e.target.value)} /></label>
        {err && <p className="err">{err}</p>}
        <p><button className="btn">{mode === 'login' ? 'Log in' : 'Register'}</button>{' '}
          <button type="button" className="btn alt" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr('') }}>
            {mode === 'login' ? 'Create an account' : 'I have an account'}</button></p>
        <p className="lg">Demo accounts: client@pastoras.com / client123 and admin@pastoras.com / admin123.</p>
      </form>
      </div>
    </div>
  )
}
