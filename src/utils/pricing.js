import { P } from '../data/packages'
import { A } from '../data/addOns'

export const tot = b => P[b.pkg].p * b.g + b.add.reduce((s, i) => s + A[i].p, 0)
export const paid = b => b.pay.reduce((s, x) => s + x.a, 0)
