import React from 'react';
import { User } from '../types/expense';
import { User as UserIcon, ChevronDown } from 'lucide-react';

interface UserSelectorProps {
  users: User[];
  selectedUserId: string;
  onUserChange: (userId: string) => void;
  loading?: boolean;
}

export function UserSelector({ users, selectedUserId, onUserChange, loading }: UserSelectorProps) {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 mb-1">
        <UserIcon className="w-4 h-4 text-gray-500" />
        <label className="text-sm font-medium text-gray-700">
          Seleccionar Usuario
        </label>
      </div>
      
      <div className="relative">
        <select
          value={selectedUserId}
          onChange={(e) => onUserChange(e.target.value)}
          className="
            appearance-none w-full px-3 py-2 pr-8
            bg-white border border-gray-300 rounded-lg shadow-sm
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            text-gray-900 font-medium
            hover:border-gray-400 transition-colors duration-200
          "
        >
          <option value="">Todos los usuarios</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}