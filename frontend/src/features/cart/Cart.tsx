import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, X, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { ProductThumbnail } from '@/components/ui/product-thumbnail';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

// Lista de familias que pueden tener la promoción de 10 cajas
const FAMILIAS_CON_PROMOCION = [
  "CRISTAL EXACT",
  "CRISTAL FINE",
  "CRISTAL LARGE",
  "CRISTAL SOFT",
  "CRISTAL FUN",
  "CRISTAL UP"
];

export default function Cart() {
  const { cartItems: cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Número de items por página

  const totalPages = Math.ceil(cart.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = cart.slice(startIndex, endIndex);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calcular total de cajas por familia
  const boxesByFamily = cart.reduce((acc, item) => {
    const family = item.product.familia_producto;
    acc[family] = (acc[family] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const totalAmount = cart.reduce((sum, item) => {
    // Obtener el precio base con promociones existentes
    const basePrice = item.clientType === 'custab'
      ? (item.product.neto_promo_custab || item.product.neto_custab)
      : (item.product.neto_promo_partner || item.product.neto_partner);

    // Solo aplicar la lógica de promoción de 10 cajas a las familias CRISTAL
    let finalPrice = basePrice;
    if (FAMILIAS_CON_PROMOCION.includes(item.product.familia_producto)) {
      const familyBoxes = boxesByFamily[item.product.familia_producto] || 0;
      if (familyBoxes >= 10) {
        // Calcular el precio base sin promociones
        const precioSinPromo = item.clientType === 'custab'
          ? item.product.neto_custab
          : item.product.neto_partner;
        finalPrice = precioSinPromo * 0.9; // Aplicar 10% de descuento al precio sin promo
      }
    }
    
    return sum + (finalPrice * item.quantity);
  }, 0);

  const handleQuantityChange = (productId: string, newQuantity: number, minOrder: number) => {
    if (newQuantity >= minOrder) {
      updateQuantity(productId, newQuantity);
    }
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const clientType = cart[0]?.clientType.toUpperCase() || '';
      const date = new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      // Añadir logo
      const logoPath = '/assets/logoBic.png';
      doc.addImage(logoPath, 'PNG', 20, 20, 40, 15);

      // Título y fecha
      doc.setTextColor(228, 155, 15); // Color naranja/dorado de la app
      doc.setFontSize(24);
      doc.text('Presupuesto', doc.internal.pageSize.width - 20, 30, { align: 'right' });
      
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(11);
      doc.text(`Fecha: ${date}`, doc.internal.pageSize.width - 20, 40, { align: 'right' });
      doc.text(`Cliente: ${clientType}`, doc.internal.pageSize.width - 20, 45, { align: 'right' });
      
      // Agregar BIC Iberia S.A.
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(14);
      doc.text('BIC Iberia S.A.', 20, 45);

      // Tabla de productos
      const tableData = cart.map(item => {
        // Obtener el precio base con promociones existentes
        const basePrice = item.clientType === 'custab'
          ? (item.product.neto_promo_custab || item.product.neto_custab)
          : (item.product.neto_promo_partner || item.product.neto_partner);
        
        // Solo aplicar la lógica de promoción de 10 cajas a las familias CRISTAL
        let price = basePrice;
        if (FAMILIAS_CON_PROMOCION.includes(item.product.familia_producto)) {
          const familyBoxes = boxesByFamily[item.product.familia_producto] || 0;
          if (familyBoxes >= 10) {
            // Calcular el precio base sin promociones
            const precioSinPromo = item.clientType === 'custab'
              ? item.product.neto_custab
              : item.product.neto_partner;
            price = precioSinPromo * 0.9; // Aplicar 10% de descuento al precio sin promo
          }
        }
        
        const tarifaBase = item.product.precio_tarifa;
        const baseDiscount = item.product.descuento_1;
        const clientDiscount = item.clientType === 'custab'
          ? item.product.descuento_custab
          : item.product.descuento_partner;
        const promoDiscount = item.product.descuento_promo_q;

        return [
          item.product.codigo,
          item.product.descripcion,
          formatPrice(tarifaBase),
          `${baseDiscount}%`,
          `${clientDiscount}%`,
          promoDiscount ? `${promoDiscount}%` : '-',
          formatPrice(price),
          item.quantity,
          formatPrice(price * item.quantity)
        ];
      });

      autoTable(doc, {
        startY: 60,
        head: [['Código', 'Descripción', 'Tarifa', 'Dto. Base', 'Dto. Cliente', 'Dto. Promo', 'Precio', 'Cantidad', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [228, 155, 15] }, // Color naranja/dorado de la app
        foot: [['', '', '', '', '', '', '', 'Total:', formatPrice(totalAmount)]],
        footStyles: { fillColor: [240, 240, 240], textColor: [228, 155, 15], fontStyle: 'bold' },
      });

      // Agregar nota sobre IVA
      const finalY = (doc as any).lastAutoTable?.finalY || 60;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('* Los precios no incluyen IVA', 20, finalY + 15);

      // Agregar leyendas centradas al pie de página
      doc.setFontSize(11);
      doc.setTextColor(128, 128, 128); // Gris para las leyendas
      
      // Calcular la posición Y para el pie de página (30 unidades desde abajo)
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 40;
      
      // Centrar el texto usando el ancho de la página
      const pageWidth = doc.internal.pageSize.width;
      
      // Primera línea: BIC Iberia S.A.
      doc.setFontSize(12);
      doc.text('BIC Iberia S.A.', pageWidth / 2, footerY, { align: 'center' });
      
      // Segunda línea: Validez del presupuesto
      doc.setFontSize(11);
      doc.text('Este presupuesto es válido durante 30 días desde la fecha de emisión.', 
              pageWidth / 2, footerY + 10, { align: 'center' });
      
      // Tercera línea: Contacto
      doc.text('Para cualquier consulta, no dude en contactar con su representante comercial.', 
              pageWidth / 2, footerY + 20, { align: 'center' });

      doc.save(`presupuesto_${clientType.toLowerCase()}_${date}.pdf`);
      toast.success('Presupuesto generado correctamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error('Error al generar el presupuesto');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative border-orange-200 hover:bg-orange-100 hover:text-orange-600"
        >
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge 
              variant="default" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-[#E49B0F] hover:bg-[#E49B0F]"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col bg-white">
        <SheetHeader className="border-b border-orange-100 pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/assets/logoBic.png" alt="BIC Logo" className="h-8" />
                <SheetTitle className="text-xl font-semibold text-[#E49B0F]">
                  Presupuesto BIC
                </SheetTitle>
              </div>

            </div>
            {cart.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                    clearCart();
                    toast.success('Carrito vaciado correctamente');
                  }
                }}
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              >
                Vaciar carrito
              </Button>
            )}
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-auto py-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-orange-200" />
              <p>No hay productos en el carrito</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentItems.map((item) => {
                let price;
                if (FAMILIAS_CON_PROMOCION.includes(item.product.familia_producto)) {
                  // Para familias CRISTAL, usar precio base y aplicar 10% si hay 10+ cajas
                  const basePrice = item.clientType === 'custab'
                    ? item.product.neto_custab
                    : item.product.neto_partner;
                  
                  const familyBoxes = boxesByFamily[item.product.familia_producto] || 0;
                  price = familyBoxes >= 10 ? basePrice * 0.9 : basePrice;
                } else {
                  // Para otras familias, usar el precio con promo si existe
                  price = item.clientType === 'custab'
                    ? (item.product.neto_promo_custab || item.product.neto_custab)
                    : (item.product.neto_promo_partner || item.product.neto_partner);
                }
                
                return (
                  <div key={item.product.id} className="relative bg-white rounded-lg shadow-sm border border-orange-100 hover:border-orange-200 transition-colors overflow-hidden">
                    {/* Cabecera del producto */}
                    <div className="p-4 flex items-start gap-4">
                      <ProductThumbnail code={item.product.codigo} className="w-20 h-20 sm:w-16 sm:h-16 rounded-lg border border-orange-100" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-lg sm:text-base text-orange-900 leading-tight">{item.product.descripcion}</h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="text-base sm:text-sm font-medium text-orange-600">{item.product.codigo}</span>
                          <span className="text-sm text-orange-500">{item.product.familia_producto}</span>
                        </div>
                        {/* Promociones */}
                        {FAMILIAS_CON_PROMOCION.includes(item.product.familia_producto) && 
                         boxesByFamily[item.product.familia_producto] >= 10 && (
                          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                            <Tag className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">10% dto. por volumen</span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-50 hover:text-red-600 rounded-full"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Controles de cantidad y precio */}
                    <div className="p-4 bg-orange-50/50 border-t border-orange-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 border-orange-200 bg-white text-orange-600 hover:bg-orange-50"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - item.product.pedido_minimo, item.product.pedido_minimo)}
                          disabled={item.quantity <= item.product.pedido_minimo}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value), item.product.pedido_minimo)}
                          className="h-9 w-16 text-center border border-orange-200 rounded-md bg-white text-base font-medium"
                          min={item.product.pedido_minimo}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 border-orange-200 bg-white text-orange-600 hover:bg-orange-50"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + item.product.pedido_minimo, item.product.pedido_minimo)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-orange-600">Precio: {formatPrice(price)}€</div>
                        <div className="text-lg font-semibold text-[#E49B0F]">Total: {formatPrice(price * item.quantity)}€</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-orange-100 hover:text-orange-600"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-4 mt-6 pb-4">
                  <div className="flex justify-center items-center gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="h-12 px-6 border-orange-200 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="h-12 px-6 border-orange-200 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50"
                    >
                      Siguiente
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-orange-600">
                    <span className="font-medium">Página {currentPage}</span>
                    <span>de</span>
                    <span className="font-medium">{totalPages}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="border-t border-orange-100 pt-4 bg-white rounded-t-xl shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between mb-4 px-4">
              <span className="text-lg font-semibold text-orange-900">Total</span>
              <span className="text-lg font-semibold text-[#E49B0F]">{formatPrice(totalAmount)}€</span>
            </div>
            <Button 
              className="w-full bg-[#E49B0F] hover:bg-[#E49B0F]/90" 
              onClick={generatePDF}
            >
              Generar PDF
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
