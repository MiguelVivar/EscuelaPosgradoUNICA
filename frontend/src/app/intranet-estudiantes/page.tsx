"use client";

import Card from "@/components/intranet-estudiantes/Card";
import { FaGraduationCap, FaTrophy, FaCreditCard, FaHistory, FaFileAlt, FaClipboardList, FaUser, FaClock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const cards = [
  {
    title: "Plan de Estudios",
    description: "Consulta tu plan académico completo, materias por ciclo, prerrequisitos, créditos académicos y avance curricular",
    status: <span><b>6 materias aprobadas</b><br/><small className="text-gray-500">18 créditos completados</small></span>,
    color: "blue",
    icon: <FaGraduationCap />,
    href: "/intranet-estudiantes/plan-estudios",
  },
  {
    title: "Situación Académica", 
    description: "Revisa tus calificaciones por semestre, promedio ponderado, ranking académico y estado de matrícula",
    status: <span><b>Promedio: 15.8</b><br/><small className="text-gray-500">Posición: 12/85</small></span>,
    color: "orange",
    icon: <FaTrophy />,
    href: "/intranet-estudiantes/situacion-academica",
  },
  {
    title: "Estado de Deudas",
    description: "Revisa tus pagos pendientes, fechas de vencimiento, modalidades de pago y genera comprobantes",
    status: <span><b>2 deudas pendientes</b><br/><small className="text-gray-500">S/ 850.00 total</small></span>,
    color: "slate",
    icon: <FaCreditCard />,
    href: "/intranet-estudiantes/deudas",
  },
  {
    title: "Historial de Pagos",
    description: "Consulta todos tus pagos realizados, descarga comprobantes oficiales y revisa el estado de transacciones",
    status: <span><b>Últimos 12 meses</b><br/><small className="text-gray-500">8 pagos realizados</small></span>,
    color: "blue",
    icon: <FaHistory />,
    href: "/intranet-estudiantes/historial-pagos",
  },
  {
    title: "Trámites Académicos",
    description: "Solicita certificados de estudios, constancias de matrícula, cartas de presentación y documentos oficiales",
    status: <span><b>1 trámite activo</b><br/><small className="text-gray-500">En proceso de revisión</small></span>,
    color: "orange",
    icon: <FaFileAlt />,
    href: "/intranet-estudiantes/tramites",
  },
  {
    title: "Encuestas y Evaluaciones",
    description: "Completa encuestas de evaluación docente, satisfacción académica y calidad de servicios universitarios",
    status: <span><b>2 encuestas disponibles</b><br/><small className="text-gray-500">Evaluación semestral</small></span>,
    color: "slate",
    icon: <FaClipboardList />,
    href: "/intranet-estudiantes/encuestas",
  },
];

export default function IntranetEstudiantesHome() {
  const router = useRouter();
  const { user } = useAuth();

  // Función para obtener saludo según la hora
  const getSaludo = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Buenos días";
    if (hora >= 12 && hora < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  // Función para obtener el nombre completo o username
  const getNombreCompleto = () => {
    if (user?.nombres && user?.apellidos) {
      return `${user.nombres} ${user.apellidos}`;
    }
    return user?.username || "Estudiante";
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      {/* Header de Bienvenida */}
      <div className="w-full max-w-6xl mb-8 mt-16">
        <div className="bg-white rounded-xl p-8 text-gray-800 shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaUser className="text-amber-500 text-4xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {getSaludo()}, {getNombreCompleto()}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sistema integral para la gestión de tu vida académica. Accede a todos los servicios 
              estudiantiles de manera eficiente y profesional desde un solo lugar.
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2 text-gray-500">
              <FaClock className="w-4 h-4" />
              <span className="text-sm">
                Último acceso: {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            {user?.codigoEstudiante && (
              <div className="text-right">
                <p className="text-gray-500 text-sm">Código de Estudiante</p>
                <p className="font-bold text-xl text-amber-600">{user.codigoEstudiante}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg">
              <FaGraduationCap className="text-sm" />
              <span className="text-sm font-medium">Acceso exclusivo para Estudiantes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Título Principal */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Panel Estudiantil - Sistema Integral 📚</h2>
      
      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {cards.map((card) => (
          <Card
            key={card.title}
            title={card.title}
            description={card.description}
            status={card.status}
            color={card.color as "blue" | "orange" | "slate"}
            icon={card.icon}
            onClick={() => router.push(card.href)}
          />
        ))}
      </div>

      {/* Footer con información adicional */}
      <div className="w-full max-w-6xl mt-12">
        <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
          <h3 className="text-amber-600 font-bold text-lg mb-2">Sistema de Gestión Académica</h3>
          <p className="text-gray-700 text-sm font-medium">
            Universidad Nacional San Luis Gonzaga - Escuela de Posgrado
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Para soporte técnico contacta a: soporte@unica.edu.pe | Mesa de Ayuda: (056) 522-415
          </p>
        </div>
      </div>
    </main>
  );
}
