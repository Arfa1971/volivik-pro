import React from 'react';
import { Search, Filter } from 'lucide-react';

interface ProductFiltersProps {
  onSearchChange: (value: string) => void;
  onPromotionsChange: (checked: boolean) => void;
  onClientTypeChange: (type: 'custab' | 'partner') => void;
  search: string;
  showPromotionsOnly: boolean;
  clientType: 'custab' | 'partner';
}

export function ProductFilters({
  onSearchChange,
  onPromotionsChange,
  onClientTypeChange,
  search,
  showPromotionsOnly,
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
          <div className="flex items-center space-x-2">
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                id="promotions"
                checked={showPromotionsOnly}
                onChange={(e) => onPromotionsChange(e.target.checked)}
                className="peer h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all duration-200"
              />
              <label
                htmlFor="promotions"
                className="ml-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200"
              >
                Solo promociones
              </label>
            </div>
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={clientType}
              onChange={(e) => onClientTypeChange(e.target.value as 'custab' | 'partner')}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
            >
              <option value="custab">Custab</option>
              <option value="partner">Partner</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;
