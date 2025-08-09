import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  writeBatch 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Expense, User } from '../types/expense';

export class FirebaseService {
  // Expenses
  static async addExpense(expense: Omit<Expense, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'expenses'), {
      ...expense,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }

  static async addExpensesBatch(expenses: Omit<Expense, 'id'>[]): Promise<void> {
    const batch = writeBatch(db);
    const expensesRef = collection(db, 'expenses');

    expenses.forEach((expense) => {
      const docRef = doc(expensesRef);
      batch.set(docRef, {
        ...expense,
        createdAt: new Date().toISOString()
      });
    });

    await batch.commit();
  }

  static async getExpenses(userId?: string, month?: string): Promise<Expense[]> {
    let q = query(collection(db, 'expenses'), orderBy('date', 'desc'));

    if (userId) {
      q = query(q, where('userId', '==', userId));
    }

    if (month) {
      q = query(q, where('month', '==', month));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Expense[];
  }

  static async updateExpense(id: string, updates: Partial<Expense>): Promise<void> {
    const docRef = doc(db, 'expenses', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  static async deleteExpense(id: string): Promise<void> {
    await deleteDoc(doc(db, 'expenses', id));
  }

  // Users
  static async addUser(user: Omit<User, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'users'), {
      ...user,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }

  static async getUsers(): Promise<User[]> {
    const querySnapshot = await getDocs(
      query(collection(db, 'users'), orderBy('name'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
  }

  // Statistics
  static async getMonthlyStats(userId: string, month: string) {
    const expenses = await this.getExpenses(userId, month);
    
    const stats = {
      totalAmount: 0,
      categories: {} as { [key: string]: number },
      expenseCount: expenses.length
    };

    expenses.forEach(expense => {
      stats.totalAmount += expense.amount;
      stats.categories[expense.category] = 
        (stats.categories[expense.category] || 0) + expense.amount;
    });

    return stats;
  }
}