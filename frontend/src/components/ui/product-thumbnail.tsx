import React from 'react';

interface ProductThumbnailProps {
  code: string;
  className?: string;
}

export function ProductThumbnail({ code, className = '' }: ProductThumbnailProps) {
  // Extraer el tipo de producto del código
  const getProductType = (code: string) => {
    const prefix = code.slice(0, 2);
    switch (prefix) {
      case '50': return 'Bolígrafo';
      case '92': return 'Marcador';
      case '89': return 'Corrector';
      case '94': return 'Lápiz';
      default: return 'BIC';
    }
  };

  // Obtener color basado en el código
  const getBackgroundColor = (code: string) => {
    const num = parseInt(code.slice(-2)) % 5;
    const colors = [
      'bg-blue-100 text-blue-700',   // Azul
      'bg-purple-100 text-purple-700', // Morado
      'bg-green-100 text-green-700',  // Verde
      'bg-orange-100 text-orange-700', // Naranja
      'bg-red-100 text-red-700',     // Rojo
    ];
    return colors[num];
  };

  const productType = getProductType(code);
  const bgColorClass = getBackgroundColor(code);

  return (
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${bgColorClass} ${className}`}>
      <span className="text-xs font-medium text-center leading-tight">
        {productType}
      </span>
    </div>
  );
}
