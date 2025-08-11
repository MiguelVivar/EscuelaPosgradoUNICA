"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button, LoadingSpinner } from "@/components/common";
import { FiArrowLeft, FiUserCheck, FiUser, FiSearch, FiPlus, FiBook, FiX, FiCheck } from "react-icons/fi";

// Mock data - tipos
interface Estudiante {
  id: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  email: string;
  programa: string;
  semestre: number;
  estado: string;
}

interface Curso {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
  semestre: number;
  programa: string;
  prerequisitos: string[];
  cupos: number;
  cuposOcupados: number;
  horario: string;
  docente: string;
}

interface Matricula {
  id: number;
  estudiante: Estudiante;
  cursos: Curso[];
  fechaMatricula: string;
  periodoAcademico: string;
  estado: 'ACTIVA' | 'CANCELADA' | 'PENDIENTE';
  totalCreditos: number;
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
    semestre: 1,
    estado: "ACTIVO"
  },
  {
    id: 2,
    codigo: "2024002", 
    nombres: "Carlos Alberto",
    apellidos: "Rodríguez Díaz",
    email: "carlos.rodriguez@email.com",
    programa: "Maestría en Gestión Pública",
    semestre: 2,
    estado: "ACTIVO"
  },
  {
    id: 3,
    codigo: "2024003",
    nombres: "Ana Patricia",
    apellidos: "Mendoza Torres", 
    email: "ana.mendoza@email.com",
    programa: "Maestría en Administración",
    semestre: 1,
    estado: "ACTIVO"
  }
];

const mockCursos: Curso[] = [
  { 
    id: 1, 
    codigo: "ADM501", 
    nombre: "Gestión Estratégica", 
    creditos: 4, 
    semestre: 1, 
    programa: "Maestría en Administración",
    prerequisitos: [],
    cupos: 25,
    cuposOcupados: 18,
    horario: "Lunes y Miércoles 19:00-22:00",
    docente: "Dr. Juan Pérez"
  },
  { 
    id: 2, 
    codigo: "ADM502", 
    nombre: "Finanzas Corporativas", 
    creditos: 4, 
    semestre: 1, 
    programa: "Maestría en Administración",
    prerequisitos: [],
    cupos: 30,
    cuposOcupados: 22,
    horario: "Martes y Jueves 19:00-22:00",
    docente: "Dra. Carmen Silva"
  },
  { 
    id: 3, 
    codigo: "ADM503", 
    nombre: "Marketing Avanzado", 
    creditos: 3, 
    semestre: 2, 
    programa: "Maestría en Administración",
    prerequisitos: ["ADM501"],
    cupos: 20,
    cuposOcupados: 15,
    horario: "Viernes 18:00-21:00",
    docente: "Mg. Luis Torres"
  },
  { 
    id: 4, 
    codigo: "MGP501", 
    nombre: "Políticas Públicas", 
    creditos: 4, 
    semestre: 1, 
    programa: "Maestría en Gestión Pública",
    prerequisitos: [],
    cupos: 25,
    cuposOcupados: 20,
    horario: "Lunes y Miércoles 18:30-21:30",
    docente: "Dr. Roberto Vargas"
  },
  { 
    id: 5, 
    codigo: "MGP502", 
    nombre: "Gestión Municipal", 
    creditos: 3, 
    semestre: 1, 
    programa: "Maestría en Gestión Pública",
    prerequisitos: [],
    cupos: 20,
    cuposOcupados: 12,
    horario: "Sábados 08:00-13:00",
    docente: "Mg. Patricia Ramos"
  }
];

const mockMatriculas: Matricula[] = [
  {
    id: 1,
    estudiante: mockEstudiantes[0],
    cursos: [mockCursos[0], mockCursos[1]],
    fechaMatricula: "2024-03-15",
    periodoAcademico: "2024-I",
    estado: "ACTIVA",
    totalCreditos: 8
  },
  {
    id: 2,
    estudiante: mockEstudiantes[1],
    cursos: [mockCursos[3], mockCursos[4]],
    fechaMatricula: "2024-03-12",
    periodoAcademico: "2024-I",
    estado: "ACTIVA",
    totalCreditos: 7
  }
];

export default function MatriculaEstudiantesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Estados
  const [estudianteBusqueda, setEstudianteBusqueda] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante | null>(null);
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState<Estudiante[]>([]);
  const [cursosDisponibles, setCursosDisponibles] = useState<Curso[]>([]);
  const [cursosSeleccionados, setCursosSeleccionados] = useState<Curso[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>(mockMatriculas);
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

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
        <LoadingSpinner size="lg" message="Cargando Matrícula de Estudiantes..." />
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
    
    // Filtrar cursos disponibles según el programa del estudiante
    const cursosPrograma = mockCursos.filter(curso => 
      curso.programa === estudiante.programa &&
      curso.cuposOcupados < curso.cupos
    );
    setCursosDisponibles(cursosPrograma);
    setCursosSeleccionados([]);
  };

  const agregarCurso = (curso: Curso) => {
    if (!cursosSeleccionados.find(c => c.id === curso.id)) {
      setCursosSeleccionados([...cursosSeleccionados, curso]);
    }
  };

  const removerCurso = (cursoId: number) => {
    setCursosSeleccionados(cursosSeleccionados.filter(c => c.id !== cursoId));
  };

  const confirmarMatricula = () => {
    if (!estudianteSeleccionado || cursosSeleccionados.length === 0) return;

    const totalCreditos = cursosSeleccionados.reduce((sum, curso) => sum + curso.creditos, 0);

    const nuevaMatricula: Matricula = {
      id: matriculas.length + 1,
      estudiante: estudianteSeleccionado,
      cursos: cursosSeleccionados,
      fechaMatricula: new Date().toISOString().split('T')[0],
      periodoAcademico: "2024-I",
      estado: "ACTIVA",
      totalCreditos
    };

    setMatriculas([nuevaMatricula, ...matriculas]);

    // Limpiar formulario
    setEstudianteSeleccionado(null);
    setEstudianteBusqueda("");
    setCursosDisponibles([]);
    setCursosSeleccionados([]);
    setMostrandoFormulario(false);
  };

  const getCuposColor = (curso: Curso) => {
    const porcentajeOcupacion = (curso.cuposOcupados / curso.cupos) * 100;
    if (porcentajeOcupacion >= 90) return 'text-red-600';
    if (porcentajeOcupacion >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVA':
        return 'bg-green-100 text-green-800';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalCreditosSeleccionados = cursosSeleccionados.reduce((sum, curso) => sum + curso.creditos, 0);

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
                  👥 Matrícula de Estudiantes
                </h1>
                <p className="text-gray-600 mt-1">
                  Matricular estudiantes en cursos y programas
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setMostrandoFormulario(!mostrandoFormulario)}
                leftIcon={FiPlus}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {mostrandoFormulario ? 'Cancelar' : 'Nueva Matrícula'}
              </Button>
            </div>
          </div>
        </div>

        {/* Formulario de Matrícula */}
        {mostrandoFormulario && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Selección de Estudiante */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiUser className="text-indigo-600" />
                Seleccionar Estudiante
              </h2>

              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={estudianteBusqueda}
                  onChange={(e) => {
                    setEstudianteBusqueda(e.target.value);
                    buscarEstudiantes(e.target.value);
                  }}
                  placeholder="Buscar por código, nombre o apellido..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                              {estudiante.programa} - Semestre {estudiante.semestre}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Información del estudiante seleccionado */}
              {estudianteSeleccionado && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h3 className="font-semibold text-indigo-900 mb-2">Estudiante Seleccionado</h3>
                  <div className="text-sm text-indigo-800">
                    <p><strong>Código:</strong> {estudianteSeleccionado.codigo}</p>
                    <p><strong>Nombre:</strong> {estudianteSeleccionado.nombres} {estudianteSeleccionado.apellidos}</p>
                    <p><strong>Programa:</strong> {estudianteSeleccionado.programa}</p>
                    <p><strong>Semestre:</strong> {estudianteSeleccionado.semestre}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Selección de Cursos */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiBook className="text-indigo-600" />
                Cursos Disponibles
              </h2>

              {cursosDisponibles.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cursosDisponibles.map((curso) => (
                    <div
                      key={curso.id}
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {curso.codigo} - {curso.nombre}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {curso.creditos} créditos • {curso.horario}
                          </p>
                          <p className="text-sm text-gray-500">
                            Docente: {curso.docente}
                          </p>
                          <p className={`text-xs ${getCuposColor(curso)}`}>
                            Cupos: {curso.cuposOcupados}/{curso.cupos}
                          </p>
                        </div>
                        <Button
                          onClick={() => agregarCurso(curso)}
                          disabled={cursosSeleccionados.find(c => c.id === curso.id) !== undefined}
                          variant="outline"
                          size="sm"
                          leftIcon={FiPlus}
                          className="ml-2"
                        >
                          Agregar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {estudianteSeleccionado ? 
                    'No hay cursos disponibles para este programa' : 
                    'Selecciona un estudiante para ver los cursos disponibles'
                  }
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cursos Seleccionados */}
        {mostrandoFormulario && cursosSeleccionados.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiCheck className="text-indigo-600" />
                Cursos Seleccionados
              </h2>
              <div className="text-sm bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full">
                Total: {totalCreditosSeleccionados} créditos
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {cursosSeleccionados.map((curso) => (
                <div key={curso.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {curso.codigo} - {curso.nombre}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {curso.creditos} créditos • {curso.horario}
                      </p>
                    </div>
                    <Button
                      onClick={() => removerCurso(curso.id)}
                      variant="outline"
                      size="sm"
                      leftIcon={FiX}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Quitar
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={confirmarMatricula}
                disabled={!estudianteSeleccionado || cursosSeleccionados.length === 0}
                leftIcon={FiUserCheck}
                className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
              >
                Confirmar Matrícula
              </Button>
            </div>
          </div>
        )}

        {/* Lista de Matrículas */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiUserCheck className="text-indigo-600" />
            Matrículas Registradas
          </h2>

          {matriculas.length === 0 ? (
            <div className="text-center py-8">
              <FiUserCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay matrículas registradas
              </h3>
              <p className="text-gray-500">
                Registra la primera matrícula para comenzar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matriculas.map((matricula) => (
                <div key={matricula.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {matricula.estudiante.codigo} - {matricula.estudiante.nombres} {matricula.estudiante.apellidos}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {matricula.estudiante.programa}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(matricula.estado)}`}>
                        <FiCheck className="w-3 h-3" />
                        {matricula.estado}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(matricula.fechaMatricula).toLocaleDateString()} • {matricula.totalCreditos} créditos
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {matricula.cursos.map((curso) => (
                      <div key={curso.id} className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-medium text-sm text-gray-900">
                          {curso.codigo}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {curso.nombre}
                        </p>
                        <p className="text-xs text-gray-500">
                          {curso.creditos} créditos
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
