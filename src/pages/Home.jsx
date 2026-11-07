import Carousel from '../components/common/Carousel'
import RateTable from '../components/common/RateTable'
import Inclusions from '../components/common/Inclusions'
import Tile from '../components/common/Tile'
import { EVENT_TILES, FOOD_TILES, GALLERY, STORY_PIC } from '../data/images'
import { pic } from '../utils/placeholders'

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
        <section className="sec"><h2>We cater every celebration</h2>
          <div className="tiles">{EVENT_TILES.map(t => <Tile key={t.label} {...t} />)}</div></section>

        <section className="sec"><h2>Our rates</h2>
          <p>Rates are per head and depend on your event type and number of guests.</p>
          <RateTable /></section>

        <section className="sec"><h2>What’s included</h2><Inclusions /></section>

        <section className="sec"><h2>From our kitchen</h2>
          <div className="tiles">{FOOD_TILES.map(t => <Tile key={t.label} {...t} />)}</div>
          <p><a className="btn alt" href="#menu">See the full menu</a></p></section>

        <section className="sec split">
          <img src={pic(STORY_PIC.label, STORY_PIC.c, STORY_PIC.src)} alt={STORY_PIC.label} loading="lazy" />
          <div>
            <h2>Our story</h2>
            <p>Pastora’s Catering started four years ago as an online food stall selling desserts and bilao meals. As more families and organizations asked us to cater their events, we grew into a full catering service for Calbayog City and nearby areas.</p>
            <p>Today we serve celebrations of every size, with a menu you can build yourself.</p>
          </div>
        </section>

        <section className="sec"><h2>Recent events</h2>
          <div className="gal">{GALLERY.map((g, i) => <Tile key={g.label} {...g} className={i === 0 ? 'big' : ''} />)}</div></section>

        <section className="sec"><h2>How booking works</h2>
          <div className="grid">
            <div className="card"><h3>1. Pick a date</h3>See which dates are open on the calendar.</div>
            <div className="card"><h3>2. Build your menu</h3>Choose your dishes from our menu and enter your guest count.</div>
            <div className="card"><h3>3. Pay and confirm</h3>Pay a down payment and wait for Pastora’s to confirm.</div>
          </div>
          <p><a className="btn" href="#calendar">Book Now</a></p></section>
      </>}
    </div>
  )
}
