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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por código o descripción..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <div className="flex items-center space-x-6 min-w-[300px]">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onClientTypeChange('custab')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                clientType === 'custab'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Custab
            </button>
            <button
              onClick={() => onClientTypeChange('partner')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                clientType === 'partner'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Partner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;