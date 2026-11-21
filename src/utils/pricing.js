// Totals are calculated by the server (from the database) and arrive on each booking object.
export const perHead = b => b.rate
export const addonTotal = b => b.addonTotal
export const tot = b => b.total
export const paid = b => b.paid
