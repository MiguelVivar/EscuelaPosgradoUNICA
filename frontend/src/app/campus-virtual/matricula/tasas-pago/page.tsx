"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common';
import { tasasPagoService } from '@/services/tasasPagoService';
import { programasEstudioService } from '@/services/programasEstudioService';
import { TasaPago, TasaPagoForm, TIPOS_TASA, MONEDAS } from '@/types/tasaPago';
import { ProgramaEstudio } from '@/types/programaEstudio';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaPowerOff,
  FaDollarSign,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaGraduationCap,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaCreditCard,
  FaUniversity,
  FaEye
} from 'react-icons/fa';

export default function TasasPagoPage() {
  const { user } = useAuth();
  const [tasasPago, setTasasPago] = useState<TasaPago[]>([]);
  const [programasEstudio, setProgramasEstudio] = useState<ProgramaEstudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrograma, setSelectedPrograma] = useState<number | ''>('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [selectedMoneda, setSelectedMoneda] = useState<string>('');
  const [showObligatorias, setShowObligatorias] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTasa, setEditingTasa] = useState<TasaPago | null>(null);
  const [formData, setFormData] = useState<TasaPagoForm>({
    concepto: '',
    codigo: '',
    monto: 0,
    moneda: 'PEN',
    tipo: '',
    obligatorio: false,
    descripcion: '',
    fechaVigenciaInicio: '',
    fechaVigenciaFin: '',
    programaEstudioId: 0
  });

  // Refs para animaciones
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Verificar permisos
  const canManage = user?.role === 'ADMIN' || user?.role === 'COORDINADOR';

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (statsRef.current) {
      const cards = statsRef.current.querySelectorAll('.stat-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }
      );
    }
  }, [tasasPago]);

  useEffect(() => {
    if (showModal && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, [showModal]);

  useEffect(() => {
    if (tasasPago.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tbody tr');
      gsap.fromTo(rows,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [tasasPago]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasasData, programasData] = await Promise.all([
        tasasPagoService.getTasasPago(),
        programasEstudioService.getProgramasActivos()
      ]);
      setTasasPago(tasasData);
      setProgramasEstudio(programasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTasas = tasasPago.filter(tasa => {
    const matchesSearch = tasa.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tasa.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tasa.programaEstudio.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrograma = selectedPrograma === '' || tasa.programaEstudio.id === selectedPrograma;
    const matchesTipo = selectedTipo === '' || tasa.tipo === selectedTipo;
    const matchesMoneda = selectedMoneda === '' || tasa.moneda === selectedMoneda;
    const matchesObligatoria = !showObligatorias || tasa.obligatorio;
    
    return matchesSearch && matchesPrograma && matchesTipo && matchesMoneda && matchesObligatoria;
  });

  const getTiposUnicos = () => {
    const tipos = tasasPago.map(tasa => tasa.tipo).filter(Boolean);
    return [...new Set(tipos)];
  };

  const openModal = (tasa?: TasaPago) => {
    if (tasa) {
      setEditingTasa(tasa);
      setFormData({
        concepto: tasa.concepto,
        codigo: tasa.codigo,
        monto: tasa.monto,
        moneda: tasa.moneda,
        tipo: tasa.tipo || '',
        obligatorio: tasa.obligatorio,
        descripcion: tasa.descripcion || '',
        fechaVigenciaInicio: tasa.fechaVigenciaInicio ? tasa.fechaVigenciaInicio.split('T')[0] : '',
        fechaVigenciaFin: tasa.fechaVigenciaFin ? tasa.fechaVigenciaFin.split('T')[0] : '',
        programaEstudioId: tasa.programaEstudio.id
      });
    } else {
      setEditingTasa(null);
      setFormData({
        concepto: '',
        codigo: '',
        monto: 0,
        moneda: 'PEN',
        tipo: '',
        obligatorio: false,
        descripcion: '',
        fechaVigenciaInicio: '',
        fechaVigenciaFin: '',
        programaEstudioId: 0
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTasa(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.programaEstudioId) {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar un programa de estudio',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    if (formData.monto <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'El monto debe ser mayor a 0',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    try {
      const tasaData = {
        concepto: formData.concepto,
        codigo: formData.codigo,
        monto: formData.monto,
        moneda: formData.moneda,
        tipo: formData.tipo || undefined,
        obligatorio: formData.obligatorio,
        descripcion: formData.descripcion || undefined,
        fechaVigenciaInicio: formData.fechaVigenciaInicio || undefined,
        fechaVigenciaFin: formData.fechaVigenciaFin || undefined,
        programaEstudioId: formData.programaEstudioId
      };

      if (editingTasa) {
        await tasasPagoService.updateTasaPago(editingTasa.id, tasaData);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Tasa de pago actualizada correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
      } else {
        await tasasPagoService.createTasaPago(tasaData);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Tasa de pago creada correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
      }

      closeModal();
      loadData();
    } catch (error: any) {
      console.error('Error al guardar tasa de pago:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Error al guardar la tasa de pago',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas ${currentStatus ? 'desactivar' : 'activar'} esta tasa de pago?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#f59e0b',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, cambiar estado',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await tasasPagoService.toggleActiveTasaPago(id);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Estado cambiado correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
        loadData();
      }
    } catch (error: any) {
      console.error('Error al cambiar estado:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Error al cambiar el estado',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
    }
  };

  const handleDelete = async (id: number, concepto: string) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar la tasa "${concepto}"? Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await tasasPagoService.deleteTasaPago(id);
        Swal.fire({
          title: '¡Eliminado!',
          text: 'Tasa de pago eliminada correctamente',
          icon: 'success',
          confirmButtonColor: '#f59e0b'
        });
        loadData();
      }
    } catch (error: any) {
      console.error('Error al eliminar tasa:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Error al eliminar la tasa de pago',
        icon: 'error',
        confirmButtonColor: '#f59e0b'
      });
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const formatters: { [key: string]: Intl.NumberFormat } = {
      PEN: new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }),
      USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
    };
    return formatters[currency]?.format(amount) || `${currency} ${amount}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No definida';
    try {
      return new Date(dateString).toLocaleDateString('es-PE');
    } catch {
      return 'Fecha inválida';
    }
  };

  const getMontoTotal = () => {
    return filteredTasas.reduce((sum, tasa) => sum + (tasa.moneda === 'PEN' ? tasa.monto : 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <FaFileInvoiceDollar className="mx-auto h-12 w-12 text-amber-600 animate-pulse mb-4" />
          <p className="text-gray-600">Cargando tasas de pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <FaFileInvoiceDollar className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">Gestión de Tasas de Pago</h1>
                <p className="text-amber-100">Administra las tasas académicas y administrativas</p>
              </div>
            </div>
            {canManage && (
              <Button
                variant="secondary"
                leftIcon={FaPlus}
                onClick={() => openModal()}
              >
                Nueva Tasa
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="stat-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasas</p>
                <p className="text-2xl font-bold text-gray-900">{tasasPago.length}</p>
              </div>
              <FaFileInvoiceDollar className="text-3xl text-blue-500" />
            </div>
          </div>

          <div className="stat-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-green-600">{tasasPago.filter(t => t.activo).length}</p>
              </div>
              <FaCheckCircle className="text-3xl text-green-500" />
            </div>
          </div>

          <div className="stat-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Obligatorias</p>
                <p className="text-2xl font-bold text-orange-600">{tasasPago.filter(t => t.obligatorio).length}</p>
              </div>
              <FaExclamationCircle className="text-3xl text-orange-500" />
            </div>
          </div>

          <div className="stat-card bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monto Total (PEN)</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(getMontoTotal(), 'PEN')}</p>
              </div>
              <FaMoneyBillWave className="text-3xl text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Search */}
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar tasas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Programa Filter */}
            <div>
              <select
                value={selectedPrograma}
                onChange={(e) => setSelectedPrograma(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                aria-label="Filtrar por programa"
              >
                <option value="">Todos los programas</option>
                {programasEstudio.map(programa => (
                  <option key={programa.id} value={programa.id}>{programa.nombre}</option>
                ))}
              </select>
            </div>

            {/* Tipo Filter */}
            <div>
              <select
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                aria-label="Filtrar por tipo"
              >
                <option value="">Todos los tipos</option>
                {TIPOS_TASA.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            {/* Moneda Filter */}
            <div>
              <select
                value={selectedMoneda}
                onChange={(e) => setSelectedMoneda(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                aria-label="Filtrar por moneda"
              >
                <option value="">Todas las monedas</option>
                {MONEDAS.map(moneda => (
                  <option key={moneda.value} value={moneda.value}>{moneda.label}</option>
                ))}
              </select>
            </div>

            {/* Solo Obligatorias */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showObligatorias}
                  onChange={(e) => setShowObligatorias(e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-11 h-6 transition duration-200 ease-linear rounded-full ${showObligatorias ? 'bg-amber-600' : 'bg-gray-200'}`}>
                  <div className={`absolute left-0 top-0 bg-white border-2 border-gray-300 rounded-full h-6 w-6 transition transform duration-100 ease-linear ${showObligatorias ? 'translate-x-full border-amber-600' : 'translate-x-0'}`}></div>
                </div>
                <span className="ml-3 text-sm text-gray-700">Solo obligatorias</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            Mostrando {filteredTasas.length} de {tasasPago.length} tasas de pago
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Programa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vigencia
                  </th>
                  {canManage && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasas.map((tasa, index) => (
                  <tr key={tasa.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            tasa.obligatorio ? 'bg-orange-100' : 'bg-blue-100'
                          }`}>
                            {tasa.obligatorio ? (
                              <FaExclamationCircle className="h-5 w-5 text-orange-600" />
                            ) : (
                              <FaFileInvoiceDollar className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{tasa.concepto}</div>
                          {tasa.descripcion && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{tasa.descripcion}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {tasa.codigo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaGraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">{tasa.programaEstudio.nombre}</div>
                          <div className="text-sm text-gray-500">{tasa.programaEstudio.codigo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaDollarSign className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(tasa.monto, tasa.moneda)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tasa.tipo && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tasa.tipo === 'MATRICULA' ? 'bg-blue-100 text-blue-800' :
                          tasa.tipo === 'PENSION' ? 'bg-green-100 text-green-800' :
                          tasa.tipo === 'DERECHO_GRADO' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {tasa.tipo}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tasa.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tasa.activo ? (
                            <>
                              <FaCheckCircle className="h-3 w-3 mr-1" />
                              Activa
                            </>
                          ) : (
                            <>
                              <FaTimesCircle className="h-3 w-3 mr-1" />
                              Inactiva
                            </>
                          )}
                        </span>
                        {tasa.obligatorio && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <FaExclamationCircle className="h-3 w-3 mr-1" />
                            Obligatoria
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <FaCalendarAlt className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs">
                            {formatDate(tasa.fechaVigenciaInicio)} - {formatDate(tasa.fechaVigenciaFin)}
                          </span>
                        </div>
                      </div>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openModal(tasa)}
                            className="text-amber-600 hover:text-amber-900 transition-colors duration-150"
                            title="Editar"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(tasa.id, tasa.activo)}
                            className={`transition-colors duration-150 ${
                              tasa.activo 
                                ? 'text-orange-600 hover:text-orange-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={tasa.activo ? 'Desactivar' : 'Activar'}
                          >
                            <FaPowerOff className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tasa.id, tasa.concepto)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-150"
                            title="Eliminar"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTasas.length === 0 && (
            <div className="text-center py-12">
              <FaFileInvoiceDollar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron tasas de pago</h3>
              <p className="text-gray-500">
                {searchTerm || selectedPrograma || selectedTipo 
                  ? 'Prueba ajustando los filtros de búsqueda'
                  : 'Aún no hay tasas de pago registradas'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingTasa ? 'Editar Tasa de Pago' : 'Nueva Tasa de Pago'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Concepto */}
                <div className="md:col-span-2">
                  <label htmlFor="concepto" className="block text-sm font-medium text-gray-700 mb-2">
                    Concepto *
                  </label>
                  <input
                    type="text"
                    id="concepto"
                    required
                    maxLength={100}
                    value={formData.concepto}
                    onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Ej: Matrícula Maestría en Educación"
                  />
                </div>

                {/* Código */}
                <div>
                  <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-2">
                    Código *
                  </label>
                  <input
                    type="text"
                    id="codigo"
                    required
                    maxLength={20}
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Ej: MAT-ME-001"
                  />
                </div>

                {/* Programa de Estudio */}
                <div>
                  <label htmlFor="programaEstudioId" className="block text-sm font-medium text-gray-700 mb-2">
                    Programa de Estudio *
                  </label>
                  <select
                    id="programaEstudioId"
                    required
                    value={formData.programaEstudioId}
                    onChange={(e) => setFormData({ ...formData, programaEstudioId: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value={0}>Seleccionar programa</option>
                    {programasEstudio.map(programa => (
                      <option key={programa.id} value={programa.id}>{programa.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Monto */}
                <div>
                  <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-2">
                    Monto *
                  </label>
                  <input
                    type="number"
                    id="monto"
                    required
                    min="0.01"
                    step="0.01"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                {/* Moneda */}
                <div>
                  <label htmlFor="moneda" className="block text-sm font-medium text-gray-700 mb-2">
                    Moneda
                  </label>
                  <select
                    id="moneda"
                    value={formData.moneda}
                    onChange={(e) => setFormData({ ...formData, moneda: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {MONEDAS.map(moneda => (
                      <option key={moneda.value} value={moneda.value}>{moneda.label}</option>
                    ))}
                  </select>
                </div>

                {/* Tipo */}
                <div>
                  <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    id="tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar tipo</option>
                    {TIPOS_TASA.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                {/* Fecha Inicio Vigencia */}
                <div>
                  <label htmlFor="fechaVigenciaInicio" className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Inicio Vigencia
                  </label>
                  <input
                    type="date"
                    id="fechaVigenciaInicio"
                    value={formData.fechaVigenciaInicio}
                    onChange={(e) => setFormData({ ...formData, fechaVigenciaInicio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Fecha Fin Vigencia */}
                <div>
                  <label htmlFor="fechaVigenciaFin" className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Fin Vigencia
                  </label>
                  <input
                    type="date"
                    id="fechaVigenciaFin"
                    value={formData.fechaVigenciaFin}
                    onChange={(e) => setFormData({ ...formData, fechaVigenciaFin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    maxLength={500}
                    rows={3}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Descripción detallada de la tasa de pago..."
                  />
                </div>

                {/* Obligatorio */}
                <div className="md:col-span-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.obligatorio}
                      onChange={(e) => setFormData({ ...formData, obligatorio: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`relative w-11 h-6 transition duration-200 ease-linear rounded-full ${formData.obligatorio ? 'bg-amber-600' : 'bg-gray-200'}`}>
                      <div className={`absolute left-0 top-0 bg-white border-2 border-gray-300 rounded-full h-6 w-6 transition transform duration-100 ease-linear ${formData.obligatorio ? 'translate-x-full border-amber-600' : 'translate-x-0'}`}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Es una tasa obligatoria
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Las tasas obligatorias deben ser pagadas para completar el proceso de matrícula
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeModal}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={editingTasa ? FaEdit : FaPlus}
                >
                  {editingTasa ? 'Actualizar' : 'Crear'} Tasa
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}