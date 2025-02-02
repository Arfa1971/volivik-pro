import { ProductService } from '../services/ProductService';

async function checkAPI() {
  const service = new ProductService();
  
  try {
    console.log('Consultando productos desde el servicio...');
    const products = await service.findAll();
    
    // Buscar productos específicos
    const codes = ['1199110114', '1199190121'];
    
    for (const code of codes) {
      console.log(`\nVerificando producto ${code} desde la API:`);
      const product = products.find(p => p.codigo === code);
      
      if (!product) {
        console.log('Producto no encontrado en la respuesta de la API');
        continue;
      }
      
      console.log('Descripción:', product.descripcion);
      console.log('\nPrecios y descuentos:');
      console.log('Precio base:', product.precio_tarifa + '€');
      console.log('Descuento base:', product.descuento_1 + '%');
      
      console.log('\nCliente Custab:');
      console.log('Descuento custab:', product.descuento_custab + '%');
      console.log('Precio neto custab:', product.neto_custab + '€');
      if (product.neto_promo_custab) {
        console.log('Precio promo custab:', product.neto_promo_custab + '€');
      }
      
      console.log('\nCliente Partner:');
      console.log('Descuento partner:', product.descuento_partner + '%');
      console.log('Precio neto partner:', product.neto_partner + '€');
      if (product.neto_promo_partner) {
        console.log('Precio promo partner:', product.neto_promo_partner + '€');
      }
      
      if (product.descuento_promo_q) {
        console.log('\nPromoción:');
        console.log('Descuento promoción:', product.descuento_promo_q + '%');
      }
      
      // Mostrar el objeto completo para debugging
      console.log('\nObjeto completo del producto:');
      console.log(JSON.stringify(product, null, 2));
    }
    
  } catch (error) {
    console.error('Error al verificar la API:', error);
  }
}

checkAPI();
