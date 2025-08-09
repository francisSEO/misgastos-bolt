import React, { useState, useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { useExpenses } from '../hooks/useExpenses';
import { useUsers } from '../hooks/useUsers';
import { UserSelector } from '../components/UserSelector';
import { MonthSelector } from '../components/MonthSelector';
import { StatCard } from '../components/StatCard';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart as PieChartIcon,
  BarChart3,
  Download
} from 'lucide-react';
import { exportToCSV } from '../utils/csvProcessor';

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
];

export function Summary() {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // Current month
  );

  const { users, loading: usersLoading } = useUsers();
  const { expenses, loading: expensesLoading } = useExpenses(selectedUserId, selectedMonth);

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  // Group by category for charts
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.category === expense.category);
    if (existing) {
      existing.amount += expense.amount;
      existing.count += 1;
    } else {
      acc.push({
        category: expense.category,
        amount: expense.amount,
        count: 1
      });
    }
    return acc;
  }, [] as Array<{ category: string; amount: number; count: number }>);

  // Sort by amount for better visualization
  categoryData.sort((a, b) => b.amount - a.amount);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.category}</p>
          <p className="text-blue-600">
            {formatCurrency(data.amount)}
          </p>
          <p className="text-sm text-gray-500">
            {data.count} gasto{data.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleExport = () => {
    const filename = `resumen_${selectedUserId || 'todos'}_${selectedMonth || 'todos'}.csv`;
    exportToCSV(expenses, filename);
  };

  const selectedUser = users.find(user => user.id === selectedUserId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Resumen de Gastos
          </h1>
          <p className="text-gray-600 mt-1">
            Análisis detallado por categorías y tendencias
          </p>
        </div>
        
        {expenses.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Filtros de Análisis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UserSelector
            users={users}
            selectedUserId={selectedUserId}
            onUserChange={setSelectedUserId}
            loading={usersLoading}
          />
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>
        
        {(selectedUser || selectedMonth) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              Analizando gastos 
              {selectedUser && <span> de <strong>{selectedUser.name}</strong></span>}
              {selectedMonth && (
                <span> para <strong>
                  {new Date(selectedMonth + '-01').toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </strong></span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total del Período"
          value={totalExpenses}
          icon={DollarSign}
          color="green"
        />
        
        <StatCard
          title="Promedio por Gasto"
          value={formatCurrency(averageExpense)}
          icon={TrendingUp}
          color="blue"
        />
        
        <StatCard
          title="Categorías Activas"
          value={categoryData.length}
          icon={PieChartIcon}
          color="purple"
        />
        
        <StatCard
          title="Total de Gastos"
          value={expenses.length}
          icon={BarChart3}
          color="yellow"
        />
      </div>

      {/* Charts Section */}
      {categoryData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Distribución por Categorías
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) => 
                      `${category} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Gastos por Categoría
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={(value) => `€${value}`}
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="amount" 
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <PieChartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay datos para mostrar
            </h3>
            <p className="text-gray-500">
              {expensesLoading 
                ? 'Cargando datos...' 
                : 'No se encontraron gastos para los filtros seleccionados. Ajusta los filtros o importa más datos.'
              }
            </p>
          </div>
        </div>
      )}

      {/* Category Details Table */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Detalle por Categorías
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gastos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promedio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % del Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryData.map((category, index) => (
                  <tr key={category.category} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="font-medium text-gray-900">
                          {category.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(category.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(category.amount / category.count)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {((category.amount / totalExpenses) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}