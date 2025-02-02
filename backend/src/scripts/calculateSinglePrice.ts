// Función para redondear a 2 decimales
function roundTo2Decimals(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function calculatePrice() {
  const basePrice = 128.92;
  const baseDiscount = 25;
  const custabDiscount = 5;
  const promoDiscount = 19;  // Según la captura

  console.log('=== Cálculo de precio para ST CDISPLAY CRISTAL RENEW21 SP ===');
  console.log('Precio base:', basePrice + '€');
  
  // Paso 1: Aplicar descuento base
  const afterBaseDiscount = roundTo2Decimals(basePrice * (1 - baseDiscount/100));
  console.log(`\n1. Después de descuento base (-${baseDiscount}%):`);
  console.log(`${basePrice} × (1 - ${baseDiscount}/100) = ${afterBaseDiscount}€`);
  
  // Paso 2: Aplicar descuento custab
  const afterCustabDiscount = roundTo2Decimals(afterBaseDiscount * (1 - custabDiscount/100));
  console.log(`\n2. Después de descuento custab (-${custabDiscount}%):`);
  console.log(`${afterBaseDiscount} × (1 - ${custabDiscount}/100) = ${afterCustabDiscount}€`);
  
  // Paso 3: Aplicar promoción
  const finalPrice = roundTo2Decimals(afterCustabDiscount * (1 - promoDiscount/100));
  console.log(`\n3. Después de promoción (-${promoDiscount}%):`);
  console.log(`${afterCustabDiscount} × (1 - ${promoDiscount}/100) = ${finalPrice}€`);
  
  console.log('\nPrecio final calculado:', finalPrice + '€');
  console.log('Precio en la captura: 73.49€');
  console.log('Diferencia:', roundTo2Decimals(Math.abs(finalPrice - 73.49)) + '€');
}

calculatePrice();
