"use client";

import React, { useState, useRef } from 'react';
import { FaFileExcel, FaDownload, FaUpload, FaFileImport, FaEye, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { ExcelService } from '@/services/ExcelService';

interface ExcelManagerProps {
  onImportComplete?: () => void;
  className?: string;
}

interface FilePreview {
  headers: string[];
  data: unknown[][];
  fileName: string;
}

export const ExcelManager: React.FC<ExcelManagerProps> = ({ 
  onImportComplete, 
  className = "" 
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportUsuarios = async () => {
    setIsExporting(true);
    try {
      await ExcelService.exportUsuarios();
      
      await Swal.fire({
        title: '¡Éxito!',
        text: 'Usuarios exportados correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al exportar:', error);
      await Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al exportar usuarios',
        icon: 'error'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      await ExcelService.descargarPlantilla();
      
      await Swal.fire({
        title: '¡Plantilla descargada!',
        text: 'Use esta plantilla para importar usuarios',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al descargar plantilla:', error);
      await Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al descargar la plantilla',
        icon: 'error'
      });
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setValidationErrors([]);
    setFilePreview(null);
    setShowPreview(false);

    // Validar archivo
    try {
      const validation = await ExcelService.validateExcelFile(file);
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        await Swal.fire({
          title: 'Archivo inválido',
          html: `
            <div class="text-left">
              <p class="mb-2">Se encontraron los siguientes errores:</p>
              <ul class="list-disc list-inside text-red-600">
                ${validation.errors.map(error => `<li>${error}</li>`).join('')}
              </ul>
            </div>
          `,
          icon: 'error'
        });
        return;
      }

      // Generar preview
      const preview = await ExcelService.previewExcelContent(file);
      if (preview.success && preview.headers && preview.data) {
        setFilePreview({
          headers: preview.headers,
          data: preview.data,
          fileName: file.name
        });
      }
    } catch (error) {
      console.error('Error al validar archivo:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Error al validar el archivo',
        icon: 'error'
      });
    }
  };

  const handleImportUsuarios = async () => {
    if (!selectedFile) return;

    const result = await Swal.fire({
      title: '¿Confirmar importación?',
      html: `
        <div class="text-left">
          <p class="mb-2">Se importará el archivo: <strong>${selectedFile.name}</strong></p>
          <p class="text-sm text-gray-600">Esta acción creará nuevos usuarios en el sistema.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, importar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    setIsImporting(true);
    try {
      const importResult = await ExcelService.importUsuarios(selectedFile);
      
      if (importResult.success) {
        await Swal.fire({
          title: '¡Importación completada!',
          html: `<pre class="text-left text-sm whitespace-pre-wrap">${importResult.message}</pre>`,
          icon: 'success',
          confirmButtonText: 'Entendido'
        });
        
        // Limpiar estado
        setSelectedFile(null);
        setFilePreview(null);
        setShowPreview(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Notificar que se completó la importación
        if (onImportComplete) {
          onImportComplete();
        }
      } else {
        await Swal.fire({
          title: 'Importación con errores',
          html: `<pre class="text-left text-sm whitespace-pre-wrap">${importResult.message}</pre>`,
          icon: 'warning',
          confirmButtonText: 'Entendido'
        });
      }
    } catch (error) {
      console.error('Error en importación:', error);
      await Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al importar usuarios',
        icon: 'error'
      });
    } finally {
      setIsImporting(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setShowPreview(false);
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
          <FaFileExcel className="mr-2 text-green-600" />
          Gestión de Archivos Excel
        </h3>
        <p className="text-sm text-gray-600">
          Importe y exporte usuarios utilizando archivos de Excel
        </p>
      </div>

      {/* Botones de Exportación y Plantilla */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleExportUsuarios}
          disabled={isExporting}
          className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Exportando...
            </div>
          ) : (
            <>
              <FaDownload className="mr-2" />
              Exportar Usuarios
            </>
          )}
        </button>

        <button
          onClick={handleDownloadTemplate}
          disabled={isDownloadingTemplate}
          className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isDownloadingTemplate ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Descargando...
            </div>
          ) : (
            <>
              <FaFileImport className="mr-2" />
              Descargar Plantilla
            </>
          )}
        </button>
      </div>

      {/* Sección de Importación */}
      <div className="border-t pt-6">
        <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center">
          <FaUpload className="mr-2 text-orange-600" />
          Importar Usuarios desde Excel
        </h4>

        {/* Selector de Archivo */}
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            onChange={handleFileSelect}
            className="hidden"
            id="excel-file-input"
          />
          <label
            htmlFor="excel-file-input"
            className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <div className="text-center">
              <FaFileExcel className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                {selectedFile ? selectedFile.name : 'Haz clic para seleccionar un archivo Excel (.xlsx)'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Máximo 10MB
              </p>
            </div>
          </label>
        </div>

        {/* Errores de Validación */}
        {validationErrors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h5 className="text-sm font-medium text-red-800 mb-2">Errores encontrados:</h5>
            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Archivo Seleccionado */}
        {selectedFile && validationErrors.length === 0 && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaFileExcel className="text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">{selectedFile.name}</p>
                  <p className="text-xs text-green-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {filePreview && (
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <FaEye className="mr-1" />
                    {showPreview ? 'Ocultar' : 'Vista previa'}
                  </button>
                )}
                <button
                  onClick={clearSelection}
                  className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                >
                  <FaTimes className="mr-1" />
                  Quitar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vista Previa */}
        {showPreview && filePreview && (
          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h5 className="text-sm font-medium text-gray-800 mb-3">Vista previa del archivo:</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    {filePreview.headers.map((header, index) => (
                      <th
                        key={index}
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filePreview.data.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          {String(cell) || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Mostrando las primeras 5 filas del archivo
            </p>
          </div>
        )}

        {/* Botón de Importación */}
        {selectedFile && validationErrors.length === 0 && (
          <button
            onClick={handleImportUsuarios}
            disabled={isImporting}
            className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isImporting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Importando usuarios...
              </div>
            ) : (
              <>
                <FaUpload className="mr-2" />
                Importar Usuarios
              </>
            )}
          </button>
        )}
      </div>

      {/* Instrucciones */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="text-sm font-medium text-blue-800 mb-2">Instrucciones:</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>1. Descargue la plantilla de Excel para ver el formato correcto</li>
          <li>2. Complete los datos de los usuarios en la plantilla</li>
          <li>3. Elimine las filas de ejemplo antes de importar</li>
          <li>4. Seleccione el archivo y revise la vista previa</li>
          <li>5. Haga clic en "Importar Usuarios" para completar el proceso</li>
        </ul>
      </div>
    </div>
  );
};
