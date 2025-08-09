import React from 'react';
import { Calendar } from 'lucide-react';

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  // Generate months for the last 12 months
  const generateMonthOptions = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthValue = date.toISOString().slice(0, 7); // YYYY-MM
      const monthLabel = date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      months.push({ value: monthValue, label: monthLabel });
    }
    
    return months;
  };

  const months = generateMonthOptions();

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 mb-1">
        <Calendar className="w-4 h-4 text-gray-500" />
        <label className="text-sm font-medium text-gray-700">
          Seleccionar Mes
        </label>
      </div>
      
      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
        className="
          appearance-none w-full px-3 py-2 pr-8
          bg-white border border-gray-300 rounded-lg shadow-sm
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          text-gray-900 font-medium
          hover:border-gray-400 transition-colors duration-200
        "
      >
        <option value="">Todos los meses</option>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
    </div>
  );
}