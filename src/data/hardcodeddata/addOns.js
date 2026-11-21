// Optional add-ons. Prices are estimates: confirm them with Pastora's before launch.
// Extra dishes: one more dish per food type, priced per head. `k` matches the menu category.
export const ADDON_DISHES = [
  { k: 'Beef', label: 'beef', p: 50 },
  { k: 'Pork', label: 'pork', p: 40 },
  { k: 'Chicken', label: 'chicken', p: 35 },
  { k: 'Seafood', label: 'seafood', p: 60 },
  { k: 'Noodles', label: 'pasta', p: 25 },
  { k: 'Kakanin', label: 'kakanin', p: 15 },
  { k: 'Dessert', label: 'dessert', p: 25 }]
// Services: basis 'head' = price x guests x quantity, 'flat' = price x quantity.
export const ADDON_SERVICES = [
  { k: 'waiter', n: 'Extra waiter', p: 600, basis: 'flat', max: 5, note: 'per waiter' },
  { k: 'softdrinks', n: 'Extra round of softdrinks', p: 30, basis: 'head', max: 3, note: 'per guest, per round' },
  { k: 'sound', n: 'Sound system', p: 2500, basis: 'flat', max: 1, note: 'flat rate' },
  { k: 'cake', n: 'Celebration cake', p: 1500, basis: 'flat', max: 1, note: 'flat rate' }]
