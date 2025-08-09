import React, { useState } from 'react';
import { Expense } from '../types/expense';
import { 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Calendar,
  DollarSign,
  Tag,
  FileText 
} from 'lucide-react';
import { getCategories } from '../utils/categoryMapper';

interface ExpensesListProps {
  expenses: Expense[];
  onUpdateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  onDeleteExpense: (id: string) => Promise<void>;
  loading?: boolean;
}

interface EditingExpense extends Expense {
  isEditing: boolean;
}

export function ExpensesList({ 
  expenses, 
  onUpdateExpense, 
  onDeleteExpense, 
  loading 
}: ExpensesListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Expense>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const categories = getCategories();

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id || '');
    setEditForm({
      date: expense.date,
      amount: expense.amount,
      category: expense.category,
      description: expense.description
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    if (!editForm.date || !editForm.amount || !editForm.description) {
      return;
    }

    try {
      setActionLoading(id);
      
      const updates = {
        ...editForm,
        month: editForm.date!.substring(0, 7) // Update month based on new date
      };
      
      await onUpdateExpense(id, updates);
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating expense:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      return;
    }

    try {
      setActionLoading(id);
      await onDeleteExpense(id);
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay gastos registrados
        </h3>
        <p className="text-gray-500">
          Comienza importando un archivo CSV o añadiendo gastos manualmente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => {
        const isEditing = editingId === expense.id;
        const isLoading = actionLoading === expense.id;

        return (
          <div 
            key={expense.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
          >
            {isEditing ? (
              // Edit mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={editForm.date || ''}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Importe
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.amount || ''}
                      onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      value={editForm.category || ''}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={cancelEdit}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => saveEdit(expense.id!)}
                    disabled={isLoading}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar</span>
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 flex-1 min-w-0">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      {formatDate(expense.date)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-lg text-gray-900">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {expense.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 truncate">
                      {expense.description}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 ml-4">
                  <button
                    onClick={() => startEdit(expense)}
                    disabled={isLoading}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteExpense(expense.id!)}
                    disabled={isLoading}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}