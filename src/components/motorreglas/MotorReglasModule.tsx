"use client";

import { useEffect, useState } from "react";

type RuleResult = {
  code: string;
  title: string;
  area: string;
  module: string;
  severity: "Crítica" | "Alta" | "Media" | "Baja";
  status: "Acción inmediata" | "Acción requerida" | "Monitorear" | "Cumple";
  count: number;
  evidence: unknown[];
  recommendation: string;
  capaSuggested: boolean;
  auditPackage: string;
};

type RuleEngineResponse = {
  ok: boolean;
  generatedAt: string;
  app: string;
  score: number;
  summary: {
    totalRules: number;
    activeRules: number;
    criticalRules: number;
    highRules: number;
    capaSuggested: number;
    auditPackagesSuggested: number;
  };
  activeRules: RuleResult[];
  allRules: RuleResult[];
  capaSuggestions: Array<{
    sourceRule: string;
    title: string;
    area: string;
    module: string;
    severity: string;
    recommendation: string;
    evidenceCount: number;
  }>;
  auditPackagesSuggested: Array<{
    code: string;
    rules: string[];
  }>;
  recommendations: string[];
  error?: string;
};

function downloadJson(data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `floratrack_motor_reglas_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

function severityClass(severity: string) {
  if (severity === "Crítica") return "bg-red-100 text-red-700";
  if (severity === "Alta") return "bg-amber-100 text-amber-700";
  if (severity === "Media") return "bg-blue-100 text-blue-700";
  return "bg-slate-100 text-slate-700";
}

export default function MotorReglasModule() {
  const [data, setData] = useState<RuleEngineResponse | null>(null);
  const [message, setMessage] = useState("Ejecutando motor de reglas compliance...");
  const [view, setView] = useState("active");

  async function loadData() {
    try {
      const response = await fetch("/api/enterprise/rule-engine", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error ejecutando motor de reglas.");
        return;
      }

      setData(result);
      setMessage("Motor de reglas ejecutado correctamente.");
    } catch {
      setMessage("No se pudo conectar el motor de reglas.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const rulesToShow = data
    ? view === "all"
      ? data.allRules
      : data.activeRules
    : [];

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">
            Motor de Reglas Compliance
          </h2>
          <p className="text-slate-500 mt-2 max-w-4xl leading-relaxed">
            Evaluación automática GACP/GMP/GxP: OOS, CAPA, desviaciones,
            brechas regulatorias, Data Integrity, proveedores, validación,
            monitoreo ambiental, PQR/APR, estabilidad y postmercado.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => data && downloadJson(data)}
            className="bg-white border px-6 py-4 rounded-xl font-bold text-slate-700"
          >
            Exportar JSON
          </button>

          <button
            onClick={loadData}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg font-bold"
          >
            Ejecutar reglas
          </button>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
        {message}
      </div>

      {data && (
        <>
          <div className="grid grid-cols-6 gap-4 mb-8">
            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Score compliance</div>
              <div className="text-5xl font-black text-green-600 mt-2">
                {data.score}%
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Reglas</div>
              <div className="text-5xl font-black text-slate-800 mt-2">
                {data.summary.totalRules}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Activas</div>
              <div className="text-5xl font-black text-amber-600 mt-2">
                {data.summary.activeRules}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Críticas</div>
              <div className="text-5xl font-black text-red-600 mt-2">
                {data.summary.criticalRules}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">CAPA sugeridas</div>
              <div className="text-5xl font-black text-slate-800 mt-2">
                {data.summary.capaSuggested}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Paquetes</div>
              <div className="text-5xl font-black text-slate-800 mt-2">
                {data.summary.auditPackagesSuggested}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 border rounded-2xl p-6">
              <h3 className="text-2xl font-black text-slate-800 mb-4">
                Recomendaciones ejecutivas
              </h3>

              <div className="space-y-3">
                {data.recommendations.map((item, index) => (
                  <div key={index} className="border rounded-xl p-4 text-slate-600 leading-relaxed">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-2xl p-6 bg-slate-50">
              <h3 className="text-2xl font-black text-slate-800 mb-4">
                Paquetes sugeridos
              </h3>

              <div className="space-y-3 max-h-72 overflow-auto">
                {data.auditPackagesSuggested.length === 0 && (
                  <div className="bg-white border rounded-xl p-4 text-green-700 font-bold">
                    No hay paquetes críticos sugeridos.
                  </div>
                )}

                {data.auditPackagesSuggested.map((pkg) => (
                  <div key={pkg.code} className="bg-white border rounded-xl p-4">
                    <div className="font-black text-slate-800">{pkg.code}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Reglas: {pkg.rules.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setView("active")}
              className={`px-5 py-3 rounded-xl font-bold border ${
                view === "active"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-slate-700"
              }`}
            >
              Reglas activas
            </button>

            <button
              onClick={() => setView("all")}
              className={`px-5 py-3 rounded-xl font-bold border ${
                view === "all"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-slate-700"
              }`}
            >
              Todas las reglas
            </button>
          </div>

          <div className="space-y-5">
            {rulesToShow.length === 0 && (
              <div className="border rounded-2xl p-8 bg-green-50 text-green-700 font-bold">
                No hay reglas activas. El sistema no detecta alertas abiertas.
              </div>
            )}

            {rulesToShow.map((rule) => (
              <div key={rule.code} className="border rounded-2xl p-6">
                <div className="flex justify-between items-start gap-6">
                  <div>
                    <div className="text-sm font-bold text-green-600">
                      {rule.code} · {rule.area} · {rule.module}
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 mt-1">
                      {rule.title}
                    </h3>

                    <p className="text-slate-500 mt-3 leading-relaxed">
                      {rule.recommendation}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs px-3 py-2 rounded-full font-black ${severityClass(rule.severity)}`}>
                      {rule.severity}
                    </span>

                    <div className="text-5xl font-black text-slate-800 mt-4">
                      {rule.count}
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      evidencias
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mt-5">
                  <div className="bg-slate-50 border rounded-xl p-4">
                    <div className="text-xs text-slate-500">Estado</div>
                    <div className="font-black text-slate-800 mt-1">
                      {rule.status}
                    </div>
                  </div>

                  <div className="bg-slate-50 border rounded-xl p-4">
                    <div className="text-xs text-slate-500">CAPA sugerida</div>
                    <div className="font-black text-slate-800 mt-1">
                      {rule.capaSuggested ? "Sí" : "No"}
                    </div>
                  </div>

                  <div className="bg-slate-50 border rounded-xl p-4">
                    <div className="text-xs text-slate-500">Paquete auditoría</div>
                    <div className="font-black text-slate-800 mt-1">
                      {rule.auditPackage}
                    </div>
                  </div>

                  <div className="bg-slate-50 border rounded-xl p-4">
                    <div className="text-xs text-slate-500">Módulo origen</div>
                    <div className="font-black text-slate-800 mt-1">
                      {rule.module}
                    </div>
                  </div>
                </div>

                {rule.evidence.length > 0 && (
                  <details className="mt-5">
                    <summary className="cursor-pointer font-bold text-slate-700">
                      Ver evidencias
                    </summary>

                    <pre className="bg-slate-950 text-green-100 rounded-xl p-4 mt-3 text-xs overflow-auto">
                      {JSON.stringify(rule.evidence, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>

          {data.capaSuggestions.length > 0 && (
            <div className="border rounded-2xl p-6 mt-8 bg-amber-50 border-amber-200">
              <h3 className="text-2xl font-black text-amber-800 mb-4">
                CAPA sugeridas automáticamente
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {data.capaSuggestions.map((capa) => (
                  <div key={capa.sourceRule} className="bg-white border rounded-xl p-4">
                    <div className="text-sm font-bold text-amber-700">
                      {capa.sourceRule} · {capa.severity}
                    </div>

                    <h4 className="text-lg font-black text-slate-800 mt-1">
                      {capa.title}
                    </h4>

                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                      {capa.recommendation}
                    </p>

                    <div className="text-xs text-slate-400 mt-3">
                      Evidencias: {capa.evidenceCount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
