import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Product } from '@/types/product';

interface ProductPromoPDFProps {
  product: Product;
  clientType: 'custab' | 'partner';
}

// Estilos
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF'
  },
  container: {
    flex: 1,
    gap: 10
  },
  header: {
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    color: '#991B1B',
    marginBottom: 5
  },
  code: {
    fontSize: 14,
    color: '#E49B0F'
  },
  mainGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 10
  },
  imageContainer: {
    width: '40%',
    height: 300,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  infoContainer: {
    width: '60%',
    gap: 8
  },
  detailsSection: {
    backgroundColor: '#FFF7ED',
    padding: 8,
    borderRadius: 4,
    gap: 4,
    marginBottom: 8
  },
  logisticSection: {
    backgroundColor: '#FFF7ED',
    padding: 8,
    borderRadius: 4,
    gap: 4,
    marginBottom: 8
  },
  sectionTitle: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: 'bold',
    marginBottom: 8
  },
  infoRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 2
  },
  label: {
    fontSize: 10,
    color: '#991B1B',
    width: '120px'
  },
  value: {
    fontSize: 10,
    color: '#000000',
    flex: 1
  },
  promoSection: {
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8
  },
  promoTitle: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: 'bold',
    marginBottom: 6
  },
  promoText: {
    fontSize: 12,
    color: '#065F46'
  },
  priceSection: {
    backgroundColor: '#FFF7ED',
    padding: 8,
    borderRadius: 4
  },
  priceTitle: {
    fontSize: 16,
    color: '#991B1B',
    marginBottom: 12,
    fontWeight: 'bold'
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  priceLabel: {
    fontSize: 12,
    color: '#991B1B'
  },
  discountLabel: {
    fontSize: 10,
    color: '#6B21A8',
    marginBottom: 2
  },
  discountValue: {
    fontSize: 12,
    color: '#6B21A8',
    fontWeight: 'bold'
  },
  basePrice: {
    fontSize: 14,
    color: '#991B1B'
  },
  regularPrice: {
    fontSize: 14,
    color: '#E49B0F'
  },
  promoPrice: {
    fontSize: 14,
    color: '#059669',
    fontWeight: 'bold'
  }
});

export const ProductPromoPDF = ({ product, clientType }: ProductPromoPDFProps) => {
  // Para PLASTIDECOR1, el precio promocional solo aplica a partir de 10 cajas
  // Calcular precios con valores por defecto
  const regularPrice = clientType === 'custab'
    ? (product.neto_custab ?? product.precio_tarifa ?? 0)
    : (product.neto_partner ?? product.precio_tarifa ?? 0);

  const promoPrice = clientType === 'custab'
    ? product.neto_promo_custab
    : product.neto_promo_partner;

  // Si no hay precio promocional, usar el precio regular
  const price = promoPrice ?? regularPrice;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header con título y código */}
          <View style={styles.header}>
            <Text style={styles.title}>{product.descripcion}</Text>
            <Text style={styles.code}>{product.codigo}</Text>
          </View>

          {/* Grid principal */}
          <View style={styles.mainGrid}>
            {/* Columna izquierda: Imagen */}
            <View style={styles.imageContainer}>
              <Image
                style={styles.productImage}
                src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/products/${product.codigo}.jpg`}
                cache={false}
              />
            </View>

            {/* Columna derecha: Información */}
            <View style={styles.infoContainer}>
              {/* Detalles del producto */}
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Detalles</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>EAN:</Text>
                  <Text style={styles.value}>{product.ean}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Formato:</Text>
                  <Text style={styles.value}>{product.formato || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Familia:</Text>
                  <Text style={styles.value}>{product.familia_producto}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Sub-familia:</Text>
                  <Text style={styles.value}>{product.familia || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Catálogo:</Text>
                  <Text style={styles.value}>{product.catalogo}</Text>
                </View>
              </View>

              {/* Información logística */}
              <View style={styles.logisticSection}>
                <Text style={styles.sectionTitle}>Información logística</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Unidades por caja:</Text>
                  <Text style={styles.value}>{product.unidades_por_caja} uds</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Unidades por embalaje:</Text>
                  <Text style={styles.value}>{product.unidades_por_embalaje} uds</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Pedido mínimo:</Text>
                  <Text style={styles.value}>{product.pedido_minimo} uds</Text>
                </View>
                {product.peso_caja && (
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Peso por caja:</Text>
                    <Text style={styles.value}>{product.peso_caja} kg</Text>
                  </View>
                )}
                {product.volumen_caja && (
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Volumen por caja:</Text>
                    <Text style={styles.value}>{product.volumen_caja} m³</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Sección de precios */}
          <View style={styles.priceSection}>
            <Text style={styles.priceTitle}>Precios y descuentos</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tarifa base</Text>
              <Text style={styles.basePrice}>{(product.precio_tarifa ?? 0).toFixed(2)}€</Text>
            </View>

            {/* Descuentos aplicados */}
            <View style={[styles.priceRow, { backgroundColor: '#F3E8FF', padding: 10, borderRadius: 4, marginVertical: 10 }]}>
              <View>
                <Text style={[styles.priceLabel, { marginBottom: 5 }]}>Descuentos aplicados</Text>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                  <View>
                    <Text style={styles.discountLabel}>Base</Text>
                    <Text style={styles.discountValue}>{(product.descuento_1 ?? 0).toFixed(1)}%</Text>
                  </View>
                  <View>
                    <Text style={styles.discountLabel}>{clientType === 'custab' ? 'Custab' : 'Partner'}</Text>
                    <Text style={styles.discountValue}>
                      {(clientType === 'custab' ? (product.descuento_custab ?? 0) : (product.descuento_partner ?? 0)).toFixed(1)}%
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Precios finales */}
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Precio por unidad</Text>
              <Text style={styles.regularPrice}>
                {(clientType === 'custab' 
                  ? (product.precio_unidad_custab ?? 0)
                  : (product.precio_unidad_partner ?? 0)
                ).toFixed(3)}€
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Precio neto</Text>
              <Text style={styles.regularPrice}>{regularPrice.toFixed(2)}€</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Precio neto con promo</Text>
              <Text style={styles.promoPrice}>{price.toFixed(2)}€</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Ahorro total</Text>
              <Text style={[styles.promoPrice, { color: '#059669' }]}>
                {(((product.precio_tarifa ?? 0) - (price ?? 0)) / (product.precio_tarifa ?? 1) * 100).toFixed(1)}%
              </Text>
            </View>
          </View>

          {/* Sección de promoción */}
          <View style={styles.promoSection}>
            <Text style={styles.promoTitle}>
              OFERTA ESPECIAL PARA {clientType === 'custab' ? 'CUSTAB' : 'PARTNER'}
            </Text>
            {product.promocion_familia && (
              <Text style={styles.promoText}>{product.promocion_familia}</Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};
