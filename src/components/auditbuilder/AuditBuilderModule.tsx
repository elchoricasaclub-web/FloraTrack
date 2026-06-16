"use client";

import { useEffect, useMemo, useState } from "react";

type ScopeKey =
  | "full"
  | "gacp"
  | "gmp"
  | "lims"
  | "qms"
  | "regulatory"
  | "data-integrity"
  | "supplier"
  | "facility"
  | "product";

type AuditSection = {
  title: string;
  delegate: string;
  module: string;
  section: string;
  ok: boolean;
  count: number;
  open: number;
  evidence: unknown[];
  error?: string;
};

type RequiredIndexItem = {
  section: string;
  module: string;
  title: string;
  delegate: string;
  required: boolean;
  availableRecords: number;
  openItems: number;
  status: string;
  error?: string;
};

type AuditBuilderResponse = {
  ok: boolean;
  generatedAt: string;
  scope: ScopeKey;
  title: string;
  readiness: number;
  summary: {
    sections: number;
    sectionsWithEvidence: number;
    totalRecords: number;
    totalOpen: number;
    technicalErrors: number;
  };
  requiredIndex: RequiredIndexItem[];
  sections: AuditSection[];
  executiveConclusion: string;
  recommendations: string[];
  error?: string;
};

const scopes: Array<{ value: ScopeKey; label: string }> = [
  { value: "full", label: "Full Enterprise" },
  { value: "gacp", label: "GACP" },
  { value: "gmp", label: "GMP" },
  { value: "lims", label: "LIMS / COA" },
  { value: "qms", label: "QMS" },
  { value: "regulatory", label: "Regulatorio" },
  { value: "data-integrity", label: "Data Integrity / CSV" },
  { value: "supplier", label: "Supplier QA" },
  { value: "facility", label: "Facility / EMS" },
  { value: "product", label: "Producto / PQR" },
];

function downloadJson(data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `floratrack_audit_package_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

function downloadHtml(data: AuditBuilderResponse) {
  const rows = data.requiredIndex
    .map(
      (item) => `
        <tr>
          <td>${item.section}</td>
          <td>${item.module}</td>
          <td>${item.title}</td>
          <td>${item.availableRecords}</td>
          <td>${item.openItems}</td>
          <td>${item.status}</td>
        </tr>
      `
    )
    .join("");

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${data.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #0f172a; }
          h1 { font-size: 30px; }
          h2 { margin-top: 32px; }
          .card { border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; margin: 14px 0; }
          .score { font-size: 46px; font-weight: 900; color: #16a34a; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; font-size: 12px; text-align: left; }
          th { background: #f1f5f9; }
        </style>
      </head>
      <body>
        <h1>${data.title}</h1>
        <p><strong>Generado:</strong> ${data.generatedAt}</p>
        <div class="card">
          <div>Readiness</div>
          <div class="score">${data.readiness}%</div>
        </div>
        <div class="card">
          <p><strong>Conclusión ejecutiva:</strong> ${data.executiveConclusion}</p>
          <p><strong>Secciones:</strong> ${data.summary.sections}</p>
          <p><strong>Registros:</strong> ${data.summary.totalRecords}</p>
          <p><strong>Pendientes abiertos:</strong> ${data.summary.totalOpen}</p>
          <p><strong>Errores técnicos:</strong> ${data.summary.technicalErrors}</p>
        </div>
        <h2>Índice requerido</h2>
        <table>
          <thead>
            <tr>
              <th>Sección</th>
              <th>Módulo</th>
              <th>Evidencia</th>
              <th>Registros</th>
              <th>Abiertos</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([html], {
    type: "text/html",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `floratrack_audit_package_${data.scope}_${new Date()
    .toISOString()
    .slice(0, 10)}.html`;
  link.click();

  URL.revokeObjectURL(url);
}

function scoreClass(score: number) {
  if (score >= 90) return "text-green-600";
  if (score >= 75) return "text-amber-600";
  return "text-red-600";
}

function statusClass(status: string) {
  if (status === "Con evidencia") return "bg-green-100 text-green-700";
  if (status === "Con pendientes") return "bg-amber-100 text-amber-700";
  if (status === "Error técnico") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
}

export default function AuditBuilderModule() {
  const [scope, setScope] = useState<ScopeKey>("full");
  const [data, setData] = useState<AuditBuilderResponse | null>(null);
  const [message, setMessage] = useState("Selecciona un alcance y genera el paquete.");
  const [activeSection, setActiveSection] = useState<string>("");

  async function loadData(nextScope: ScopeKey = scope) {
    try {
      setMessage("Generando paquete de auditoría...");

      const response = await fetch(`/api/enterprise/audit-builder?scope=${nextScope}`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error generando paquete.");
        return;
      }

      setData(result);
      setActiveSection(result.sections?.[0]?.title || "");
      setMessage("Paquete de auditoría generado correctamente.");
    } catch {
      setMessage("No se pudo conectar Audit Builder.");
    }
  }

  useEffect(() => {
    loadData("full");
  }, []);

  const active = useMemo(
    () => data?.sections.find((item) => item.title === activeSection),
    [data, activeSection]
  );

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <div className="text-sm font-black text-green-600 mb-2">
            FloraTrack Enterprise
          </div>

          <h2 className="text-5xl font-black text-slate-800">
            Audit Package Builder
          </h2>

          <p className="text-slate-500 mt-3 max-w-5xl leading-relaxed">
            Generador de paquetes de auditoría para GACP, GMP, LIMS, QMS,
            Regulatorio, Data Integrity, Supplier QA, Facility, Producto o
            auditoría maestra completa.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => data && downloadHtml(data)}
            className="bg-white border px-6 py-4 rounded-xl font-bold text-slate-700"
          >
            Exportar HTML
          </button>

          <button
            onClick={() => data && downloadJson(data)}
            className="bg-white border px-6 py-4 rounded-xl font-bold text-slate-700"
          >
            Exportar JSON
          </button>

          <button
            onClick={() => loadData(scope)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg font-bold"
          >
            Generar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-2 mb-8">
        {scopes.map((item) => (
          <button
            key={item.value}
            onClick={() => {
              setScope(item.value);
              loadData(item.value);
            }}
            className={`px-3 py-3 rounded-xl border font-bold text-sm ${
              scope === item.value
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
        {message}
      </div>

      {data && (
        <>
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Readiness</div>
              <div className={`text-5xl font-black mt-2 ${scoreClass(data.readiness)}`}>
                {data.readiness}%
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Secciones</div>
              <div className="text-5xl font-black text-slate-800 mt-2">
                {data.summary.sections}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Con evidencia</div>
              <div className="text-5xl font-black text-green-600 mt-2">
                {data.summary.sectionsWithEvidence}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Registros</div>
              <div className="text-5xl font-black text-slate-800 mt-2">
                {data.summary.totalRecords}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Abiertos</div>
              <div className="text-5xl font-black text-amber-600 mt-2">
                {data.summary.totalOpen}
              </div>
            </div>
          </div>

          <div className="border rounded-2xl p-6 mb-8 bg-slate-50">
            <h3 className="text-3xl font-black text-slate-800">
              {data.title}
            </h3>

            <p className="text-slate-600 mt-3 leading-relaxed">
              {data.executiveConclusion}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-5">
              {data.recommendations.map((item, index) => (
                <div key={index} className="bg-white border rounded-xl p-4 text-sm text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="border rounded-2xl p-6 col-span-2">
              <h3 className="text-2xl font-black text-slate-800 mb-5">
                Índice requerido del paquete
              </h3>

              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left bg-slate-50">
                      <th className="p-3">Sección</th>
                      <th className="p-3">Módulo</th>
                      <th className="p-3">Evidencia</th>
                      <th className="p-3">Registros</th>
                      <th className="p-3">Abiertos</th>
                      <th className="p-3">Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.requiredIndex.map((item) => (
                      <tr key={`${item.delegate}-${item.title}`} className="border-t">
                        <td className="p-3 font-bold text-slate-700">
                          {item.section}
                        </td>
                        <td className="p-3">{item.module}</td>
                        <td className="p-3">{item.title}</td>
                        <td className="p-3 font-black">{item.availableRecords}</td>
                        <td className="p-3 font-black">{item.openItems}</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-black ${statusClass(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border rounded-2xl p-6 bg-slate-50">
              <h3 className="text-2xl font-black text-slate-800 mb-5">
                Secciones
              </h3>

              <div className="space-y-2 max-h-[520px] overflow-auto">
                {data.sections.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => setActiveSection(item.title)}
                    className={`w-full text-left border rounded-xl p-4 ${
                      activeSection === item.title
                        ? "bg-green-50 border-green-500"
                        : "bg-white"
                    }`}
                  >
                    <div className="font-black text-slate-800">
                      {item.title}
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      {item.module} · {item.count} registros · {item.open} abiertos
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {active && (
            <div className="border rounded-2xl p-6">
              <div className="flex justify-between gap-6 mb-5">
                <div>
                  <h3 className="text-3xl font-black text-slate-800">
                    {active.title}
                  </h3>

                  <p className="text-slate-500 mt-2">
                    {active.section} · {active.module} · {active.delegate}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-5xl font-black text-slate-800">
                    {active.count}
                  </div>

                  <div className="text-sm text-slate-500">
                    registros disponibles
                  </div>
                </div>
              </div>

              {active.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-5">
                  {active.error}
                </div>
              )}

              <pre className="bg-slate-950 text-green-100 rounded-xl p-5 overflow-auto text-xs max-h-[500px]">
                {JSON.stringify(active.evidence, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}
    </section>
  );
}
