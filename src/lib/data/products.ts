export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  inStock: boolean
  rating: number
  reviews: number
}

export const products: Product[] = [
  // Equipos de Gimnasio
  {
    id: "P001",
    name: "Mancuernas Ajustables 20kg",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    category: "Equipos",
    description: "Mancuernas ajustables de alta calidad, perfectas para entrenamientos en casa.",
    inStock: true,
    rating: 4.8,
    reviews: 127
  },
  {
    id: "P002",
    name: "Barra Olímpica 20kg",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=300&fit=crop",
    category: "Equipos",
    description: "Barra olímpica profesional de 20kg, ideal para levantamiento de pesas.",
    inStock: true,
    rating: 4.9,
    reviews: 89
  },
  {
    id: "P003",
    name: "Banco Ajustable Multifunción",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop",
    category: "Equipos",
    description: "Banco ajustable multifunción para ejercicios completos de fuerza.",
    inStock: true,
    rating: 4.7,
    reviews: 156
  },
  {
    id: "P004",
    name: "Kettlebell 16kg",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    category: "Equipos",
    description: "Kettlebell de hierro fundido de 16kg para entrenamientos funcionales.",
    inStock: true,
    rating: 4.6,
    reviews: 203
  },

  // Ropa Deportiva
  {
    id: "P005",
    name: "Camiseta Deportiva Pro",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    category: "Ropa",
    description: "Camiseta deportiva transpirable con tecnología Dri-FIT.",
    inStock: true,
    rating: 4.5,
    reviews: 342
  },
  {
    id: "P006",
    name: "Shorts de Entrenamiento",
    price: 32.99,
    image: "https://images.unsplash.com/photo-1506629905607-d0a94b3c2e94?w=400&h=300&fit=crop",
    category: "Ropa",
    description: "Shorts cómodos y flexibles para cualquier tipo de entrenamiento.",
    inStock: true,
    rating: 4.4,
    reviews: 198
  },
  {
    id: "P007",
    name: "Zapatillas Running Pro",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    category: "Ropa",
    description: "Zapatillas profesionales para running con amortiguación avanzada.",
    inStock: true,
    rating: 4.8,
    reviews: 267
  },
  {
    id: "P008",
    name: "Leggings Deportivos",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1506629905607-d0a94b3c2e94?w=400&h=300&fit=crop",
    category: "Ropa",
    description: "Leggings de alta compresión para entrenamientos intensos.",
    inStock: true,
    rating: 4.6,
    reviews: 145
  },

  // Suplementos
  {
    id: "P009",
    name: "Proteína Whey 2kg",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop",
    category: "Suplementos",
    description: "Proteína whey de alta calidad para recuperación muscular.",
    inStock: true,
    rating: 4.7,
    reviews: 89
  },
  {
    id: "P010",
    name: "Creatina Monohidrato 500g",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop",
    category: "Suplementos",
    description: "Creatina pura para aumentar fuerza y resistencia.",
    inStock: true,
    rating: 4.8,
    reviews: 156
  },
  {
    id: "P011",
    name: "Pre-Entreno Energía",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop",
    category: "Suplementos",
    description: "Suplemento pre-entreno para máxima energía y concentración.",
    inStock: true,
    rating: 4.5,
    reviews: 201
  },
  {
    id: "P012",
    name: "Multivitamínico Deportivo",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop",
    category: "Suplementos",
    description: "Complejo multivitamínico específico para deportistas.",
    inStock: true,
    rating: 4.3,
    reviews: 123
  }
]

export const categories = ["Todos", "Equipos", "Ropa", "Suplementos"]