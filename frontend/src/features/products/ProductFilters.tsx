import React from 'react';
import { Search, Filter } from 'lucide-react';

interface ProductFiltersProps {
  onSearchChange: (value: string) => void;
  onClientTypeChange: (type: 'custab' | 'partner') => void;
  search: string;
  clientType: 'custab' | 'partner';
}

export function ProductFilters({
  onSearchChange,
  onClientTypeChange,
  search,
  clientType
}: ProductFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#E49B0F] h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar por código o descripción..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E49B0F] focus:border-transparent transition-all duration-200 text-base"
        />
      </div>
      
      {/* Botones de tipo de cliente */}
      <div className="flex w-full justify-center gap-3">
        <button
          onClick={() => onClientTypeChange('custab')}
          className={`flex-1 max-w-[160px] py-3 rounded-lg transition-all duration-200 text-base font-medium ${
            clientType === 'custab'
              ? 'bg-[#E49B0F] text-white shadow-md'
              : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
          }`}
        >
          Custab
        </button>
        <button
          onClick={() => onClientTypeChange('partner')}
          className={`flex-1 max-w-[160px] py-3 rounded-lg transition-all duration-200 text-base font-medium ${
            clientType === 'partner'
              ? 'bg-[#E49B0F] text-white shadow-md'
              : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
          }`}
        >
          Partner
        </button>
      </div>
      </div>
    </div>
  );
}

export default ProductFilters;