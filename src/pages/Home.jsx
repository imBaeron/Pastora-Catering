import Carousel from '../components/common/Carousel'

export default function Home({ user, bookings }) {
  const admin = user?.role === 'admin'
  const pending = bookings.filter(b => b.s === 'Pending').length
  return (
    <div className="wrap">
      <div className="hero">
        <div>
          <h1>{admin ? 'Welcome back to Pastora’s' : 'Celebrate every occasion with Pastora’s'}</h1>
          <p>{admin
            ? 'Review new booking requests, confirm events, and track payments from your dashboard.'
            : 'Bilao meals, desserts, and full-service catering for weddings, birthdays, and corporate events in Calbayog City. Pick a date, choose a package, and book online.'}</p>
          {admin
            ? <a className="btn" href="#dashboard">Open dashboard</a>
            : <><a className="btn" href="#calendar">Book Now</a>{' '}<a className="btn alt" href="#packages">See packages</a></>}
          {admin && pending > 0 && <p className="lg">{pending} booking request{pending > 1 ? 's' : ''} waiting for review.</p>}
        </div>
        <Carousel />
      </div>
      {!admin && <>
        <h2>How booking works</h2>
        <div className="grid">
          <div className="card"><h3>1. Pick a date</h3>See which dates are open on the calendar.</div>
          <div className="card"><h3>2. Fill in your event</h3>Choose a package, guest count, and add-ons.</div>
          <div className="card"><h3>3. Pay and confirm</h3>Pay a down payment and wait for Pastora’s to confirm.</div>
        </div>
      </>}
    </div>
  )
}
