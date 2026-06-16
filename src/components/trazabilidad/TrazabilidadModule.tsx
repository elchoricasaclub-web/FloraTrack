"use client";

import { useEffect, useState } from "react";

type TraceChain = {
  cropId: string;
  cropCode: string;
  stage: string;
  status: string;
  farm: null | {
    name: string;
    city: string | null;
    areaHa: number | null;
    status: string;
  };
  genetic: null | {
    name: string;
    origin: string | null;
    type: string | null;
    status: string;
  };
  harvests: Array<{
    id: string;
    code: string;
    wetWeight: number | null;
    status: string;
    samples: Array<{
      id: string;
      code: string;
      type: string | null;
      status: string;
      analyses: Array<{
        id: string;
        code: string;
        type: string | null;
        result: string | null;
        status: string;
        coa: null | {
          id: string;
          code: string;
          result: string | null;
          status: string;
        };
      }>;
    }>;
  }>;
  counts: {
    harvests: number;
    samples: number;
    analyses: number;
    coas: number;
  };
  complete: boolean;
  traceabilityScore: number;
};

type TraceResponse = {
  ok: boolean;
  totalChains: number;
  completeChains: number;
  incompleteChains: number;
  averageScore: number;
  chains: TraceChain[];
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

export default function TrazabilidadModule() {
  const [data, setData] = useState<TraceResponse | null>(null);
  const [message, setMessage] = useState("Cargando trazabilidad...");
  const [selected, setSelected] = useState<string>("");

  async function loadTraceability() {
    try {
      const response = await fetch("/api/enterprise/traceability", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error cargando trazabilidad.");
        return;
      }

      setData(result);
      setSelected(result.chains[0]?.cropId || "");
      setMessage("Trazabilidad cargada desde Prisma.");
    } catch {
      setMessage("Error conectando API de trazabilidad.");
    }
  }

  useEffect(() => {
    loadTraceability();
  }, []);

  const chain = data?.chains.find((item) => item.cropId === selected);

  function exportTrace() {
    if (!chain) return;

    downloadFile(
      `floratrack_traceability_${chain.cropCode}.json`,
      JSON.stringify(chain, null, 2),
      "application/json"
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Trazabilidad</h2>
          <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed">
            Reconstrucción completa desde predio, genética y cultivo hasta
            cosecha, muestra, análisis y COA.
          </p>
        </div>

        <button
          onClick={loadTraceability}
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
              <div className="text-sm text-slate-500">Score promedio</div>
              <div className="text-5xl font-bold text-green-600 mt-2">
                {data.averageScore}%
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Cadenas</div>
              <div className="text-4xl font-bold text-slate-800 mt-2">
                {data.totalChains}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Completas</div>
              <div className="text-4xl font-bold text-green-600 mt-2">
                {data.completeChains}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Incompletas</div>
              <div className="text-4xl font-bold text-red-600 mt-2">
                {data.incompleteChains}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <select
              value={selected}
              onChange={(event) => setSelected(event.target.value)}
              className="flex-1 border rounded-xl px-4 py-3 bg-white text-slate-700 font-bold"
            >
              {data.chains.map((item) => (
                <option key={item.cropId} value={item.cropId}>
                  {item.cropCode} · {item.genetic?.name || "Sin genética"} ·{" "}
                  {item.traceabilityScore}%
                </option>
              ))}
            </select>

            <button
              onClick={exportTrace}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold"
            >
              Exportar cadena
            </button>
          </div>

          {chain ? (
            <div className="space-y-6">
              <div className="border rounded-2xl p-6">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-800">
                      {chain.cropCode}
                    </h3>
                    <p className="text-slate-500 mt-2">
                      Etapa: {chain.stage} · Estado: {chain.status}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-slate-500">Score trazabilidad</div>
                    <div className="text-5xl font-bold text-green-600">
                      {chain.traceabilityScore}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="border rounded-xl p-4">
                    <div className="text-sm text-slate-500">Predio</div>
                    <div className="text-xl font-bold text-slate-800 mt-1">
                      {chain.farm?.name || "Sin predio"}
                    </div>
                    <div className="text-slate-500 text-sm mt-1">
                      {chain.farm?.city || "-"} · {chain.farm?.areaHa || 0} ha
                    </div>
                  </div>

                  <div className="border rounded-xl p-4">
                    <div className="text-sm text-slate-500">Genética</div>
                    <div className="text-xl font-bold text-slate-800 mt-1">
                      {chain.genetic?.name || "Sin genética"}
                    </div>
                    <div className="text-slate-500 text-sm mt-1">
                      {chain.genetic?.type || "-"} · {chain.genetic?.status || "-"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-5">
                  Cadena cultivo → cosecha → muestra → análisis → COA
                </h3>

                <div className="space-y-5">
                  {chain.harvests.map((harvest) => (
                    <div key={harvest.id} className="border rounded-xl p-5 bg-slate-50">
                      <div className="text-xl font-bold text-slate-800">
                        Cosecha {harvest.code}
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        Peso húmedo: {harvest.wetWeight || 0} · Estado: {harvest.status}
                      </div>

                      <div className="mt-4 space-y-3">
                        {harvest.samples.map((sample) => (
                          <div key={sample.id} className="bg-white border rounded-xl p-4">
                            <div className="font-bold text-slate-800">
                              Muestra {sample.code}
                            </div>
                            <div className="text-sm text-slate-500">
                              Tipo: {sample.type || "-"} · Estado: {sample.status}
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-3">
                              {sample.analyses.map((analysis) => (
                                <div key={analysis.id} className="border rounded-xl p-4">
                                  <div className="font-bold text-slate-800">
                                    Análisis {analysis.code}
                                  </div>
                                  <div className="text-sm text-slate-500 mt-1">
                                    {analysis.type || "-"} · {analysis.status}
                                  </div>
                                  <div className="text-sm text-slate-600 mt-2">
                                    Resultado: {analysis.result || "-"}
                                  </div>
                                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="text-sm font-bold text-green-700">
                                      COA: {analysis.coa?.code || "Sin COA"}
                                    </div>
                                    <div className="text-xs text-green-600 mt-1">
                                      {analysis.coa?.result || "-"} ·{" "}
                                      {analysis.coa?.status || "-"}
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {sample.analyses.length === 0 && (
                                <div className="border rounded-xl p-4 text-slate-500">
                                  Sin análisis asociados.
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {harvest.samples.length === 0 && (
                          <div className="bg-white border rounded-xl p-4 text-slate-500">
                            Sin muestras asociadas.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {chain.harvests.length === 0 && (
                    <div className="border rounded-xl p-8 text-center text-slate-500">
                      Sin cosechas asociadas.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-2xl p-12 text-center text-slate-500">
              No existen cadenas de trazabilidad.
            </div>
          )}
        </>
      )}
    </section>
  );
}
