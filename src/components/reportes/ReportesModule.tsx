"use client";

import { useEffect, useState } from "react";

type ReportRecord = {
  name: string;
  value: number;
  ok: boolean;
};

type ReportSection = {
  title: string;
  records: ReportRecord[];
};

type ReportData = {
  ok: boolean;
  generatedAt: string;
  title: string;
  healthScore: number;
  totalModules: number;
  modulesOk: number;
  totalRecords: number;
  sections: ReportSection[];
  criticalStatus: Record<string, number>;
  reportStatus: string;
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

function htmlReport(data: ReportData) {
  const sections = data.sections
    .map(
      (section) => `
        <h2>${section.title}</h2>
        <table>
          <thead>
            <tr>
              <th>Módulo</th>
              <th>Registros</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${section.records
              .map(
                (record) => `
                  <tr>
                    <td>${record.name}</td>
                    <td>${record.value}</td>
                    <td>${record.ok ? "OK" : "ERROR"}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      `
    )
    .join("");

  const risks = Object.entries(data.criticalStatus)
    .map(
      ([key, value]) => `
        <tr>
          <td>${key}</td>
          <td>${value}</td>
        </tr>
      `
    )
    .join("");

  return `
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>FloraTrack Enterprise Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #1e293b; }
    h1 { color: #16a34a; font-size: 40px; margin-bottom: 6px; }
    h2 { margin-top: 30px; color: #334155; }
    .subtitle { color: #64748b; margin-bottom: 28px; }
    .score { font-size: 64px; font-weight: bold; color: #16a34a; }
    .grid { display:grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin: 24px 0; }
    .card { border:1px solid #e2e8f0; border-radius:14px; padding:18px; background:#f8fafc; }
    .label { color:#64748b; font-size:13px; }
    .value { font-size:28px; font-weight:bold; margin-top:6px; }
    table { width:100%; border-collapse:collapse; margin-top:12px; font-size:13px; }
    th { background:#f1f5f9; color:#475569; text-align:left; padding:10px; border:1px solid #e2e8f0; }
    td { padding:10px; border:1px solid #e2e8f0; }
    button { background:#16a34a; color:white; border:0; border-radius:10px; padding:12px 18px; font-weight:bold; }
    @media print { button { display:none; } }
  </style>
</head>
<body>
  <button onclick="window.print()">Imprimir / Guardar PDF</button>
  <h1>FloraTrack Enterprise Report</h1>
  <div class="subtitle">Generado: ${new Date(data.generatedAt).toLocaleString("es-CO")}</div>

  <div class="score">${data.healthScore}%</div>
  <h2>${data.reportStatus}</h2>

  <div class="grid">
    <div class="card"><div class="label">Módulos</div><div class="value">${data.totalModules}</div></div>
    <div class="card"><div class="label">Módulos OK</div><div class="value">${data.modulesOk}</div></div>
    <div class="card"><div class="label">Registros</div><div class="value">${data.totalRecords}</div></div>
    <div class="card"><div class="label">Fecha</div><div class="value">${new Date(data.generatedAt).toLocaleDateString("es-CO")}</div></div>
  </div>

  <h2>Estado crítico</h2>
  <table>
    <tbody>${risks}</tbody>
  </table>

  ${sections}
</body>
</html>
`;
}

export default function ReportesModule() {
  const [data, setData] = useState<ReportData | null>(null);
  const [message, setMessage] = useState("Cargando reportes enterprise...");

  async function loadReport() {
    try {
      const response = await fetch("/api/enterprise/reports", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error cargando reportes.");
        return;
      }

      setData(result);
      setMessage("Reporte enterprise generado desde Prisma.");
    } catch {
      setMessage("Error conectando API de reportes.");
    }
  }

  function exportJson() {
    if (!data) return;

    downloadFile(
      "floratrack_enterprise_report.json",
      JSON.stringify(data, null, 2),
      "application/json"
    );
  }

  function exportHtml() {
    if (!data) return;

    downloadFile(
      "floratrack_enterprise_report.html",
      htmlReport(data),
      "text/html;charset=utf-8"
    );
  }

  useEffect(() => {
    loadReport();
  }, []);

  const scoreColor =
    !data || data.healthScore < 70
      ? "text-red-600"
      : data.healthScore < 90
      ? "text-yellow-600"
      : "text-green-600";

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Reportes</h2>
          <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed">
            Reporte ejecutivo enterprise conectado a Prisma: estado integral por
            dominio, salud de módulos, registros, riesgos críticos y exportación
            JSON/HTML/PDF.
          </p>
        </div>

        <button
          onClick={loadReport}
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
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Health Score</div>
              <div className={`text-5xl font-bold mt-2 ${scoreColor}`}>
                {data.healthScore}%
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Módulos</div>
              <div className="text-4xl font-bold text-slate-800 mt-2">
                {data.totalModules}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Módulos OK</div>
              <div className="text-4xl font-bold text-green-600 mt-2">
                {data.modulesOk}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Registros</div>
              <div className="text-4xl font-bold text-slate-800 mt-2">
                {data.totalRecords}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Estado</div>
              <div className="text-xl font-bold text-green-600 mt-2">
                {data.reportStatus}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={exportJson}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-bold"
            >
              Exportar JSON
            </button>

            <button
              onClick={exportHtml}
              className="bg-white border px-6 py-4 rounded-xl font-bold text-slate-700"
            >
              Generar HTML / PDF
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            {Object.entries(data.criticalStatus).map(([key, value]) => (
              <div key={key} className="border rounded-xl p-4">
                <div className="text-sm text-slate-500">{key}</div>
                <div className="text-3xl font-bold text-slate-800 mt-1">
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {data.sections.map((section) => (
              <div key={section.title} className="border rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  {section.title}
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {section.records.map((record) => (
                    <div key={record.name} className="border rounded-xl p-4">
                      <div className="flex justify-between gap-2">
                        <div className="text-slate-600">{record.name}</div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-bold ${
                            record.ok
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {record.ok ? "OK" : "ERROR"}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-slate-800 mt-2">
                        {record.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
