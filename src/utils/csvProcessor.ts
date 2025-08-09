import Papa from 'papaparse';
import { CSVRow, Expense } from '../types/expense';
import { categorizeExpense } from './categoryMapper';

export interface ProcessCSVOptions {
  userId: string;
  file: File;
}

export interface ProcessCSVResult {
  success: boolean;
  expenses: Omit<Expense, 'id'>[];
  errors: string[];
  processed: number;
  skipped: number;
}

export function processCSVFile({ userId, file }: ProcessCSVOptions): Promise<ProcessCSVResult> {
  return new Promise((resolve) => {
    const expenses: Omit<Expense, 'id'>[] = [];
    const errors: string[] = [];
    let processed = 0;
    let skipped = 0;

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        results.data.forEach((row, index) => {
          try {
            const expense = processCSVRow(row, userId, index + 2); // +2 for header and 1-based indexing
            if (expense) {
              expenses.push(expense);
              processed++;
            } else {
              skipped++;
            }
          } catch (error) {
            errors.push(`Fila ${index + 2}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            skipped++;
          }
        });

        resolve({
          success: errors.length === 0,
          expenses,
          errors,
          processed,
          skipped
        });
      },
      error: (error) => {
        resolve({
          success: false,
          expenses: [],
          errors: [`Error al procesar archivo: ${error.message}`],
          processed: 0,
          skipped: 0
        });
      }
    });
  });
}

function processCSVRow(row: CSVRow, userId: string, rowNumber: number): Omit<Expense, 'id'> | null {
  // Handle different possible column names
  const date = row.fecha || row.date || row.Date || row.FECHA;
  const amount = row.importe || row.amount || row.Amount || row.IMPORTE;
  const description = row.descripción || row.descripcion || row.description || row.Description || row.DESCRIPCION;
  const category = row.categoría || row.categoria || row.category || row.Category || row.CATEGORIA;

  // Validate required fields
  if (!date) {
    throw new Error(`Fecha requerida`);
  }

  if (!amount && amount !== 0) {
    throw new Error(`Importe requerido`);
  }

  if (!description) {
    throw new Error(`Descripción requerida`);
  }

  // Process and validate date
  const processedDate = processDate(date);
  if (!processedDate) {
    throw new Error(`Formato de fecha inválido: ${date}`);
  }

  // Process and validate amount
  const processedAmount = processAmount(amount);
  if (processedAmount === null || processedAmount < 0) {
    throw new Error(`Importe inválido: ${amount}`);
  }

  // Process category
  const processedCategory = category || categorizeExpense(description);

  // Create month field (YYYY-MM)
  const month = processedDate.substring(0, 7);

  return {
    userId,
    date: processedDate,
    amount: processedAmount,
    description: description.trim(),
    category: processedCategory,
    month,
    createdAt: new Date().toISOString()
  };
}

function processDate(dateInput: any): string | null {
  if (!dateInput) return null;

  let date: Date;

  if (typeof dateInput === 'string') {
    // Try different date formats
    const formats = [
      // DD/MM/YYYY
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
      // DD-MM-YYYY
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
      // YYYY-MM-DD
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
      // MM/DD/YYYY
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    ];

    const input = dateInput.trim();
    
    // Try DD/MM/YYYY or DD-MM-YYYY
    const ddmmFormat = input.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (ddmmFormat) {
      const [, day, month, year] = ddmmFormat;
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      // Try standard Date parsing
      date = new Date(input);
    }
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return null;
  }

  // Validate date
  if (isNaN(date.getTime())) {
    return null;
  }

  // Return in YYYY-MM-DD format
  return date.toISOString().split('T')[0];
}

function processAmount(amountInput: any): number | null {
  if (amountInput === null || amountInput === undefined) return null;

  let amount: number;

  if (typeof amountInput === 'number') {
    amount = amountInput;
  } else if (typeof amountInput === 'string') {
    // Remove currency symbols, commas, and spaces
    const cleanAmount = amountInput
      .replace(/[$€£¥₹₽]/g, '')
      .replace(/[,\s]/g, '')
      .replace(',', '.');
    
    amount = parseFloat(cleanAmount);
  } else {
    return null;
  }

  return isNaN(amount) ? null : Math.round(amount * 100) / 100;
}

export function exportToCSV(expenses: Expense[], filename: string = 'expenses.csv'): void {
  const csvData = expenses.map(expense => ({
    'Fecha': expense.date,
    'Usuario': expense.userId,
    'Importe': expense.amount,
    'Categoría': expense.category,
    'Descripción': expense.description,
    'Mes': expense.month,
    'Creado': expense.createdAt
  }));

  const csv = Papa.unparse(csvData, {
    delimiter: ',',
    encoding: 'UTF-8'
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}