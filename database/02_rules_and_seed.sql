-- Run AFTER creating the tables (dbdiagram.io: Export > PostgreSQL).
-- Assumes empty tables, so the ids below start at 1.

-- ---------- Starter data ----------
INSERT INTO role (role_name) VALUES ('Client'), ('Admin');
INSERT INTO booking_status (status_name) VALUES ('Pending'), ('Confirmed'), ('Cancelled'), ('Completed');  -- Confirmed = 2
INSERT INTO payment_method (method_name) VALUES ('Cash'), ('GCash'), ('Bank Transfer');

INSERT INTO event_category (category_name, min_guests) VALUES ('Standard', 1), ('Special', 70);
INSERT INTO event_type (event_category_id, type_name) VALUES
  (1, 'Birthday'), (1, 'Fiesta'), (1, 'Baptism'), (1, 'Dedication'), (1, 'House/Office Blessing'), (1, 'Other'),
  (2, 'Wedding'), (2, 'Special Event');
INSERT INTO pricing_rate (event_category_id, min_guests, price_per_head) VALUES
  (1, 0, 300), (1, 70, 280), (1, 100, 250),
  (2, 70, 350), (2, 100, 300);

INSERT INTO menu_slot (slot_name, dishes_allowed) VALUES
  ('Beef', 1), ('Pork or seafood', 1), ('Chicken', 1), ('Pasta', 1), ('Kakanin', 2), ('Dessert', 1);
INSERT INTO menu_category (slot_id, category_name) VALUES
  (1, 'Beef'), (2, 'Pork'), (2, 'Seafood'), (3, 'Chicken'), (4, 'Noodles'), (5, 'Kakanin'), (6, 'Dessert');

-- Add-ons (prices are estimates: confirm with Pastora's). Category ids follow the menu_category inserts above.
INSERT INTO add_on (addon_name, addon_type, menu_category_id, price, pricing_basis, max_quantity) VALUES
  ('One more beef dish',    'Extra dish', 1, 50, 'per_head', 1),
  ('One more pork dish',    'Extra dish', 2, 40, 'per_head', 1),
  ('One more seafood dish', 'Extra dish', 3, 60, 'per_head', 1),
  ('One more chicken dish', 'Extra dish', 4, 35, 'per_head', 1),
  ('One more pasta dish',   'Extra dish', 5, 25, 'per_head', 1),
  ('One more kakanin dish', 'Extra dish', 6, 15, 'per_head', 1),
  ('One more dessert dish', 'Extra dish', 7, 25, 'per_head', 1);
INSERT INTO add_on (addon_name, addon_type, price, pricing_basis, max_quantity) VALUES
  ('Extra waiter',              'Service',  600, 'flat',     5),
  ('Extra round of softdrinks', 'Service',   30, 'per_head', 3),
  ('Sound system',              'Service', 2500, 'flat',     1),
  ('Celebration cake',          'Service', 1500, 'flat',     1);

-- ---------- Rules the database enforces ----------
-- Only one Confirmed booking per event date (status_id 2 = Confirmed).
CREATE UNIQUE INDEX one_confirmed_booking_per_date ON booking (event_date) WHERE status_id = 2;

ALTER TABLE booking ADD CONSTRAINT guest_count_positive CHECK (guest_count > 0);
ALTER TABLE booking ADD CONSTRAINT price_positive CHECK (price_per_head > 0);
ALTER TABLE add_on ADD CONSTRAINT addon_price_positive CHECK (price > 0);
ALTER TABLE add_on ADD CONSTRAINT addon_basis_valid CHECK (pricing_basis IN ('per_head', 'flat'));
ALTER TABLE booking_addon ADD CONSTRAINT addon_quantity_positive CHECK (quantity > 0);
-- Backend also checks: quantity <= add_on.max_quantity; an Extra dish add-on must include a menu_item_id
-- from that add-on's menu_category, and it must not repeat a dish already chosen for the booking.
ALTER TABLE payment ADD CONSTRAINT amount_positive CHECK (amount > 0);
ALTER TABLE pricing_rate ADD CONSTRAINT rate_positive CHECK (price_per_head > 0);

-- ---------- Price lookup (use $1 = event_category_id, $2 = guest count) ----------
-- SELECT price_per_head FROM pricing_rate
-- WHERE event_category_id = $1 AND min_guests <= $2
-- ORDER BY min_guests DESC LIMIT 1;

-- ---------- Dashboard examples ----------
-- Balance per booking:
-- Booking total = food + add-ons:
-- SELECT b.booking_id,
--   b.guest_count * b.price_per_head
--   + COALESCE((SELECT SUM(ba.unit_price * ba.quantity * CASE WHEN a.pricing_basis = 'per_head' THEN b.guest_count ELSE 1 END)
--               FROM booking_addon ba JOIN add_on a ON a.addon_id = ba.addon_id WHERE ba.booking_id = b.booking_id), 0) AS total
-- FROM booking b;
-- Revenue by payment method:
-- SELECT m.method_name, SUM(p.amount) FROM payment p JOIN payment_method m ON m.method_id = p.method_id GROUP BY m.method_name;
