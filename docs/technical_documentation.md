# Documentación Técnica: BIC Quotation App

## 1. Descripción General
BIC Quotation App es una aplicación web fullstack diseñada para gestionar productos y cotizaciones de BIC. La aplicación está construida utilizando una arquitectura moderna de dos capas (frontend y backend) y está optimizada para manejar diferentes tipos de clientes (Custab y Partner).

## 2. Arquitectura Técnica

### 2.1 Backend (Node.js + Express + TypeScript)
- **Tecnologías principales:**
  - Node.js como runtime
  - Express.js como framework web
  - TypeScript para tipado estático
  - Supabase como base de datos
  - Prisma como ORM

#### Estructura del Backend:
```
backend/src/
├── config/         # Configuraciones de la aplicación
├── controllers/    # Controladores de la lógica de negocio
├── data/          # Datos y migraciones
├── interfaces/    # Definiciones de tipos TypeScript
├── middleware/    # Middleware personalizado
├── routes/        # Definición de rutas API
├── scripts/       # Scripts de utilidad
├── services/      # Servicios de negocio
└── utils/         # Utilidades generales
```

### 2.2 Frontend (React + TypeScript)
- **Tecnologías principales:**
  - React como framework UI
  - TypeScript para tipado estático
  - Tailwind CSS para estilos
  - Vite como bundler

#### Estructura del Frontend:
```
frontend/src/
├── assets/        # Recursos estáticos
├── components/    # Componentes reutilizables
├── context/      # Contextos de React
├── features/     # Características principales
├── hooks/        # Hooks personalizados
├── lib/          # Bibliotecas y configuraciones
├── services/     # Servicios API
├── types/        # Definiciones de tipos
└── utils/        # Utilidades
```

## 3. Características Principales

### 3.1 Gestión de Productos
- Gestión de productos en Supabase
- Sistema de búsqueda y filtrado avanzado
- Visualización detallada de información de productos
- Gestión de precios diferenciados por tipo de cliente

### 3.2 Sistema de Precios
- Soporte para diferentes tipos de clientes (Custab/Partner)
- Gestión de descuentos personalizados
- Promociones trimestrales y familiares

### 3.3 Seguridad y Datos
- Sistema de respaldo automático de datos
- Middleware de validación para uploads
- Gestión de variables de entorno para configuraciones sensibles

## 4. Flujos de Trabajo Principales

### 4.1 Gestión de Datos
#### Base de Datos
La aplicación utiliza Supabase como base de datos principal, con las siguientes tablas:

- Products: Información básica de productos
- Prices: Historial de precios y descuentos
- Promotions: Promociones activas y programadas
- Backups: Sistema de respaldo automático

#### Flujo de Datos
1. Gestión de productos en Supabase
2. Validación y procesamiento de datos
3. Actualización en tiempo real
4. Sistema de respaldo automático

#### Respaldo y Recuperación
- Respaldos automáticos programados
- Sistema de versionado de datos
- Recuperación rápida desde Supabase

### 4.2 Gestión de Cotizaciones
1. Selección de productos
2. Aplicación de precios según tipo de cliente
3. Cálculo de descuentos
4. Generación de cotización

## 5. Mantenimiento y Operaciones

### 5.1 Respaldos
- Sistema automatizado de respaldos
- Almacenamiento de respaldos en `backend/backup/`
- Script de respaldo completo del proyecto disponible

### 5.2 Despliegue
- Script de despliegue automatizado
- Configuraciones separadas para desarrollo y producción

## 6. Consideraciones Técnicas

### 6.1 Rendimiento
- Implementación de paginación para listas grandes
- Optimización de consultas a base de datos
- Lazy loading de componentes React

### 6.2 Escalabilidad
- Arquitectura modular
- Separación clara de responsabilidades
- Uso de TypeScript para mantenibilidad

## 7. Configuración del Entorno

### 7.1 Requisitos
- Node.js v18 o superior
- npm o yarn
- Supabase

### 7.2 Variables de Entorno
- Configuraciones separadas para desarrollo y producción
- Gestión segura de secretos y configuraciones sensibles
