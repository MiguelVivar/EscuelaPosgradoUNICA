"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button, LoadingSpinner } from "@/components/common";
import { FiArrowLeft, FiCheck, FiUser, FiSearch, FiPlus, FiCalendar, FiFileText } from "react-icons/fi";

// Mock data - tipos
interface Estudiante {
  id: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  programa: string;
  estado: string;
}

interface Curso {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
  semestre: number;
  programa: string;
}

interface Convalidacion {
  id: number;
  estudiante: Estudiante;
  curso: Curso;
  institucionProcedencia: string;
  cursoConvalidado: string;
  creditosConvalidados: number;
  motivo: string;
  fechaConvalidacion: string;
  estado: 'APROBADA' | 'PENDIENTE' | 'RECHAZADA';
  observaciones?: string;
}

// Mock data
const mockEstudiantes: Estudiante[] = [
  {
    id: 1,
    codigo: "2024001",
    nombres: "María José",
    apellidos: "García López",
    email: "maria.garcia@email.com",
    programa: "Maestría en Administración",
    estado: "ACTIVO"
  },
  {
    id: 2,
    codigo: "2024002", 
    nombres: "Carlos Alberto",
    apellidos: "Rodríguez Díaz",
    email: "carlos.rodriguez@email.com",
    programa: "Maestría en Gestión Pública",
    estado: "ACTIVO"
  },
  {
    id: 3,
    codigo: "2024003",
    nombres: "Ana Patricia",
    apellidos: "Mendoza Torres", 
    email: "ana.mendoza@email.com",
    programa: "Maestría en Administración",
    estado: "ACTIVO"
  }
];

const mockCursos: Curso[] = [
  { id: 1, codigo: "ADM501", nombre: "Gestión Estratégica", creditos: 4, semestre: 1, programa: "Maestría en Administración" },
  { id: 2, codigo: "ADM502", nombre: "Finanzas Corporativas", creditos: 4, semestre: 1, programa: "Maestría en Administración" },
  { id: 3, codigo: "ADM503", nombre: "Marketing Avanzado", creditos: 3, semestre: 2, programa: "Maestría en Administración" },
  { id: 4, codigo: "MGP501", nombre: "Políticas Públicas", creditos: 4, semestre: 1, programa: "Maestría en Gestión Pública" },
  { id: 5, codigo: "MGP502", nombre: "Gestión Municipal", creditos: 3, semestre: 1, programa: "Maestría en Gestión Pública" }
];

const mockConvalidaciones: Convalidacion[] = [
  {
    id: 1,
    estudiante: mockEstudiantes[0],
    curso: mockCursos[0],
    institucionProcedencia: "Universidad Nacional Mayor de San Marcos",
    cursoConvalidado: "Administración Estratégica",
    creditosConvalidados: 4,
    motivo: "Curso equivalente cursado en pregrado con nota satisfactoria",
    fechaConvalidacion: "2024-03-15",
    estado: "APROBADA",
    observaciones: "Documentación completa y verificada"
  },
  {
    id: 2,
    estudiante: mockEstudiantes[1],
    curso: mockCursos[3],
    institucionProcedencia: "Pontificia Universidad Católica del Perú",
    cursoConvalidado: "Análisis de Políticas Públicas",
    creditosConvalidados: 4,
    motivo: "Experiencia profesional en sector público por 5 años",
    fechaConvalidacion: "2024-03-10",
    estado: "PENDIENTE"
  }
];

export default function ConvalidacionesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Estados
  const [estudianteBusqueda, setEstudianteBusqueda] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante | null>(null);
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState<Estudiante[]>([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<number | "">("");
  const [institucionProcedencia, setInstitucionProcedencia] = useState("");
  const [cursoConvalidado, setCursoConvalidado] = useState("");
  const [creditosConvalidados, setCreditosConvalidados] = useState<number | "">("");
  const [motivo, setMotivo] = useState("");
  const [convalidaciones, setConvalidaciones] = useState<Convalidacion[]>(mockConvalidaciones);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

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
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
        <LoadingSpinner size="lg" message="Cargando Registro de Convalidaciones..." />
      </div>
    );
  }

  if (!isAuthenticated || !user || (user.role !== 'ADMIN' && user.role !== 'COORDINADOR')) {
    return null;
  }

  const buscarEstudiantes = (termino: string) => {
    if (termino.length < 2) {
      setEstudiantesFiltrados([]);
      return;
    }

    const filtrados = mockEstudiantes.filter(estudiante =>
      estudiante.codigo.toLowerCase().includes(termino.toLowerCase()) ||
      estudiante.nombres.toLowerCase().includes(termino.toLowerCase()) ||
      estudiante.apellidos.toLowerCase().includes(termino.toLowerCase())
    );
    setEstudiantesFiltrados(filtrados);
  };

  const seleccionarEstudiante = (estudiante: Estudiante) => {
    setEstudianteSeleccionado(estudiante);
    setEstudianteBusqueda(`${estudiante.codigo} - ${estudiante.nombres} ${estudiante.apellidos}`);
    setEstudiantesFiltrados([]);
  };

  const registrarConvalidacion = () => {
    if (!estudianteSeleccionado || !cursoSeleccionado || !motivo) return;

    const curso = mockCursos.find(c => c.id === cursoSeleccionado);
    if (!curso) return;

    const nuevaConvalidacion: Convalidacion = {
      id: convalidaciones.length + 1,
      estudiante: estudianteSeleccionado,
      curso,
      institucionProcedencia,
      cursoConvalidado,
      creditosConvalidados: Number(creditosConvalidados) || curso.creditos,
      motivo,
      fechaConvalidacion: new Date().toISOString().split('T')[0],
      estado: 'PENDIENTE'
    };

    setConvalidaciones([nuevaConvalidacion, ...convalidaciones]);

    // Limpiar formulario
    setEstudianteSeleccionado(null);
    setEstudianteBusqueda("");
    setCursoSeleccionado("");
    setInstitucionProcedencia("");
    setCursoConvalidado("");
    setCreditosConvalidados("");
    setMotivo("");
    setMostrarFormulario(false);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'APROBADA':
        return 'bg-green-100 text-green-800';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'RECHAZADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'APROBADA':
        return <FiCheck className="w-4 h-4" />;
      case 'PENDIENTE':
        return <FiCalendar className="w-4 h-4" />;
      case 'RECHAZADA':
        return <FiFileText className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                href="/campus-virtual/matricula"
                variant="outline"
                leftIcon={FiArrowLeft}
                className="hover:scale-105 transition-transform duration-200"
              >
                Volver
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  ✅ Registro de Convalidaciones
                </h1>
                <p className="text-gray-600 mt-1">
                  Gestionar convalidaciones de cursos por estudiante
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                leftIcon={FiPlus}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {mostrarFormulario ? 'Cancelar' : 'Nueva Convalidación'}
              </Button>
            </div>
          </div>
        </div>

        {/* Formulario de Nueva Convalidación */}
        {mostrarFormulario && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiPlus className="text-purple-600" />
              Nueva Convalidación
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Búsqueda de Estudiante */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Estudiante
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={estudianteBusqueda}
                    onChange={(e) => {
                      setEstudianteBusqueda(e.target.value);
                      buscarEstudiantes(e.target.value);
                    }}
                    placeholder="Buscar por código, nombre o apellido..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  
                  {/* Resultados de búsqueda */}
                  {estudiantesFiltrados.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {estudiantesFiltrados.map((estudiante) => (
                        <div
                          key={estudiante.id}
                          onClick={() => seleccionarEstudiante(estudiante)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <FiUser className="text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {estudiante.codigo} - {estudiante.nombres} {estudiante.apellidos}
                              </div>
                              <div className="text-sm text-gray-500">
                                {estudiante.programa}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Curso a Convalidar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Curso a Convalidar
                </label>
                <select
                  value={cursoSeleccionado}
                  onChange={(e) => setCursoSeleccionado(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Seleccionar curso</option>
                  {mockCursos
                    .filter(curso => !estudianteSeleccionado || curso.programa === estudianteSeleccionado.programa)
                    .map((curso) => (
                    <option key={curso.id} value={curso.id}>
                      {curso.codigo} - {curso.nombre} ({curso.creditos} créditos)
                    </option>
                  ))}
                </select>
              </div>

              {/* Institución de Procedencia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institución de Procedencia
                </label>
                <input
                  type="text"
                  value={institucionProcedencia}
                  onChange={(e) => setInstitucionProcedencia(e.target.value)}
                  placeholder="Nombre de la institución..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Curso Convalidado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Curso Convalidado
                </label>
                <input
                  type="text"
                  value={cursoConvalidado}
                  onChange={(e) => setCursoConvalidado(e.target.value)}
                  placeholder="Nombre del curso convalidado..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Créditos Convalidados */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Créditos Convalidados
                </label>
                <input
                  type="number"
                  value={creditosConvalidados}
                  onChange={(e) => setCreditosConvalidados(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Número de créditos..."
                  min="1"
                  max="6"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Motivo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de la Convalidación
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Describir el motivo de la convalidación..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Botón Registrar */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={registrarConvalidacion}
                disabled={!estudianteSeleccionado || !cursoSeleccionado || !motivo}
                leftIcon={FiCheck}
                className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              >
                Registrar Convalidación
              </Button>
            </div>
          </div>
        )}

        {/* Lista de Convalidaciones */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiCheck className="text-purple-600" />
            Historial de Convalidaciones
          </h2>

          {convalidaciones.length === 0 ? (
            <div className="text-center py-8">
              <FiFileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay convalidaciones registradas
              </h3>
              <p className="text-gray-500">
                Registra la primera convalidación para comenzar.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Curso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Convalidación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {convalidaciones.map((convalidacion) => (
                    <tr key={convalidacion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {convalidacion.estudiante.codigo}
                          </div>
                          <div className="text-sm text-gray-500">
                            {convalidacion.estudiante.nombres} {convalidacion.estudiante.apellidos}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {convalidacion.curso.codigo}
                          </div>
                          <div className="text-sm text-gray-500">
                            {convalidacion.curso.nombre}
                          </div>
                          <div className="text-xs text-gray-400">
                            {convalidacion.curso.creditos} créditos
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900">
                            {convalidacion.cursoConvalidado}
                          </div>
                          <div className="text-sm text-gray-500">
                            {convalidacion.institucionProcedencia}
                          </div>
                          <div className="text-xs text-gray-400">
                            {convalidacion.creditosConvalidados} créditos
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(convalidacion.estado)}`}>
                          {getEstadoIcon(convalidacion.estado)}
                          {convalidacion.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(convalidacion.fechaConvalidacion).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
