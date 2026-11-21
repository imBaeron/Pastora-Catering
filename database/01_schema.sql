-- Pastora's Catering: tables. Run FIRST, inside the "pastora-catering" database.
-- Matches your ERD, plus add_on and booking_addon (used by your rules/seed file but missing from the ERD image).

CREATE TABLE role (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  role_id INT NOT NULL REFERENCES role(role_id),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE event_category (
  event_category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(30) NOT NULL UNIQUE,
  min_guests INT NOT NULL
);

CREATE TABLE event_type (
  event_type_id SERIAL PRIMARY KEY,
  event_category_id INT NOT NULL REFERENCES event_category(event_category_id),
  type_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE pricing_rate (
  rate_id SERIAL PRIMARY KEY,
  event_category_id INT NOT NULL REFERENCES event_category(event_category_id),
  min_guests INT NOT NULL,
  price_per_head DECIMAL(10,2) NOT NULL
);

CREATE TABLE menu_slot (
  slot_id SERIAL PRIMARY KEY,
  slot_name VARCHAR(50) NOT NULL UNIQUE,
  dishes_allowed INT NOT NULL
);

CREATE TABLE menu_category (
  menu_category_id SERIAL PRIMARY KEY,
  slot_id INT NOT NULL REFERENCES menu_slot(slot_id),
  category_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE menu_item (
  menu_item_id SERIAL PRIMARY KEY,
  menu_category_id INT NOT NULL REFERENCES menu_category(menu_category_id),
  item_name VARCHAR(100) NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (menu_category_id, item_name)
);

CREATE TABLE booking_status (
  status_id SERIAL PRIMARY KEY,
  status_name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE payment_method (
  method_id SERIAL PRIMARY KEY,
  method_name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE blocked_date (
  blocked_date_id SERIAL PRIMARY KEY,
  created_by INT NOT NULL REFERENCES account(account_id),
  blocked_date DATE NOT NULL UNIQUE,
  reason VARCHAR(255)
);

CREATE TABLE booking (
  booking_id SERIAL PRIMARY KEY,
  booking_reference_no VARCHAR(30) UNIQUE,            -- 'PCS-1001', filled in by the API
  client_id INT NOT NULL REFERENCES account(account_id),
  event_type_id INT NOT NULL REFERENCES event_type(event_type_id),
  status_id INT NOT NULL REFERENCES booking_status(status_id),
  confirmed_by INT REFERENCES account(account_id),
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  venue VARCHAR(255) NOT NULL,
  guest_count INT NOT NULL,
  price_per_head DECIMAL(10,2) NOT NULL,              -- rate frozen at booking time
  is_outside_city BOOLEAN NOT NULL DEFAULT FALSE,
  special_requests TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE booking_menu_item (
  booking_id INT NOT NULL REFERENCES booking(booking_id) ON DELETE CASCADE,
  menu_item_id INT NOT NULL REFERENCES menu_item(menu_item_id),
  PRIMARY KEY (booking_id, menu_item_id)
);

CREATE TABLE add_on (
  addon_id SERIAL PRIMARY KEY,
  addon_name VARCHAR(100) NOT NULL,
  addon_type VARCHAR(20) NOT NULL,                    -- 'Extra dish' or 'Service'
  menu_category_id INT REFERENCES menu_category(menu_category_id),  -- only for Extra dish
  price DECIMAL(10,2) NOT NULL,
  pricing_basis VARCHAR(10) NOT NULL,                 -- 'per_head' or 'flat'
  max_quantity INT NOT NULL DEFAULT 1
);

CREATE TABLE booking_addon (
  booking_addon_id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL REFERENCES booking(booking_id) ON DELETE CASCADE,
  addon_id INT NOT NULL REFERENCES add_on(addon_id),
  menu_item_id INT REFERENCES menu_item(menu_item_id), -- the chosen dish for Extra dish add-ons
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL                    -- price frozen at booking time
);

CREATE TABLE payment (
  payment_id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL REFERENCES booking(booking_id),
  method_id INT NOT NULL REFERENCES payment_method(method_id),
  received_by INT REFERENCES account(account_id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
  reference_no VARCHAR(50),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'Paid'
);

CREATE INDEX idx_booking_client ON booking(client_id);
CREATE INDEX idx_booking_date ON booking(event_date);
CREATE INDEX idx_payment_booking ON payment(booking_id);
