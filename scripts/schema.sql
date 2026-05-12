-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
DO $$ BEGIN CREATE TYPE user_role AS ENUM ('customer', 'admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'ready', 'completed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE payment_method AS ENUM ('cash'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID          PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT          NOT NULL DEFAULT '',
  email         TEXT          NOT NULL UNIQUE,
  avatar_url    TEXT,
  role          user_role     NOT NULL DEFAULT 'customer',
  password_hash TEXT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.raw_user_meta_data->>'avatar_url', 'customer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();

-- addresses
CREATE TABLE IF NOT EXISTS addresses (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label        TEXT        NOT NULL DEFAULT 'Home',
  full_address TEXT        NOT NULL,
  is_default   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- categories
CREATE TABLE IF NOT EXISTS categories (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT        NOT NULL,
  slug       TEXT        NOT NULL UNIQUE,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Coffee','coffee',1),('Signature Lattes','signature-lattes',2),
  ('Rice Meals','rice-meals',3),('Desserts','desserts',4)
ON CONFLICT (slug) DO NOTHING;

-- menu_items
CREATE TABLE IF NOT EXISTS menu_items (
  id          UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID           NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name        TEXT           NOT NULL,
  description TEXT           NOT NULL DEFAULT '',
  price       NUMERIC(10,2)  NOT NULL CHECK (price >= 0),
  image_url   TEXT,
  is_available BOOLEAN       NOT NULL DEFAULT TRUE,
  is_sold_out  BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_availability ON menu_items(is_available, is_sold_out);

-- item_customizations
CREATE TABLE IF NOT EXISTS item_customizations (
  id           UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID     NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE UNIQUE,
  sizes        TEXT[]   NOT NULL DEFAULT ARRAY['small','medium','large'],
  sugar_levels TEXT[]   NOT NULL DEFAULT ARRAY['less sweet','normal','extra sweet'],
  temperatures TEXT[]   NOT NULL DEFAULT ARRAY['hot','iced']
);

-- orders
CREATE TABLE IF NOT EXISTS orders (
  id               UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id      UUID           NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  status           order_status   NOT NULL DEFAULT 'pending',
  payment_method   payment_method NOT NULL DEFAULT 'cash',
  total_amount     NUMERIC(10,2)  NOT NULL CHECK (total_amount >= 0),
  delivery_address TEXT,
  order_notes      TEXT,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- order_items
CREATE TABLE IF NOT EXISTS order_items (
  id           UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id     UUID          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID          NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
  quantity     INTEGER       NOT NULL CHECK (quantity > 0),
  unit_price   NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  size         TEXT,
  sugar_level  TEXT,
  temperature  TEXT
);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON order_items(menu_item_id);

-- promo_banner
CREATE TABLE IF NOT EXISTS promo_banner (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  message    TEXT        NOT NULL DEFAULT '',
  is_active  BOOLEAN     NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO promo_banner (message, is_active)
VALUES ('Welcome to Brews Lee — order now and enjoy your favorite brew!', FALSE)
ON CONFLICT DO NOTHING;
CREATE OR REPLACE FUNCTION update_promo_banner_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;
DROP TRIGGER IF EXISTS promo_banner_updated_at ON promo_banner;
CREATE TRIGGER promo_banner_updated_at BEFORE UPDATE ON promo_banner FOR EACH ROW EXECUTE FUNCTION update_promo_banner_timestamp();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_banner ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$;

-- profiles policies
DROP POLICY IF EXISTS "profiles: read own or admin" ON profiles;
CREATE POLICY "profiles: read own or admin" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
DROP POLICY IF EXISTS "profiles: update own or admin" ON profiles;
CREATE POLICY "profiles: update own or admin" ON profiles FOR UPDATE USING (auth.uid() = id OR is_admin());
DROP POLICY IF EXISTS "profiles: insert own or admin" ON profiles;
CREATE POLICY "profiles: insert own or admin" ON profiles FOR INSERT WITH CHECK (auth.uid() = id OR is_admin());

-- addresses policies
DROP POLICY IF EXISTS "addresses: all own or admin" ON addresses;
CREATE POLICY "addresses: all own or admin" ON addresses FOR ALL USING (auth.uid() = user_id OR is_admin());
DROP POLICY IF EXISTS "addresses: insert own or admin" ON addresses;
CREATE POLICY "addresses: insert own or admin" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());

-- categories policies
DROP POLICY IF EXISTS "categories: public read" ON categories;
CREATE POLICY "categories: public read" ON categories FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "categories: admin write" ON categories;
CREATE POLICY "categories: admin write" ON categories FOR ALL USING (is_admin());

-- menu_items policies
DROP POLICY IF EXISTS "menu_items: public read" ON menu_items;
CREATE POLICY "menu_items: public read" ON menu_items FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "menu_items: admin write" ON menu_items;
CREATE POLICY "menu_items: admin write" ON menu_items FOR ALL USING (is_admin());

-- item_customizations policies
DROP POLICY IF EXISTS "item_customizations: public read" ON item_customizations;
CREATE POLICY "item_customizations: public read" ON item_customizations FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "item_customizations: admin write" ON item_customizations;
CREATE POLICY "item_customizations: admin write" ON item_customizations FOR ALL USING (is_admin());

-- orders policies
DROP POLICY IF EXISTS "orders: read own or admin" ON orders;
CREATE POLICY "orders: read own or admin" ON orders FOR SELECT USING (auth.uid() = customer_id OR is_admin());
DROP POLICY IF EXISTS "orders: customer insert" ON orders;
CREATE POLICY "orders: customer insert" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
DROP POLICY IF EXISTS "orders: admin update" ON orders;
CREATE POLICY "orders: admin update" ON orders FOR UPDATE USING (is_admin());

-- order_items policies
DROP POLICY IF EXISTS "order_items: read own or admin" ON order_items;
CREATE POLICY "order_items: read own or admin" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.customer_id = auth.uid() OR is_admin()))
);
DROP POLICY IF EXISTS "order_items: customer insert" ON order_items;
CREATE POLICY "order_items: customer insert" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
);

-- promo_banner policies
DROP POLICY IF EXISTS "promo_banner: public read" ON promo_banner;
CREATE POLICY "promo_banner: public read" ON promo_banner FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "promo_banner: admin write" ON promo_banner;
CREATE POLICY "promo_banner: admin write" ON promo_banner FOR ALL USING (is_admin());

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE promo_banner;
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
