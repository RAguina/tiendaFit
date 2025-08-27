import { useUserData } from "@/hooks/use-user-data"
import { useRouter } from "next/navigation"

export default function OrdersSection() {
  const { recentOrders, loading } = useUserData()
  const router = useRouter()

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Mis Pedidos
          </h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Mis Pedidos
          </h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Ver Todos
          </button>
        </div>
      </div>
      <div className="p-6">
        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes pedidos aún
            </h3>
            <p className="text-gray-600 mb-6">
              Cuando realices tu primera compra, aparecerá aquí con toda la información de seguimiento.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Explorar Productos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mock order items for future implementation */}
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">#12345</h4>
                  <p className="text-sm text-gray-600">Pedido realizado el 15 de febrero, 2024</p>
                  <p className="text-sm text-gray-600 mt-1">3 artículos</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">$149.99</p>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Entregado
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}