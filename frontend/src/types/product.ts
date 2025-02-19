export interface Product {
  id: string;
  codigo: string;
  descripcion: string;
  ean: string;
  unidades_por_caja: number;
  unidades_por_embalaje: number;
  pedido_minimo: number;
  precio_tarifa: number;
  descuento_1: number;
  
  // Custab
  descuento_custab: number;
  neto_custab: number;
  neto_uds_custab: number;
  neto_promo_custab: number | null;
  precio_unidad_custab: number;
  
  // Partner
  descuento_partner: number;
  neto_partner: number;
  neto_uds_partner: number;
  neto_promo_partner: number | null;
  precio_unidad_partner: number;
  
  // Promociones
  descuento_promo_q: number;
  promocion_familia: string | null;
  
  // Categorización
  familia_producto: string;
  categoria: string;
  catalogo: string;
  
  // Imagen
  imagen_nombre?: string;
  
  // Metadatos
  created_at: string;
  updated_at: string;
  activo: boolean;
}
