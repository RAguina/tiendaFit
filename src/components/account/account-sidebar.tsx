interface AccountSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export default function AccountSidebar({ activeSection, onSectionChange }: AccountSidebarProps) {
  const sections = [
    { id: 'profile', name: 'Perfil', icon: '👤' },
    { id: 'orders', name: 'Mis Pedidos', icon: '📦' },
    { id: 'addresses', name: 'Direcciones', icon: '📍' },
    { id: 'settings', name: 'Configuración', icon: '⚙️' }
  ]

  return (
    <nav className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Navegación
        </h2>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSectionChange(section.id)}
                className={`w-full text-left px-3 py-2 rounded-md font-medium ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {section.icon} {section.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}