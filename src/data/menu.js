export const MENU = {
  Beef: ['Caldereta', 'Beef w/ Cream and Mushroom', 'Beef Steak Tagalog', 'Garlic Pepper Beef', 'Beef Salpicao'],
  Pork: ['Pork Steak', 'Pork Menudo', 'Sweet and Sour Pork', 'Pork Humba', 'Pork Tonkatsu', 'Sweet and Spicy Pork Ribs', 'Breaded Pork Chop'],
  Chicken: ['Buttered Chicken', 'Fried Chicken with Gravy Sauce', 'Chicken Teriyaki', 'BBQ Buffalo Wings', 'Chicken Afritada', 'Chicken Fillet', 'Chicken Roll'],
  Seafood: ['Mixed Seafood', 'Garlic Shrimp', 'Calamares', 'Camaron Rebusado', 'Sweet and Sour Fish'],
  Noodles: ['Spaghetti', 'Carbonara', 'Pancit Canton', 'Pancit Bam-i', 'Special Bihon', 'Sotanghon Guisado'],
  Kakanin: ['Choco Moron', 'Latik', 'Kurukod (Tango)', 'Puto', 'Pitchi Pitchi'],
  Dessert: ['Fruit Salad', 'Mango Tapioca', 'Buko Pandan', 'Coffee Jelly', 'Mango Crepe']
}
// What every event includes: the client picks n dishes for each slot.
export const SLOTS = [
  { k: 'beef', label: 'Beef', n: 1, from: ['Beef'] },
  { k: 'porkSea', label: 'Pork or seafood', n: 1, from: ['Pork', 'Seafood'] },
  { k: 'chicken', label: 'Chicken', n: 1, from: ['Chicken'] },
  { k: 'pasta', label: 'Pasta', n: 1, from: ['Noodles'] },
  { k: 'kakanin', label: 'Kakanin', n: 2, from: ['Kakanin'] },
  { k: 'dessert', label: 'Dessert', n: 1, from: ['Dessert'] }]
export const FOOD_EXTRAS = ['Rice', '1 round of softdrinks', 'Purified water service']
export const SERVICE = ['Buffet skirting', 'Chair covers', 'Table covers', 'Chair ribbons', 'Table centerpiece', 'Plates, utensils, and goblets', 'Uniformed waiters']
export const SLIDES = [['Lechon belly', '#F2E2C7'], ['Bilao pancit', '#D6A45D'], ['Dessert platter', '#c98f4a']]
export const DEFAULT_MENU = { beef: ['Caldereta'], porkSea: ['Pork Menudo'], chicken: ['Fried Chicken with Gravy Sauce'], pasta: ['Spaghetti'], kakanin: ['Puto', 'Latik'], dessert: ['Buko Pandan'] }
