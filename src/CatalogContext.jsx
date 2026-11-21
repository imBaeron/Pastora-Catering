// Loads the menu, rates, add-ons and payment methods from the API once and shares them with every page.
import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'

const Ctx = createContext(null)
// eslint-disable-next-line react-refresh/only-export-components
export const useCatalog = () => useContext(Ctx)

// Builds the "Guest count | Standard | Special" rows shown on the Menu page from the pricing_rate table.
function rateTable(c) {
  const mins = [...new Set(Object.values(c.rates).flat().map(r => r[0]))].sort((a, b) => b - a)
  const cell = (cat, m) => {
    if (Math.max(m, 1) < c.minGuests[cat]) return `Minimum of ${c.minGuests[cat]} pax`
    const tier = c.rates[cat].find(([min]) => m >= min)
    return `₱${tier[1]} per head`
  }
  return mins.map((m, i) => {
    const label = i === 0 ? `${m} pax and above` : m === 0 ? `Below ${mins[i - 1]} pax` : `${m} to ${mins[i - 1] - 1} pax`
    return [label, cell('Standard', m), cell('Special', m)]
  })
}

export function CatalogProvider({ children }) {
  const [c, setC] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => { api.catalog().then(setC).catch(e => setErr(e.message)) }, [])
  if (err) return <p className="err" style={{ padding: 24 }}>Cannot reach the server: {err}. Is the API running?</p>
  if (!c) return <p style={{ padding: 24 }}>Loading…</p>

  const catOf = t => (c.eventTypes.find(e => e[0] === t) || [0, 'Standard'])[1]
  const rate = (cat, g) => (c.rates[cat].find(([min]) => g >= min) || c.rates[cat].at(-1))[1]
  return <Ctx.Provider value={{ ...c, catOf, rate, RATE_TABLE: rateTable(c) }}>{children}</Ctx.Provider>
}
