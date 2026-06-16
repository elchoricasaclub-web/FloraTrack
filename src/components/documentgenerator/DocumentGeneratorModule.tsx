"use client";

import { useEffect, useState } from "react";

type Option = {
  value?: string;
  key?: string;
  label?: string;
  title?: string;
  description?: string;
};

type GeneratedDocument = {
  ok: boolean;
  generatedAt: string;
  template: string;
  scope: string;
  title: string;
  summary: {
    sections: number;
    sectionsWithEvidence: number;
    totalRecords: number;
    technicalErrors: number;
  };
  markdown: string;
  html: string;
  sections: unknown[];
  recommendations: string[];
  error?: string;
};

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export default function DocumentGeneratorModule() {
  const [templates, setTemplates] = useState<Option[]>([]);
  const [scopes, setScopes] = useState<Option[]>([]);
  const [template, setTemplate] = useState("audit-report");
  const [scope, setScope] = useState("full");
  const [data, setData] = useState<GeneratedDocument | null>(null);
  const [message, setMessage] = useState("Selecciona plantilla y alcance para generar documento.");

  async function loadOptions() {
    try {
      const response = await fetch("/api/enterprise/document-generator", {
        cache: "no-store",
      });

      const result = await response.json();

      if (result.ok) {
        setTemplates(result.templates || []);
        setScopes(result.scopes || []);
      }
    } catch {
      setMessage("No se pudieron cargar las plantillas.");
    }
  }

  async function generateDocument() {
    try {
      setMessage("Generando documento...");

      const response = await fetch("/api/enterprise/document-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template,
          scope,
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error generando documento.");
        return;
      }

      setData(result);
      setMessage("Documento generado correctamente.");
    } catch {
      setMessage("No se pudo conectar el generador documental.");
    }
  }

  useEffect(() => {
    loadOptions();
  }, []);

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <div className="text-sm font-black text-green-600 mb-2">
            FloraTrack Enterprise
          </div>

          <h2 className="text-5xl font-black text-slate-800">
            Generador Documental
          </h2>

          <p className="text-slate-500 mt-3 max-w-5xl leading-relaxed">
            Genera documentos técnicos y ejecutivos para auditoría, SOP,
            validación CSV, PQR/APR, dossier regulatorio, revisión gerencial y
            Data Integrity usando la información real de los módulos conectados.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() =>
              data &&
              downloadFile(
                JSON.stringify(data, null, 2),
                `floratrack_documento_${data.template}_${data.scope}.json`,
                "application/json"
              )
            }
            className="bg-white border px-6 py-4 rounded-xl font-bold text-slate-700"
          >
            JSON
          </button>

          <button
            onClick={() =>
              data &&
              downloadFile(
                data.markdown,
                `floratrack_documento_${data.template}_${data.scope}.txt`,
                "text/plain"
              )
            }
            className="bg-white border px-6 py-4 rounded-xl font-bold text-slate-700"
          >
            TXT
          </button>

          <button
            onClick={() =>
              data &&
              downloadFile(
                data.html,
                `floratrack_documento_${data.template}_${data.scope}.html`,
                "text/html"
              )
            }
            className="bg-white border px-6 py-4 rounded-xl font-bold text-slate-700"
          >
            HTML
          </button>

          <button
            onClick={generateDocument}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg font-bold"
          >
            Generar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-2">
            Plantilla documental
          </label>

          <select
            value={template}
            onChange={(event) => setTemplate(event.target.value)}
            className="w-full border rounded-xl px-4 py-4 font-bold"
          >
            {templates.map((item) => (
              <option key={item.key} value={item.key}>
                {item.title}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {templates.map((item) => (
              <button
                key={item.key}
                onClick={() => setTemplate(String(item.key))}
                className={`text-left border rounded-xl p-4 ${
                  template === item.key ? "bg-green-50 border-green-500" : "bg-white"
                }`}
              >
                <div className="font-black text-slate-800">{item.title}</div>
                <div className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {item.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-600 mb-2">
            Alcance
          </label>

          <select
            value={scope}
            onChange={(event) => setScope(event.target.value)}
            className="w-full border rounded-xl px-4 py-4 font-bold"
          >
            {scopes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {scopes.map((item) => (
              <button
                key={item.value}
                onClick={() => setScope(String(item.value))}
                className={`text-left border rounded-xl p-4 font-bold ${
                  scope === item.value ? "bg-green-50 border-green-500" : "bg-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
        {message}
      </div>

      {data && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-8">
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
              <div className="text-sm text-slate-500">Errores técnicos</div>
              <div className="text-5xl font-black text-red-600 mt-2">
                {data.summary.technicalErrors}
              </div>
            </div>
          </div>

          <div className="border rounded-2xl p-6 mb-8 bg-slate-50">
            <h3 className="text-3xl font-black text-slate-800">
              {data.title}
            </h3>

            <p className="text-slate-500 mt-2">
              Generado: {data.generatedAt}
            </p>

            <div className="grid grid-cols-3 gap-4 mt-5">
              {data.recommendations.map((item, index) => (
                <div key={index} className="bg-white border rounded-xl p-4 text-sm text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="border rounded-2xl p-6">
              <h3 className="text-2xl font-black text-slate-800 mb-4">
                Vista editable TXT / Markdown
              </h3>

              <textarea
                value={data.markdown}
                readOnly
                className="w-full h-[720px] border rounded-xl p-5 text-sm font-mono bg-slate-50"
              />
            </div>

            <div className="border rounded-2xl p-6">
              <h3 className="text-2xl font-black text-slate-800 mb-4">
                Vista HTML
              </h3>

              <iframe
                title="Vista HTML documento"
                srcDoc={data.html}
                className="w-full h-[720px] border rounded-xl bg-white"
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
