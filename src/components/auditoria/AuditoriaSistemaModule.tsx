"use client";

import { useEffect, useMemo, useState } from "react";

type AuditRecord = {
  id: string;
  module: string;
  action: string;
  recordId: string | null;
  recordLabel: string | null;
  responsible: string | null;
  status: string | null;
  snapshot: string | null;
  createdAt: string;
};

type AuditResponse = {
  ok: boolean;
  total: number;
  modules: string[];
  actions: string[];
  summary: Array<{
    module: string;
    count: number;
    lastEvent: string | null;
  }>;
  data: AuditRecord[];
  error?: string;
};

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const element = document.createElement("a");

  element.href = url;
  element.download = filename;
  element.click();

  URL.revokeObjectURL(url);
}

export default function AuditoriaSistemaModule() {
  const [data, setData] = useState<AuditResponse | null>(null);
  const [message, setMessage] = useState("Cargando auditoría del sistema...");
  const [moduleFilter, setModuleFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  async function loadAudit() {
    try {
      const response = await fetch("/api/enterprise/audit-system", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error cargando auditoría.");
        return;
      }

      setData(result);
      setMessage("Auditoría del sistema cargada desde Prisma.");
    } catch {
      setMessage("Error conectando API de auditoría.");
    }
  }

  useEffect(() => {
    loadAudit();
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];

    return data.data.filter((record) => {
      const moduleOk = moduleFilter === "Todos" || record.module === moduleFilter;
      const searchOk = JSON.stringify(record)
        .toLowerCase()
        .includes(search.toLowerCase());

      return moduleOk && searchOk;
    });
  }, [data, moduleFilter, search]);

  function exportAudit() {
    downloadFile(
      "floratrack_audit_trail.json",
      JSON.stringify(filtered, null, 2),
      "application/json"
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">
            Auditoría Sistema
          </h2>
          <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed">
            Audit trail centralizado: módulo, acción, responsable, estado,
            snapshot, fecha, filtros y exportación.
          </p>
        </div>

        <button
          onClick={loadAudit}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg font-bold"
        >
          Actualizar
        </button>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
        {message}
      </div>

      {data && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Eventos</div>
              <div className="text-4xl font-bold text-slate-800 mt-2">
                {data.total}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Módulos auditados</div>
              <div className="text-4xl font-bold text-green-600 mt-2">
                {data.modules.length}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Acciones</div>
              <div className="text-4xl font-bold text-slate-800 mt-2">
                {data.actions.length}
              </div>
            </div>

            <button
              onClick={exportAudit}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold"
            >
              Exportar auditoría
            </button>
          </div>

          <div className="flex gap-4 mb-8">
            <select
              value={moduleFilter}
              onChange={(event) => setModuleFilter(event.target.value)}
              className="border rounded-xl px-4 py-3 bg-white text-slate-700 font-bold"
            >
              <option value="Todos">Todos los módulos</option>
              {data.modules.map((module) => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </select>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar en auditoría..."
              className="flex-1 border rounded-xl px-4 py-3 text-slate-700"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {data.summary.slice(0, 9).map((item) => (
              <div key={item.module} className="border rounded-xl p-4">
                <div className="text-sm text-slate-500">{item.module}</div>
                <div className="text-3xl font-bold text-slate-800 mt-1">
                  {item.count}
                </div>
              </div>
            ))}
          </div>

          <div className="border rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-sm text-slate-600">Fecha</th>
                  <th className="px-4 py-3 text-sm text-slate-600">Módulo</th>
                  <th className="px-4 py-3 text-sm text-slate-600">Acción</th>
                  <th className="px-4 py-3 text-sm text-slate-600">Registro</th>
                  <th className="px-4 py-3 text-sm text-slate-600">Responsable</th>
                  <th className="px-4 py-3 text-sm text-slate-600">Estado</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id} className="border-t align-top">
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(record.createdAt).toLocaleString("es-CO")}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">
                      {record.module}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{record.action}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {record.recordLabel || record.recordId || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {record.responsible || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {record.status || "-"}
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={6}>
                      No existen eventos para el filtro seleccionado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
