"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FiCalendar, FiPlus, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight, FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import Link from "next/link";
import { matriculaService, PeriodoAcademico, PeriodoForm } from "@/services/matriculaService";
import ServiceStatus from "@/components/ui/ServiceStatus";

export default function PeriodosAcademicosPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [periodos, setPeriodos] = useState<PeriodoAcademico[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPeriodo, setEditingPeriodo] = useState<PeriodoAcademico | null>(null);
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(null);
  const [formData, setFormData] = useState<PeriodoForm>({
    codigo: "",
    nombre: "",
    anio: new Date().getFullYear().toString(),
    semestre: "I",
    fechaInicio: "",
    fechaFin: "",
    fechaInicioMatricula: "",
    fechaFinMatricula: "",
    habilitado: false,
    descripcion: ""
  });

  // Verificar autenticación y autorización
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/iniciar-sesion");
        return;
      }
      
      if (user && user.role !== 'ADMIN' && user.role !== 'COORDINADOR') {
        router.push("/campus-virtual");
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Auto-generar código cuando cambian año o semestre
  const updateCodigoIfEmpty = (anio: string, semestre: string) => {
    if (anio && semestre) {
      const newCodigo = `${anio}-${semestre}`;
      // Solo actualizar si el código está vacío o si coincide con el patrón auto-generado anterior
      if (!formData.codigo || formData.codigo === "" || formData.codigo.match(/^\d{4}-(I|II|VERANO)$/)) {
        setFormData(prev => ({
          ...prev,
          codigo: newCodigo
        }));
      }
    }
  };

  // Auto-generar código inicial cuando se abre el modal para nuevo período
  useEffect(() => {
    if (showModal && !editingPeriodo && formData.anio && formData.semestre && !formData.codigo) {
      const codigoInicial = `${formData.anio}-${formData.semestre}`;
      setFormData(prev => ({
        ...prev,
        codigo: codigoInicial
      }));
    }
  }, [showModal, editingPeriodo, formData.anio, formData.semestre, formData.codigo]);

  // Cargar períodos académicos
  useEffect(() => {
    if (isAuthenticated && user) {
      loadPeriodos();
    }
  }, [isAuthenticated, user]);

  // Verificar estado del servicio al cargar
  useEffect(() => {
    checkServiceStatus();
  }, []);

  const checkServiceStatus = async () => {
    console.log("🔍 [DEBUG] Verificando estado del servicio de matrícula...");
    const isAvailable = await matriculaService.checkHealth();
    console.log("🔍 [DEBUG] Estado del servicio:", isAvailable);
    setServiceAvailable(isAvailable);
  };

  const loadPeriodos = async () => {
    try {
      setLoading(true);
      console.log("🔍 [DEBUG] Iniciando carga de períodos académicos...");
      console.log("🔍 [DEBUG] Usuario autenticado:", isAuthenticated);
      console.log("🔍 [DEBUG] Usuario actual:", user);
      
      // Verificar token en localStorage
      const token = localStorage.getItem('authToken');
      console.log("🔍 [DEBUG] Token en localStorage:", token ? "Presente" : "Ausente");
      
      // Llamar al servicio
      console.log("🔍 [DEBUG] Llamando a matriculaService.getPeriodosAcademicos()...");
      const periodosData = await matriculaService.getPeriodosAcademicos();
      console.log("🔍 [DEBUG] Respuesta del servicio:", periodosData);
      console.log("🔍 [DEBUG] Número de períodos recibidos:", Array.isArray(periodosData) ? periodosData.length : 'No es array');
      
      setPeriodos(periodosData);
      console.log("🔍 [DEBUG] Períodos establecidos en el estado");
    } catch (error) {
      console.error("❌ [ERROR] Error al cargar períodos:", error);
      console.error("❌ [ERROR] Tipo de error:", typeof error);
      console.error("❌ [ERROR] Stack trace:", error instanceof Error ? error.stack : 'No stack available');
      
      // Manejo específico para errores 403
      if (error instanceof Error && error.message.includes('403')) {
        console.log("🔍 [DEBUG] Error 403 detectado - sesión expirada");
        Swal.fire({
          icon: "error",
          title: "Acceso Denegado",
          text: "Tu sesión ha expirado o no tienes permisos para acceder a esta información. Por favor, inicia sesión nuevamente.",
          confirmButtonText: "Ir a Login",
          showCancelButton: true,
          cancelButtonText: "Reintentar"
        }).then((result) => {
          if (result.isConfirmed) {
            // Limpiar sesión y redirigir al login
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            router.push('/iniciar-sesion');
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Reintentar la carga
            loadPeriodos();
          }
        });
        return;
      }
      
      // Otros errores
      console.log("🔍 [DEBUG] Mostrando mensaje de error de conexión");
      Swal.fire({
        icon: "error",
        title: "Error de Conexión",
        text: "No se pudieron cargar los períodos académicos. Verifica que el microservicio de Matrícula esté ejecutándose.",
        footer: "¿El contenedor docker-compose está activo?"
      });
    } finally {
      setLoading(false);
      console.log("🔍 [DEBUG] Carga de períodos finalizada");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validaciones básicas
      if (!formData.nombre || !formData.anio || !formData.semestre) {
        Swal.fire({
          icon: "warning",
          title: "Campos requeridos",
          text: "Por favor completa todos los campos obligatorios"
        });
        return;
      }

      // Generar código automáticamente si está vacío
      const codigoFinal = formData.codigo?.trim() || `${formData.anio}-${formData.semestre}`;
      
      // Verificar duplicados antes de crear (solo para nuevos períodos)
      if (!editingPeriodo) {
        const existePeriodo = periodos.some(p => 
          p.codigo.toLowerCase() === codigoFinal.toLowerCase() ||
          (p.anio === formData.anio && p.semestre === formData.semestre)
        );
        
        if (existePeriodo) {
          Swal.fire({
            icon: "warning",
            title: "Período Duplicado",
            text: `Ya existe un período académico para ${formData.anio}-${formData.semestre}`,
            footer: "Verifica los períodos existentes o edita el período actual"
          });
          return;
        }
      }
      
      // Crear el objeto de datos con código garantizado
      const dataToSend: PeriodoForm = {
        ...formData,
        codigo: codigoFinal
      };

      console.log('Datos a enviar:', dataToSend); // Debug

      // Validar fechas
      const fechaInicio = new Date(formData.fechaInicio);
      const fechaFin = new Date(formData.fechaFin);
      const fechaInicioMatricula = new Date(formData.fechaInicioMatricula);
      const fechaFinMatricula = new Date(formData.fechaFinMatricula);

      if (fechaInicio >= fechaFin) {
        Swal.fire({
          icon: "warning",
          title: "Fechas inválidas",
          text: "La fecha de inicio debe ser anterior a la fecha de fin"
        });
        return;
      }

      if (fechaInicioMatricula >= fechaFinMatricula) {
        Swal.fire({
          icon: "warning",
          title: "Fechas inválidas",
          text: "La fecha de inicio de matrícula debe ser anterior a la fecha de fin"
        });
        return;
      }

      // Mostrar indicador de carga
      Swal.fire({
        title: editingPeriodo ? 'Actualizando...' : 'Creando período...',
        text: 'Por favor espera mientras se procesa la solicitud',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      if (editingPeriodo) {
        // Actualizar período existente
        const updatedPeriodo = await matriculaService.updatePeriodoAcademico(editingPeriodo.id, dataToSend);
        const updatedPeriodos = periodos.map(p => 
          p.id === editingPeriodo.id ? updatedPeriodo : p
        );
        setPeriodos(updatedPeriodos);
        
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "El período académico ha sido actualizado exitosamente"
        });
      } else {
        // Crear nuevo período
        const newPeriodo = await matriculaService.createPeriodoAcademico(dataToSend);
        
        // Recargar la lista completa para asegurar sincronización
        await loadPeriodos();
        
        Swal.fire({
          icon: "success",
          title: "¡Creado!",
          text: `Período académico "${newPeriodo.codigo}" creado exitosamente`,
          timer: 2000,
          showConfirmButton: false
        });
      }

      handleCloseModal();
    } catch (error: any) {
      console.error("Error al guardar período:", error);
      
      // Manejo específico para errores de duplicados
      if (error.message && (
        error.message.includes('ya existe') || 
        error.message.includes('duplicate') ||
        error.message.includes('UNIQUE constraint') ||
        error.message.includes('Duplicate entry')
      )) {
        Swal.fire({
          icon: "warning",
          title: "Período Duplicado",
          text: `El período académico "${formData.codigo || `${formData.anio}-${formData.semestre}`}" ya existe en la base de datos.`,
          footer: "La página se actualizará para mostrar todos los períodos",
          confirmButtonText: "Actualizar lista"
        }).then(() => {
          // Recargar la lista para mostrar el período que ya existe
          loadPeriodos();
        });
      } else {
        // Otros errores
        Swal.fire({
          icon: "error",
          title: "Error al guardar",
          text: error.message || "No se pudo guardar el período académico. Verifica la conexión con el servidor.",
          footer: "Si el problema persiste, verifica que el microservicio de Matrícula esté ejecutándose"
        });
      }
    }
  };

  const handleEdit = (periodo: PeriodoAcademico) => {
    setEditingPeriodo(periodo);
    setFormData({
      codigo: periodo.codigo,
      nombre: periodo.nombre,
      anio: periodo.anio,
      semestre: periodo.semestre,
      fechaInicio: periodo.fechaInicio.split('T')[0],
      fechaFin: periodo.fechaFin.split('T')[0],
      fechaInicioMatricula: periodo.fechaInicioMatricula.split('T')[0],
      fechaFinMatricula: periodo.fechaFinMatricula.split('T')[0],
      habilitado: periodo.habilitado,
      descripcion: periodo.descripcion || ""
    });
    setShowModal(true);
  };

  const handleDeactivate = async (periodo: PeriodoAcademico) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Se desactivará el período académico "${periodo.nombre}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        // Mostrar indicador de carga
        Swal.fire({
          title: 'Desactivando...',
          text: 'Por favor espera mientras se desactiva el período',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await matriculaService.deletePeriodoAcademico(periodo.id);
        
        // Recargar la lista completa para asegurar sincronización
        await loadPeriodos();
        
        Swal.fire({
          icon: "success",
          title: "¡Desactivado!",
          text: `El período académico "${periodo.codigo}" ha sido desactivado`,
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error al desactivar",
          text: error.message || "No se pudo desactivar el período académico",
          footer: "Verifica que no existan dependencias asociadas al período"
        });
      }
    }
  };

  const handleReactivate = async (periodo: PeriodoAcademico) => {
    const result = await Swal.fire({
      title: "¿Reactivar período?",
      text: `Se reactivará el período académico "${periodo.nombre}"`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, reactivar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        // Mostrar indicador de carga
        Swal.fire({
          title: 'Reactivando...',
          text: 'Por favor espera mientras se reactiva el período',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Crear un nuevo período con los mismos datos (ya que delete es permanente)
        const dataToReactivate: PeriodoForm = {
          codigo: periodo.codigo,
          nombre: periodo.nombre,
          anio: periodo.anio,
          semestre: periodo.semestre,
          fechaInicio: periodo.fechaInicio.split('T')[0],
          fechaFin: periodo.fechaFin.split('T')[0],
          fechaInicioMatricula: periodo.fechaInicioMatricula.split('T')[0],
          fechaFinMatricula: periodo.fechaFinMatricula.split('T')[0],
          habilitado: false, // Lo reactivamos pero deshabilitado por seguridad
          descripcion: periodo.descripcion || ""
        };

        await matriculaService.createPeriodoAcademico(dataToReactivate);
        
        // Recargar la lista completa para asegurar sincronización
        await loadPeriodos();
        
        Swal.fire({
          icon: "success",
          title: "¡Reactivado!",
          text: `El período académico "${periodo.codigo}" ha sido reactivado`,
          footer: "El período ha sido reactivado como 'deshabilitado'. Puedes habilitarlo usando el botón de toggle.",
          timer: 3000,
          showConfirmButton: false
        });
      } catch (error: any) {
        console.error("Error al reactivar período:", error);
        
        // Manejo específico para errores de duplicados
        if (error.message && (
          error.message.includes('ya existe') || 
          error.message.includes('duplicate') ||
          error.message.includes('UNIQUE constraint') ||
          error.message.includes('Duplicate entry')
        )) {
          Swal.fire({
            icon: "info",
            title: "Período ya existe",
            text: `El período académico "${periodo.codigo}" ya existe activo en la base de datos.`,
            footer: "La página se actualizará para mostrar el estado actual",
            confirmButtonText: "Actualizar lista"
          }).then(() => {
            loadPeriodos();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al reactivar",
            text: error.message || "No se pudo reactivar el período académico",
            footer: "Verifica la conexión con el servidor"
          });
        }
      }
    }
  };

  const handleToggleHabilitado = async (periodo: PeriodoAcademico) => {
    try {
      const updatedPeriodo = await matriculaService.togglePeriodoHabilitado(periodo.id);
      const updatedPeriodos = periodos.map(p => 
        p.id === periodo.id ? updatedPeriodo : p
      );
      setPeriodos(updatedPeriodos);
      
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: `Período ${updatedPeriodo.habilitado ? 'habilitado' : 'deshabilitado'} para matrícula`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo cambiar el estado del período"
      });
    }
  };

  const handleRefreshList = async () => {
    setLoading(true);
    await loadPeriodos();
    Swal.fire({
      icon: "success",
      title: "Lista actualizada",
      text: "Los períodos académicos se han recargado desde el servidor",
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPeriodo(null);
    setFormData({
      codigo: "",
      nombre: "",
      anio: new Date().getFullYear().toString(),
      semestre: "I",
      fechaInicio: "",
      fechaFin: "",
      fechaInicioMatricula: "",
      fechaFinMatricula: "",
      habilitado: false,
      descripcion: ""
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando Períodos Académicos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || (user.role !== 'ADMIN' && user.role !== 'COORDINADOR')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Link 
                  href="/campus-virtual/matricula"
                  className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200 rounded-xl p-3"
                >
                  <FiArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <FiCalendar className="w-8 h-8 text-blue-600" />
                    Períodos Académicos
                    <ServiceStatus 
                      isAvailable={serviceAvailable}
                      serviceName="Matrícula"
                      onRetry={checkServiceStatus}
                    />
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Gestiona los períodos académicos y habilita procesos de matrícula
                    {!serviceAvailable && serviceAvailable !== null && (
                      <span className="block text-sm text-red-600 mt-1">
                        El microservicio de Matrícula no está disponible. Verifica Docker Compose.
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefreshList}
                  disabled={serviceAvailable === false}
                  className={`px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium ${
                    serviceAvailable === false
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  title={serviceAvailable === false ? 'Servicio no disponible' : 'Actualizar lista'}
                >
                  <FiRefreshCw className="w-5 h-5" />
                  Actualizar
                </button>
                
                <button
                  onClick={() => setShowModal(true)}
                  disabled={serviceAvailable === false}
                  className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium ${
                    serviceAvailable === false
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                  }`}
                  title={serviceAvailable === false ? 'Servicio no disponible' : 'Crear nuevo período'}
                >
                  <FiPlus className="w-5 h-5" />
                  Nuevo Período
                </button>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="text-blue-700 text-sm font-medium">Total Períodos</div>
                <div className="text-2xl font-bold text-blue-800">{periodos.length}</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="text-green-700 text-sm font-medium">Habilitados</div>
                <div className="text-2xl font-bold text-green-800">
                  {periodos.filter(p => p.habilitado).length}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="text-amber-700 text-sm font-medium">Activos</div>
                <div className="text-2xl font-bold text-amber-800">
                  {periodos.filter(p => p.activo).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Períodos */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando períodos académicos...</p>
            </div>
          ) : periodos.length === 0 ? (
            <div className="p-8 text-center">
              <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              {serviceAvailable === false ? (
                <>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Servicio de Matrícula No Disponible</h3>
                  <p className="text-gray-600 mb-4">
                    El microservicio de Matrícula no está ejecutándose.<br/>
                    Verifica que Docker Compose esté activo e incluya el servicio de matrícula.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <p className="text-amber-800 text-sm">
                      <strong>Para activar el servicio:</strong><br/>
                      1. Asegúrate de que Docker esté ejecutándose<br/>
                      2. Ejecuta: <code className="bg-amber-100 px-2 py-1 rounded">docker-compose up -d</code><br/>
                      3. Verifica que el puerto 8082 esté disponible
                    </p>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Recargar Página
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No hay períodos académicos</h3>
                  <p className="text-gray-600 mb-4">La base de datos está vacía. Comienza creando tu primer período académico</p>
                  <div className="flex items-center gap-3 justify-center">
                    <button
                      onClick={handleRefreshList}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      Verificar si hay datos
                    </button>
                    <button
                      onClick={() => setShowModal(true)}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Crear Primer Período
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Período</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Código</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Año/Semestre</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Período Académico</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Período Matrícula</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {periodos.map((periodo) => (
                    <tr key={periodo.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{periodo.nombre}</div>
                        {periodo.descripcion && (
                          <div className="text-sm text-gray-500 mt-1">{periodo.descripcion}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {periodo.codigo}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{periodo.anio}</div>
                        <div className="text-sm text-gray-500">Semestre {periodo.semestre}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>{formatDate(periodo.fechaInicio)}</div>
                        <div className="text-gray-500">al {formatDate(periodo.fechaFin)}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>{formatDate(periodo.fechaInicioMatricula)}</div>
                        <div className="text-gray-500">al {formatDate(periodo.fechaFinMatricula)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            periodo.activo 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {periodo.activo ? 'Activo' : 'Inactivo'}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            periodo.habilitado 
                              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {periodo.habilitado ? 'Habilitado' : 'Deshabilitado'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {periodo.activo ? (
                            <>
                              <button
                                onClick={() => handleToggleHabilitado(periodo)}
                                className={`p-2 rounded-lg transition-colors ${
                                  periodo.habilitado
                                    ? 'text-green-600 hover:bg-green-50 border border-green-200'
                                    : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                                title={periodo.habilitado ? 'Deshabilitar' : 'Habilitar'}
                              >
                                {periodo.habilitado ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
                              </button>
                              <button
                                onClick={() => handleEdit(periodo)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                                title="Editar"
                              >
                                <FiEdit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeactivate(periodo)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                                title="Desactivar"
                              >
                                <FiTrash2 className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleReactivate(periodo)}
                                className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200 text-sm font-medium flex items-center gap-2"
                                title="Reactivar período"
                              >
                                <FiRefreshCw className="w-4 h-4" />
                                Reactivar
                              </button>
                              <button
                                onClick={() => handleEdit(periodo)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                                title="Ver/Editar (solo lectura)"
                                disabled
                              >
                                <FiEdit className="w-5 h-5 opacity-50" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              {/* Header del Modal */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FiCalendar className="w-6 h-6" />
                  {editingPeriodo ? 'Editar Período Académico' : 'Nuevo Período Académico'}
                </h2>
                <p className="text-blue-100 mt-2">
                  {editingPeriodo ? 'Modifica los datos del período académico' : 'Completa la información del nuevo período'}
                </p>
              </div>

              {/* Contenido del Modal */}
              <div className="p-6 space-y-6">
                {/* Información Básica */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código del Período *
                    </label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`ej: ${formData.anio}-${formData.semestre} (auto-generado)`}
                      title="Si se deja vacío, se generará automáticamente como: AÑO-SEMESTRE"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Se genera automáticamente si se deja vacío: {formData.anio}-{formData.semestre}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Período *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ej: 2024-I"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Año *
                    </label>
                    <input
                      type="number"
                      placeholder="2025"
                      value={formData.anio}
                      onChange={(e) => {
                        const newAnio = e.target.value;
                        setFormData({...formData, anio: newAnio});
                        updateCodigoIfEmpty(newAnio, formData.semestre);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="2020"
                      max="2030"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semestre *
                    </label>
                    <select
                      value={formData.semestre}
                      onChange={(e) => {
                        const newSemestre = e.target.value;
                        setFormData({...formData, semestre: newSemestre});
                        updateCodigoIfEmpty(formData.anio, newSemestre);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      title="Seleccionar semestre académico"
                      required
                    >
                      <option value="I">I</option>
                      <option value="II">II</option>
                      <option value="VERANO">Verano</option>
                    </select>
                  </div>
                </div>

                {/* Fechas del Período Académico */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Período Académico</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Inicio *
                      </label>
                      <input
                        type="date"
                        placeholder="2025-01-01"
                        value={formData.fechaInicio}
                        onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Fin *
                      </label>
                      <input
                        type="date"
                        placeholder="2025-06-30"
                        value={formData.fechaFin}
                        onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inicio de Matrícula *
                      </label>
                      <input
                        type="date"
                        placeholder="2025-01-01"
                        value={formData.fechaInicioMatricula}
                        onChange={(e) => setFormData({...formData, fechaInicioMatricula: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fin de Matrícula *
                      </label>
                      <input
                        type="date"
                        placeholder="2025-01-31"
                        value={formData.fechaFinMatricula}
                        onChange={(e) => setFormData({...formData, fechaFinMatricula: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Configuración */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Configuración</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="habilitado"
                        checked={formData.habilitado}
                        onChange={(e) => setFormData({...formData, habilitado: e.target.checked})}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="habilitado" className="text-sm font-medium text-gray-700">
                        Habilitar período para matrícula
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <textarea
                        value={formData.descripcion}
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Descripción opcional del período académico"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer del Modal */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                >
                  {editingPeriodo ? 'Actualizar Período' : 'Crear Período'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
