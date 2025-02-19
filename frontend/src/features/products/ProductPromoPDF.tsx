import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Product } from '@/types/product';

interface ProductPromoPDFProps {
  product: Product;
  clientType: 'custab' | 'partner';
}

// Estilos
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF'
  },
  container: {
    flex: 1,
    gap: 20
  },
  header: {
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    color: '#991B1B',
    marginBottom: 5
  },
  code: {
    fontSize: 16,
    color: '#E49B0F'
  },
  mainGrid: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 20
  },
  imageContainer: {
    width: '30%',
    height: 250,
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
    width: '70%',
    gap: 20
  },
  detailsSection: {
    gap: 10
  },
  logisticSection: {
    gap: 10,
    marginTop: 10
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10
  },
  label: {
    fontSize: 12,
    color: '#991B1B',
    width: '120px'
  },
  value: {
    fontSize: 12,
    color: '#000000',
    flex: 1
  },
  promoSection: {
    backgroundColor: '#ECFDF5',
    padding: 20,
    borderRadius: 4,
    marginBottom: 20
  },
  promoTitle: {
    fontSize: 16,
    color: '#065F46',
    fontWeight: 'bold',
    marginBottom: 8
  },
  promoText: {
    fontSize: 14,
    color: '#065F46'
  },
  priceSection: {
    backgroundColor: '#FFF7ED',
    padding: 20,
    borderRadius: 4
  },
  priceTitle: {
    fontSize: 20,
    color: '#991B1B',
    marginBottom: 15,
    fontWeight: 'bold'
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  priceLabel: {
    fontSize: 16,
    color: '#EA580C'
  },
  basePrice: {
    fontSize: 20,
    color: '#991B1B'
  },
  regularPrice: {
    fontSize: 20,
    color: '#991B1B'
  },
  promoPrice: {
    fontSize: 20,
    color: '#E49B0F',
    fontWeight: 'bold'
  }
});

export const ProductPromoPDF = ({ product, clientType }: ProductPromoPDFProps) => {
  // Para PLASTIDECOR1, el precio promocional solo aplica a partir de 10 cajas
  const regularPrice = clientType === 'custab'
    ? product.neto_custab
    : product.neto_partner;

  const promoPrice = clientType === 'custab'
    ? product.neto_promo_custab
    : product.neto_promo_partner;

  const price = product.familia_producto === 'PLASTIDECOR1'
    ? promoPrice || regularPrice // Solo mostramos el precio promo en el PDF
    : (promoPrice || regularPrice);

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
                <View style={styles.infoRow}>
                  <Text style={styles.label}>EAN:</Text>
                  <Text style={styles.value}>{product.ean}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Familia:</Text>
                  <Text style={styles.value}>{product.familia_producto}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Catálogo:</Text>
                  <Text style={styles.value}>{product.catalogo}</Text>
                </View>
              </View>

              {/* Información logística */}
              <View style={styles.logisticSection}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Unidades/caja:</Text>
                  <Text style={styles.value}>{product.unidades_por_caja} uds</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Pedido mínimo:</Text>
                  <Text style={styles.value}>{product.pedido_minimo} uds</Text>
                </View>
              </View>
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

          {/* Sección de precios */}
          <View style={styles.priceSection}>
            <Text style={styles.priceTitle}>Precios</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tarifa base</Text>
              <Text style={styles.basePrice}>{(regularPrice * 1.25).toFixed(2)}€</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Precio neto</Text>
              <Text style={styles.regularPrice}>{regularPrice.toFixed(2)}€</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Precio promo</Text>
              <Text style={styles.promoPrice}>{price.toFixed(2)}€</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
