'use client'

import { useState } from 'react'
import { products, categories } from '@/lib/data/products'
import { useAddToCart } from '@/hooks/use-add-to-cart'
import AddToCartButton from '@/components/ui/add-to-cart-button'

export default function ProductsPage() {
  const { handleAddToCart, isLoading, isSuccess } = useAddToCart()
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  const filteredProducts = products.filter(product => {
    return selectedCategory === "Todos" || product.category === selectedCategory
  })

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nuestros Productos
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Encuentra todo lo que necesitas para tu entrenamiento
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
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
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}