import { supabase } from '../config/supabase';

export async function checkDatabase() {
  try {
    console.log('Verificando la base de datos...');

    // Verificar tabla tarifa_neta_bic
    const { data: products, error: productsError } = await supabase
      .from('tarifa_neta_bic')
      .select('*')
      .limit(1);

    if (productsError) {
      console.error('Error al verificar la tabla tarifa_neta_bic:', productsError);
      return false;
    }

    if (!products || products.length === 0) {
      console.warn('La tabla tarifa_neta_bic está vacía');
      return false;
    }

    console.log('✅ La tabla tarifa_neta_bic está correctamente configurada');
    return true;

  } catch (error) {
    console.error('Error al verificar la base de datos:', error);
    return false;
  }
}

// Ejecutar la verificación si se llama directamente
if (require.main === module) {
  checkDatabase();
}
