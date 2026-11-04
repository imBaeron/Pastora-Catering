// Pastora's rates. Event type decides the category; category + guest count decide the price per head.
export const EVENT_TYPES = [
  ['Birthday', 'standard'], ['Fiesta', 'standard'], ['Baptism', 'standard'], ['Dedication', 'standard'],
  ['House/Office Blessing', 'standard'], ['Other', 'standard'],
  ['Wedding', 'special'], ['Special Event', 'special']]
export const catOf = t => (EVENT_TYPES.find(e => e[0] === t) || [0, 'standard'])[1]
export const MIN_GUESTS = { standard: 1, special: 70 }   // no special-event rate was given below 70 pax

// [minimum guests, price per head], checked from the top
const RATES = { standard: [[100, 250], [70, 280], [0, 300]], special: [[100, 300], [0, 350]] }
export const rate = (cat, g) => RATES[cat].find(([min]) => g >= min)[1]

export const RATE_TABLE = [
  ['100 pax and above', '₱250 per head', '₱300 per head'],
  ['70 to 99 pax', '₱280 per head', '₱350 per head'],
  ['Below 70 pax', '₱300 per head', 'Minimum of 70 pax']]
