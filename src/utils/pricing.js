import { rate, catOf } from '../data/rates'
import { ADDON_DISHES, ADDON_SERVICES } from '../data/addOns'

export const perHead = b => rate(catOf(b.t), b.g)
// b.addons = { dishes: { Beef: 'Beef Salpicao' }, services: { waiter: 2 } }
export const addonTotal = b => {
  const { dishes = {}, services = {} } = b.addons || {}
  const d = Object.keys(dishes).reduce((s, c) => s + ADDON_DISHES.find(a => a.k === c).p * b.g, 0)
  const v = Object.entries(services).reduce((s, [k, q]) => {
    const a = ADDON_SERVICES.find(x => x.k === k)
    return s + a.p * q * (a.basis === 'head' ? b.g : 1)
  }, 0)
  return d + v
}
export const tot = b => perHead(b) * b.g + addonTotal(b)
export const paid = b => b.pay.reduce((s, x) => s + x.a, 0)
