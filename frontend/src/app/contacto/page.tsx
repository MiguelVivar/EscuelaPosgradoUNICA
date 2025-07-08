"use client";

import React from "react";

export default function SimplePage() {
  const [selected, setSelected] = React.useState("Alta Dirección");
  const menu = [
    "Alta Dirección",
    "Facultades",
    "Direcciones y Oficinas",
    "Centros y Servicios",
  ];
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="container mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Directorio de la Universidad Nacional &quot;San Luis Gonzaga&quot;
          </h1>
          <p className="text-gray-600 mb-8">Consulta de Facultades, Direcciones y Centros.</p>
          {/* Contacto y Mapa */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Información de contacto institucional */}
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow p-6 flex flex-col gap-4 justify-between min-w-[260px] max-w-xs">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Contacto institucional</h2>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Horario de atención:</span>
                  <div className="text-gray-700">Lunes a Viernes, 6:00 am - 12:00 pm</div>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Dirección:</span>
                  <div className="text-gray-700"> Av. Los Maestros S/N</div>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Teléfono:</span>
                  <div className="text-gray-700">056-620063</div>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Correo electrónico:</span>
                  <div className="text-gray-700">diga@unica.edu.pe</div>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Mesa de partes:</span>
                  <div className="text-gray-700">mesadepartes@unica.edu.pe</div>
                </div>
              </div>
            </div>
            {/* Formulario de contacto */}
            <form className="flex-1 bg-white border border-gray-200 rounded-2xl shadow p-6" onSubmit={e => e.preventDefault()}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Envíanos un mensaje</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1" htmlFor="nombre">Nombre</label>
                <input className="w-full border rounded px-3 py-2" type="text" id="nombre" name="nombre" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1" htmlFor="email">Correo electrónico</label>
                <input className="w-full border rounded px-3 py-2" type="email" id="email" name="email" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1" htmlFor="mensaje">Mensaje</label>
                <textarea className="w-full border rounded px-3 py-2" id="mensaje" name="mensaje" rows={4} required></textarea>
              </div>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Enviar</button>
            </form>
            {/* Mapa */}
            <div className="flex-1 min-h-[300px] bg-gray-100 border border-gray-200 rounded-2xl shadow overflow-hidden">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 p-4">Ubicación</h2>
              <iframe
                title="Mapa UNICA"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d967.4750163567132!2d-75.73542102709841!3d-14.083076213129493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9110e28a8ad5a9bf%3A0xb3869e7db6ef2c93!2sUniversidad%20Nacional%20San%20Luis%20Gonzaga!5e0!3m2!1ses!2spe!4v1751081710280!5m2!1ses!2spe"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="flex md:flex-col flex-row gap-4 md:w-64 w-full mb-4 md:mb-0">
            {menu.map((item) => (
              <button
                key={item}
                className={`w-full text-left px-6 py-3 rounded-lg border transition font-semibold text-gray-700 hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${selected === item ? "bg-blue-600 text-white" : "bg-white"}`}
                onClick={() => setSelected(item)}
              >
                {item}
              </button>
            ))}
          </div>
          {/* Content */}
          <div className="flex-1">
            {selected === "Alta Dirección" && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mt-4 md:mt-0">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Alta Dirección</h2>
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Dependencia</th>
                      <th className="border px-4 py-2 text-left">Correo</th>
                      <th className="border px-4 py-2 text-left">Mesa de Partes</th>
                      <th className="border px-4 py-2 text-left">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Rector</td>
                      <td className="border px-4 py-2">rector@unica.edu.pe</td>
                      <td className="border px-4 py-2">mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-217405</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Vicerrectorado Académico</td>
                      <td className="border px-4 py-2">vracademico@unica.edu.pe</td>
                      <td className="border px-4 py-2">vracademico.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-218310</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Vicerrectorado de Investigación</td>
                      <td className="border px-4 py-2">vrid@unica.edu.pe</td>
                      <td className="border px-4 py-2">vrid.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-284401</td>
                    </tr>
                  </tbody>
                </table>

                {/* Órganos Especiales */}
                <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Órganos Especiales</h3>
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Dependencia</th>
                      <th className="border px-4 py-2 text-left">Correo</th>
                      <th className="border px-4 py-2 text-left">Mesa de Partes</th>
                      <th className="border px-4 py-2 text-left">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Comisión Permanente de Fiscalización</td>
                      <td className="border px-4 py-2">fiscalizacion@unica.edu.pe</td>
                      <td className="border px-4 py-2">fiscalizacion.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2"></td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Defensoría Universitaria</td>
                      <td className="border px-4 py-2">defensoriauniversitaria@unica.edu.pe</td>
                      <td className="border px-4 py-2">defensoria.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-386344</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Tribunal de Honor Universitario</td>
                      <td className="border px-4 py-2">tribunaldehonor@unica.edu.pe</td>
                      <td className="border px-4 py-2">defensoria.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-766433</td>
                    </tr>
                  </tbody>
                </table>

                {/* Órganos Consultivos */}
                <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Órganos Consultivos</h3>
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Dependencia</th>
                      <th className="border px-4 py-2 text-left">Correo</th>
                      <th className="border px-4 py-2 text-left">Mesa de Partes</th>
                      <th className="border px-4 py-2 text-left">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Comité Electoral Universitario</td>
                      <td className="border px-4 py-2">comite_electoral@unica.edu.pe</td>
                      <td className="border px-4 py-2">comite_electoral.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-654321</td>
                    </tr>
                  </tbody>
                </table>

                {/* Órganos de Control */}
                <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Órganos de Control</h3>
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Dependencia</th>
                      <th className="border px-4 py-2 text-left">Correo</th>
                      <th className="border px-4 py-2 text-left">Mesa de Partes</th>
                      <th className="border px-4 py-2 text-left">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Órgano de Control Institucional</td>
                      <td className="border px-4 py-2">cinstitucional@unica.edu.pe</td>
                      <td className="border px-4 py-2">cinstitucional.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-771827</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}


            {selected === "Facultades" && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mt-4 md:mt-0">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Facultades</h2>
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Dependencia</th>
                      <th className="border px-4 py-2 text-left">Correo</th>
                      <th className="border px-4 py-2 text-left">Mesa de Partes</th>
                      <th className="border px-4 py-2 text-left">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Administración</td>
                      <td className="border px-4 py-2">administracion@unica.edu.pe</td>
                      <td className="border px-4 py-2">administracion.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-287180</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Agronomía</td>
                      <td className="border px-4 py-2">agronomia@unica.edu.pe</td>
                      <td className="border px-4 py-2">agronomia.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-774375</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Arquitectura</td>
                      <td className="border px-4 py-2">arquitectura@unica.edu.pe</td>
                      <td className="border px-4 py-2">arquitectura.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-761194</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Ciencias</td>
                      <td className="border px-4 py-2">ciencias@unica.edu.pe</td>
                      <td className="border px-4 py-2">ciencias.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-774622</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Ciencias Biológicas</td>
                      <td className="border px-4 py-2">ccbb@unica.edu.pe</td>
                      <td className="border px-4 py-2">biologia.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-283832</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Ciencias de la Comunicación, Turismo y Arqueología</td>
                      <td className="border px-4 py-2">cctya@unica.edu.pe</td>
                      <td className="border px-4 py-2">cctya.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-283842</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Ciencias de la Educación y Humanidades</td>
                      <td className="border px-4 py-2">educacion@unica.edu.pe</td>
                      <td className="border px-4 py-2">educacion.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-283831</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Ciencias Económicas y Negocios Internacionales</td>
                      <td className="border px-4 py-2">economia@unica.edu.pe</td>
                      <td className="border px-4 py-2">economia.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-387355</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Contabilidad</td>
                      <td className="border px-4 py-2">contabilidad@unica.edu.pe</td>
                      <td className="border px-4 py-2">contabilidad.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-387450</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Derecho y Ciencia Política</td>
                      <td className="border px-4 py-2">derecho@unica.edu.pe</td>
                      <td className="border px-4 py-2">derecho.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-223837</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Enfermería</td>
                      <td className="border px-4 py-2">enfermeria@unica.edu.pe</td>
                      <td className="border px-4 py-2">enfermeria.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-283900</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Farmacia y Bioquímica</td>
                      <td className="border px-4 py-2">farmacia@unica.edu.pe</td>
                      <td className="border px-4 py-2">farmacia.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-762573</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Ingeniería Ambiental y Sanitaria</td>
                      <td className="border px-4 py-2">ambientalysanitaria@unica.edu.pe</td>
                      <td className="border px-4 py-2">fias.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-283844</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Ingeniería Civil</td>
                      <td className="border px-4 py-2">civil@unica.edu.pe</td>
                      <td className="border px-4 py-2">ingcivil.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-283893</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Ingeniería de Minas y Metalurgia</td>
                      <td className="border px-4 py-2">minasymetalurgia@unica.edu.pe</td>
                      <td className="border px-4 py-2">fimm.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-277286</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Ingeniería de Sistemas</td>
                      <td className="border px-4 py-2">sistemas@unica.edu.pe</td>
                      <td className="border px-4 py-2">fis.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-762292</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Ingeniería Mecánica y Eléctrica</td>
                      <td className="border px-4 py-2">mecanicayelectrica@unica.edu.pe</td>
                      <td className="border px-4 py-2">fimee.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-283895</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Ingeniería Pesquera y de Alimentos</td>
                      <td className="border px-4 py-2">pesqueria@unica.edu.pe</td>
                      <td className="border px-4 py-2">fipa.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-322889</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Ingeniería Química y Petroquímica</td>
                      <td className="border px-4 py-2">quimica@unica.edu.pe</td>
                      <td className="border px-4 py-2">fiq.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-283899</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Medicina Humana</td>
                      <td className="border px-4 py-2">medicina@unica.edu.pe</td>
                      <td className="border px-4 py-2">fmh.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-407126</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Medicina Veterinaria y Zootecnia</td>
                      <td className="border px-4 py-2">veterinaria@unica.edu.pe</td>
                      <td className="border px-4 py-2">veterinaria.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-323901</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Obstetricia</td>
                      <td className="border px-4 py-2">obstetricia@unica.edu.pe</td>
                      <td className="border px-4 py-2">obstetricia.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-761152</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Odontología</td>
                      <td className="border px-4 py-2">odontologia@unica.edu.pe</td>
                      <td className="border px-4 py-2">odontologia.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-283894</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Psicología</td>
                      <td className="border px-4 py-2">psicologia@unica.edu.pe</td>
                      <td className="border px-4 py-2">psicologia.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-283841</td>
                    </tr>
                  </tbody>
                </table>

                 <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Órganos de Línea</h3>
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Dependencia</th>
                      <th className="border px-4 py-2 text-left">Correo</th>
                      <th className="border px-4 py-2 text-left">Mesa de Partes</th>
                      <th className="border px-4 py-2 text-left">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Escuela de Posgrado</td>
                      <td className="border px-4 py-2">posgrado@unica.edu.pe</td>
                      <td className="border px-4 py-2">posgrado.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-284400</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {selected === "Direcciones y Oficinas" && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mt-4 md:mt-0">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Oficinas dependientes del Rectorado</h2>
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Dependencia</th>
                      <th className="border px-4 py-2 text-left">Correo</th>
                      <th className="border px-4 py-2 text-left">Mesa de Partes</th>
                      <th className="border px-4 py-2 text-left">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Dirección General de Administración</td>
                      <td className="border px-4 py-2">diga@unica.edu.pe</td>
                      <td className="border px-4 py-2">diga.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-283915</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Oficina de Asesoría Jurídica</td>
                      <td className="border px-4 py-2">asesorialegal@unica.edu.pe</td>
                      <td className="border px-4 py-2">asesorialegal.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-218306</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Oficina de Comunicaciones e Imagen Institucional</td>
                      <td className="border px-4 py-2">imagen@unica.edu.pe</td>
                      <td className="border px-4 py-2">imagen.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-284399</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Oficina de Cooperación y Relaciones Internacionales</td>
                      <td className="border px-4 py-2">coop_tecnica@unica.edu.pe</td>
                      <td className="border px-4 py-2">coop_tecnica.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-228406</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Oficina de Gestión de la Calidad</td>
                      <td className="border px-4 py-2">gestiondelacalidad@unica.edu.pe</td>
                      <td className="border px-4 py-2">calidad.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-386487</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Oficina de Planeamiento y Presupuesto</td>
                      <td className="border px-4 py-2">planeamientoypresupuesto@unica.edu.pe</td>
                      <td className="border px-4 py-2">planeamientoypresupuesto.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-283704</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Oficina de Tecnologías de la Información</td>
                      <td className="border px-4 py-2">tic@unica.edu.pe</td>
                      <td className="border px-4 py-2">tic.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-211176</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Secretaría General</td>
                      <td className="border px-4 py-2">sec_general@unica.edu.pe</td>
                      <td className="border px-4 py-2">mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2"></td>
                    </tr>
                  </tbody>
                </table>

                {/* Oficinas dependientes del Vicerrectorado de Investigación */}
                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Oficinas dependientes del Vicerrectorado de Investigación</h2>
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Dependencia</th>
                      <th className="border px-4 py-2 text-left">Correo</th>
                      <th className="border px-4 py-2 text-left">Mesa de Partes</th>
                      <th className="border px-4 py-2 text-left">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Dirección de Incubadora de Empresas</td>
                      <td className="border px-4 py-2">incubadoradeempresas@unica.edu.pe</td>
                      <td className="border px-4 py-2"></td>
                      <td className="border px-4 py-2">056-284401</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Dirección de Innovación y Transferencia Tecnológica</td>
                      <td className="border px-4 py-2">innovaciontecnologica@unica.edu.pe</td>
                      <td className="border px-4 py-2"></td>
                      <td className="border px-4 py-2">056-284401</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Dirección de Producción de Bienes y Servicios</td>
                      <td className="border px-4 py-2">producciondebienes@unica.edu.pe</td>
                      <td className="border px-4 py-2"></td>
                      <td className="border px-4 py-2">056-284401</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Instituto de Investigación</td>
                      <td className="border px-4 py-2">institutodeinvestigacion@unica.edu.pe</td>
                      <td className="border px-4 py-2"></td>
                      <td className="border px-4 py-2">056-284401</td>
                    </tr>
                  </tbody>
                </table>

                {/* Oficinas dependientes del Vicerrectorado Académico */}
                <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Oficinas dependientes del Vicerrectorado Académico</h3>
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Dependencia</th>
                      <th className="border px-4 py-2 text-left">Correo</th>
                      <th className="border px-4 py-2 text-left">Mesa de Partes</th>
                      <th className="border px-4 py-2 text-left">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Dirección de Admisión</td>
                      <td className="border px-4 py-2">oga@unica.edu.pe</td>
                      <td className="border px-4 py-2">oga.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-284402</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Dirección de Bienestar Universitario</td>
                      <td className="border px-4 py-2">bienestar_universitario@unica.edu.pe</td>
                      <td className="border px-4 py-2">bienestar_universitario.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-760316</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Dirección de Capacitación, Perfeccionamiento Docente y Desarrollo</td>
                      <td className="border px-4 py-2">capacitacion@unica.edu.pe</td>
                      <td className="border px-4 py-2">capacitacion.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-386914</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Dirección de Registro, Matrícula y Estadística</td>
                      <td className="border px-4 py-2">ogmre@unica.edu.pe</td>
                      <td className="border px-4 py-2">ogmre.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-766473</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Dirección de Responsabilidad Social Universitaria</td>
                      <td className="border px-4 py-2">social_universitaria@unica.edu.pe</td>
                      <td className="border px-4 py-2">rsu.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-386318</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Dirección de Servicios Académicos</td>
                      <td className="border px-4 py-2">serv_academicos@unica.edu.pe</td>
                      <td className="border px-4 py-2">serviciosacademicos.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-762577</td>
                    </tr>
                  </tbody>
                </table>

<h2 className="text-2xl font-semibold text-gray-800 mb-4">Unidades de Direcciones y Oficinas</h2>
<table className="w-full table-auto border-collapse">
  <thead className="bg-gray-100">
    <tr>
      <th className="border px-4 py-2 text-left">Dependencia</th>
      <th className="border px-4 py-2 text-left">Correo</th>
      <th className="border px-4 py-2 text-left">Mesa de Partes</th>
      <th className="border px-4 py-2 text-left">Teléfono</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="border px-4 py-2 font-medium">Unidad de Abastecimiento</td>
      <td className="border px-4 py-2">abastecimiento@unica.edu.pe</td>
      <td className="border px-4 py-2">abastecimiento.mesadepartes@unica.edu.pe</td>
      <td className="border px-4 py-2">056-283912</td>
    </tr>
    <tr>
      <td className="border px-4 py-2 font-medium">Unidad de Asistencia Social</td>
      <td className="border px-4 py-2">asistenciasocial@unica.edu.pe</td>
      <td className="border px-4 py-2">asistenciasocial.mesadepartes@unica.edu.pe</td>
      <td className="border px-4 py-2">056-766473</td>
    </tr>
    <tr>
      <td className="border px-4 py-2 font-medium">Unidad de Infraestructura y Mantenimiento</td>
      <td className="border px-4 py-2">mantenimiento@unica.edu.pe</td>
      <td className="border px-4 py-2">mantenimiento.mesadepartes@unica.edu.pe</td>
      <td className="border px-4 py-2">056-283912</td>
    </tr>
    <tr>
      <td className="border px-4 py-2 font-medium">Unidad de Proceso de Registro, Matrícula y Estadística</td>
      <td className="border px-4 py-2">matricula@unica.edu.pe</td>
      <td className="border px-4 py-2">matricula.mesadepartes@unica.edu.pe</td>
      <td className="border px-4 py-2">056-766473</td>
    </tr>
    <tr>
      <td className="border px-4 py-2 font-medium">Unidad de Recreación, Deporte y PRODAC</td>
      <td className="border px-4 py-2">prodac@unica.edu.pe</td>
      <td className="border px-4 py-2">prodac.mesadepartes@unica.edu.pe</td>
      <td className="border px-4 py-2">056-766473</td>
    </tr>
    <tr>
      <td className="border px-4 py-2 font-medium">Unidad de Recursos Humanos</td>
      <td className="border px-4 py-2">personal@unica.edu.pe</td>
      <td className="border px-4 py-2">personal.mesadepartes@unica.edu.pe</td>
      <td className="border px-4 py-2">056-283912</td>
    </tr>
    <tr>
      <td className="border px-4 py-2 font-medium">Unidad de Seguimiento y Apoyo al Egresado y/o Graduado</td>
      <td className="border px-4 py-2">serviciosalegrado@unica.edu.pe</td>
      <td className="border px-4 py-2">serviciosalegrado.mesadepartes@unica.edu.pe</td>
      <td className="border px-4 py-2">056-762577</td>
    </tr>
    <tr>
      <td className="border px-4 py-2 font-medium">Unidad de Servicios Generales</td>
      <td className="border px-4 py-2">serviciosgenerales@unica.edu.pe</td>
      <td className="border px-4 py-2">serviciosgenerales.mesadepartes@unica.edu.pe</td>
      <td className="border px-4 py-2">056-283912</td>
    </tr>
    <tr>
      <td className="border px-4 py-2 font-medium">Unidad de Tesorería y Contabilidad</td>
      <td className="border px-4 py-2">dircontabilidad@unica.edu.pe</td>
      <td className="border px-4 py-2">dircontabilidad.mesadepartes@unica.edu.pe</td>
      <td className="border px-4 py-2">056-221227</td>
    </tr>
    <tr>
      <td className="border px-4 py-2 font-medium">Unidad Ejecutora de Inversiones</td>
      <td className="border px-4 py-2">unidadejecutoradeinversiones@unica.edu.pe</td>
      <td className="border px-4 py-2">unidadejecutoradeinversiones.mesadepartes@unica.edu.pe</td>
      <td className="border px-4 py-2">056-386489</td>
    </tr>
  </tbody>
</table>
  </div>
)}
           {selected === "Centros y Servicios" && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mt-4 md:mt-0">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Centros y Servicios</h2>
                {/* Tabla de Centros y Servicios */}
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Dependencia</th>
                      <th className="border px-4 py-2 text-left">Correo</th>
                      <th className="border px-4 py-2 text-left">Mesa de Partes</th>
                      <th className="border px-4 py-2 text-left">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Centro de Computación de Alto Rendimiento</td>
                      <td className="border px-4 py-2">centro_hpc@unica.edu.pe</td>
                      <td className="border px-4 py-2">centro_hpc.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-771672</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Centro de Estudios Preuniversitarios - Ica</td>
                      <td className="border px-4 py-2">cepu@unica.edu.pe</td>
                      <td className="border px-4 py-2">cepu.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-321485</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Centro de Idiomas</td>
                      <td className="border px-4 py-2">centrodeidiomas@unica.edu.pe</td>
                      <td className="border px-4 py-2">centrodeidiomas.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-284404</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Centro de Informática</td>
                      <td className="border px-4 py-2">centrodeinformatica@unica.edu.pe</td>
                      <td className="border px-4 py-2">centrodeinformatica.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-283990</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Editorial Universitaria</td>
                      <td className="border px-4 py-2">editorialuniversitaria@unica.edu.pe</td>
                      <td className="border px-4 py-2">editorialuniversitaria.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-284032</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Fundo Arrabales</td>
                      <td className="border px-4 py-2">fundoarrabales@unica.edu.pe</td>
                      <td className="border px-4 py-2">fundoarrabales.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-284031</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Laboratorio de Análisis Bioquímicos y Clínicos</td>
                      <td className="border px-4 py-2">bioquimica@unica.edu.pe</td>
                      <td className="border px-4 py-2">bioquimica.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-283987</td>
                    </tr>
                  </tbody>
                </table>

                {/* Servicios Educacionales Complementarios Básicos */}
                <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Servicios Educacionales Complementarios Básicos</h3>
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Dependencia</th>
                      <th className="border px-4 py-2 text-left">Correo</th>
                      <th className="border px-4 py-2 text-left">Mesa de Partes</th>
                      <th className="border px-4 py-2 text-left">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Centro Médico Universitario</td>
                      <td className="border px-4 py-2">centromedico@unica.edu.pe</td>
                      <td className="border px-4 py-2">centromedico.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-284033</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Comedor Universitario</td>
                      <td className="border px-4 py-2">ogbu.comedoruniversitario@unica.edu.pe</td>
                      <td className="border px-4 py-2">ogbu.comedoruniversitario.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-284403</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Servicio Psicopedagógico</td>
                      <td className="border px-4 py-2">servicio_psicopedagogico@unica.edu.pe</td>
                      <td className="border px-4 py-2">servicio_psicopedagogico.mesadepartes@unica.edu.pe</td>
                      <td className="border px-4 py-2">056-284413</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {/* Espaciador para asegurar que el footer sea visible */}
            <div className="h-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
