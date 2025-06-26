"use client";

import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/layout/PageHeader";
import { FaBook, FaClipboardList, FaFileAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";

export default function MisCursosPage() {
  const { user } = useAuth();

  const isDocente = user?.role === 'DOCENTE';

  const cursosEjemplo = [
    {
      id: 1,
      nombre: "Metodología de la Investigación",
      codigo: "MI-001",
      creditos: 3,
      estudiantes: isDocente ? 25 : undefined,
      horario: "Lunes 18:00 - 21:00",
      estado: "Activo"
    },
    {
      id: 2,
      nombre: "Estadística Aplicada",
      codigo: "EA-002", 
      creditos: 4,
      estudiantes: isDocente ? 30 : undefined,
      horario: "Miércoles 18:00 - 21:00",
      estado: "Activo"
    },
    {
      id: 3,
      nombre: "Gestión de Proyectos",
      codigo: "GP-003",
      creditos: 3,
      estudiantes: isDocente ? 22 : undefined,
      horario: "Viernes 18:00 - 21:00",
      estado: "Activo"
    }
  ];

  return (
    <div className="min-h-full">
      <PageHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center">
              <FaBook className="text-blue-500 text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Cursos</h3>
                <p className="text-2xl font-bold text-blue-600">{cursosEjemplo.length}</p>
              </div>
            </div>
          </div>

          {isDocente ? (
            <>
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center">
                  <FaUsers className="text-green-500 text-3xl mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Estudiantes</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {cursosEjemplo.reduce((acc, curso) => acc + (curso.estudiantes || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center">
                  <FaClipboardList className="text-orange-500 text-3xl mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Por Calificar</h3>
                    <p className="text-2xl font-bold text-orange-600">8</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center">
                  <FaClipboardList className="text-orange-500 text-3xl mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Tareas</h3>
                    <p className="text-2xl font-bold text-orange-600">5</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center">
                  <FaFileAlt className="text-red-500 text-3xl mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Exámenes</h3>
                    <p className="text-2xl font-bold text-red-600">2</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center">
              <FaCalendarAlt className="text-purple-500 text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Esta Semana</h3>
                <p className="text-2xl font-bold text-purple-600">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de cursos */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              {isDocente ? 'Mis Cursos - Vista Docente' : 'Mis Cursos Matriculados'}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créditos
                  </th>
                  {isDocente && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiantes
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
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
                      <div className="font-medium text-gray-900">{curso.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {curso.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {curso.creditos}
                    </td>
                    {isDocente && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {curso.estudiantes} estudiantes
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {curso.horario}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {curso.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        {isDocente ? 'Gestionar' : 'Ingresar'}
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Ver Detalles
                      </button>
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
