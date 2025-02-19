import { useState } from 'react';
import { X, Package, Tag, Box, Info, Euro, Check, Plus, Minus, ShoppingCart, FileText } from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { ProductImages } from './ProductImages';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ProductPromoPDF } from './ProductPromoPDF';

interface ProductDetailsProps {
  product: Product;
  clientType: 'custab' | 'partner';
  onClose: () => void;
}

export default function ProductDetails({ product, clientType, onClose }: ProductDetailsProps) {
  // Log para depuración
  console.log('ProductDetails:', {
    catalogo: product.catalogo,
    codigo: product.codigo,
    clientType,
    precios: {
      tarifa: product.precio_tarifa,
      neto_custab: product.neto_custab,
      neto_partner: product.neto_partner,
      promo_custab: product.neto_promo_custab,
      promo_partner: product.neto_promo_partner
    }
  });
  // Asegurar que pedido_minimo tenga un valor válido según el catálogo
  const pedidoMinimo = ['DURACELL', 'BLADE'].includes(product.catalogo)
    ? 1 // Para Duracell y Blade, usar 1 como pedido mínimo
    : (product.pedido_minimo || 1);
  const [quantity, setQuantity] = useState(pedidoMinimo);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  // Asegurar que todos los precios tengan valores válidos
  const defaultPrice = product.precio_tarifa ?? 0;
  
  // Inicializar precios con valores seguros para cada catálogo
  let precios;
  if (['DURACELL', 'BLADE'].includes(product.catalogo)) {
    // Para Duracell y Blade, usar siempre precio tarifa como respaldo
    precios = {
      custab: {
        neto: product.neto_custab ?? defaultPrice,
        promo: defaultPrice // Sin precios promocionales
      },
      partner: {
        neto: product.neto_partner ?? defaultPrice,
        promo: defaultPrice // Sin precios promocionales
      }
    };
  } else {
    // Para otros catálogos, mantener la lógica original
    precios = {
      custab: {
        neto: product.neto_custab ?? defaultPrice,
        promo: product.neto_promo_custab ?? (product.neto_custab ?? defaultPrice)
      },
      partner: {
        neto: product.neto_partner ?? defaultPrice,
        promo: product.neto_promo_partner ?? (product.neto_partner ?? defaultPrice)
      }
    };
  }

  // Log de precios calculados
  console.log('Precios calculados:', {
    catalogo: product.catalogo,
    defaultPrice,
    precios,
    clientType
  });

  // Determinar si se aplica el precio promocional o si es producto con regalo
  const hasPromoOrGift = ['8757704', '8757712'].includes(product.codigo)
    ? quantity >= 120 && (clientType === 'custab' ? !!product.neto_promo_custab : !!product.neto_promo_partner)
    : product.codigo === '9615921' || true;

  // Determinar si se debe mostrar el botón de PDF
  const showPdfButton = product.codigo === '9615921' || (product.promocion_familia && hasPromoOrGift);

  let price = defaultPrice; // Inicializar con precio por defecto
  try {
    if (['DURACELL', 'BLADE', 'LIGHTERS'].includes(product.catalogo)) {
      // Para catálogos especiales, usar precio base
      price = clientType === 'custab' ? precios.custab.neto : precios.partner.neto;
      console.log('Precio calculado para catálogo especial:', {
        catalogo: product.catalogo,
        clientType,
        price,
        precios
      });
    } else if (['8757712', '9203013', '9339613'].includes(product.codigo)) {
      // Para productos especiales, usar precio neto si cantidad < 120
      if (quantity < 120) {
        price = clientType === 'custab' ? precios.custab.neto : precios.partner.neto;
      } else {
        price = clientType === 'custab' ? precios.custab.promo : precios.partner.promo;
      }
    } else if (product.codigo === '9615921') {
      // Para el producto con regalo incluido, usar siempre el precio normal
      price = clientType === 'custab' ? precios.custab.neto : precios.partner.neto;
    } else {
      // Para otros productos mantener la lógica original
      price = clientType === 'custab'
        ? (hasPromoOrGift ? precios.custab.promo : precios.custab.neto)
        : (hasPromoOrGift ? precios.partner.promo : precios.partner.neto);
    }
  } catch (error) {
    console.error('Error calculando precio:', {
      error,
      catalogo: product.catalogo,
      codigo: product.codigo,
      clientType,
      precios
    });
    // En caso de error, usar el precio por defecto
    price = defaultPrice;
  }

  const handleQuantityChange = (newQuantity: number) => {
    const minQuantity = ['DURACELL', 'BLADE', 'LIGHTERS'].includes(product.catalogo)
      ? 1 // Para catálogos especiales, usar 1 como pedido mínimo
      : (product.pedido_minimo ?? 1);

    // Para los productos especiales
    if (['8757712', '9203013', '9339613'].includes(product.codigo)) {
      // No permitir cantidades menores al pedido mínimo
      if (newQuantity < minQuantity) {
        setQuantity(minQuantity);
        toast.error(`La cantidad mínima de pedido es ${minQuantity} unidades`);
        return;
      }

      // Asegurarse de que la cantidad sea un múltiplo del pedido mínimo
      const multiplier = Math.max(1, Math.round(newQuantity / minQuantity));
      const adjustedQuantity = multiplier * minQuantity;
      setQuantity(adjustedQuantity);
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity, clientType);
    toast.success('Producto añadido al carrito', {
      duration: 1500,
      position: 'top-right',
      style: { backgroundColor: '#22c55e', color: 'white' }
    });
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 200);
  };

  return (
    <div className="relative bg-white p-4 sm:p-6 max-w-2xl mx-auto overflow-y-auto max-h-[90vh]">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 -mx-4 sm:mx-0 px-4 sm:px-0 pb-4 border-b border-orange-100">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-orange-900 leading-tight">{product.descripcion}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-lg sm:text-base font-medium text-orange-600">{product.codigo}</span>
              {product.categoria && (
                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-orange-50 text-orange-800 border border-orange-200">
                  {product.categoria}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {(product.descuento_promo_q > 0 || product.codigo === '9615921') && (
              <PDFDownloadLink
                document={<ProductPromoPDF product={product} clientType={clientType} />}
                fileName={`${product.codigo}-promo.pdf`}
                className="p-2.5 hover:bg-orange-50 rounded-full transition-colors duration-200 disabled:opacity-50"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {({ loading, error }) => (
                  <>
                    <FileText className={`h-6 w-6 ${loading ? 'text-gray-400' : error ? 'text-red-500' : 'text-green-500'}`} />
                    <span className="sr-only">
                      {loading ? 'Generando PDF...' : error ? 'Error al generar PDF' : 'Descargar ficha de promoción'}
                    </span>
                  </>
                )}
              </PDFDownloadLink>
            )}
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-orange-50 rounded-full transition-colors duration-200"
              aria-label="Cerrar"
            >
              <X className="h-6 w-6 text-orange-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Imagen del producto */}
        <div className="aspect-square w-full max-w-md mx-auto bg-white rounded-lg overflow-hidden">
          <ProductImages productCode={product.codigo} size="lg" />
        </div>

        {/* Información del producto y logística */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100">
            <h3 className="text-base font-medium text-orange-800 flex items-center gap-2 mb-4">
              <Info className="h-5 w-5" />
              Detalles
            </h3>
            <div className="space-y-3">
              <div>
                <dt className="text-sm text-orange-600">EAN</dt>
                <dd className="text-base font-medium text-orange-900 mt-1">{product.ean?.toString() || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm text-orange-600">Familia</dt>
                <dd className="text-base font-medium text-orange-900 mt-1">{product.familia_producto}</dd>
              </div>
              <div>
                <dt className="text-sm text-orange-600">Catálogo</dt>
                <dd className="text-base font-medium text-orange-900 mt-1">{product.catalogo}</dd>
              </div>
              {product.subcategoria && (
                <div>
                  <dt className="text-sm text-orange-600">Subcategoría</dt>
                  <dd className="text-base font-medium text-orange-900 mt-1">{product.subcategoria}</dd>
                </div>
              )}
            </div>
          </div>

          <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100">
            <h3 className="text-base font-medium text-orange-800 flex items-center gap-2 mb-4">
              <Box className="h-5 w-5" />
              Logística
            </h3>
            <div className="space-y-3">
              <div>
                <dt className="text-sm text-orange-600">Unidades/caja</dt>
                <dd className="text-base font-medium text-orange-900 mt-1">{product.unidades_por_caja} uds</dd>
              </div>
              <div>
                <dt className="text-sm text-orange-600">Pedido mínimo</dt>
                <dd className="text-base font-medium text-orange-900 mt-1">{product.pedido_minimo} uds</dd>
              </div>
              {product.multiplo_venta && (
                <div>
                  <dt className="text-sm text-orange-600">Múltiplo de venta</dt>
                  <dd className="text-base font-medium text-orange-900 mt-1">{product.multiplo_venta} uds</dd>
                </div>
              )}
              {product.stock_disponible && (
                <div>
                  <dt className="text-sm text-orange-600">Stock disponible</dt>
                  <dd className="text-base font-medium text-orange-900 mt-1">{product.stock_disponible} uds</dd>
                </div>
              )}
              {product.peso_caja && (
                <div>
                  <dt className="text-sm text-orange-600">Peso por caja</dt>
                  <dd className="text-base font-medium text-orange-900 mt-1">{product.peso_caja} kg</dd>
                </div>
              )}
              {product.volumen_caja && (
                <div>
                  <dt className="text-sm text-orange-600">Volumen por caja</dt>
                  <dd className="text-base font-medium text-orange-900 mt-1">{product.volumen_caja} m³</dd>
                </div>
              )}
              {product.cajas_palet && (
                <div>
                  <dt className="text-sm text-orange-600">Cajas por palet</dt>
                  <dd className="text-base font-medium text-orange-900 mt-1">{product.cajas_palet} cajas</dd>
                </div>
              )}
            </div>
          </div>

          {/* Precios */}
          <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100">
            <h3 className="text-base font-medium text-orange-800 flex items-center gap-2 mb-4">
              <Euro className="h-5 w-5" />
              Precios
            </h3>
            <div className="grid gap-3">
              <div>
                <dt className="text-sm text-orange-600">Tarifa base</dt>
                <dd className="text-base font-medium text-orange-900 mt-1">{(product.precio_tarifa ?? 0).toFixed(2)}€</dd>
              </div>
              {/* Solo mostrar descuentos si NO es Duracell + Partner */}
              {!(product.catalogo === 'DURACELL' && clientType === 'partner') && (
                <>
                  <div>
                    <dt className="text-sm text-orange-600">Descuento base</dt>
                    <dd className="text-base font-medium text-green-600 mt-1">{(product.descuento_1 ?? 0).toFixed(2)}%</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-orange-600">
                      Dto. {clientType === 'custab' ? 'Custab' : 'Partner'}
                    </dt>
                    <dd className="text-base font-medium text-green-600 mt-1">
                      {(clientType === 'custab' ? (product.descuento_custab ?? 0) : (product.descuento_partner ?? 0)).toFixed(2)}%
                    </dd>
                  </div>
                </>
              )}
              <div>
                <dt className="text-sm text-orange-600">Precio neto</dt>
                <dd className="text-lg font-semibold text-[#E49B0F] mt-1">
                  {(clientType === 'custab' 
                    ? (product.neto_custab ?? product.precio_tarifa ?? 0)
                    : (product.neto_partner ?? product.precio_tarifa ?? 0)
                  ).toFixed(2)}€
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Promoción si existe */}
        {(product.promocion_familia || product.codigo === '9615921') && (
          <div className="bg-green-50/50 p-5 rounded-xl border border-green-200">
            <h3 className="text-lg font-medium text-green-800 flex items-center gap-2 mb-3">
              <Tag className="h-6 w-6" />
              ¡Promoción activa!
            </h3>
            <p className="text-base text-green-700 leading-relaxed">
              {product.codigo === '9615921' 
                ? 'Promoción especial: Material/Regalo incluido'
                : product.promocion_familia
              }
            </p>
            {!['9615921'].includes(product.codigo) && (
              <div className="mt-4 p-3 bg-white/50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">Precio promocional:</p>
                <p className="text-xl font-semibold text-green-800 mt-1">
                  {clientType === 'custab' 
                    ? (product.neto_promo_custab?.toFixed(2) || 'N/A') 
                    : (product.neto_promo_partner?.toFixed(2) || 'N/A')}€
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cantidad y añadir al carrito - Fijo en la parte inferior */}
      <div className="sticky bottom-0 bg-white -mx-4 sm:mx-0 px-4 sm:px-0 pt-4 pb-4 mt-6 border-t border-orange-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 bg-orange-50/80 p-3 rounded-xl border border-orange-200 shadow-sm">
              <Button
                variant="outline"
                size="lg"
                className="h-14 w-14 bg-white border-orange-300 text-orange-600 hover:bg-orange-50 text-xl shadow-sm"
                onClick={() => {
                  handleQuantityChange(quantity - product.pedido_minimo);
                }}
                disabled={quantity <= product.pedido_minimo}
              >
                <span className="text-[#E49B0F] text-2xl font-medium">-</span>
              </Button>
              <div className="flex flex-col items-center gap-1">
                <label htmlFor="quantity" className="text-sm font-medium text-orange-600">Cantidad</label>
                <input
                  type="number"
                  id="quantity"
                  min={product.pedido_minimo}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="h-14 w-28 p-2 bg-white border-2 border-orange-300 rounded-lg text-center text-xl font-semibold shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
                />
              </div>
              <Button
                variant="outline"
                size="lg"
                className="h-14 w-14 bg-white border-orange-300 text-orange-600 hover:bg-orange-50 text-xl shadow-sm"
                onClick={() => {
                  handleQuantityChange(quantity + product.pedido_minimo);
                }}
              >
                <span className="text-[#E49B0F] text-2xl font-medium">+</span>
              </Button>
            </div>
            <div className="text-right">
              <div className="text-sm text-orange-600">Total</div>
              <div className="text-2xl font-semibold text-[#E49B0F]">{(price * quantity).toFixed(2)}€</div>
            </div>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="h-14 w-full bg-[#E49B0F] hover:bg-[#d38e0e] text-white text-lg font-medium flex items-center justify-center gap-3 rounded-xl shadow-sm transition-colors"
          >
            <ShoppingCart className="h-6 w-6" />
            {isAdding ? 'Añadiendo...' : 'Añadir al carrito'}
          </Button>
        </div>
      </div>
    </div>
  );
}
