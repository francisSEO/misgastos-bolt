import { useState, useEffect } from 'react';
import { User } from '../types/expense';
import { FirebaseService } from '../services/firebaseService';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FirebaseService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (userData: Omit<User, 'id'>) => {
    try {
      const id = await FirebaseService.addUser(userData);
      const newUser = { ...userData, id };
      setUsers(prev => [...prev, newUser]);
      return id;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al crear usuario');
    }
  };

  return {
    users,
    loading,
    error,
    addUser,
    refetch: fetchUsers
  };
}