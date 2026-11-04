import { rate, catOf } from '../data/rates'

export const perHead = b => rate(catOf(b.t), b.g)
export const tot = b => perHead(b) * b.g
export const paid = b => b.pay.reduce((s, x) => s + x.a, 0)
