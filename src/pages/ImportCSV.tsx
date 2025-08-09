import React, { useState, useRef } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useExpenses } from '../hooks/useExpenses';
import { UserSelector } from '../components/UserSelector';
import { processCSVFile, ProcessCSVResult } from '../utils/csvProcessor';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Download
} from 'lucide-react';

export function ImportCSV() {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessCSVResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { users, loading: usersLoading } = useUsers();
  const { addExpensesBatch } = useExpenses();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setResult(null);
    } else {
      alert('Por favor selecciona un archivo CSV válido.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setResult(null);
    } else {
      alert('Por favor selecciona un archivo CSV válido.');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const processCSV = async () => {
    if (!selectedFile || !selectedUserId) {
      alert('Por favor selecciona un archivo CSV y un usuario.');
      return;
    }

    setProcessing(true);
    
    try {
      const processingResult = await processCSVFile({
        file: selectedFile,
        userId: selectedUserId
      });

      setResult(processingResult);

      if (processingResult.success && processingResult.expenses.length > 0) {
        await addExpensesBatch(processingResult.expenses);
      }
    } catch (error) {
      setResult({
        success: false,
        expenses: [],
        errors: [error instanceof Error ? error.message : 'Error desconocido'],
        processed: 0,
        skipped: 0
      });
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectedUser = users.find(user => user.id === selectedUserId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Importar Gastos desde CSV
        </h1>
        <p className="text-gray-600 mt-1">
          Sube un archivo CSV para importar gastos en lote
        </p>
      </div>

      {/* Instructions Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">
          Formato del archivo CSV
        </h2>
        <p className="text-blue-700 mb-4">
          Tu archivo CSV debe contener las siguientes columnas (los nombres pueden variar):
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Columnas requeridas:</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• <strong>fecha</strong> (DD/MM/YYYY o YYYY-MM-DD)</li>
              <li>• <strong>importe</strong> (número decimal)</li>
              <li>• <strong>descripción</strong> (texto descriptivo)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Columnas opcionales:</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• <strong>categoría</strong> (se asignará automáticamente si está vacía)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Import Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* User Selection */}
          <div>
            <UserSelector
              users={users}
              selectedUserId={selectedUserId}
              onUserChange={setSelectedUserId}
              loading={usersLoading}
            />
            {selectedUser && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">
                  Todos los gastos se asignarán a: <strong>{selectedUser.name}</strong>
                </p>
              </div>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo CSV
            </label>
            
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    Arrastra tu archivo CSV aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-gray-400">
                    Solo archivos CSV (máximo 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div>
              {selectedFile && (
                <button
                  onClick={resetForm}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Limpiar selección
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={processCSV}
                disabled={!selectedFile || !selectedUserId || processing}
                className="
                  px-6 py-2 bg-blue-600 text-white rounded-lg font-medium
                  hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                  transition-colors duration-200 flex items-center space-x-2
                "
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Importar Gastos</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            {result.success ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
            <h2 className="text-lg font-semibold text-gray-900">
              Resultado de la Importación
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Procesados</span>
              </div>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {result.processed}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">Omitidos</span>
              </div>
              <p className="text-2xl font-bold text-yellow-700 mt-1">
                {result.skipped}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900">Errores</span>
              </div>
              <p className="text-2xl font-bold text-red-700 mt-1">
                {result.errors.length}
              </p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-900 mb-2">
                Errores encontrados:
              </h3>
              <ul className="space-y-1 text-sm text-red-700">
                {result.errors.map((error, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.success && result.processed > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700">
                ¡Importación completada exitosamente! Se han procesado {result.processed} gastos 
                para {selectedUser?.name}.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}