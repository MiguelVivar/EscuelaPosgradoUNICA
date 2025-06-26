"use client";

import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/layout/PageHeader";
import { FaPlus, FaEdit, FaTrash, FaUsers, FaCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function CursosGestionPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Solo coordinadores pueden acceder
  if (user?.role !== 'COORDINADOR') {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">Esta página es solo para coordinadores.</p>
          <button 
            onClick={() => router.push('/campus-virtual')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Volver al Campus Virtual
          </button>
        </div>
      </div>
    );
  }

  const cursosEjemplo = [
    {
      id: 1,
      nombre: "Metodología de la Investigación",
      codigo: "MI-001",
      programa: "Maestría en Administración",
      docente: "Dr. Juan Pérez",
      estudiantes: 25,
      creditos: 3,
      estado: "Activo",
      ciclo: "2024-I"
    },
    {
      id: 2,
      nombre: "Estadística Aplicada",
      codigo: "EA-002",
      programa: "Maestría en Ingeniería",
      docente: "Dra. María González",
      estudiantes: 30,
      creditos: 4,
      estado: "Activo",
      ciclo: "2024-I"
    },
    {
      id: 3,
      nombre: "Gestión de Proyectos",
      codigo: "GP-003",
      programa: "Maestría en Administración",
      docente: "Mg. Carlos Rodríguez",
      estudiantes: 22,
      creditos: 3,
      estado: "Programado",
      ciclo: "2024-II"
    }
  ];

  return (
    <div className="min-h-full">
      <PageHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Estadísticas de gestión */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 text-xl font-bold">{cursosEjemplo.length}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total Cursos</h3>
                <p className="text-sm text-gray-600">Este ciclo</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center">
              <FaUsers className="text-green-500 text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Estudiantes</h3>
                <p className="text-2xl font-bold text-green-600">
                  {cursosEjemplo.reduce((acc, curso) => acc + curso.estudiantes, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-yellow-600 text-xl font-bold">
                  {cursosEjemplo.filter(c => c.estado === 'Programado').length}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Programados</h3>
                <p className="text-sm text-gray-600">Próximo ciclo</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center">
              <FaCalendarAlt className="text-purple-500 text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Ciclo Actual</h3>
                <p className="text-lg font-bold text-purple-600">2024-I</p>
              </div>
            </div>
          </div>
        </div>

        {/* Herramientas de gestión */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Cursos</h2>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <FaPlus className="mr-2" />
                Nuevo Curso
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <FaCalendarAlt className="mr-2" />
                Gestionar Horarios
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <select 
              className="p-2 border border-gray-300 rounded-lg"
              aria-label="Filtrar por programa"
            >
              <option>Todos los programas</option>
              <option>Maestría en Administración</option>
              <option>Maestría en Ingeniería</option>
              <option>Doctorado en Ciencias</option>
            </select>
            <select 
              className="p-2 border border-gray-300 rounded-lg"
              aria-label="Filtrar por estado"
            >
              <option>Todos los estados</option>
              <option>Activo</option>
              <option>Programado</option>
              <option>Finalizado</option>
            </select>
            <select 
              className="p-2 border border-gray-300 rounded-lg"
              aria-label="Filtrar por ciclo"
            >
              <option>Todos los ciclos</option>
              <option>2024-I</option>
              <option>2024-II</option>
            </select>
            <input 
              type="text" 
              placeholder="Buscar curso..." 
              className="p-2 border border-gray-300 rounded-lg"
              aria-label="Buscar curso"
            />
          </div>
        </div>

        {/* Tabla de cursos */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Programa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Docente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ciclo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cursosEjemplo.map((curso) => (
                  <tr key={curso.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{curso.nombre}</div>
                        <div className="text-sm text-gray-500">{curso.codigo} • {curso.creditos} créditos</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {curso.programa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {curso.docente}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {curso.estudiantes} estudiantes
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        curso.estado === 'Activo' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {curso.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {curso.ciclo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <FaEdit />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1">
                          <FaUsers />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
