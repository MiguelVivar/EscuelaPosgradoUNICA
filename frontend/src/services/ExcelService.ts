import { API_CONFIG, getAuthHeaders } from '@/lib/api';
import * as XLSX from 'xlsx';

export interface ExcelImportResult {
  success: boolean;
  message: string;
  details?: string;
}

/**
 * Servicio para manejar operaciones de Excel en el frontend
 */
export class ExcelService {
  
  /**
   * Exporta usuarios a Excel
   */
  static async exportUsuarios(): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/usuarios/exportar-excel`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Crear blob y descargar archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Obtener el nombre del archivo de los headers o usar uno por defecto
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'usuarios_exportados.xlsx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=(.+)/);
        if (filenameMatch) {
          filename = filenameMatch[1].replace(/"/g, '');
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al exportar usuarios:', error);
      throw new Error('Error al exportar usuarios. Por favor, intente nuevamente.');
    }
  }

  /**
   * Descarga la plantilla de Excel para importar usuarios
   */
  static async descargarPlantilla(): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/usuarios/plantilla-excel`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Crear blob y descargar archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plantilla_usuarios.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar plantilla:', error);
      throw new Error('Error al descargar la plantilla. Por favor, intente nuevamente.');
    }
  }

  /**
   * Importa usuarios desde un archivo Excel
   */
  static async importUsuarios(file: File): Promise<ExcelImportResult> {
    try {
      // Validar archivo
      if (!file) {
        return {
          success: false,
          message: 'Debe seleccionar un archivo'
        };
      }

      if (!file.name.endsWith('.xlsx')) {
        return {
          success: false,
          message: 'El archivo debe ser de formato Excel (.xlsx)'
        };
      }

      // Preparar FormData
      const formData = new FormData();
      formData.append('file', file);

      // Headers sin Content-Type para FormData
      const headers: HeadersInit = {};
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          headers['Authorization'] = `Bearer ${storedToken}`;
        }
      }

      // Enviar archivo al backend
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/usuarios/importar-excel`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || `Error HTTP: ${response.status}`,
          details: result.details
        };
      }

      return {
        success: result.success,
        message: result.message,
        details: result.details
      };
    } catch (error) {
      console.error('Error al importar usuarios:', error);
      return {
        success: false,
        message: 'Error al importar usuarios. Por favor, verifique el archivo e intente nuevamente.',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Valida un archivo Excel antes de enviarlo (validación del lado cliente)
   */
  static async validateExcelFile(file: File): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Validar extensión
      if (!file.name.endsWith('.xlsx')) {
        errors.push('El archivo debe tener extensión .xlsx');
      }

      // Validar tamaño (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        errors.push('El archivo es demasiado grande. Máximo permitido: 10MB');
      }

      // Leer archivo y validar estructura básica
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        
        if (!workbook.SheetNames.length) {
          errors.push('El archivo no contiene hojas de cálculo');
          return { isValid: false, errors };
        }

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Validar que tenga al menos header y una fila de datos
        if (!jsonData || jsonData.length < 2) {
          errors.push('El archivo debe contener al menos un header y una fila de datos');
        }

        // Validar headers mínimos requeridos
        const headers = jsonData[0] as string[];
        const requiredHeaders = ['Username', 'Email', 'Password', 'Nombres', 'Apellidos', 'Rol'];
        
        for (const requiredHeader of requiredHeaders) {
          if (!headers.includes(requiredHeader)) {
            errors.push(`Falta el header requerido: ${requiredHeader}`);
          }
        }

        // Validar que tenga datos (excluyendo filas de ejemplo si las hay)
        const dataRows = jsonData.slice(1).filter((row: unknown) => {
          const rowArray = row as unknown[];
          // Filtrar filas vacías
          return rowArray && rowArray.some((cell: unknown) => cell && cell.toString().trim() !== '');
        });

        if (dataRows.length === 0) {
          errors.push('El archivo no contiene datos para importar');
        }

      } catch (xlsxError) {
        console.error('Error al procesar el archivo Excel:', xlsxError);
        if (xlsxError instanceof Error) {
          if (xlsxError.message.includes('ZIP') || xlsxError.message.includes('Corrupt')) {
            errors.push('El archivo parece estar corrupto o no es un archivo Excel válido');
          } else if (xlsxError.message.includes('password') || xlsxError.message.includes('encrypted')) {
            errors.push('El archivo Excel está protegido con contraseña. Por favor, guarde una versión sin protección');
          } else {
            errors.push(`Error al leer el archivo Excel: ${xlsxError.message}`);
          }
        } else {
          errors.push('Error al leer el archivo. Asegúrese de que sea un archivo Excel válido (.xlsx)');
        }
      }

    } catch (error) {
      console.error('Error general al validar archivo:', error);
      if (error instanceof Error) {
        errors.push(`Error al validar el archivo: ${error.message}`);
      } else {
        errors.push('Error desconocido al validar el archivo');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Previsualizacion del contenido del archivo Excel
   */
  static async previewExcelContent(file: File): Promise<{
    success: boolean;
    data?: unknown[][];
    headers?: string[];
    error?: string;
  }> {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!jsonData || jsonData.length === 0) {
        return {
          success: false,
          error: 'El archivo está vacío'
        };
      }

      const headers = jsonData[0] as string[];
      const dataRows = jsonData.slice(1, 6) as unknown[][]; // Mostrar solo las primeras 5 filas

      return {
        success: true,
        headers,
        data: dataRows
      };
    } catch (error) {
      console.error('Error al previsualizar archivo Excel:', error);
      let errorMessage = 'Error al leer el archivo';
      
      if (error instanceof Error) {
        if (error.message.includes('ZIP') || error.message.includes('Corrupt')) {
          errorMessage = 'El archivo parece estar corrupto o no es un archivo Excel válido';
        } else if (error.message.includes('password') || error.message.includes('encrypted')) {
          errorMessage = 'El archivo Excel está protegido con contraseña';
        } else {
          errorMessage = `Error al procesar el archivo: ${error.message}`;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}
