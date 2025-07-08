"use client";

import React from "react";
import { Button, Notification } from "@/components/common";
import { useContactForm } from "@/hooks/useContactForm";

export default function SimplePage() {
  const [selected, setSelected] = React.useState("Alta Dirección");
  const { 
    formData, 
    isSubmitting, 
    submitStatus, 
    handleInputChange, 
    handleSubmit, 
    resetForm 
  } = useContactForm();

  const menu = [
    "Alta Dirección",
    "Facultades",
    "Direcciones y Oficinas",
    "Centros y Servicios",
  ];

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 mt-16 sm:mt-20">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            Directorio de la Universidad Nacional &quot;San Luis Gonzaga&quot;
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Consulta de Facultades, Direcciones y Centros.
          </p>
          
          {/* Contacto y Mapa */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            {/* Información de contacto institucional */}
            <div className="w-full lg:w-80 lg:flex-shrink-0 bg-white border border-gray-200 rounded-2xl shadow p-4 sm:p-6 flex flex-col gap-4 justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  Contacto institucional
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-700 text-sm sm:text-base">
                      Horario de atención:
                    </span>
                    <div className="text-gray-700 text-sm sm:text-base">
                      Lunes a Viernes, 6:00 am - 12:00 pm
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 text-sm sm:text-base">
                      Dirección:
                    </span>
                    <div className="text-gray-700 text-sm sm:text-base">
                      Av. Los Maestros S/N
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 text-sm sm:text-base">
                      Teléfono:
                    </span>
                    <div className="text-gray-700 text-sm sm:text-base">
                      056-620063
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 text-sm sm:text-base">
                      Correo electrónico:
                    </span>
                    <div className="text-gray-700 text-sm sm:text-base break-all">
                      diga@unica.edu.pe
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 text-sm sm:text-base">
                      Mesa de partes:
                    </span>
                    <div className="text-gray-700 text-sm sm:text-base break-all">
                      mesadepartes@unica.edu.pe
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de contacto */}
            <form 
              className="flex-1 bg-white border border-gray-200 rounded-2xl shadow p-4 sm:p-6" 
              onSubmit={handleSubmit}
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Envíanos un mensaje
              </h2>
              
              {/* Status Messages */}
              {submitStatus.type && (
                <div className="mb-4">
                  <Notification 
                    type={submitStatus.type} 
                    message={submitStatus.message}
                    onClose={() => resetForm()}
                  />
                </div>
              )}
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm sm:text-base font-medium" htmlFor="nombre">
                      Nombre *
                    </label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      type="text" 
                      id="nombre" 
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Tu nombre completo"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm sm:text-base font-medium" htmlFor="email">
                      Correo electrónico *
                    </label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tucorreo@ejemplo.com"
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm sm:text-base font-medium" htmlFor="telefono">
                      Teléfono (opcional)
                    </label>
                    <input 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      type="tel" 
                      id="telefono" 
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="(056) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm sm:text-base font-medium" htmlFor="asunto">
                      Asunto *
                    </label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      id="asunto" 
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="Consulta General">Consulta General</option>
                      <option value="Información de Posgrado">Información de Posgrado</option>
                      <option value="Matrícula">Matrícula</option>
                      <option value="Admisión">Admisión</option>
                      <option value="Trámites Administrativos">Trámites Administrativos</option>
                      <option value="Quejas y Sugerencias">Quejas y Sugerencias</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1 text-sm sm:text-base font-medium" htmlFor="mensaje">
                    Mensaje *
                  </label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical" 
                    id="mensaje" 
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    rows={4} 
                    placeholder="Describe tu consulta o mensaje..."
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.mensaje.length}/500 caracteres
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="flex-1 sm:flex-none sm:min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      'Enviar mensaje'
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 sm:flex-none sm:min-w-[120px]"
                    onClick={resetForm}
                    disabled={isSubmitting}
                  >
                    Limpiar
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500 mt-3">
                  * Campos obligatorios. Tu información será utilizada únicamente para responder a tu consulta.
                </div>
              </div>
            </form>

            {/* Mapa */}
            <div className="w-full lg:w-80 lg:flex-shrink-0 min-h-[250px] sm:min-h-[300px] bg-gray-100 border border-gray-200 rounded-2xl shadow overflow-hidden">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 p-4">
                Ubicación
              </h2>
              <iframe
                title="Mapa UNICA"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d967.4750163567132!2d-75.73542102709841!3d-14.083076213129493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9110e28a8ad5a9bf%3A0xb3869e7db6ef2c93!2sUniversidad%20Nacional%20San%20Luis%20Gonzaga!5e0!3m2!1ses!2spe!4v1751081710280!5m2!1ses!2spe"
                width="100%"
                height="250"
                className="sm:h-[300px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Directory Section */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-4 lg:w-64 w-full mb-4 lg:mb-0">
            {menu.map((item) => (
              <Button
                key={item}
                variant="outline"
                onClick={() => setSelected(item)}
              >
                {item}
              </Button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Responsive Table Component */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 mt-4 lg:mt-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                {selected}
              </h2>
              
              {/* Mobile-first responsive table */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse min-w-[600px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium">
                        Dependencia
                      </th>
                      <th className="border px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium">
                        Correo
                      </th>
                      <th className="border px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium">
                        Mesa de Partes
                      </th>
                      <th className="border px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium">
                        Teléfono
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected === "Alta Dirección" && (
                      <>
                        <tr>
                          <td className="border px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm">
                            Rector
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            rector@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            mesadepartes@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm">
                            056-217405
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm">
                            Vicerrectorado Académico
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            vracademico@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            vracademico.mesadepartes@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm">
                            056-218310
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm">
                            Vicerrectorado de Investigación
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            vrid@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            vrid.mesadepartes@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm">
                            056-284401
                          </td>
                        </tr>
                      </>
                    )}
                    
                    {selected === "Facultades" && (
                      <>
                        <tr>
                          <td className="border px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm">
                            Administración
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            administracion@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            administracion.mesadepartes@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm">
                            056-287180
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm">
                            Medicina Humana
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            medicina@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            fmh.mesadepartes@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm">
                            056-407126
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm">
                            Escuela de Posgrado
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            posgrado@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            posgrado.mesadepartes@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm">
                            056-284400
                          </td>
                        </tr>
                      </>
                    )}
                    
                    {selected === "Direcciones y Oficinas" && (
                      <>
                        <tr>
                          <td className="border px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm">
                            Dirección General de Administración
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            diga@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            diga.mesadepartes@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm">
                            056-283915
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm">
                            Oficina de Asesoría Jurídica
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            asesorialegal@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            asesorialegal.mesadepartes@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm">
                            056-218306
                          </td>
                        </tr>
                      </>
                    )}
                    
                    {selected === "Centros y Servicios" && (
                      <>
                        <tr>
                          <td className="border px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm">
                            Centro de Idiomas
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            centrodeidiomas@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            centrodeidiomas.mesadepartes@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm">
                            056-284404
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm">
                            Centro Médico Universitario
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            centromedico@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm break-all">
                            centromedico.mesadepartes@unica.edu.pe
                          </td>
                          <td className="border px-2 sm:px-4 py-2 text-xs sm:text-sm">
                            056-284033
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Spacer for footer visibility */}
            <div className="h-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
