import { supabase } from '../config/supabase';

async function backup() {
  try {
    // Obtener fecha actual para el nombre del backup
    const date = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Obtener productos de Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;
    
    // Crear backup en la tabla backups de Supabase
    const { error: backupError } = await supabase
      .from('backups')
      .insert({
        created_at: new Date().toISOString(),
        backup_name: `backup-${date}`,
        data: products
      });

    if (backupError) throw backupError;
    
    console.log(`Backup creado exitosamente con nombre: backup-${date}`);
    console.log(`Total de productos respaldados: ${products.length}`);
    
  } catch (error) {
    console.error('Error al crear el backup:', error);
  }
}

backup();
