"use client";

import { useEffect, useState } from "react";

type Recommendation = {
  id?: string;
  engine: string;
  module: string | null;
  category: string | null;
  title: string;
  finding: string | null;
  recommendation: string | null;
  severity: string;
  status: string;
  createdAt?: string;
};

type AiResponse = {
  ok: boolean;
  engine: string;
  recommendations: Recommendation[];
  saved: Recommendation[];
  total: number;
  savedTotal: number;
  error?: string;
};

type AiEngineModuleProps = {
  title: string;
  description: string;
  engine: "auditor" | "sop" | "risks";
  icon: string;
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

export default function AiEngineModule({
  title,
  description,
  engine,
  icon,
}: AiEngineModuleProps) {
  const [data, setData] = useState<AiResponse | null>(null);
  const [message, setMessage] = useState("Cargando motor IA...");
  const [filter, setFilter] = useState("Todas");

  async function loadData() {
    try {
      const response = await fetch(`/api/enterprise/ai/${engine}`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error cargando IA.");
        return;
      }

      setData(result);
      setMessage("Motor IA cargado desde Prisma y reglas enterprise.");
    } catch {
      setMessage("Error conectando API IA.");
    }
  }

  async function generateSaved() {
    try {
      setMessage("Generando recomendaciones IA auditadas...");

      const response = await fetch(`/api/enterprise/ai/${engine}`, {
        method: "POST",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error generando recomendaciones.");
        return;
      }

      setMessage(`Recomendaciones guardadas: ${result.createdTotal}.`);
      loadData();
    } catch {
      setMessage("Error guardando recomendaciones IA.");
    }
  }

  function exportRecommendations() {
    if (!data) return;

    downloadFile(
      `floratrack_${engine}_recommendations.json`,
      JSON.stringify(
        {
          engine: data.engine,
          recommendations: data.recommendations,
          saved: data.saved,
        },
        null,
        2
      ),
      "application/json"
    );
  }

  useEffect(() => {
    loadData();
  }, []);

  const currentRecommendations = data?.recommendations || [];

  const filtered =
    filter === "Todas"
      ? currentRecommendations
      : currentRecommendations.filter((item) => item.severity === filter);

  const critical = currentRecommendations.filter(
    (item) => item.severity === "Crítica"
  ).length;

  const high = currentRecommendations.filter(
    (item) => item.severity === "Alta"
  ).length;

  const medium = currentRecommendations.filter(
    (item) => item.severity === "Media"
  ).length;

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <div className="text-6xl mb-4">{icon}</div>
          <h2 className="text-4xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={generateSaved}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg font-bold"
          >
            Generar IA
          </button>

          <button
            onClick={loadData}
            className="bg-white border px-6 py-4 rounded-xl text-slate-700 font-bold"
          >
            Actualizar
          </button>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
        {message}
      </div>

      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="border rounded-xl p-5">
          <div className="text-sm text-slate-500">Recomendaciones</div>
          <div className="text-4xl font-bold text-slate-800 mt-2">
            {currentRecommendations.length}
          </div>
        </div>

        <div className="border rounded-xl p-5">
          <div className="text-sm text-slate-500">Críticas</div>
          <div className="text-4xl font-bold text-red-600 mt-2">{critical}</div>
        </div>

        <div className="border rounded-xl p-5">
          <div className="text-sm text-slate-500">Altas</div>
          <div className="text-4xl font-bold text-yellow-600 mt-2">{high}</div>
        </div>

        <div className="border rounded-xl p-5">
          <div className="text-sm text-slate-500">Medias</div>
          <div className="text-4xl font-bold text-slate-800 mt-2">{medium}</div>
        </div>

        <div className="border rounded-xl p-5">
          <div className="text-sm text-slate-500">Guardadas</div>
          <div className="text-4xl font-bold text-green-600 mt-2">
            {data?.savedTotal || 0}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
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

        <button
          onClick={exportRecommendations}
          className="bg-white border px-6 py-3 rounded-xl font-bold text-slate-700"
        >
          Exportar JSON
        </button>
      </div>

      <div className="space-y-4">
        {filtered.map((item, index) => (
          <div key={`${item.title}-${index}`} className="border rounded-2xl p-6">
            <div className="flex justify-between gap-6">
              <div>
                <div className="text-sm text-slate-400">
                  {item.module} · {item.category}
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {item.title}
                </h3>

                <p className="text-slate-500 mt-3">
                  <strong>Hallazgo:</strong> {item.finding}
                </p>

                <p className="text-slate-700 mt-3">
                  <strong>Recomendación:</strong> {item.recommendation}
                </p>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex px-4 py-2 rounded-xl font-bold ${
                    item.severity === "Crítica"
                      ? "bg-red-100 text-red-700"
                      : item.severity === "Alta"
                      ? "bg-yellow-100 text-yellow-700"
                      : item.severity === "Media"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.severity}
                </span>

                <div className="text-sm text-slate-400 mt-3">
                  {item.status}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="border rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-slate-700">
              No existen recomendaciones para este filtro
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}
