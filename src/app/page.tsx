'use client'

import Link from 'next/link'
import { products } from '@/lib/data/products'
import { useAddToCart } from '@/hooks/use-add-to-cart'
import AddToCartButton from '@/components/ui/add-to-cart-button'

export default function HomePage() {
  const { handleAddToCart, isLoading, isSuccess } = useAddToCart()
  const featuredProducts = products.slice(0, 3) // Get first 3 products

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-white">
            Transforma tu Cuerpo
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white">
            Encuentra los mejores productos fitness para alcanzar tus objetivos. 
            Equipos, ropa deportiva y suplementos de la más alta calidad.
          </p>
          <Link 
            href="/products" 
            className="inline-block bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Explorar Productos
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Nuestras Categorías
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center hover:shadow-lg">
              <div className="text-4xl mb-4">🏋️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Equipos de Gimnasio</h3>
              <p className="text-gray-600 dark:text-gray-400">Mancuernas, barras, máquinas y más</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center hover:shadow-lg">
              <div className="text-4xl mb-4">👕</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Ropa Deportiva</h3>
              <p className="text-gray-600 dark:text-gray-400">Camisetas, shorts, zapatillas y accesorios</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center hover:shadow-lg">
              <div className="text-4xl mb-4">💊</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Suplementos</h3>
              <p className="text-gray-600 dark:text-gray-400">Proteínas, vitaminas y nutrición deportiva</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Productos Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 transform">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="p-6">
                  <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                    {product.category}
                  </span>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                    ${product.price}
                  </p>
                  <AddToCartButton
                    isLoading={isLoading(product.id)}
                    isSuccess={isSuccess(product.id)}
                    onClick={() => handleAddToCart(product.id, 1)}
                    size="md"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}