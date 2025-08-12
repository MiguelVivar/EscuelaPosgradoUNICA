'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaCalendarCheck, 
  FaGraduationCap, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaToggleOn, 
  FaToggleOff, 
  FaEdit, 
  FaPowerOff, 
  FaInfoCircle,
  FaPlus,
  FaSearch
} from 'react-icons/fa';

interface PeriodoAcademico {
  id: number;
  nombre: string;
  codigo: string;
  anio: string;
  semestre: string;
  fechaInicio: string;
  fechaFin: string;
  fechaInicioMatricula: string;
  fechaFinMatricula: string;
  descripcion: string;
  activo: boolean;
  habilitado: boolean;
}

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  leftIcon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  leftIcon: Icon, 
  children, 
  type = 'button' 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {Icon && <Icon className="mr-2" />}
      {children}
    </button>
  );
};

export default function PeriodosAcademicosPage() {
  const [periodos, setPeriodos] = useState<PeriodoAcademico[]>([]);
  const [filteredPeriodos, setFilteredPeriodos] = useState<PeriodoAcademico[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPeriodo, setEditingPeriodo] = useState<PeriodoAcademico | null>(null);
  const [loading, setLoading] = useState(true);
  const canManage = true; // Placeholder para permisos
  const tableRef = useRef<HTMLTableElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    anio: new Date().getFullYear().toString(),
    semestre: 'I',
    fechaInicio: '',
    fechaFin: '',
    fechaInicioMatricula: '',
    fechaFinMatricula: '',
    descripcion: '',
    habilitado: true
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-PE');
  };

  const updateCodigoIfEmpty = (anio: string, semestre: string) => {
    if (!formData.codigo || formData.codigo === `${formData.anio}-${formData.semestre}`) {
      setFormData(prev => ({...prev, codigo: `${anio}-${semestre}`}));
    }
  };

  const handleEdit = (periodo: PeriodoAcademico) => {
    setEditingPeriodo(periodo);
    setFormData({
      nombre: periodo.nombre,
      codigo: periodo.codigo,
      anio: periodo.anio,
      semestre: periodo.semestre,
      fechaInicio: periodo.fechaInicio,
      fechaFin: periodo.fechaFin,
      fechaInicioMatricula: periodo.fechaInicioMatricula,
      fechaFinMatricula: periodo.fechaFinMatricula,
      descripcion: periodo.descripcion,
      habilitado: periodo.habilitado
    });
    setShowModal(true);
  };

  const handleToggleActive = (periodo: PeriodoAcademico) => {
    // Implementar toggle de estado activo
    console.log('Toggle active para período:', periodo.id);
  };

  const handleToggleHabilitado = (periodo: PeriodoAcademico) => {
    // Implementar toggle de habilitado
    console.log('Toggle habilitado para período:', periodo.id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPeriodo(null);
    setFormData({
      nombre: '',
      codigo: '',
      anio: new Date().getFullYear().toString(),
      semestre: 'I',
      fechaInicio: '',
      fechaFin: '',
      fechaInicioMatricula: '',
      fechaFinMatricula: '',
      descripcion: '',
      habilitado: true
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de envío
    console.log('Enviar formulario:', formData);
    handleCloseModal();
  };

  useEffect(() => {
    // Simular carga de datos
    const mockPeriodos: PeriodoAcademico[] = [
      {
        id: 1,
        nombre: '2025-I',
        codigo: '2025-I',
        anio: '2025',
        semestre: 'I',
        fechaInicio: '2025-03-18',
        fechaFin: '2025-07-26',
        fechaInicioMatricula: '2025-01-15',
        fechaFinMatricula: '2025-03-15',
        descripcion: 'Primer semestre académico 2025',
        activo: true,
        habilitado: true
      },
      {
        id: 2,
        nombre: '2024-II',
        codigo: '2024-II',
        anio: '2024',
        semestre: 'II',
        fechaInicio: '2024-08-19',
        fechaFin: '2024-12-20',
        fechaInicioMatricula: '2024-06-15',
        fechaFinMatricula: '2024-08-15',
        descripcion: 'Segundo semestre académico 2024',
        activo: false,
        habilitado: false
      }
    ];
    
    setTimeout(() => {
      setPeriodos(mockPeriodos);
      setFilteredPeriodos(mockPeriodos);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = periodos.filter(periodo =>
      periodo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      periodo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      periodo.anio.includes(searchTerm)
    );
    setFilteredPeriodos(filtered);
  }, [periodos, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando períodos académicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Períodos Académicos</h1>
              <p className="text-gray-600 mt-1">Gestiona los períodos académicos y de matrícula</p>
            </div>
            {canManage && (
              <Button
                variant="primary"
                onClick={() => setShowModal(true)}
                leftIcon={FaPlus}
              >
                Nuevo Período
              </Button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, código o año..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table ref={tableRef} className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Año/Semestre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período Académico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                {canManage && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPeriodos.map((periodo) => (
                <tr key={periodo.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <FaCalendarAlt className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{periodo.nombre}</div>
                        {periodo.descripcion && (
                          <div className="text-sm text-gray-500 mt-1">{periodo.descripcion}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {periodo.codigo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaClock className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{periodo.anio}</div>
                        <div className="text-sm text-gray-500">Semestre {periodo.semestre}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaCalendarCheck className="text-gray-400 mr-2 flex-shrink-0" />
                      <div className="text-sm text-gray-900">
                        <div>{formatDate(periodo.fechaInicio)}</div>
                        <div className="text-gray-500">al {formatDate(periodo.fechaFin)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaGraduationCap className="text-gray-400 mr-2 flex-shrink-0" />
                      <div className="text-sm text-gray-900">
                        <div>{formatDate(periodo.fechaInicioMatricula)}</div>
                        <div className="text-gray-500">al {formatDate(periodo.fechaFinMatricula)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        periodo.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {periodo.activo ? (
                          <>
                            <FaCheckCircle className="mr-1" />
                            Activo
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="mr-1" />
                            Inactivo
                          </>
                        )}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        periodo.habilitado 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {periodo.habilitado ? (
                          <>
                            <FaToggleOn className="mr-1" />
                            Habilitado
                          </>
                        ) : (
                          <>
                            <FaToggleOff className="mr-1" />
                            Deshabilitado
                          </>
                        )}
                      </span>
                    </div>
                  </td>
                  {canManage && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {periodo.activo && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleHabilitado(periodo)}
                            leftIcon={periodo.habilitado ? FaToggleOn : FaToggleOff}
                          >
                            {periodo.habilitado ? 'Deshabilitar' : 'Habilitar'}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(periodo)}
                          leftIcon={FaEdit}
                        >
                          Editar
                        </Button>
                        <Button
                          variant={periodo.activo ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => handleToggleActive(periodo)}
                          leftIcon={FaPowerOff}
                        >
                          {periodo.activo ? 'Desactivar' : 'Reactivar'}
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPeriodos.length === 0 && (
            <div className="text-center py-12">
              <FaInfoCircle className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron períodos académicos</h3>
              <p className="text-gray-500">
                {searchTerm
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Aún no hay períodos académicos registrados en el sistema'
                }
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div ref={modalRef} className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <form onSubmit={handleSubmit}>
              {/* Header del Modal */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <FaCalendarAlt className="text-amber-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {editingPeriodo ? 'Editar Período Académico' : 'Nuevo Período Académico'}
                      </h2>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      type="button"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

              {/* Contenido del Modal */}
              <div className="p-6 space-y-6">
                {/* Información Básica */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código del Período *
                    </label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder={`ej: ${formData.anio}-${formData.semestre} (auto-generado)`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Período *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="ej: 2024-I"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Año *
                    </label>
                    <input
                      type="number"
                      value={formData.anio}
                      onChange={(e) => {
                        const newAnio = e.target.value;
                        setFormData({...formData, anio: newAnio});
                        updateCodigoIfEmpty(newAnio, formData.semestre);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      min="2020"
                      max="2030"
                      placeholder="2025"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Semestre *
                    </label>
                    <select
                      value={formData.semestre}
                      onChange={(e) => {
                        const newSemestre = e.target.value;
                        setFormData({...formData, semestre: newSemestre});
                        updateCodigoIfEmpty(formData.anio, newSemestre);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      title="Seleccionar semestre"
                      required
                    >
                      <option value="I">I</option>
                      <option value="II">II</option>
                      <option value="VERANO">Verano</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="habilitado"
                      checked={formData.habilitado}
                      onChange={(e) => setFormData({...formData, habilitado: e.target.checked})}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <label htmlFor="habilitado" className="ml-2 text-sm font-medium text-gray-700">
                      Habilitar período para matrícula
                    </label>
                  </div>
                </div>

                {/* Fechas del Período Académico */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Período Académico</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Inicio *
                      </label>
                      <input
                        type="date"
                        value={formData.fechaInicio}
                        onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        title="Fecha de inicio del período académico"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Fin *
                      </label>
                      <input
                        type="date"
                        value={formData.fechaFin}
                        onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        title="Fecha de fin del período académico"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Fechas de Matrícula */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">🎓 Período de Matrícula</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Inicio de Matrícula *
                      </label>
                      <input
                        type="date"
                        value={formData.fechaInicioMatricula}
                        onChange={(e) => setFormData({...formData, fechaInicioMatricula: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        title="Fecha de inicio de matrícula"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fin de Matrícula *
                      </label>
                      <input
                        type="date"
                        value={formData.fechaFinMatricula}
                        onChange={(e) => setFormData({...formData, fechaFinMatricula: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        title="Fecha de fin de matrícula"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Descripción opcional del período académico"
                  />
                </div>
              </div>

              {/* Footer del Modal */}
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={handleCloseModal}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                >
                  {editingPeriodo ? 'Actualizar' : 'Crear'} Período
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
