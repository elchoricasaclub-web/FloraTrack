"use client";

import { useEffect, useState } from "react";

type Phase = {
  phase: number;
  title: string;
  objective: string;
  status: string;
  priority: string;
  score: number;
  evidence: Record<string, number>;
  actions: string[];
  deliverables: string[];
};

type ImmediateAction = {
  order: number;
  title: string;
  reason: string;
  module: string;
};

type PlanResponse = {
  ok: boolean;
  generatedAt: string;
  app: string;
  globalScore: number;
  totalOpen: number;
  nextFiveSteps: string[];
  phases: Phase[];
  immediateActions: ImmediateAction[];
  executiveConclusion: string;
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
  link.download = `floratrack_plan_implementacion_${new Date()
    .toISOString()
    .slice(0, 10)}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

function downloadHtml(data: PlanResponse) {
  const phaseHtml = data.phases
    .map(
      (phase) => `
        <h2>Fase ${phase.phase}. ${phase.title}</h2>
        <p><strong>Objetivo:</strong> ${phase.objective}</p>
        <p><strong>Estado:</strong> ${phase.status}</p>
        <p><strong>Prioridad:</strong> ${phase.priority}</p>
        <p><strong>Score:</strong> ${phase.score}%</p>
        <h3>Acciones</h3>
        <ul>${phase.actions.map((item) => `<li>${item}</li>`).join("")}</ul>
        <h3>Entregables</h3>
        <ul>${phase.deliverables.map((item) => `<li>${item}</li>`).join("")}</ul>
      `
    )
    .join("");

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Plan Maestro de Implementación FloraTrack</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 42px; color: #0f172a; line-height: 1.55; }
          h1 { font-size: 34px; }
          h2 { margin-top: 32px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; }
          .score { font-size: 48px; font-weight: 900; color: #16a34a; }
          .card { border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; margin: 16px 0; }
        </style>
      </head>
      <body>
        <h1>Plan Maestro de Implementación FloraTrack Enterprise</h1>
        <p><strong>Generado:</strong> ${data.generatedAt}</p>
        <div class="card">
          <p>Score global</p>
          <div class="score">${data.globalScore}%</div>
          <p>${data.executiveConclusion}</p>
        </div>
        ${phaseHtml}
      </body>
    </html>
  `;

  const blob = new Blob([html], {
    type: "text/html",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `floratrack_plan_implementacion_${new Date()
    .toISOString()
    .slice(0, 10)}.html`;
  link.click();

  URL.revokeObjectURL(url);
}

function scoreColor(score: number) {
  if (score >= 90) return "text-green-600";
  if (score >= 75) return "text-amber-600";
  return "text-red-600";
}

function priorityClass(priority: string) {
  if (priority === "Crítica") return "bg-red-100 text-red-700";
  if (priority === "Alta") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

export default function ImplementationPlanModule() {
  const [data, setData] = useState<PlanResponse | null>(null);
  const [message, setMessage] = useState("Cargando Plan Maestro de Implementación...");
  const [activePhase, setActivePhase] = useState<number>(1);

  async function loadData() {
    try {
      const response = await fetch("/api/enterprise/implementation-plan", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error cargando plan de implementación.");
        return;
      }

      setData(result);
      setActivePhase(result.phases?.[0]?.phase || 1);
      setMessage("Plan Maestro generado correctamente.");
    } catch {
      setMessage("No se pudo conectar el Plan Maestro.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const selectedPhase = data?.phases.find((phase) => phase.phase === activePhase);

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <div className="text-sm font-black text-green-600 mb-2">
            FloraTrack Enterprise
          </div>

          <h2 className="text-5xl font-black text-slate-800">
            Plan Maestro de Implementación
          </h2>

          <p className="text-slate-500 mt-3 max-w-5xl leading-relaxed">
            Ruta ejecutiva para convertir FloraTrack en una plataforma audit-ready:
            estabilización técnica, GACP, GMP, LIMS, QMS, regulatorio, Data
            Integrity, CSV, seguridad, documentación y entrega final.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => data && downloadHtml(data)}
            className="bg-white border px-6 py-4 rounded-xl font-bold text-slate-700"
          >
            HTML
          </button>

          <button
            onClick={() => data && downloadJson(data)}
            className="bg-white border px-6 py-4 rounded-xl font-bold text-slate-700"
          >
            JSON
          </button>

          <button
            onClick={loadData}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg font-bold"
          >
            Actualizar
          </button>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
        {message}
      </div>

      {data && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Score global</div>
              <div className={`text-5xl font-black mt-2 ${scoreColor(data.globalScore)}`}>
                {data.globalScore}%
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Pendientes abiertos</div>
              <div className="text-5xl font-black text-amber-600 mt-2">
                {data.totalOpen}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Fases</div>
              <div className="text-5xl font-black text-slate-800 mt-2">
                {data.phases.length}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Acciones inmediatas</div>
              <div className="text-5xl font-black text-slate-800 mt-2">
                {data.immediateActions.length}
              </div>
            </div>
          </div>

          <div className="border rounded-2xl p-6 mb-8 bg-slate-50">
            <h3 className="text-3xl font-black text-slate-800">
              Conclusión ejecutiva
            </h3>

            <p className="text-slate-600 mt-3 leading-relaxed">
              {data.executiveConclusion}
            </p>
          </div>

          <div className="grid grid-cols-5 gap-3 mb-8">
            {data.nextFiveSteps.map((step, index) => (
              <div key={step} className="border rounded-xl p-5 bg-white">
                <div className="text-sm font-black text-green-600">
                  Paso {index + 1}
                </div>

                <div className="text-lg font-black text-slate-800 mt-2">
                  {step}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="border rounded-2xl p-6 col-span-2">
              <h3 className="text-2xl font-black text-slate-800 mb-5">
                Fases del plan
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {data.phases.map((phase) => (
                  <button
                    key={phase.phase}
                    onClick={() => setActivePhase(phase.phase)}
                    className={`text-left border rounded-2xl p-5 ${
                      activePhase === phase.phase
                        ? "bg-green-50 border-green-500"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-6">
                      <div>
                        <div className="text-sm font-black text-green-600">
                          Fase {phase.phase}
                        </div>

                        <h4 className="text-xl font-black text-slate-800 mt-1">
                          {phase.title}
                        </h4>

                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                          {phase.objective}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className={`text-4xl font-black ${scoreColor(phase.score)}`}>
                          {phase.score}%
                        </div>

                        <span className={`text-xs px-3 py-2 rounded-full font-black ${priorityClass(phase.priority)}`}>
                          {phase.priority}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border rounded-2xl p-6 bg-slate-50">
              <h3 className="text-2xl font-black text-slate-800 mb-5">
                Acciones inmediatas
              </h3>

              <div className="space-y-3">
                {data.immediateActions.map((action) => (
                  <div key={action.order} className="bg-white border rounded-xl p-4">
                    <div className="text-sm font-black text-green-600">
                      {action.order}. {action.module}
                    </div>

                    <h4 className="font-black text-slate-800 mt-1">
                      {action.title}
                    </h4>

                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {action.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedPhase && (
            <div className="border rounded-2xl p-6 mb-8">
              <div className="flex justify-between gap-6 mb-6">
                <div>
                  <div className="text-sm font-black text-green-600">
                    Fase {selectedPhase.phase}
                  </div>

                  <h3 className="text-3xl font-black text-slate-800">
                    {selectedPhase.title}
                  </h3>

                  <p className="text-slate-500 mt-3 max-w-5xl leading-relaxed">
                    {selectedPhase.objective}
                  </p>
                </div>

                <div className="text-right">
                  <div className={`text-6xl font-black ${scoreColor(selectedPhase.score)}`}>
                    {selectedPhase.score}%
                  </div>

                  <div className="text-sm text-slate-500">
                    {selectedPhase.status}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h4 className="font-black text-slate-800 mb-3">
                    Acciones
                  </h4>

                  <div className="space-y-2">
                    {selectedPhase.actions.map((item) => (
                      <div key={item} className="border rounded-xl p-3 text-sm text-slate-600">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-slate-800 mb-3">
                    Entregables
                  </h4>

                  <div className="space-y-2">
                    {selectedPhase.deliverables.map((item) => (
                      <div key={item} className="border rounded-xl p-3 text-sm text-slate-600">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-slate-800 mb-3">
                    Evidencia actual
                  </h4>

                  <pre className="bg-slate-950 text-green-100 rounded-xl p-4 text-xs overflow-auto max-h-96">
                    {JSON.stringify(selectedPhase.evidence, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          <div className="border rounded-2xl p-6 bg-slate-50">
            <h3 className="text-2xl font-black text-slate-800 mb-5">
              Recomendaciones
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {data.recommendations.map((item) => (
                <div key={item} className="bg-white border rounded-xl p-4 text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
