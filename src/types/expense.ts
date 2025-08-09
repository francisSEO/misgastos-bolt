export interface Expense {
  id?: string;
  userId: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  month: string; // YYYY-MM format
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface MonthlyReport {
  month: string;
  userId: string;
  totalAmount: number;
  categories: { [category: string]: number };
  expenseCount: number;
}

export interface CSVRow {
  fecha: string;
  importe: string | number;
  descripción: string;
  descripcion: string;
  categoría?: string;
  categoria?: string;
  [key: string]: any;
}