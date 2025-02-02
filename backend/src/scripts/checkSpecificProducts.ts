import { supabase } from '../config/supabase';

async function checkSpecificProducts() {
  const codes = ['1199110114', '1199190121'];
  
  try {
    for (const code of codes) {
      console.log(`\nVerificando producto ${code}:`);
      
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          id,
          code,
          description,
          prices!inner (
            list_price,
            discount_1,
            custab_discount,
            custab_net,
            partner_discount,
            partner_net
          ),
          promotions (
            promo_discount,
            custab_promo_net,
            partner_promo_net
          )
        `)
        .eq('code', code)
        .eq('active', true)
        .single();

      if (error) {
        console.error('Error:', error);
        continue;
      }

      if (!product) {
        console.log('Producto no encontrado');
        continue;
      }

      const price = product.prices[0];
      console.log('Descripción:', product.description);
      console.log('\nPrecios en base de datos:');
      console.log('Precio base:', price.list_price + '€');
      
      // Calcular precio con descuentos para verificar
      const afterBaseDiscount = price.list_price * (1 - price.discount_1/100);
      
      console.log('\nCliente Custab:');
      const afterCustabDiscount = afterBaseDiscount * (1 - price.custab_discount/100);
      console.log('Descuento base:', price.discount_1 + '%');
      console.log('Descuento custab:', price.custab_discount + '%');
      console.log('Precio calculado:', afterCustabDiscount.toFixed(2) + '€');
      console.log('Precio en DB:', price.custab_net + '€');
      
      console.log('\nCliente Partner:');
      const afterPartnerDiscount = afterBaseDiscount * (1 - price.partner_discount/100);
      console.log('Descuento base:', price.discount_1 + '%');
      console.log('Descuento partner:', price.partner_discount + '%');
      console.log('Precio calculado:', afterPartnerDiscount.toFixed(2) + '€');
      console.log('Precio en DB:', price.partner_net + '€');
      
      if (product.promotions?.[0]) {
        const promo = product.promotions[0];
        console.log('\nPrecios con promoción:');
        console.log('Descuento promoción:', promo.promo_discount + '%');
        console.log('Precio promo custab en DB:', promo.custab_promo_net + '€');
        console.log('Precio promo partner en DB:', promo.partner_promo_net + '€');
      }
    }
  } catch (error) {
    console.error('Error en la verificación:', error);
  }
}

checkSpecificProducts();
