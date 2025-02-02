# Frontend - BIC Quotation App

Interfaz de usuario desarrollada con React, TypeScript y Tailwind CSS.

## Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
│   └── ui/        # Componentes de interfaz básicos
├── features/      # Características principales
│   └── products/  # Componentes relacionados con productos
├── hooks/         # Hooks personalizados
├── lib/          # Utilidades y configuraciones
└── types/        # Definiciones de tipos TypeScript
```

## Características Principales

### Gestión de Productos
- Lista de productos con búsqueda y filtrado
- Vista detallada de producto
- Precios diferenciados por tipo de cliente

### Interfaz de Usuario
- Diseño responsive
- Temas claros/oscuros
- Componentes accesibles
- Notificaciones toast

## Componentes Principales

### ProductList
- Lista paginada de productos
- Búsqueda en tiempo real
- Ordenamiento por columnas

### ProductDetails
- Modal con información detallada
- Precios y descuentos según tipo de cliente
- Información de unidades y promociones

## Desarrollo

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar en modo desarrollo:
```bash
npm run dev
```

3. Construir para producción:
```bash
npm run build
```

## Tecnologías Utilizadas

- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Query
- Axios

## Estado Global

La aplicación utiliza React Query para:
- Caché de datos
- Gestión de estado del servidor
- Mutaciones optimistas

## Manejo de Errores

- Boundary de errores global
- Notificaciones toast para errores
- Reintentos automáticos en peticiones fallidas

## Integración con Backend

- API REST
- Endpoints configurados en `src/lib/api.ts`
- Interceptores para tokens y errores

## Mejores Prácticas

- Code splitting automático
- Lazy loading de componentes
- Optimización de imágenes
- SEO básico

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Vista previa de producción
npm run preview

# Lint
npm run lint

# Type check
npm run type-check
```

## Mantenimiento

1. Actualizar dependencias:
```bash
npm update
```

2. Verificar tipos:
```bash
npm run type-check
```

3. Linting:
```bash
npm run lint
```

## Configuración del Entorno

Variables de entorno necesarias:
```env
VITE_API_URL=http://localhost:3001/api/v1

```
