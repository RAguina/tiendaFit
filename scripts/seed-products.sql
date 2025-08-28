BEGIN;

-- 1) Asegurar categorias base (con SLUG NOT NULL)
INSERT INTO categories (id, name, slug, updated_at)
VALUES
  ('CAT_EQUIP', 'Equipos',      'equipos',      NOW()),
  ('CAT_ROPA',  'Ropa',         'ropa',         NOW()),
  ('CAT_SUPLE', 'Suplementos',  'suplementos',  NOW())
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    updated_at = NOW();

-- 2) Productos (category_id NOT NULL) + upsert
INSERT INTO products
(id, name, description, price, image, stock, is_active, created_at, updated_at, category_id)
VALUES
('P001','Mancuernas Ajustables 20kg','Mancuernas ajustables de alta calidad, perfectas para entrenamientos en casa.',89.99,'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',50,true,NOW(),NOW(),'CAT_EQUIP'),
('P002','Barra Olimpica 20kg','Barra olimpica profesional de 20kg, ideal para levantamiento de pesas.',159.99,'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop',25,true,NOW(),NOW(),'CAT_EQUIP'),
('P003','Banco Ajustable Multifuncion','Banco ajustable multifuncion para ejercicios completos de fuerza.',199.99,'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',15,true,NOW(),NOW(),'CAT_EQUIP'),
('P004','Kettlebell 16kg','Kettlebell de hierro fundido de 16kg para entrenamientos funcionales.',45.99,'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',30,true,NOW(),NOW(),'CAT_EQUIP'),

('P005','Camiseta Deportiva Pro','Camiseta deportiva transpirable con tecnologia Dri-FIT.',24.99,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',100,true,NOW(),NOW(),'CAT_ROPA'),
('P006','Shorts de Entrenamiento','Shorts comodos y flexibles para cualquier tipo de entrenamiento.',32.99,'https://images.unsplash.com/photo-1506629905607-d0a94b3c2e94?w=400&h=300&fit=crop',75,true,NOW(),NOW(),'CAT_ROPA'),
('P007','Zapatillas Running Pro','Zapatillas profesionales para running con amortiguacion avanzada.',129.99,'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',40,true,NOW(),NOW(),'CAT_ROPA'),
('P008','Leggings Deportivos','Leggings de alta compresion para entrenamientos intensos.',39.99,'https://images.unsplash.com/photo-1506629905607-d0a94b3c2e94?w=400&h=300&fit=crop',60,true,NOW(),NOW(),'CAT_ROPA'),

('P009','Proteina Whey 2kg','Proteina whey de alta calidad para recuperacion muscular.',45.99,'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop',80,true,NOW(),NOW(),'CAT_SUPLE'),
('P010','Creatina Monohidrato 500g','Creatina pura para aumentar fuerza y resistencia.',29.99,'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop',120,true,NOW(),NOW(),'CAT_SUPLE'),
('P011','Pre-Entreno Energia','Suplemento pre-entreno para maxima energia y concentracion.',34.99,'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop',45,true,NOW(),NOW(),'CAT_SUPLE'),
('P012','Multivitaminico Deportivo','Complejo multivitaminico especifico para deportistas.',19.99,'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop',90,true,NOW(),NOW(),'CAT_SUPLE')
ON CONFLICT (id) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  price       = EXCLUDED.price,
  image       = EXCLUDED.image,
  stock       = EXCLUDED.stock,
  is_active   = EXCLUDED.is_active,
  updated_at  = NOW(),
  category_id = EXCLUDED.category_id;

COMMIT;

-- Verificacion
SELECT id, name, slug FROM categories ORDER BY id;
SELECT id, name, price, stock, category_id FROM products ORDER BY id;
