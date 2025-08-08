"use client";
import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/common";
import Swal from "sweetalert2";
import { gsap } from "gsap";
import {
  FaSearch,
  FaEye,
  FaDownload,
  FaUpload,
  FaInfoCircle,
  FaCheckCircle,
  FaGraduationCap,
  FaUserGraduate,
  FaFilter,
  FaTimes,
  FaEdit,
  FaMapMarkerAlt,
  FaFileExcel,
  FaCreditCard,
  FaMoneyBillWave,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  Estudiante,
  FiltrosEstudiante,
  EstudianteEstadisticas,
} from "@/types/estudiante";
import { Sede } from "@/types/sede";
import { PagoEstudiante, EstadoPago } from "@/types/pagoEstudiante";
import { estudiantesService } from "@/services/estudiantesService";
import { sedesService } from "@/services/sedesService";
import { pagosEstudianteService } from "@/services/pagosEstudianteService";

// Interfaces locales para formularios
interface EstudianteCompleto extends Omit<Estudiante, "fechaIngreso"> {
  sedeId?: number;
  fechaIngreso?: string | Date;
}

interface EditFormData {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  estado: "INGRESANTE" | "ACTIVO" | "RESERVADO" | "GRADUADO" | "RETIRADO";
  semestreActual: number;
  sedeId: string;
}

export default function InfoEstudiantePage() {
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "COORDINADOR";
  const modalRef = useRef<HTMLDivElement>(null);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstudianteEstadisticas>({
    totalEstudiantes: 0,
    activos: 0,
    graduados: 0,
    retirados: 0,
    promedioGeneral: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosEstudiante>({});
  const [tempFiltros, setTempFiltros] = useState<FiltrosEstudiante>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] =
    useState<Estudiante | null>(null);
  const [estudianteCompleto, setEstudianteCompleto] =
    useState<EstudianteCompleto | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    estado: "ACTIVO",
    semestreActual: 1,
    sedeId: "",
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedEstudiantePagos, setSelectedEstudiantePagos] = useState<
    PagoEstudiante[]
  >([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Carga inicial de datos - SOLO se ejecuta al montar y cuando cambian filtros reales
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [{ estudiantes }, stats, sedesData] = await Promise.all([
          estudiantesService.buscarEstudiantes(filtros),
          estudiantesService.getEstadisticas(),
          sedesService.getSedes(),
        ]);
        setEstudiantes(estudiantes);
        setEstadisticas(stats);
        setSedes(sedesData);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los datos de estudiantes",
          confirmButtonColor: "#f59e0b",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [filtros]); // Cambiar a solo [filtros] para que funcione con todos los filtros

  // Animaciones de entrada
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (estudiantes.length && tableRef.current) {
      const rows = tableRef.current.querySelectorAll("tbody tr");
      gsap.fromTo(
        rows,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [estudiantes]);

  const handleViewEstudiante = async (e: Estudiante) => {
    try {
      setSelectedEstudiante(e);
      setShowViewModal(true);
      const full = await estudiantesService.getInformacionEstudiante(e.id);
      setEstudianteCompleto(full);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la información del estudiante",
        confirmButtonColor: "#f59e0b",
        backdrop: true,
        didOpen: () => {
          const backdrop = document.querySelector(
            ".swal2-backdrop"
          ) as HTMLElement;
          if (backdrop) {
            backdrop.style.backdropFilter = "blur(8px)";
            backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
          }
        },
      });
    }
  };

  const handleEditEstudiante = async (estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setEditFormData({
      nombres: estudiante.nombres,
      apellidos: estudiante.apellidos,
      email: estudiante.email,
      telefono: estudiante.telefono || "",
      estado: estudiante.estado,
      semestreActual: estudiante.semestreActual,
      sedeId: estudiante.sede?.id?.toString() || "",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedEstudiante) return;

    try {
      // Encontrar la sede seleccionada
      const sedeSeleccionada = sedes.find(
        (s) => s.id.toString() === editFormData.sedeId
      );

      // Crear el objeto actualizado completo
      const estudianteActualizado: Estudiante = {
        ...selectedEstudiante,
        nombres: editFormData.nombres,
        apellidos: editFormData.apellidos,
        email: editFormData.email,
        telefono: editFormData.telefono,
        estado: editFormData.estado as
          | "INGRESANTE"
          | "ACTIVO"
          | "RESERVADO"
          | "GRADUADO"
          | "RETIRADO",
        semestreActual: editFormData.semestreActual,
        sede: sedeSeleccionada || selectedEstudiante.sede,
      };

      // Actualizar el estado local de forma persistente
      setEstudiantes((prevEstudiantes) =>
        prevEstudiantes.map((est) =>
          est.id === selectedEstudiante.id ? estudianteActualizado : est
        )
      );

      // También actualizar selectedEstudiante si está en vista
      setSelectedEstudiante(estudianteActualizado);

      Swal.fire({
        icon: "success",
        title: "Estudiante actualizado",
        text: "Los cambios se guardaron correctamente",
        confirmButtonColor: "#f59e0b",
        backdrop: true,
        didOpen: () => {
          const backdrop = document.querySelector(
            ".swal2-backdrop"
          ) as HTMLElement;
          if (backdrop) {
            backdrop.style.backdropFilter = "blur(8px)";
            backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
          }
        },
      });

      setShowEditModal(false);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron guardar los cambios",
        confirmButtonColor: "#f59e0b",
        backdrop: true,
        didOpen: () => {
          const backdrop = document.querySelector(
            ".swal2-backdrop"
          ) as HTMLElement;
          if (backdrop) {
            backdrop.style.backdropFilter = "blur(8px)";
            backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
          }
        },
      });
    }
  };

  const handleUploadFile = async () => {
    if (!uploadFile) return;

    try {
      setLoading(true);
      const result = await estudiantesService.uploadExcel(uploadFile);

      Swal.fire({
        icon: "success",
        title: "Archivo procesado",
        html: `
                        <div class="text-left">
                            <p><strong>Estudiantes procesados:</strong> ${
                              result.procesados
                            }</p>
                            <p><strong>Errores:</strong> ${result.errores}</p>
                            ${
                              result.errores > 0
                                ? `<div class="mt-3 p-3 bg-red-50 rounded-lg">
                                <p class="font-medium text-red-800 mb-2">Detalles de errores:</p>
                                ${result.detalles
                                  .filter((d) => d.includes("Error"))
                                  .map(
                                    (d) =>
                                      `<p class="text-sm text-red-600">${d}</p>`
                                  )
                                  .join("")}
                            </div>`
                                : ""
                            }
                        </div>
                    `,
        confirmButtonColor: "#f59e0b",
        backdrop: true,
        didOpen: () => {
          const backdrop = document.querySelector(
            ".swal2-backdrop"
          ) as HTMLElement;
          if (backdrop) {
            backdrop.style.backdropFilter = "blur(8px)";
            backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
          }
        },
      });

      setShowUploadModal(false);
      setUploadFile(null);
      // Recargar datos
      window.location.reload();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cargar el archivo",
        confirmButtonColor: "#f59e0b",
        backdrop: true,
        didOpen: () => {
          const backdrop = document.querySelector(
            ".swal2-backdrop"
          ) as HTMLElement;
          if (backdrop) {
            backdrop.style.backdropFilter = "blur(8px)";
            backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
          }
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await estudiantesService.downloadTemplate();
      Swal.fire({
        icon: "success",
        title: "Plantilla descargada",
        text: "La plantilla se ha descargado correctamente",
        confirmButtonColor: "#f59e0b",
        backdrop: true,
        didOpen: () => {
          const backdrop = document.querySelector(
            ".swal2-backdrop"
          ) as HTMLElement;
          if (backdrop) {
            backdrop.style.backdropFilter = "blur(8px)";
            backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
          }
        },
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo descargar la plantilla",
        confirmButtonColor: "#f59e0b",
        backdrop: true,
        didOpen: () => {
          const backdrop = document.querySelector(
            ".swal2-backdrop"
          ) as HTMLElement;
          if (backdrop) {
            backdrop.style.backdropFilter = "blur(8px)";
            backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
          }
        },
      });
    }
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      ACTIVO: "bg-green-100 text-green-800",
      GRADUADO: "bg-blue-100 text-blue-800",
      RETIRADO: "bg-red-100 text-red-800",
      INGRESANTE: "bg-yellow-100 text-yellow-800",
      SUSPENDIDO: "bg-gray-100 text-gray-800",
    };
    return badges[estado as keyof typeof badges] || "bg-gray-100 text-gray-800";
  };

  // Filtrado local mejorado - CORREGIDO
  const filtered = useMemo(() => {
    return estudiantes.filter((e) => {
      // Filtro de búsqueda - MEJORADO para incluir facultad
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          e.codigo?.toLowerCase().includes(term) ||
          e.nombres?.toLowerCase().includes(term) ||
          e.apellidos?.toLowerCase().includes(term) ||
          e.programa?.nombre?.toLowerCase().includes(term) ||
          (e.programa?.facultad &&
            e.programa.facultad.toLowerCase().includes(term));
        if (!matchesSearch) return false;
      }

      // Filtros avanzados aplicados - CORREGIDO
      if (filtros.estado && e.estado !== filtros.estado) {
        return false;
      }

      if (filtros.sede && e.sede?.id?.toString() !== filtros.sede) {
        return false;
      }

      // CORREGIDO: Filtro de semestre
      if (filtros.semestre && e.semestreActual !== parseInt(filtros.semestre)) {
        return false;
      }

      return true;
    });
  }, [estudiantes, searchTerm, filtros]); // Quitamos tempFiltros de las dependencias

  const handleOpenAdvancedFilters = () => {
    setTempFiltros({ ...filtros });
    setShowAdvancedFilters(true);
  };

  const handleApplyFilters = () => {
    setFiltros({ ...tempFiltros });
    setShowAdvancedFilters(false);
  };

  const handleClearFilters = () => {
    setTempFiltros({});
    setFiltros({});
    setShowAdvancedFilters(false);
  };

  const handleCancelFilters = () => {
    setTempFiltros({ ...filtros });
    setShowAdvancedFilters(false);
  };

  const handleViewPaymentStatus = async (estudiante: Estudiante) => {
    try {
      setLoadingPayments(true);
      setSelectedEstudiante(estudiante);
      setShowPaymentModal(true);

      const pagos = await pagosEstudianteService.getPagosByEstudiante(
        estudiante.id
      );
      setSelectedEstudiantePagos(pagos);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar el estado de pagos",
        confirmButtonColor: "#f59e0b",
      });
    } finally {
      setLoadingPayments(false);
    }
  };

  const getEstadoPagoBadge = (estado: EstadoPago) => {
    const badges = {
      PENDIENTE: "bg-yellow-100 text-yellow-800",
      PAGADO: "bg-green-100 text-green-800",
      VENCIDO: "bg-red-100 text-red-800",
      PARCIAL: "bg-blue-100 text-blue-800",
      ANULADO: "bg-gray-100 text-gray-800",
    };
    return badges[estado] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="container mx-auto px-4 py-8">
      {/* Header y estadísticas */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Información Estudiantil
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card
            title="Total"
            value={estadisticas.totalEstudiantes}
            icon={<FaUserGraduate />}
            color="bg-blue-500"
          />
          <Card
            title="Activos"
            value={estadisticas.activos}
            icon={<FaCheckCircle />}
            color="bg-green-500"
          />
          <Card
            title="Graduados"
            value={estadisticas.graduados}
            icon={<FaGraduationCap />}
            color="bg-purple-500"
          />
          <Card
            title="Retirados"
            value={estadisticas.retirados}
            icon={<FaInfoCircle />}
            color="bg-red-500"
          />
        </div>
      </div>

      {/* Buscador y acciones */}
      <div className="flex flex-wrap mb-6 gap-4">
        <div className="relative flex-1 min-w-64">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar estudiantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <Button
          onClick={handleOpenAdvancedFilters}
          leftIcon={FaFilter}
          variant="outline"
        >
          Filtros Avanzados
        </Button>
        {canManage && (
          <Button onClick={() => setShowUploadModal(true)} leftIcon={FaUpload}>
            Cargar Excel
          </Button>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Programa
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semestre
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sede
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((e) => {
                const sede = sedes.find((s) => s.id === e.sede?.id);
                return (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {e.nombres} {e.apellidos}
                        </div>
                        <div className="text-sm text-gray-500">{e.codigo}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {e.programa?.nombre || "Sin programa"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {e.programa?.facultad || "Sin facultad"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {e.semestreActual}°
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(
                          e.estado
                        )}`}
                      >
                        {e.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" />
                        {sede?.nombre || e.sede?.nombre || "Sin sede"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewEstudiante(e)}
                          leftIcon={FaEye}
                        >
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewPaymentStatus(e)}
                          leftIcon={FaCreditCard}
                        >
                          Pagos
                        </Button>
                        {canManage && (
                          <Button
                            size="sm"
                            onClick={() => handleEditEstudiante(e)}
                            leftIcon={FaEdit}
                          >
                            Editar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <NoData message="No hay estudiantes que mostrar" />
          )}
        </div>
      </div>

      {/* Modal de Filtros Avanzados */}
      {showAdvancedFilters && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Header amber */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filtros Avanzados</h3>
                <button
                  onClick={handleCancelFilters}
                  className="text-white hover:text-amber-200 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="filter-estado"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Estado
                </label>
                <select
                  id="filter-estado"
                  title="Filtrar por estado del estudiante"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={tempFiltros.estado || ""}
                  onChange={(e) =>
                    setTempFiltros({ ...tempFiltros, estado: e.target.value })
                  }
                >
                  <option value="">Todos los estados</option>
                  <option value="ACTIVO">Activo</option>
                  <option value="GRADUADO">Graduado</option>
                  <option value="RETIRADO">Retirado</option>
                  <option value="INGRESANTE">Ingresante</option>
                  <option value="SUSPENDIDO">Suspendido</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="filter-sede"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sede
                </label>
                <select
                  id="filter-sede"
                  title="Filtrar por sede del estudiante"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={tempFiltros.sede || ""}
                  onChange={(e) =>
                    setTempFiltros({
                      ...tempFiltros,
                      sede: e.target.value || undefined,
                    })
                  }
                >
                  <option value="">Todas las sedes</option>
                  {sedes.map((sede) => (
                    <option key={sede.id} value={sede.id.toString()}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="filter-semestre"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Semestre
                </label>
                <select
                  id="filter-semestre"
                  title="Filtrar por semestre actual del estudiante"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={tempFiltros.semestre || ""}
                  onChange={(e) =>
                    setTempFiltros({ ...tempFiltros, semestre: e.target.value })
                  }
                >
                  <option value="">Todos los semestres</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                    <option key={sem} value={sem.toString()}>
                      {sem}° Semestre
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer con botones */}
            <div className="px-6 py-4 bg-gray-50 flex justify-between">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Limpiar Filtros
              </Button>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleCancelFilters}>
                  Cancelar
                </Button>
                <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Carga de Archivos */}
      {showUploadModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Header amber */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Cargar Archivo Excel</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-white hover:text-amber-200 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
              {/* Instrucciones */}
              <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                  <FaInfoCircle className="mr-2" />
                  Instrucciones
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• El archivo debe ser formato Excel (.xlsx o .xls)</li>
                  <li>• Descarga la plantilla para ver el formato correcto</li>
                  <li>• No modifiques los nombres de las columnas</li>
                  <li>
                    • Los códigos de estudiante deben ser{" "}
                    <strong>únicos</strong>
                  </li>
                </ul>
                <button
                  onClick={handleDownloadTemplate}
                  className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 flex items-center transition-colors"
                >
                  <FaDownload className="mr-2" />
                  Descargar Plantilla
                </button>
              </div>

              {/* Área de carga */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-400 transition-colors">
                <FaFileExcel className="mx-auto text-5xl text-green-500 mb-3" />
                <p className="text-gray-600 mb-3">
                  Arrastra tu archivo aquí o selecciónalo
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-lg font-medium border transition-colors"
                >
                  Seleccionar archivo
                </label>
                {uploadFile && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      {uploadFile.name}
                    </p>
                    <p className="text-xs text-green-600">
                      Archivo seleccionado correctamente
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer con botones */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowUploadModal(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleUploadFile} disabled={!uploadFile}>
                Cargar Archivo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ver Estudiante */}
      {showViewModal && selectedEstudiante && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header amber */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <FaUserGraduate className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedEstudiante.nombres}{" "}
                      {selectedEstudiante.apellidos}
                    </h2>
                    <p className="text-amber-100 font-medium">
                      {selectedEstudiante.codigo}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-white hover:text-amber-200 transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
              {estudianteCompleto ? (
                <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                        <FaInfoCircle className="mr-2 text-amber-500" />
                        Contacto
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <strong>Email:</strong> {estudianteCompleto.email}
                        </p>
                        <p className="text-sm">
                          <strong>Teléfono:</strong>{" "}
                          {estudianteCompleto.telefono || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                        <FaGraduationCap className="mr-2 text-amber-500" />
                        Académico
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <strong>Programa:</strong>{" "}
                          {estudianteCompleto.programa?.nombre}
                        </p>
                        <p className="text-sm">
                          <strong>Facultad:</strong>{" "}
                          {estudianteCompleto.programa?.facultad}
                        </p>
                        <p className="text-sm">
                          <strong>Semestre:</strong>{" "}
                          {estudianteCompleto.semestreActual}°
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                        <FaInfoCircle className="mr-2 text-amber-500" />
                        Estado
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <strong>Estado:</strong>
                          <span
                            className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(
                              estudianteCompleto.estado
                            )}`}
                          >
                            {estudianteCompleto.estado}
                          </span>
                        </p>
                        <p className="text-sm">
                          <strong>Promedio:</strong>{" "}
                          {estudianteCompleto.promedioGeneral?.toFixed(2) ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-amber-500" />
                        Ubicación
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <strong>Sede:</strong>{" "}
                          {sedes.find((s) => s.id === estudianteCompleto.sedeId)
                            ?.nombre ||
                            estudianteCompleto.sede?.nombre ||
                            "N/A"}
                        </p>
                        <p className="text-sm">
                          <strong>Ingreso:</strong>{" "}
                          {estudianteCompleto.fechaIngreso
                            ? new Date(
                                estudianteCompleto.fechaIngreso
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">Cargando información...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <Button onClick={() => setShowViewModal(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Estudiante */}
      {showEditModal && selectedEstudiante && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
            {/* Header amber */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Editar Estudiante</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-white hover:text-amber-200 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Formulario */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-nombres"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombres
                  </label>
                  <input
                    id="edit-nombres"
                    type="text"
                    title="Nombres del estudiante"
                    placeholder="Ingrese los nombres"
                    value={editFormData.nombres || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        nombres: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-apellidos"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Apellidos
                  </label>
                  <input
                    id="edit-apellidos"
                    type="text"
                    title="Apellidos del estudiante"
                    placeholder="Ingrese los apellidos"
                    value={editFormData.apellidos || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        apellidos: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="edit-email"
                    type="email"
                    title="Correo electrónico del estudiante"
                    placeholder="ejemplo@correo.com"
                    value={editFormData.email || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-telefono"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Teléfono
                  </label>
                  <input
                    id="edit-telefono"
                    type="text"
                    title="Número de teléfono del estudiante"
                    placeholder="Ingrese el teléfono"
                    value={editFormData.telefono || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        telefono: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-estado"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Estado
                  </label>
                  <select
                    id="edit-estado"
                    title="Estado académico del estudiante"
                    value={editFormData.estado || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        estado: e.target.value as
                          | "INGRESANTE"
                          | "ACTIVO"
                          | "RESERVADO"
                          | "GRADUADO"
                          | "RETIRADO",
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="GRADUADO">Graduado</option>
                    <option value="RETIRADO">Retirado</option>
                    <option value="INGRESANTE">Ingresante</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="edit-semestre"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Semestre Actual
                  </label>
                  <input
                    id="edit-semestre"
                    type="number"
                    min="1"
                    max="10"
                    title="Semestre actual del estudiante"
                    placeholder="1"
                    value={editFormData.semestreActual || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        semestreActual: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* NUEVO: Campo Estado Financiero */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCreditCard className="inline mr-2 text-amber-500" />
                    Estado Financiero
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      Para gestionar el estado financiero completo, utiliza el
                      botón &quot;Ver Estado de Pagos&quot; en la tabla
                      principal.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowEditModal(false);
                        handleViewPaymentStatus(selectedEstudiante!);
                      }}
                      leftIcon={FaMoneyBillWave}
                      size="sm"
                    >
                      Ver Estado de Pagos
                    </Button>
                  </div>
                </div>

                {/* NUEVO: Campo para editar sede */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="edit-sede"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <FaMapMarkerAlt className="inline mr-2 text-amber-500" />
                    Sede
                  </label>
                  <select
                    id="edit-sede"
                    title="Sede donde estudia el estudiante"
                    value={editFormData.sedeId || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        sedeId: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar sede</option>
                    {sedes.map((sede) => (
                      <option key={sede.id} value={sede.id.toString()}>
                        {sede.nombre} - {sede.direccion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer con botones */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
            </div>
          </div>
        </div>
      )}

      {/* NUEVO: Modal de Estado de Pagos */}
      {showPaymentModal && selectedEstudiante && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <FaCreditCard className="text-2xl" />
                  <div>
                    <h2 className="text-xl font-bold">Estado de Pagos</h2>
                    <p className="text-amber-100">
                      {selectedEstudiante.nombres}{" "}
                      {selectedEstudiante.apellidos} -{" "}
                      {selectedEstudiante.codigo}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-white hover:text-amber-200 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loadingPayments ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">Cargando estado de pagos...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Resumen */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600">
                            Pagos Realizados
                          </p>
                          <p className="text-2xl font-bold text-green-800">
                            {
                              selectedEstudiantePagos.filter(
                                (p) => p.estado === EstadoPago.PAGADO
                              ).length
                            }
                          </p>
                        </div>
                        <FaCheckCircle className="text-3xl text-green-500" />
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-600">
                            Pagos Pendientes
                          </p>
                          <p className="text-2xl font-bold text-yellow-800">
                            {
                              selectedEstudiantePagos.filter(
                                (p) => p.estado === EstadoPago.PENDIENTE
                              ).length
                            }
                          </p>
                        </div>
                        <FaExclamationTriangle className="text-3xl text-yellow-500" />
                      </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-red-600">Pagos Vencidos</p>
                          <p className="text-2xl font-bold text-red-800">
                            {
                              selectedEstudiantePagos.filter(
                                (p) => p.estado === EstadoPago.VENCIDO
                              ).length
                            }
                          </p>
                        </div>
                        <FaTimes className="text-3xl text-red-500" />
                      </div>
                    </div>
                  </div>

                  {/* Tabla de Pagos */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Concepto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Monto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Vencimiento
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fecha Pago
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedEstudiantePagos.map((pago) => (
                            <tr key={pago.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {pago.tasaPago.concepto}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {pago.tasaPago.codigo}
                                    {pago.tasaPago.obligatorio && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                        Obligatorio
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {pago.moneda} {pago.monto.toFixed(2)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoPagoBadge(
                                    pago.estado
                                  )}`}
                                >
                                  {pago.estado}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {pago.fechaVencimiento
                                  ? new Date(
                                      pago.fechaVencimiento
                                    ).toLocaleDateString()
                                  : "Sin fecha"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {pago.fechaPago
                                  ? new Date(
                                      pago.fechaPago
                                    ).toLocaleDateString()
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {selectedEstudiantePagos.length === 0 && (
                      <div className="text-center py-12">
                        <FaMoneyBillWave className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No hay pagos registrados
                        </h3>
                        <p className="text-gray-500">
                          Este estudiante aún no tiene pagos asignados
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <Button onClick={() => setShowPaymentModal(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componentes auxiliares para estadísticas y vacío
function Card({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-l-amber-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color} text-white`}>{icon}</div>
      </div>
    </div>
  );
}

function NoData({ message }: { message: string }) {
  return (
    <div className="text-center p-12">
      <FaInfoCircle className="mx-auto text-5xl text-gray-300 mb-4" />
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
}
