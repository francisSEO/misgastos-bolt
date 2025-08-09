import React, { useState, useEffect } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useUsers } from '../hooks/useUsers';
import { UserSelector } from '../components/UserSelector';
import { MonthSelector } from '../components/MonthSelector';
import { ExpensesList } from '../components/ExpensesList';
import { StatCard } from '../components/StatCard';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Download
} from 'lucide-react';
import { exportToCSV } from '../utils/csvProcessor';

export function Dashboard() {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  
  const { users, loading: usersLoading } = useUsers();
  const { 
    expenses, 
    loading: expensesLoading, 
    updateExpense, 
    deleteExpense 
  } = useExpenses(selectedUserId, selectedMonth);

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  const categoryCounts = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategory = Object.entries(categoryCounts).reduce(
    (max, [category, count]) => count > max.count ? { category, count } : max,
    { category: 'N/A', count: 0 }
  );

  const handleExport = () => {
    const filename = `gastos_${selectedUserId || 'todos'}_${selectedMonth || 'todos'}.csv`;
    exportToCSV(expenses, filename);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Resumen general de gastos y actividad reciente
          </p>
        </div>
        
        {expenses.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Filtros
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
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Gastos"
          value={totalExpenses}
          icon={DollarSign}
          color="green"
        />
        
        <StatCard
          title="Promedio por Gasto"
          value={averageExpense.toFixed(2)}
          icon={TrendingUp}
          color="blue"
        />
        
        <StatCard
          title="Número de Gastos"
          value={expenses.length}
          icon={Calendar}
          color="purple"
        />
        
        <StatCard
          title="Categoría Principal"
          value={topCategory.category}
          icon={BarChart3}
          color="yellow"
        />
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Gastos Recientes
            {expenses.length > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({expenses.length} gasto{expenses.length !== 1 ? 's' : ''})
              </span>
            )}
          </h2>
        </div>
        
        <div className="p-6">
          <ExpensesList
            expenses={expenses.slice(0, 10)} // Show only first 10
            onUpdateExpense={updateExpense}
            onDeleteExpense={deleteExpense}
            loading={expensesLoading}
          />
          
          {expenses.length > 10 && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Mostrando 10 de {expenses.length} gastos.
                Usa los filtros para refinar la búsqueda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}