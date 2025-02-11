import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CartItem } from '@/types/cart';

export const generateOrderPDF = (items: CartItem[], total: number) => {
  const doc = new jsPDF();
  const currentDate = new Date().toLocaleDateString();

  // Añadir encabezado
  doc.setFontSize(20);
  doc.text('Pedido BIC', 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Fecha: ${currentDate}`, 14, 30);

  // Preparar datos para la tabla
  const tableData = items.map(item => {
    const price = item.clientType === 'custab'
      ? (item.product.neto_promo_custab || item.product.neto_custab)
      : (item.product.neto_promo_partner || item.product.neto_partner);

    return [
      item.product.codigo,
      item.product.descripcion,
      item.quantity.toString(),
      `${price.toFixed(2)}€`,
      `${(price * item.quantity).toFixed(2)}€`,
      item.product.promocion_familia || '-'
    ];
  });

  // Añadir tabla
  autoTable(doc, {
    head: [['Código', 'Descripción', 'Cantidad', 'Precio/ud', 'Total', 'Promoción']],
    body: tableData,
    startY: 40,
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 60 },
      2: { cellWidth: 20, halign: 'right' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 35 }
    }
  });

  // Añadir total
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total: ${total.toFixed(2)}€`, 170, finalY + 10, { align: 'right' });

  // Guardar el PDF
  doc.save(`Pedido_BIC_${currentDate.replace(/\//g, '-')}.pdf`);
};
