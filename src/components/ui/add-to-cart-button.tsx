'use client'

interface AddToCartButtonProps {
  isLoading: boolean
  isSuccess: boolean
  disabled?: boolean
  onClick: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
}

export default function AddToCartButton({
  isLoading,
  isSuccess,
  disabled = false,
  onClick,
  className = '',
  size = 'md',
  variant = 'primary'
}: AddToCartButtonProps) {
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg'
  }

  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
    secondary: 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600'
  }

  const baseClasses = `
    cart-button w-full font-medium rounded-lg
    ${sizeClasses[size]}
    ${
      isSuccess 
        ? 'bg-green-500 hover:bg-green-600 text-white cart-success' 
        : isLoading
        ? 'bg-primary-400 text-white cursor-not-allowed cart-loading'
        : `${variantClasses[variant]} text-white`
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `

  const LoadingSpinner = () => (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )

  return (
    <button 
      onClick={onClick}
      disabled={disabled || isLoading}
      className={baseClasses}
    >
      {isSuccess ? (
        <span className="flex items-center justify-center cart-bounce">
          <span className="text-xl mr-2">🎉</span>
          ¡Agregado! ✓
        </span>
      ) : isLoading ? (
        <span className="flex items-center justify-center">
          <LoadingSpinner />
          <span className="ml-2">Agregando...</span>
        </span>
      ) : (
        <span className="flex items-center justify-center">
          <span className="mr-2">🛒</span>
          Agregar al Carrito
        </span>
      )}
    </button>
  )
}