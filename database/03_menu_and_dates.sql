-- Run THIRD. Menu dishes (from src/data/menu.js). Category ids follow 02_rules_and_seed.sql:
-- 1 Beef, 2 Pork, 3 Seafood, 4 Chicken, 5 Noodles, 6 Kakanin, 7 Dessert
INSERT INTO menu_item (menu_category_id, item_name) VALUES
  (1,'Caldereta'),(1,'Beef w/ Cream and Mushroom'),(1,'Beef Steak Tagalog'),(1,'Garlic Pepper Beef'),(1,'Beef Salpicao'),
  (2,'Pork Steak'),(2,'Pork Menudo'),(2,'Sweet and Sour Pork'),(2,'Pork Humba'),(2,'Pork Tonkatsu'),(2,'Sweet and Spicy Pork Ribs'),(2,'Breaded Pork Chop'),
  (3,'Mixed Seafood'),(3,'Garlic Shrimp'),(3,'Calamares'),(3,'Camaron Rebusado'),(3,'Sweet and Sour Fish'),
  (4,'Buttered Chicken'),(4,'Fried Chicken with Gravy Sauce'),(4,'Chicken Teriyaki'),(4,'BBQ Buffalo Wings'),(4,'Chicken Afritada'),(4,'Chicken Fillet'),(4,'Chicken Roll'),
  (5,'Spaghetti'),(5,'Carbonara'),(5,'Pancit Canton'),(5,'Pancit Bam-i'),(5,'Special Bihon'),(5,'Sotanghon Guisado'),
  (6,'Choco Moron'),(6,'Latik'),(6,'Kurukod (Tango)'),(6,'Puto'),(6,'Pitchi Pitchi'),
  (7,'Fruit Salad'),(7,'Mango Tapioca'),(7,'Buko Pandan'),(7,'Coffee Jelly'),(7,'Mango Crepe');
