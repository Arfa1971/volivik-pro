# Documentación de la Base de Datos

## Esquema de la Base de Datos

### Tabla: Product

| Campo           | Tipo     | Descripción                              | Nullable |
|----------------|----------|------------------------------------------|----------|
| id             | String   | Identificador único                      | No       |
| code           | String   | Código del producto                      | No       |
| ean            | String   | Código EAN                              | No       |
| description    | String   | Descripción del producto                 | No       |
| familyProduct  | String   | Familia del producto                     | Sí       |
| strategic      | String   | Tipo estratégico                         | Sí       |
| unitsPerBox    | Int      | Unidades por caja                        | Sí       |
| unitsPerPackage| Int      | Unidades por embalaje                    | Sí       |
| minimumOrder   | Int      | Pedido mínimo                           | Sí       |
| price2025      | Float    | Precio tarifa 2025                       | Sí       |
| discount1      | String   | Descuento base                           | Sí       |
| discountCustab | String   | Descuento para cliente Custab            | Sí       |
| discountPartner| String   | Descuento para cliente Partner           | Sí       |
| netPriceCustab | Float    | Precio neto para Custab                  | Sí       |
| netPricePartner| Float    | Precio neto para Partner                 | Sí       |
| promoQuarter   | String   | Promoción trimestral                     | Sí       |
| promoFamily    | String   | Promoción por familia                    | Sí       |
| createdAt      | DateTime | Fecha de creación                       | No       |
| updatedAt      | DateTime | Fecha de última actualización           | No       |

## Índices

- `code` (Único): Garantiza que no haya códigos de producto duplicados
- `ean` (Único): Garantiza que no haya códigos EAN duplicados

## Relaciones

Actualmente no hay relaciones con otras tablas, ya que es una estructura simple centrada en productos.

## Consideraciones de Diseño

1. **Campos Nullables**:
   - La mayoría de los campos son nullables para permitir importaciones parciales
   - Los campos críticos (id, code, ean, description) son requeridos

2. **Tipos de Datos**:
   - Se usa String para descuentos para permitir formatos flexibles (ej: "25%")
   - Precios almacenados como Float para precisión decimal
   - Unidades como Int para valores enteros

3. **Auditoría**:
   - createdAt y updatedAt para seguimiento temporal
   - Actualizados automáticamente por Prisma

## Respaldo y Recuperación

1. **Respaldo**:
   ```bash
   npx ts-node src/scripts/backup.ts
   ```

2. **Recuperación**:
   ```bash
   # Pendiente de implementar script de restauración
   ```

## Mantenimiento

1. **Limpieza**:
   - Se recomienda limpiar registros antiguos periódicamente
   - Mantener respaldos de datos históricos

2. **Optimización**:
   - Índices creados para búsquedas frecuentes
   - Monitorear el tamaño de la base de datos

## Migración

Para aplicar cambios al esquema:

```bash
# Crear nueva migración
npx prisma migrate dev --name <nombre_migracion>

# Aplicar migraciones pendientes
npx prisma migrate deploy
```
