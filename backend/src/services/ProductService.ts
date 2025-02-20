import { ProductWithPricing } from '../interfaces/Product';
import { supabase } from '../config/supabase';

export class ProductService {
  private mapProduct(product: any): ProductWithPricing {
    return {
      id: product.id,
      codigo: product.codigo,
      descripcion: product.descripcion,
      ean: product.ean,
      unidades_por_caja: product.unidades_por_caja,
      unidades_por_embalaje: product.unidades_por_embalaje,
      pedido_minimo: product.pedido_minimo,
      precio_tarifa: product.precio_tarifa,
      descuento_1: product.descuento_1,
      descuento_custab: product.descuento_custab,
      neto_custab: product.neto_custab,
      neto_uds_custab: product.neto_uds_custab,
      neto_promo_custab: product.neto_promo_custab,
      precio_unidad_custab: product.precio_unidad_custab,
      descuento_partner: product.descuento_partner,
      neto_partner: product.neto_partner,
      neto_uds_partner: product.neto_uds_partner,
      neto_promo_partner: product.neto_promo_partner,
      precio_unidad_partner: product.precio_unidad_partner,
      descuento_promo_q: product.descuento_promo_q,
      promocion_familia: product.promocion_familia,
      familia_producto: product.familia_producto,
      categoria: product.categoria,
      catalogo: product.catalogo,
      created_at: product.created_at,
      updated_at: product.updated_at,
      activo: product.activo
    };
  }

  async findAll(): Promise<ProductWithPricing[]> {
    try {
      const { data: products, error } = await supabase
        .from('tarifa_neta_bic')
        .select('*')
        .eq('activo', true)
        .order('codigo');

      if (error) {
        console.error('Error al obtener productos:', error);
        throw error;
      }

      return products.map(this.mapProduct);
    } catch (error) {
      console.error('Error en findAll:', error);
      throw error;
    }
  }

  async findByCategory(catalogo: string): Promise<ProductWithPricing[]> {
    try {
      const { data: products, error } = await supabase
        .from('tarifa_neta_bic')
        .select('*')
        .eq('activo', true)
        .eq('catalogo', catalogo)
        .order('codigo');

      if (error) {
        console.error('Error al obtener productos por catálogo:', error);
        throw error;
      }

      return products.map(this.mapProduct);
    } catch (error) {
      console.error('Error en findByCategory:', error);
      throw error;
    }
  }

  async search(query: string): Promise<ProductWithPricing[]> {
    try {
      const { data: products, error } = await supabase
        .from('tarifa_neta_bic')
        .select('*')
        .eq('activo', true)
        .or(`codigo.ilike.%${query}%,descripcion.ilike.%${query}%,ean.ilike.%${query}%`)
        .order('codigo');

      if (error) {
        console.error('Error al buscar productos:', error);
        throw error;
      }

      return products.map(product => ({
        id: product.id,
        codigo: product.codigo,
        descripcion: product.descripcion,
        ean: product.ean,
        unidades_por_caja: product.unidades_por_caja,
        unidades_por_embalaje: product.unidades_por_embalaje,
        pedido_minimo: product.pedido_minimo,
        precio_tarifa: product.precio_tarifa,
        descuento_1: product.descuento_1,
        descuento_custab: product.descuento_custab,
        neto_custab: product.neto_custab,
        neto_uds_custab: product.neto_uds_custab,
        neto_promo_custab: product.neto_promo_custab,
        precio_unidad_custab: product.precio_unidad_custab,
        descuento_partner: product.descuento_partner,
        neto_partner: product.neto_partner,
        neto_uds_partner: product.neto_uds_partner,
        neto_promo_partner: product.neto_promo_partner,
        precio_unidad_partner: product.precio_unidad_partner,
        descuento_promo_q: product.descuento_promo_q,
        promocion_familia: product.promocion_familia,
        familia_producto: product.familia_producto,
        categoria: product.categoria,
        catalogo: product.catalogo,
        created_at: product.created_at,
        updated_at: product.updated_at,
        activo: product.activo
      }));
    } catch (error) {
      console.error('Error en search:', error);
      throw error;
    }
  }
}