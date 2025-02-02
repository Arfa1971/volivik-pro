import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FileImage } from 'lucide-react';

interface ProductImagesProps {
  productCode: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-32 h-32',
  lg: 'w-full aspect-square'
};

export function ProductImages({ 
  productCode, 
  className = '', 
  size = 'md'
}: ProductImagesProps) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = supabase
    .storage
    .from('product-images')
    .getPublicUrl(`products/${productCode}.jpg`)
    .data?.publicUrl;

  console.log('Image URL:', {
    productCode,
    path: `products/${productCode}.jpg`,
    url: imageUrl
  });

  return (
    <div className={`${sizeClasses[size]} rounded-lg border overflow-hidden bg-gray-50 flex items-center justify-center ${className}`}>
      {!imageError && imageUrl ? (
        <img
          src={imageUrl}
          alt={`Producto ${productCode}`}
          className="w-full h-full object-contain"
          onError={() => setImageError(true)}
        />
      ) : (
        <FileImage 
          className={size === 'sm' ? 'h-4 w-4 text-gray-400' : 'h-12 w-12 text-gray-400'} 
        />
      )}
    </div>
  );
}
