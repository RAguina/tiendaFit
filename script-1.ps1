    # Script para crear la estructura del e-commerce
Write-Host "🚀 Creando estructura del e-commerce..." -ForegroundColor Green

# Crear directorios principales
$directories = @(
    "src",
    "src/app",
    "src/app/(auth)",
    "src/app/(auth)/login",
    "src/app/(auth)/register",
    "src/app/(shop)",
    "src/app/(shop)/products",
    "src/app/(shop)/cart",
    "src/app/(shop)/checkout",
    "src/app/admin",
    "src/app/admin/products",
    "src/app/admin/orders",
    "src/app/api",
    "src/app/api/auth",
    "src/app/api/products",
    "src/app/api/cart",
    "src/components",
    "src/components/ui",
    "src/components/layout",
    "src/components/product",
    "src/components/cart",
    "src/components/admin",
    "src/lib",
    "src/lib/db",
    "src/lib/auth",
    "src/lib/validations",
    "src/lib/actions",
    "src/types",
    "src/hooks",
    "public",
    "public/images"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Creado: $dir" -ForegroundColor Cyan
    }
}

# Crear archivos principales
$files = @{
    # App Router - Layout y páginas principales
    "src/app/layout.tsx" = ""
    "src/app/page.tsx" = ""
    "src/app/globals.css" = ""
    
    # Auth pages
    "src/app/(auth)/login/page.tsx" = ""
    "src/app/(auth)/register/page.tsx" = ""
    
    # Shop pages
    "src/app/(shop)/products/page.tsx" = ""
    "src/app/(shop)/products/[id]/page.tsx" = ""
    "src/app/(shop)/cart/page.tsx" = ""
    "src/app/(shop)/checkout/page.tsx" = ""
    
    # Admin pages
    "src/app/admin/page.tsx" = ""
    "src/app/admin/products/page.tsx" = ""
    "src/app/admin/orders/page.tsx" = ""
    
    # API Routes
    "src/app/api/auth/route.ts" = ""
    "src/app/api/products/route.ts" = ""
    "src/app/api/products/[id]/route.ts" = ""
    "src/app/api/cart/route.ts" = ""
    
    # Components UI
    "src/components/ui/button.tsx" = ""
    "src/components/ui/input.tsx" = ""
    "src/components/ui/card.tsx" = ""
    "src/components/ui/badge.tsx" = ""
    "src/components/ui/dialog.tsx" = ""
    
    # Layout Components
    "src/components/layout/header.tsx" = ""
    "src/components/layout/footer.tsx" = ""
    "src/components/layout/sidebar.tsx" = ""
    "src/components/layout/navigation.tsx" = ""
    
    # Product Components
    "src/components/product/product-card.tsx" = ""
    "src/components/product/product-grid.tsx" = ""
    "src/components/product/product-details.tsx" = ""
    "src/components/product/product-form.tsx" = ""
    
    # Cart Components
    "src/components/cart/cart-item.tsx" = ""
    "src/components/cart/cart-summary.tsx" = ""
    "src/components/cart/cart-button.tsx" = ""
    
    # Admin Components
    "src/components/admin/admin-nav.tsx" = ""
    "src/components/admin/product-table.tsx" = ""
    "src/components/admin/order-table.tsx" = ""
    
    # Lib
    "src/lib/db/index.ts" = ""
    "src/lib/db/schema.ts" = ""
    "src/lib/auth/config.ts" = ""
    "src/lib/validations/auth.ts" = ""
    "src/lib/validations/product.ts" = ""
    "src/lib/validations/cart.ts" = ""
    "src/lib/actions/auth.ts" = ""
    "src/lib/actions/products.ts" = ""
    "src/lib/actions/cart.ts" = ""
    "src/lib/utils.ts" = ""
    
    # Types
    "src/types/index.ts" = ""
    "src/types/product.ts" = ""
    "src/types/user.ts" = ""
    "src/types/cart.ts" = ""
    
    # Hooks
    "src/hooks/use-cart.ts" = ""
    "src/hooks/use-auth.ts" = ""
    "src/hooks/use-products.ts" = ""
    
    # Config files
    "next.config.js" = ""
    "tailwind.config.js" = ""
    "tsconfig.json" = ""
    ".env.local" = ""
    ".env.example" = ""
    "package.json" = ""
    ".gitignore" = ""
    "README.md" = ""
}

foreach ($file in $files.Keys) {
    if (!(Test-Path $file)) {
        New-Item -ItemType File -Path $file -Force | Out-Null
        Write-Host "📄 Creado: $file" -ForegroundColor Yellow
    }
}

Write-Host " Estructura creada exitosamente!" -ForegroundColor Green
Write-Host "Total de directorios: $($directories.Count)" -ForegroundColor Magenta
Write-Host "Total de archivos: $($files.Count)" -ForegroundColor Magenta
Write-Host "Listo para empezar a codificar!" -ForegroundColor Green