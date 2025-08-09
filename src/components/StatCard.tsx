import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
  trend?: {
    value: number;
    label: string;
  };
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  red: 'bg-red-50 text-red-600 border-red-200',
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  trend 
}: StatCardProps) {
  const colorClass = colorClasses[color];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' && title.includes('€') 
              ? new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(value)
              : value
            }
          </p>
          {trend && (
            <p className={`text-sm mt-2 ${
              trend.value > 0 
                ? 'text-green-600' 
                : trend.value < 0 
                  ? 'text-red-600' 
                  : 'text-gray-500'
            }`}>
              {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        
        <div className={`
          flex items-center justify-center w-12 h-12 rounded-lg border
          ${colorClass}
        `}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}