import { useState, useEffect } from 'react';
import { Expense } from '../types/expense';
import { FirebaseService } from '../services/firebaseService';

export function useExpenses(userId?: string, month?: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FirebaseService.getExpenses(userId, month);
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar gastos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [userId, month]);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const id = await FirebaseService.addExpense(expense);
      const newExpense = { ...expense, id };
      setExpenses(prev => [newExpense, ...prev]);
      return id;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al crear gasto');
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      await FirebaseService.updateExpense(id, updates);
      setExpenses(prev => prev.map(expense => 
        expense.id === id ? { ...expense, ...updates } : expense
      ));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al actualizar gasto');
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await FirebaseService.deleteExpense(id);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al eliminar gasto');
    }
  };

  const addExpensesBatch = async (expenses: Omit<Expense, 'id'>[]) => {
    try {
      await FirebaseService.addExpensesBatch(expenses);
      await fetchExpenses(); // Refresh the list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al importar gastos');
    }
  };

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    addExpensesBatch,
    refetch: fetchExpenses
  };
}