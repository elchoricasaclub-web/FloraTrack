"use client";

import { useEffect, useState } from "react";

type AlertItem = {
  id: string;
  type: string;
  module: string;
  title: string;
  detail: string;
  severity: "Crítica" | "Alta" | "Media" | "Baja";
  status: string;
  date: string | null;
};

type AlertsResponse = {
  ok: boolean;
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  data: AlertItem[];
  error?: string;
};

export default function AlertasModule() {
  const [alerts, setAlerts] = useState<AlertsResponse>({
    ok: false,
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    data: [],
  });
  const [message, setMessage] = useState("Cargando alertas...");
  const [filter, setFilter] = useState("Todas");

  async function loadAlerts() {
    try {
      const response = await fetch("/api/enterprise/alerts", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error cargando alertas.");
        return;
      }

      setAlerts(result);
      setMessage("Alertas cargadas desde Prisma.");
    } catch {
      setMessage("Error conectando API de alertas.");
    }
  }

  useEffect(() => {
    loadAlerts();
  }, []);

  const filtered =
    filter === "Todas"
      ? alerts.data
      : alerts.data.filter((alert) => alert.severity === filter);

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Alertas</h2>
          <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed">
            Motor de alertas enterprise conectado a Prisma: vencimientos,
            licencias, calibraciones, mantenimiento, capacitación, bloqueos,
            inventario, COA y riesgos críticos.
          </p>
        </div>

        <button
          onClick={loadAlerts}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg font-bold"
        >
          Actualizar
        </button>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
        {message}
      </div>

      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Total</div>
          <div className="text-3xl font-bold text-slate-800">{alerts.total}</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Críticas</div>
          <div className="text-3xl font-bold text-red-600">{alerts.critical}</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Altas</div>
          <div className="text-3xl font-bold text-yellow-600">{alerts.high}</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Medias</div>
          <div className="text-3xl font-bold text-slate-800">{alerts.medium}</div>
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="border rounded-xl px-4 py-3 bg-white text-slate-700 font-bold"
        >
          <option value="Todas">Todas</option>
          <option value="Crítica">Críticas</option>
          <option value="Alta">Altas</option>
          <option value="Media">Medias</option>
          <option value="Baja">Bajas</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((alert) => (
          <div key={`${alert.module}-${alert.id}`} className="border rounded-2xl p-5">
            <div className="flex justify-between gap-4">
              <div>
                <div className="text-sm text-slate-400">
                  {alert.type} · {alert.module}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {alert.title}
                </h3>
                <p className="text-slate-500 mt-2">{alert.detail}</p>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex px-4 py-2 rounded-xl font-bold ${
                    alert.severity === "Crítica"
                      ? "bg-red-100 text-red-700"
                      : alert.severity === "Alta"
                      ? "bg-yellow-100 text-yellow-700"
                      : alert.severity === "Media"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {alert.severity}
                </span>

                <div className="text-sm text-slate-500 mt-3">
                  Estado: {alert.status}
                </div>

                <div className="text-sm text-slate-400 mt-1">
                  {alert.date ? new Date(alert.date).toLocaleDateString("es-CO") : "-"}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="border rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-slate-700">
              No existen alertas para este filtro
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}
