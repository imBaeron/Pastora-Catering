import Carousel from '../components/common/Carousel'
import RateTable from '../components/common/RateTable'
import Inclusions from '../components/common/Inclusions'

export default function Home({ user, bookings }) {
  const admin = user?.role === 'admin'
  const pending = bookings.filter(b => b.s === 'Pending').length
  return (
    <div className="wrap">
      <div className="hero">
        <div>
          <h1>{admin ? 'Welcome back to Pastora’s' : 'Good food for every celebration'}</h1>
          <p>{admin
            ? 'Review new booking requests, confirm events, and track payments from your dashboard.'
            : 'Pastora’s Catering serves birthdays, fiestas, baptisms, blessings, and weddings in Calbayog City. Build your own menu, pick a date, and book online.'}</p>
          {admin
            ? <a className="btn" href="#dashboard">Open dashboard</a>
            : <><a className="btn" href="#calendar">Book Now</a>{' '}<a className="btn alt" href="#menu">See menu and rates</a></>}
          {admin && pending > 0 && <p className="lg">{pending} booking request{pending > 1 ? 's' : ''} waiting for review.</p>}
        </div>
        <Carousel />
      </div>
      {!admin && <>
        <h2>Our rates</h2>
        <p>Rates are per head and depend on your event type and number of guests.</p>
        <RateTable />
        <h2 style={{ marginTop: 32 }}>What’s included</h2>
        <Inclusions />
        <p><a className="btn alt" href="#menu">See the full menu</a></p>
        <h2 style={{ marginTop: 32 }}>How booking works</h2>
        <div className="grid">
          <div className="card"><h3>1. Pick a date</h3>See which dates are open on the calendar.</div>
          <div className="card"><h3>2. Build your menu</h3>Choose your dishes from our menu and enter your guest count.</div>
          <div className="card"><h3>3. Pay and confirm</h3>Pay a down payment and wait for Pastora’s to confirm.</div>
        </div>
      </>}
    </div>
  )
}
