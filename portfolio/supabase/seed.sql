-- ========================================
-- SUPABASE SEED - Portfolio / Mercado App
-- Execute no SQL Editor do Supabase
-- ========================================

-- CRIAR TABELAS
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  google_id TEXT,
  phone TEXT DEFAULT '',
  company TEXT DEFAULT '',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT,
  name TEXT,
  phone TEXT,
  company TEXT DEFAULT '',
  delivery_time TEXT,
  features TEXT,
  value DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  delivery_confirmed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  type TEXT DEFAULT 'text',
  file_data TEXT,
  file_type TEXT
);

-- MERCADO APP: orders (supermercado)
CREATE TABLE IF NOT EXISTS mercado_orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]',
  delivery_name TEXT DEFAULT '',
  address TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  troco TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  total DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mercado_messages (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES mercado_orders(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  sender_role TEXT DEFAULT 'user',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADMIN PADRAO (senha: 45677VDTYT)
INSERT INTO users (id, name, email, password, phone, company, is_admin)
VALUES (1, 'Administrador', 'admin@gmail.com', '$2a$10$r1VcaxPNZWMEYmsPY8U6Z.AS6EttZpoKsFIrRoINyFZBfmUVQzh1K', '(11) 99999-0000', 'DevPro', true)
ON CONFLICT (id) DO NOTHING;
