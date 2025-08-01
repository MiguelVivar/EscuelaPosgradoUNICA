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
    FaUserTie,
    FaFilter,
    FaTimes,
    FaEdit,
    FaMapMarkerAlt,
    FaFileExcel,
    FaMoneyBillWave,
    FaGraduationCap,
    FaBook,
    FaUniversity,
    FaPlus,
    FaAward,
    FaCalendarAlt,
    FaUserGraduate,
    FaBriefcase,
    } from "react-icons/fa";

    import {
    Docente,
    FiltrosDocente,
    DocenteEstadisticas,
    EstadoDocente,
    TipoGrado,
    ESTADOS_DOCENTE_LABELS,
    TIPOS_GRADO_LABELS,
    } from "@/types/docente";
    import { Sede } from "@/types/sede";
    import { PagoDocente, EstadoPagoDocente } from "@/types/pagoDocente";
    import { docentesService } from "@/services/docentesService";
    import { sedesService } from "@/services/sedesService";
    import { pagosDocenteService } from "@/services/pagosDocenteService";

    export default function InfoDocentePage() {
    const { user } = useAuth();
    const canManage = user?.role === "ADMIN" || user?.role === "COORDINADOR";
    
    // Estados principales
    const [docentes, setDocentes] = useState<Docente[]>([]);
    const [sedes, setSedes] = useState<Sede[]>([]);
    const [estadisticas, setEstadisticas] = useState<DocenteEstadisticas>({
        totalDocentes: 0,
        activos: 0,
        inactivos: 0,
        enLicencia: 0,
        promedioExperiencia: 0,
        conDoctorado: 0,
        conMaestria: 0,
    });
    
    // Estados de UI
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState<FiltrosDocente>({});
    const [tempFiltros, setTempFiltros] = useState<FiltrosDocente>({});
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAcademicModal, setShowAcademicModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    
    // Estados de datos seleccionados
    const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);
    const [docenteCompleto, setDocenteCompleto] = useState<any>(null);
    const [editFormData, setEditFormData] = useState<any>({});
    const [selectedDocentePagos, setSelectedDocentePagos] = useState<PagoDocente[]>([]);
    const [loadingPayments, setLoadingPayments] = useState(false);
    
    // Estados de formulario
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSedes, setSelectedSedes] = useState<number[]>([]);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLTableElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Carga inicial de datos
    useEffect(() => {
        (async () => {
        try {
            setLoading(true);
            const [{ docentes }, sedesData] = await Promise.all([
            docentesService.buscarDocentes(filtros),
            sedesService.getSedes(),
            ]);
            setDocentes(docentes);
            setSedes(sedesData);
            
            // Calcular estadísticas reales desde los datos
            const totalDocentes = docentes.length;
            const estadisticasReales = {
                totalDocentes,
                activos: 0, // No usado
                inactivos: 0, // No usado
                enLicencia: 0, // No usado
                promedioExperiencia: 0, // No usado
                conDoctorado: 0, // No usado
                conMaestria: 0, // No usado
            };
            setEstadisticas(estadisticasReales);
        } catch (error) {
            console.error(error);
            Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar los datos de docentes",
            confirmButtonColor: "#f59e0b",
            });
        } finally {
            setLoading(false);
        }
        })();
    }, [filtros]);

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
        if (docentes.length && tableRef.current) {
        const rows = tableRef.current.querySelectorAll("tbody tr");
        gsap.fromTo(
            rows,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
        );
        }
    }, [docentes]);

    // Handlers
    const handleViewDocente = async (docente: Docente) => {
        try {
        setSelectedDocente(docente);
        setShowViewModal(true);
        // Usar los datos ya disponibles en lugar de hacer una nueva llamada
        setDocenteCompleto(docente);
        } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo cargar la información del docente",
            confirmButtonColor: "#f59e0b",
        });
        }
    };

    const handleViewAcademicInfo = async (docente: Docente) => {
        try {
        setSelectedDocente(docente);
        setShowAcademicModal(true);
        // Usar los datos ya disponibles
        setDocenteCompleto(docente);
        } catch (err) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo cargar la información académica",
            confirmButtonColor: "#f59e0b",
        });
        }
    };

    const handleViewPaymentStatus = async (docente: Docente) => {
        try {
        setLoadingPayments(true);
        setSelectedDocente(docente);
        setShowPaymentModal(true);
        
        const pagos = await pagosDocenteService.getPagosByDocente(docente.id);
        setSelectedDocentePagos(pagos);
        } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar el estado de pagos',
            confirmButtonColor: '#f59e0b'
        });
        } finally {
        setLoadingPayments(false);
        }
    };

    const handleEditDocente = async (docente: Docente) => {
        setSelectedDocente(docente);
        setEditFormData({
        nombres: docente.nombres,
        apellidos: docente.apellidos,
        email: docente.email,
        telefono: docente.telefono || "",
        titulo: docente.titulo,
        especialidades: docente.especialidades.join(", "),
        experienciaAnios: docente.experienciaAnios,
        });
        setSelectedSedes(docente.sedes.map(s => s.id));
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedDocente) return;

        try {
        const sedesSeleccionadas = sedes.filter(s => selectedSedes.includes(s.id));
        const docenteActualizado = {
            ...selectedDocente,
            nombres: editFormData.nombres,
            apellidos: editFormData.apellidos,
            email: editFormData.email,
            telefono: editFormData.telefono,
            titulo: editFormData.titulo,
            especialidades: editFormData.especialidades.split(",").map((e: string) => e.trim()),
            experienciaAnios: editFormData.experienciaAnios,
            sedes: sedesSeleccionadas.map(s => ({
            id: s.id,
            nombre: s.nombre,
            direccion: s.direccion,
            activa: s.activo
            })),
        };

        setDocentes(prevDocentes =>
            prevDocentes.map(doc =>
            doc.id === selectedDocente.id ? docenteActualizado : doc
            )
        );

        setSelectedDocente(docenteActualizado);

        Swal.fire({
            icon: "success",
            title: "Docente actualizado",
            text: "Los cambios se guardaron correctamente",
            confirmButtonColor: "#f59e0b",
        });

        setShowEditModal(false);
        } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron guardar los cambios",
            confirmButtonColor: "#f59e0b",
        });
        }
    };

    // Manejo de sedes múltiples
    const handleSedeToggle = (sedeId: number) => {
        setSelectedSedes(prev => 
        prev.includes(sedeId) 
            ? prev.filter(id => id !== sedeId)
            : [...prev, sedeId]
        );
    };

    const removeSede = (sedeId: number) => {
        setSelectedSedes(prev => prev.filter(id => id !== sedeId));
    };

    const handleUploadFile = async () => {
        if (!uploadFile) return;

        try {
        setLoading(true);
        const result = await docentesService.uploadExcel(uploadFile);

        Swal.fire({
            icon: "success",
            title: "Archivo procesado",
            html: `
                        <div class="text-left">
                            <p><strong>Docentes procesados:</strong> ${
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
        } catch (error) {
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
        await docentesService.downloadTemplate();
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
        } catch (error) {
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

    // Lista de estados válidos para el filtro avanzado
    const ESTADOS_VALIDOS = Object.keys(ESTADOS_DOCENTE_LABELS);

    // Filtrado local mejorado - CORREGIDO
    const filtered = useMemo(() => {
        return docentes.filter((d) => {
        // Filtro de búsqueda - MEJORADO para incluir facultad
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matchesSearch =
            d.codigo?.toLowerCase().includes(term) ||
            d.nombres?.toLowerCase().includes(term) ||
            d.apellidos?.toLowerCase().includes(term) ||
            d.titulo?.toLowerCase().includes(term) ||
            d.especialidades?.some(e => e.toLowerCase().includes(term));
            if (!matchesSearch) return false;
        }

        if (filtros.sedeId && !d.sedes?.some(s => s.id.toString() === filtros.sedeId)) {
            return false;
        }

        if (filtros.experienciaMinima && d.experienciaAnios < filtros.experienciaMinima) {
            return false;
        }

        // NUEVO: Filtro por tipo de grado
        if (filtros.tipoGrado && !d.grados?.some(g => g.tipo === filtros.tipoGrado)) {
            return false;
        }

        return true;
        });
    }, [docentes, searchTerm, filtros]); // Quitamos tempFiltros de las dependencias

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

    // Handlers - Corregir función getEstadoBadge
    const getEstadoBadge = (estado: EstadoDocente) => {
        const badges = {
        [EstadoDocente.ACTIVO]: 'bg-green-100 text-green-800',
        [EstadoDocente.INACTIVO]: 'bg-red-100 text-red-800',
        [EstadoDocente.LICENCIA]: 'bg-yellow-100 text-yellow-800',
        [EstadoDocente.RETIRADO]: 'bg-gray-100 text-gray-800',
        };
        return badges[estado] || 'bg-gray-100 text-gray-800';
    };

    const getEstadoPagoBadge = (estado: EstadoPagoDocente) => {
        const badges = {
        [EstadoPagoDocente.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
        [EstadoPagoDocente.PAGADO]: 'bg-green-100 text-green-800',
        [EstadoPagoDocente.CANCELADO]: 'bg-red-100 text-red-800',
        };
        return badges[estado] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Cargando docentes...</p>
            </div>
        </div>
        );
    }

    return (
        <div ref={containerRef} className="container mx-auto px-4 py-8">
        {/* Header y estadísticas - ACTUALIZADO */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Información Docente
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
                title="Total Docentes"
                value={estadisticas.totalDocentes}
                icon={<FaUserTie />}
                color="bg-blue-500"
            />
            <Card
                title="Rectora"
                value="Dra. María Elena Vásquez"
                icon={<FaUniversity />}
                color="bg-purple-500"
                isText={true}
            />
            <Card
                title="Años de Funcionamiento"
                value={28}
                icon={<FaCalendarAlt />}
                color="bg-amber-500"
                suffix=" años"
            />
            </div>
        </div>

        {/* Buscador y acciones */}
        <div className="flex flex-wrap mb-6 gap-4">
            <div className="relative flex-1 min-w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder="Buscar docentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            </div>
            <Button
            onClick={() => setShowAdvancedFilters(true)}
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
                    Docente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experiencia
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sedes
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                        <div>
                        <div className="text-sm font-medium text-gray-900">
                            {d.nombres} {d.apellidos}
                        </div>
                        <div className="text-sm text-gray-500">{d.codigo}</div>
                        <div className="text-xs text-gray-400">
                            {d.especialidades?.slice(0, 2).join(", ")}
                            {d.especialidades?.length > 2 && "..."}
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                        {d.titulo}
                        </div>
                        <div className="text-xs text-gray-500">
                        {d.grados?.find(g => g.tipo === TipoGrado.DOCTORADO) && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mr-1">
                            Dr.
                            </span>
                        )}
                        {d.grados?.find(g => g.tipo === TipoGrado.MAESTRIA) && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Mg.
                            </span>
                        )}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                        {d.experienciaAnios} años
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                        {d.sedes?.map((sede) => (
                            <span
                            key={sede.id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                            <FaMapMarkerAlt className="mr-1" />
                            {sede.nombre}
                            </span>
                        ))}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewDocente(d)} leftIcon={FaEye}>
                            Ver
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleViewAcademicInfo(d)} leftIcon={FaBook}>
                            Académico
                        </Button>
                        <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={() => handleViewPaymentStatus(d)} 
                            leftIcon={FaMoneyBillWave}
                        >
                            Pagos
                        </Button>
                        {canManage && (
                            <Button size="sm" onClick={() => handleEditDocente(d)} leftIcon={FaEdit}>
                            Editar
                            </Button>
                        )}
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {filtered.length === 0 && (
                <NoData message="No hay docentes que mostrar" />
            )}
            </div>
        </div>

        {/* Modales */}
        {/* Modal de Editar Docente */}
        {showEditModal && selectedDocente && (
            <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Editar Docente</h2>
                    <button
                    onClick={() => setShowEditModal(false)}
                    className="text-white hover:text-amber-200 transition-colors"
                    >
                    <FaTimes size={20} />
                    </button>
                </div>
                </div>

                <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombres
                    </label>
                    <input
                        type="text"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellidos
                    </label>
                    <input
                        type="text"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                    </label>
                    <input
                        type="text"
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
                    <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título Principal
                    </label>
                    <input
                        type="text"
                        value={editFormData.titulo || ""}
                        onChange={(e) =>
                        setEditFormData({
                            ...editFormData,
                            titulo: e.target.value,
                        })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    </div>
                    <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Especialidades (separar con comas)
                    </label>
                    <input
                        type="text"
                        value={editFormData.especialidades || ""}
                        onChange={(e) =>
                        setEditFormData({
                            ...editFormData,
                            especialidades: e.target.value,
                    })
                }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Años de Experiencia
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={editFormData.experienciaAnios || ""}
                        onChange={(e) =>
                        setEditFormData({
                            ...editFormData,
                            experienciaAnios: parseInt(e.target.value),
                    })
                }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    </div>
                    
                    {/* Sedes Múltiples */}
                    <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaMapMarkerAlt className="inline mr-2 text-amber-500" />
                        Sedes donde labora
                    </label>
                    
                    {/* Sedes seleccionadas */}
                    <div className="mb-3 flex flex-wrap gap-2">
                        {selectedSedes.map(sedeId => {
                        const sede = sedes.find(s => s.id === sedeId);
                        return sede ? (
                            <span
                            key={sedeId}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800"
                            >
                            {sede.nombre}
                            <button
                                type="button"
                                onClick={() => removeSede(sedeId)}
                                className="ml-2 hover:text-amber-600"
                            >
                                <FaTimes size={12} />
                            </button>
                            </span>
                        ) : null;
                        })}
                    </div>

                    {/* Selector de sedes */}
                    <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                        {sedes.map(sede => (
                        <label key={sede.id} className="flex items-center space-x-2 mb-2 cursor-pointer">
                            <input
                            type="checkbox"
                            checked={selectedSedes.includes(sede.id)}
                            onChange={() => handleSedeToggle(sede.id)}
                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                            />
                            <span className="text-sm text-gray-700">
                            {sede.nombre} - {sede.direccion}
                            </span>
                        </label>
                        ))}
                    </div>
                    </div>
                </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                    Cancelar
                </Button>
                <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
                </div>
            </div>
            </div>
        )}

        {/* Modal de Estado de Pagos */}
        {showPaymentModal && selectedDocente && (
            <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden max-h-[90vh]">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                    <FaMoneyBillWave className="text-2xl" />
                    <div>
                        <h2 className="text-xl font-bold">Estado de Pagos</h2>
                        <p className="text-amber-100">
                        {selectedDocente.nombres} {selectedDocente.apellidos} - {selectedDocente.codigo}
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
                    {/* Resumen - SOLO SUELDO PROMEDIO */}
                    <div className="grid grid-cols-1 gap-4 mb-6 max-w-md mx-auto">
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
                        <div className="flex items-center justify-center mb-3">
                            <FaMoneyBillWave className="text-4xl text-blue-500" />
                        </div>
                        <p className="text-sm text-blue-600 mb-1">Sueldo Promedio</p>
                        <p className="text-3xl font-bold text-blue-800">
                            S/. {selectedDocentePagos.length > 0 ? 
                            (selectedDocentePagos.reduce((sum, p) => sum + p.sueldoNeto, 0) / selectedDocentePagos.length).toFixed(0) 
                            : '0'}
                        </p>
                        </div>
                    </div>

                    {/* Tabla de Pagos */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Periodo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sueldo Base
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bonificaciones
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descuentos
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sueldo Neto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha Pago
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {selectedDocentePagos.map((pago) => (
                                <tr key={pago.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                    {pago.mes} {pago.anio}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                    S/. {pago.sueldoBase.toFixed(2)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-green-600">
                                    +S/. {pago.bonificaciones.toFixed(2)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-red-600">
                                    -S/. {pago.descuentos.toFixed(2)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-gray-900">
                                    S/. {pago.sueldoNeto.toFixed(2)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoPagoBadge(pago.estado)}`}>
                                    {pago.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {pago.fechaPago ? new Date(pago.fechaPago).toLocaleDateString() : '-'}
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>

                        {selectedDocentePagos.length === 0 && (
                        <div className="text-center py-12">
                            <FaMoneyBillWave className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pagos registrados</h3>
                            <p className="text-gray-500">
                            Este docente aún no tiene pagos registrados
                            </p>
                        </div>
                        )}
                    </div>
                    </>
                )}
                </div>
                
                <div className="px-6 py-4 bg-gray-50 flex justify-end">
                <Button onClick={() => setShowPaymentModal(false)}>
                    Cerrar
                </Button>
                </div>            
            </div>
            </div>
        )}

        {/* Modal de Ver Docente */}
        {showViewModal && selectedDocente && (
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
                        {selectedDocente.nombres}{" "}
                        {selectedDocente.apellidos}
                        </h2>
                        <p className="text-amber-100 font-medium">
                        {selectedDocente.codigo}
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
                {docenteCompleto ? (
                    <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <FaInfoCircle className="mr-2 text-amber-500" />
                            Contacto
                        </h4>
                        <div className="space-y-2">
                            <p className="text-sm">
                            <strong>Email:</strong> {docenteCompleto.email}
                            </p>
                            <p className="text-sm">
                            <strong>Teléfono:</strong>{" "}
                            {docenteCompleto.telefono || "N/A"}
                            </p>
                        </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <FaGraduationCap className="mr-2 text-amber-500" />
                            Información Académica
                        </h4>
                        <div className="space-y-2">
                            <p className="text-sm">
                            <strong>Título:</strong> {docenteCompleto.titulo}
                            </p>
                            <p className="text-sm">
                            <strong>Experiencia:</strong> {docenteCompleto.experienciaAnios} años
                            </p>
                            <p className="text-sm">
                            <strong>Estado:</strong>{" "}
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(docenteCompleto.estado)}`}>
                              {ESTADOS_DOCENTE_LABELS[docenteCompleto.estado as EstadoDocente]}
                            </span>
                            </p>
                        </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-amber-500" />
                            Sedes de Trabajo
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {docenteCompleto.sedes?.map((sede: Sede) => (
                            <span
                              key={sede.id}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {sede.nombre}
                            </span>
                          ))}
                        </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <FaCalendarAlt className="mr-2 text-amber-500" />
                            Fechas Importantes
                        </h4>
                        <div className="space-y-2">
                            <p className="text-sm">
                            <strong>Fecha de ingreso:</strong>{" "}
                            {docenteCompleto.fechaIngreso
                                ? new Date(
                                    docenteCompleto.fechaIngreso
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

        {/* Modal de Académico Docente */}
        {showAcademicModal && selectedDocente && (
            <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
                {/* Header amber */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <FaGraduationCap className="text-white text-2xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">
                        Información Académica
                        </h2>
                        <p className="text-amber-100 font-medium">
                        {selectedDocente.nombres} {selectedDocente.apellidos}
                        </p>
                    </div>
                    </div>
                    <button
                    onClick={() => setShowAcademicModal(false)}
                    className="text-white hover:text-amber-200 transition-colors"
                    >
                    <FaTimes size={24} />
                    </button>
                </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                {docenteCompleto ? (
                    <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <FaInfoCircle className="mr-2 text-amber-500" />
                            Datos Personales
                        </h4>
                        <div className="space-y-2">
                            <p className="text-sm">
                            <strong>Nombres:</strong> {docenteCompleto.nombres}
                            </p>
                            <p className="text-sm">
                            <strong>Apellidos:</strong> {docenteCompleto.apellidos}
                            </p>
                            <p className="text-sm">
                            <strong>Email:</strong> {docenteCompleto.email}
                            </p>
                            <p className="text-sm">
                            <strong>Teléfono:</strong>{" "}
                            {docenteCompleto.telefono || "N/A"}
                            </p>
                        </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <FaBook className="mr-2 text-amber-500" />
                            Formación Académica
                        </h4>
                        <div className="space-y-2">
                            {docenteCompleto.grados?.length ? (
                            docenteCompleto.grados.map((grado: any) => (
                                <div key={grado.id} className="text-sm">
                                <strong>{TIPOS_GRADO_LABELS[grado.tipo as TipoGrado]}</strong> -{" "}
                                {grado.institucion} ({grado.anioInicio} -{" "}
                                {grado.anioFin})
                                </div>
                            ))
                            ) : (
                            <p className="text-gray-500 text-sm">
                                Sin información de grados
                            </p>
                            )}
                        </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <FaBriefcase className="mr-2 text-amber-500" />
                            Experiencia Profesional
                        </h4>
                        <div className="space-y-2">
                            {docenteCompleto.experienciaLaboral?.length ? (
                            docenteCompleto.experienciaLaboral.map((exp: any) => (
                                <div key={exp.id} className="text-sm">
                                <strong>{exp.cargo}</strong> -{" "}
                                {exp.empresa} ({exp.anioInicio} -{" "}
                                {exp.anioFin})
                                </div>
                            ))
                            ) : (
                            <p className="text-gray-500 text-sm">
                                Sin información de experiencia laboral
                            </p>
                            )}
                        </div>
                        </div>
                    </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600">Cargando información académica...</p>
                    </div>
                    </div>
                )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end">
                <Button onClick={() => setShowAcademicModal(false)}>Cerrar</Button>
                </div>
            </div>
            </div>
        )}

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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sede
                    </label>
                    <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={tempFiltros.sedeId || ""}
                    onChange={(e) =>
                        setTempFiltros({
                        ...tempFiltros,
                        sedeId: e.target.value || undefined,
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experiencia Mínima (años)
                    </label>
                    <input
                    type="number"
                    min="0"
                    value={tempFiltros.experienciaMinima || ""}
                    onChange={(e) =>
                        setTempFiltros({ ...tempFiltros, experienciaMinima: parseInt(e.target.value) })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                </div>

                {/* NUEVO: Filtro por grado académico */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grado Académico
                    </label>
                    <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    value={tempFiltros.tipoGrado || ""}
                    onChange={(e) =>
                        setTempFiltros({
                        ...tempFiltros,
                        tipoGrado: e.target.value as TipoGrado || undefined,
                        })
                    }
                    >
                    <option value="">Todos los grados</option>
                    {Object.entries(TIPOS_GRADO_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                        {label}
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
                    <li>• Los códigos de docente deben ser <strong>únicos</strong></li>
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
        </div>
    )

    // Componentes auxiliares para estadísticas y vacío
    function Card({
    title,
    value,
    icon,
    color,
    suffix = "",
    isText = false,
    }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    suffix?: string;
    isText?: boolean;
    }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-l-amber-500">
        <div className="flex items-center justify-between">
            <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {isText ? (
              <p className="text-lg font-bold text-gray-900">{value}</p>
            ) : (
              <p className="text-3xl font-bold text-gray-900">{value}{suffix}</p>
            )}
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
    }}