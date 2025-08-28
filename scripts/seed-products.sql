-- Script SQL para poblar tabla 'products'
-- Ejecutar con: psql -d tu_database -f scripts/seed-products.sql

-- Limpiar productos existentes
DELETE FROM "Product";

-- Insertar productos
INSERT INTO "Product" (id, name, description, price, category, image, stock, "isActive", "createdAt", "updatedAt") VALUES
-- Equipos de Gimnasio
('1', 'Mancuernas Ajustables 20kg', 'Mancuernas ajustables de alta calidad, perfectas para entrenamientos en casa.', 89.99, 'Equipos', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', 50, true, NOW(), NOW()),
('2', 'Barra Olímpica 20kg', 'Barra olímpica profesional de 20kg, ideal para levantamiento de pesas.', 159.99, 'Equipos', 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop', 25, true, NOW(), NOW()),
('3', 'Banco Ajustable Multifunción', 'Banco ajustable multifunción para ejercicios completos de fuerza.', 199.99, 'Equipos', 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop', 15, true, NOW(), NOW()),
('4', 'Kettlebell 16kg', 'Kettlebell de hierro fundido de 16kg para entrenamientos funcionales.', 45.99, 'Equipos', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', 30, true, NOW(), NOW()),

-- Ropa Deportiva
('5', 'Camiseta Deportiva Pro', 'Camiseta deportiva transpirable con tecnología Dri-FIT.', 24.99, 'Ropa', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop', 100, true, NOW(), NOW()),
('6', 'Shorts de Entrenamiento', 'Shorts cómodos y flexibles para cualquier tipo de entrenamiento.', 32.99, 'Ropa', 'https://images.unsplash.com/photo-1506629905607-d0a94b3c2e94?w=400&h=300&fit=crop', 75, true, NOW(), NOW()),
('7', 'Zapatillas Running Pro', 'Zapatillas profesionales para running con amortiguación avanzada.', 129.99, 'Ropa', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', 40, true, NOW(), NOW()),
('8', 'Leggings Deportivos', 'Leggings de alta compresión para entrenamientos intensos.', 39.99, 'Ropa', 'https://images.unsplash.com/photo-1506629905607-d0a94b3c2e94?w=400&h=300&fit=crop', 60, true, NOW(), NOW()),

-- Suplementos
('9', 'Proteína Whey 2kg', 'Proteína whey de alta calidad para recuperación muscular.', 45.99, 'Suplementos', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop', 80, true, NOW(), NOW()),
('10', 'Creatina Monohidrato 500g', 'Creatina pura para aumentar fuerza y resistencia.', 29.99, 'Suplementos', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop', 120, true, NOW(), NOW()),
('11', 'Pre-Entreno Energía', 'Suplemento pre-entreno para máxima energía y concentración.', 34.99, 'Suplementos', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop', 45, true, NOW(), NOW()),
('12', 'Multivitamínico Deportivo', 'Complejo multivitamínico específico para deportistas.', 19.99, 'Suplementos', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop', 90, true, NOW(), NOW());

-- Verificar inserción
SELECT COUNT(*) as "Productos insertados" FROM "Product";
SELECT id, name, category, price, stock FROM "Product" ORDER BY id;