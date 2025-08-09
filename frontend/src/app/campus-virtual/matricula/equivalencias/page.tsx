"use client";
import { useEffect, useState } from "react";
import { Button } from '@/components/common';
import { programasEstudioService } from '@/services/programasEstudioService';
import { ProgramaEstudio } from '@/types/programaEstudio';
import { FaExchangeAlt, FaListAlt, FaBookOpen, FaPlus } from 'react-icons/fa';

interface Equivalencia {
  id: number;
  planOrigenId: number;
  planDestinoId: number;
  cursoOrigenCodigo: string;
  cursoDestinoCodigo: string;
  observaciones?: string;
}

export default function EquivalenciasPage() {
  const [equivalencias, setEquivalencias] = useState<Equivalencia[]>([]);
  const [planOrigenId, setPlanOrigenId] = useState("");
  const [planDestinoId, setPlanDestinoId] = useState("");
  const [cursoOrigenCodigo, setCursoOrigenCodigo] = useState("");
  const [cursoDestinoCodigo, setCursoDestinoCodigo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [programas, setProgramas] = useState<ProgramaEstudio[]>([]);
  useEffect(() => {
    // Cargar programas de estudio activos para los selects
    programasEstudioService.getProgramasActivos().then(setProgramas).catch(() => setProgramas([]));
  }, []);

  const fetchEquivalencias = async () => {
    if (!planOrigenId || !planDestinoId) return;
    setLoading(true);
    const res = await fetch(
      `/api/matricula/equivalencias?planOrigenId=${planOrigenId}&planDestinoId=${planDestinoId}`
    );
    if (res.ok) {
      setEquivalencias(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEquivalencias();
    // eslint-disable-next-line
  }, [planOrigenId, planDestinoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);
    const res = await fetch("/api/matricula/equivalencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planOrigenId: Number(planOrigenId),
        planDestinoId: Number(planDestinoId),
        cursoOrigenCodigo,
        cursoDestinoCodigo,
        observaciones,
      }),
    });
    if (res.ok) {
      setCursoOrigenCodigo("");
      setCursoDestinoCodigo("");
      setObservaciones("");
      fetchEquivalencias();
    }
  };


  // Resúmenes
  const totalEquivalencias = equivalencias.length;
  const planesInvolucrados = new Set(equivalencias.flatMap(eq => [eq.planOrigenId, eq.planDestinoId])).size;

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header estilo tasas de pago */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white/80 rounded-xl p-3 shadow text-amber-600">
            <FaExchangeAlt className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Gestión de Equivalencias</h1>
            <p className="text-white/90 text-sm">Administra las equivalencias entre cursos de diferentes planes de estudio</p>
          </div>
        </div>
  {/* No mostrar botón de nueva equivalencia, solo mantener el estilo visual del header */}
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3 border-t-4 border-amber-500">
          <FaListAlt className="w-6 h-6 text-amber-500" />
          <div>
            <div className="text-xs text-gray-500">Total Equivalencias</div>
            <div className="text-lg font-bold text-gray-800">{totalEquivalencias}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3 border-t-4 border-orange-400">
          <FaBookOpen className="w-6 h-6 text-orange-400" />
          <div>
            <div className="text-xs text-gray-500">Planes Involucrados</div>
            <div className="text-lg font-bold text-gray-800">{planesInvolucrados}</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center gap-4 mb-6 border border-amber-100">
        <div className="flex-1 flex gap-2">
          <select
            value={planOrigenId}
            onChange={e => setPlanOrigenId(e.target.value)}
            className="input input-bordered border-amber-400 focus:ring-amber-500"
          >
            <option value="">Plan Origen</option>
            {programas.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
          <select
            value={planDestinoId}
            onChange={e => setPlanDestinoId(e.target.value)}
            className="input input-bordered border-amber-400 focus:ring-amber-500"
          >
            <option value="">Plan Destino</option>
            {programas.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por código de curso..."
            className="input input-bordered border-amber-400 focus:ring-amber-500 w-full"
            value={cursoOrigenCodigo}
            onChange={e => setCursoOrigenCodigo(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de equivalencias */}
      <div className="bg-white rounded-xl shadow border border-amber-100 p-4">
        <h2 className="text-lg font-semibold mb-4 text-amber-700 flex items-center gap-2"><FaListAlt /> Equivalencias registradas</h2>
        {(!planOrigenId || !planDestinoId) && (
          <div className="text-sm text-gray-500 mb-2">Selecciona ambos planes para ver las equivalencias.</div>
        )}
        {loading ? (
          <div className="text-amber-600">Cargando equivalencias...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-amber-50">
                <tr>
                  <th>ID</th>
                  <th>Plan Origen</th>
                  <th>Plan Destino</th>
                  <th>Curso Origen</th>
                  <th>Curso Destino</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {equivalencias.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-4">
                      <div className="flex flex-col items-center gap-2">
                        <FaExchangeAlt className="w-8 h-8 text-amber-300" />
                        <span>No se encontraron equivalencias</span>
                        <span className="text-xs text-gray-400">Aún no hay equivalencias registradas</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  equivalencias.map(eq => (
                    <tr key={eq.id} className="hover:bg-amber-50">
                      <td>{eq.id}</td>
                      <td>{eq.planOrigenId}</td>
                      <td>{eq.planDestinoId}</td>
                      <td>{eq.cursoOrigenCodigo}</td>
                      <td>{eq.cursoDestinoCodigo}</td>
                      <td>{eq.observaciones}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
