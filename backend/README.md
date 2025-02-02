# Backend - BIC Quotation App

API REST desarrollada con Node.js, Express y TypeScript para la gestión de productos y cotizaciones.

## Estructura del Proyecto

```
src/
├── controllers/     # Controladores de la aplicación
├── interfaces/      # Definiciones de tipos TypeScript
├── middleware/      # Middleware personalizado
├── routes/         # Definición de rutas
├── scripts/        # Scripts de utilidad
├── services/       # Lógica de negocio
└── utils/          # Funciones de utilidad
```

## API Endpoints

### Productos

#### GET /api/v1/products
- Obtiene lista de todos los productos
- Soporta paginación y ordenamiento

#### GET /api/v1/products/search
- Búsqueda de productos por código, descripción o familia
- Query params:
  - `q`: término de búsqueda

#### POST /api/v1/products/upload
- Importa productos desde archivo CSV
- Requiere archivo multipart/form-data con campo 'csvFile'

## Modelos de Datos

### Product
```typescript
interface Product {
  id: string;
  code: string;
  ean: string;
  description: string;
  familyProduct: string | null;
  strategic: string | null;
  unitsPerBox: number | null;
  unitsPerPackage: number | null;
  minimumOrder: number | null;
  price2025: number | null;
  discount1: string | null;
  discountCustab: string | null;
  discountPartner: string | null;
  netPriceCustab: number | null;
  netPricePartner: number | null;
  promoQuarter: string | null;
  promoFamily: string | null;
}
```

## Scripts de Utilidad

### Backup
```typescript
// Ejecutar respaldo de datos
npx ts-node src/scripts/backup.ts
```

## Configuración del Entorno

1. Variables de entorno:
```env
PORT=3001
DATABASE_URL="file:./dev.db"
```

2. Base de datos:
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev
```

## Desarrollo

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar en modo desarrollo:
```bash
npm run dev
```

3. Compilar TypeScript:
```bash
npm run build
```

## Dependencias Principales

- express: Framework web
- @prisma/client: ORM para base de datos
- multer: Manejo de archivos
- csv-parse: Procesamiento de CSV
- typescript: Soporte de tipos

## Manejo de Errores

El sistema implementa un manejo centralizado de errores con los siguientes tipos:

- ValidationError: Errores de validación de datos
- NotFoundError: Recurso no encontrado
- DatabaseError: Errores de base de datos
- FileProcessingError: Errores en procesamiento de archivos

## Tests

```bash
# Ejecutar tests
npm test
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
