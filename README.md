# Volivik Pro

Aplicación web para la gestión de productos y cotizaciones de BIC, con soporte para diferentes tipos de clientes (Custab y Partner).

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

```
bic-quotation-app/
├── backend/         # API REST con Node.js y Express
└── frontend/        # Aplicación React con TypeScript
```

## Características Principales

- 🔍 Búsqueda y filtrado de productos
- 💰 Precios y descuentos diferenciados por tipo de cliente
- 📊 Visualización detallada de información de productos
- 💾 Sistema de respaldo automático de datos

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- SQLite

## Configuración Inicial

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd bic-quotation-app
```

2. Instalar dependencias:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configurar la base de datos:
```bash
cd backend
npx prisma migrate dev
```

## Ejecución del Proyecto

1. Iniciar el backend:
```bash
cd backend
npm run dev
```

2. Iniciar el frontend:
```bash
cd frontend
npm run dev
```

## Estructura de Datos

### Productos
Los productos incluyen la siguiente información:
- Código y EAN
- Descripción y familia de producto
- Unidades por caja y embalaje
- Precios y descuentos según tipo de cliente
- Promociones trimestrales y familiares

## Respaldos

El sistema incluye funcionalidades de respaldo:

1. Respaldo de datos:
```bash
cd backend
npx ts-node src/scripts/backup.ts
```

2. Respaldo completo del proyecto:
```bash
cd /ruta/del/proyecto
tar -czf bic-quotation-app-backup-$(date +%Y%m%d_%H%M%S).tar.gz --exclude='node_modules' --exclude='.git' bic-quotation-app/
```

## Mantenimiento

### Base de Datos
- Los respaldos se almacenan en `backend/backup/`
- Se recomienda realizar respaldos periódicos

### Actualizaciones
1. Actualizar dependencias:
```bash
npm update
```

2. Verificar cambios en el esquema de la base de datos:
```bash
npx prisma generate
```

## Licencia

Este proyecto es privado y confidencial.
