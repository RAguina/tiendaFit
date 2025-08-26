export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">TiendaFit</h3>
            <p className="text-gray-300 dark:text-gray-400">
              Tu tienda online de productos fitness y deportivos de la mejor calidad.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-gray-300 dark:text-gray-400">
              <li><a href="/" className="hover:text-white">Inicio</a></li>
              <li><a href="/products" className="hover:text-white">Productos</a></li>
              <li><a href="/cart" className="hover:text-white">Carrito</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="text-gray-300 dark:text-gray-400 space-y-2">
              <p>Email: info@tiendafit.com</p>
              <p>Telefono: +1 234 567 890</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TiendaFit. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}