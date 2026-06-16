"use client";

import { useEffect, useState } from "react";

type ExportSection = {
  label: string;
  ok: boolean;
  count: number;
  data: unknown[];
  error?: string;
};

type ExportPackage = {
  code: string;
  title: string;
  description: string;
  sections: ExportSection[];
};

type ExportResponse = {
  ok: boolean;
  generatedAt: string;
  app: string;
  totalPackages: number;
  totalRecords: number;
  packages: ExportPackage[];
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

function htmlPackage(pkg: ExportPackage, generatedAt: string) {
  const rows = pkg.sections
    .map(
      (section) => `
        <tr>
          <td>${section.label}</td>
          <td>${section.count}</td>
          <td>${section.ok ? "OK" : "ERROR"}</td>
          <td>${section.error || ""}</td>
        </tr>
      `
    )
    .join("");

  const details = pkg.sections
    .map(
      (section) => `
        <h2>${section.label}</h2>
        <pre>${JSON.stringify(section.data, null, 2)}</pre>
      `
    )
    .join("");

  return `
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${pkg.title}</title>
  <style>
    body { font-family: Arial, sans-serif; color:#1e293b; margin:40px; }
    h1 { color:#16a34a; font-size:38px; margin-bottom:4px; }
    h2 { margin-top:30px; color:#334155; }
    .subtitle { color:#64748b; margin-bottom:25px; }
    table { width:100%; border-collapse:collapse; margin:20px 0; }
    th { background:#f1f5f9; color:#475569; text-align:left; padding:10px; border:1px solid #e2e8f0; }
    td { padding:10px; border:1px solid #e2e8f0; }
    pre { background:#0f172a; color:#d1fae5; padding:18px; border-radius:14px; overflow:auto; font-size:12px; }
    button { background:#16a34a; color:white; border:0; border-radius:10px; padding:12px 18px; font-weight:bold; }
    @media print { button { display:none; } pre { white-space:pre-wrap; } }
  </style>
</head>
<body>
  <button onclick="window.print()">Imprimir / Guardar PDF</button>
  <h1>${pkg.title}</h1>
  <div class="subtitle">${pkg.description}</div>
  <div class="subtitle">Generado: ${new Date(generatedAt).toLocaleString("es-CO")}</div>

  <table>
    <thead>
      <tr>
        <th>Sección</th>
        <th>Registros</th>
        <th>Estado</th>
        <th>Error</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  ${details}
</body>
</html>
`;
}

export default function ExportacionesModule() {
  const [data, setData] = useState<ExportResponse | null>(null);
  const [message, setMessage] = useState("Cargando centro de exportaciones...");

  async function loadData() {
    try {
      const response = await fetch("/api/enterprise/export-center", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error cargando exportaciones.");
        return;
      }

      setData(result);
      setMessage("Centro de exportaciones conectado correctamente.");
    } catch {
      setMessage("Error conectando API de exportaciones.");
    }
  }

  function exportFullJson() {
    if (!data) return;

    downloadFile(
      "floratrack_exportacion_total_enterprise.json",
      JSON.stringify(data, null, 2),
      "application/json"
    );
  }

  function exportPackageJson(pkg: ExportPackage) {
    downloadFile(
      `floratrack_${pkg.code.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(pkg, null, 2),
      "application/json"
    );
  }

  function exportPackageHtml(pkg: ExportPackage) {
    if (!data) return;

    downloadFile(
      `floratrack_${pkg.code.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.html`,
      htmlPackage(pkg, data.generatedAt),
      "text/html;charset=utf-8"
    );
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">
            Centro de Exportaciones
          </h2>
          <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed">
            Exportación enterprise por paquetes: GACP/GMP, regulatorio, Data Integrity,
            dossier, postmercado, dirección, auditoría y evidencia.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportFullJson}
            className="bg-white border px-6 py-4 rounded-xl font-bold text-slate-700"
          >
            Exportar Todo JSON
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
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Paquetes</div>
              <div className="text-5xl font-black text-slate-800 mt-2">
                {data.totalPackages}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Registros exportables</div>
              <div className="text-5xl font-black text-green-600 mt-2">
                {data.totalRecords}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Generado</div>
              <div className="text-xl font-black text-slate-800 mt-2">
                {new Date(data.generatedAt).toLocaleString("es-CO")}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {data.packages.map((pkg) => {
              const count = pkg.sections.reduce((sum, section) => sum + section.count, 0);

              return (
                <div key={pkg.code} className="border rounded-2xl p-6">
                  <div className="flex justify-between gap-6 mb-5">
                    <div>
                      <div className="text-sm font-bold text-green-600">{pkg.code}</div>
                      <h3 className="text-2xl font-black text-slate-800 mt-1">
                        {pkg.title}
                      </h3>
                      <p className="text-slate-500 mt-2">{pkg.description}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-slate-500">Registros</div>
                      <div className="text-4xl font-black text-slate-800">{count}</div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => exportPackageJson(pkg)}
                          className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold"
                        >
                          JSON
                        </button>

                        <button
                          onClick={() => exportPackageHtml(pkg)}
                          className="bg-white border px-4 py-2 rounded-xl font-bold text-slate-700"
                        >
                          HTML / PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {pkg.sections.map((section) => (
                      <div key={section.label} className="border rounded-xl p-4">
                        <div className="flex justify-between gap-3">
                          <div className="text-slate-700 font-semibold">
                            {section.label}
                          </div>

                          <span
                            className={`text-xs px-2 py-1 rounded-full font-bold ${
                              section.ok
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {section.ok ? "OK" : "ERROR"}
                          </span>
                        </div>

                        <div className="text-3xl font-black text-slate-800 mt-2">
                          {section.count}
                        </div>

                        {section.error && (
                          <div className="text-xs text-red-600 mt-2">
                            {section.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
