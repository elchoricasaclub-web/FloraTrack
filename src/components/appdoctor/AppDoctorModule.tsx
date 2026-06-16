"use client";

import { useEffect, useMemo, useState } from "react";

type CheckStatus = "ok" | "warning" | "critical";

type DoctorCheck = {
  id: string;
  title: string;
  area: string;
  status: CheckStatus;
  score: number;
  message: string;
  detail: string;
};

type DoctorResponse = {
  generatedAt: string;
  root: string;
  summary: {
    totalScore: number;
    status: CheckStatus;
    okCount: number;
    warningCount: number;
    criticalCount: number;
    componentFiles: number;
    apiRoutes: number;
    appFiles: number;
    prismaModels: number;
  };
  checks: DoctorCheck[];
  recommendations: string[];
};

function statusClass(status: CheckStatus) {
  if (status === "ok") return "bg-green-100 text-green-700 border-green-200";
  if (status === "warning") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-red-100 text-red-700 border-red-200";
}

function statusLabel(status: CheckStatus) {
  if (status === "ok") return "OK";
  if (status === "warning") return "Advertencia";
  return "Crítico";
}

function scoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

function barColor(score: number) {
  if (score >= 80) return "bg-green-600";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${barColor(value)}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export default function AppDoctorModule() {
  const [data, setData] = useState<DoctorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [areaFilter, setAreaFilter] = useState("Todas");
  const [error, setError] = useState("");

  async function loadDoctor() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/app-doctor", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      setData(json);
    } catch (err) {
      setError("No se pudo cargar App Doctor. Revisa que el servidor esté corriendo con npm run dev.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDoctor();
  }, []);

  const areas = useMemo(() => {
    if (!data) return ["Todas"];
    return ["Todas", ...Array.from(new Set(data.checks.map((item) => item.area)))];
  }, [data]);

  const filteredChecks = useMemo(() => {
    if (!data) return [];

    return data.checks.filter((item) => {
      const statusOk = statusFilter === "Todos" || item.status === statusFilter;
      const areaOk = areaFilter === "Todas" || item.area === areaFilter;
      return statusOk && areaOk;
    });
  }, [data, statusFilter, areaFilter]);

  if (loading) {
    return (
      <section className="rounded-3xl bg-white p-8 shadow">
        <div className="text-sm font-black text-green-600">FloraTrack System</div>
        <h2 className="mt-2 text-5xl font-black text-slate-900">App Doctor</h2>
        <p className="mt-3 text-slate-500">Analizando archivos, módulos, APIs, Prisma y estructura del proyecto...</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-3xl bg-white p-8 shadow">
        <div className="text-sm font-black text-red-600">Error</div>
        <h2 className="mt-2 text-5xl font-black text-slate-900">App Doctor</h2>
        <p className="mt-3 text-slate-500">{error}</p>
        <button
          onClick={loadDoctor}
          className="mt-6 rounded-2xl bg-green-600 px-6 py-4 font-black text-white"
        >
          Reintentar
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-bl-full bg-green-500/20" />

        <div className="relative z-10 flex items-start justify-between gap-6">
          <div>
            <div className="text-sm font-black text-green-300">FloraTrack System</div>
            <h2 className="mt-2 text-6xl font-black">App Doctor</h2>
            <p className="mt-4 max-w-5xl text-slate-300">
              Diagnóstico técnico de arquitectura, frontend, backend, Prisma, módulos, menú, API routes y riesgos del proyecto.
            </p>
          </div>

          <button
            onClick={loadDoctor}
            className="rounded-2xl bg-green-600 px-6 py-4 font-black text-white shadow hover:bg-green-700"
          >
            Reanalizar
          </button>
        </div>

        <div className="relative z-10 mt-10 grid grid-cols-4 gap-4">
          <div className="rounded-3xl bg-white/10 p-5">
            <div className="text-sm font-bold text-slate-300">Score técnico</div>
            <div className={`mt-2 text-6xl font-black ${scoreColor(data.summary.totalScore)}`}>
              {data.summary.totalScore}%
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-5">
            <div className="text-sm font-bold text-slate-300">Componentes</div>
            <div className="mt-2 text-6xl font-black text-white">
              {data.summary.componentFiles}
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-5">
            <div className="text-sm font-bold text-slate-300">API Routes</div>
            <div className="mt-2 text-6xl font-black text-white">
              {data.summary.apiRoutes}
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-5">
            <div className="text-sm font-bold text-slate-300">Prisma Models</div>
            <div className="mt-2 text-6xl font-black text-white">
              {data.summary.prismaModels}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-sm font-bold text-slate-500">OK</div>
          <div className="mt-2 text-5xl font-black text-green-600">{data.summary.okCount}</div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-sm font-bold text-slate-500">Advertencias</div>
          <div className="mt-2 text-5xl font-black text-amber-600">{data.summary.warningCount}</div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-sm font-bold text-slate-500">Críticos</div>
          <div className="mt-2 text-5xl font-black text-red-600">{data.summary.criticalCount}</div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow">
        <div className="grid grid-cols-12 gap-4">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="col-span-3 rounded-2xl border px-5 py-4 font-semibold"
          >
            <option>Todos</option>
            <option value="ok">ok</option>
            <option value="warning">warning</option>
            <option value="critical">critical</option>
          </select>

          <select
            value={areaFilter}
            onChange={(event) => setAreaFilter(event.target.value)}
            className="col-span-4 rounded-2xl border px-5 py-4 font-semibold"
          >
            {areas.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>

          <div className="col-span-5 rounded-2xl bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-500">
            Última revisión: {new Date(data.generatedAt).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {filteredChecks.map((check) => (
          <div key={check.id} className="rounded-3xl border bg-white p-7 shadow-sm">
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-green-600">
                  {check.area}
                </div>
                <h3 className="mt-2 text-3xl font-black text-slate-900">{check.title}</h3>
                <p className="mt-3 text-slate-500">{check.message}</p>
              </div>

              <span className={`rounded-full border px-4 py-2 text-xs font-black ${statusClass(check.status)}`}>
                {statusLabel(check.status)}
              </span>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm font-bold text-slate-500">
                <span>Score</span>
                <span>{check.score}%</span>
              </div>
              <ProgressBar value={check.score} />
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <div className="text-xs font-bold text-slate-400">Detalle técnico</div>
              <div className="mt-1 font-semibold text-slate-700">{check.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-8 shadow">
        <div className="text-sm font-black text-green-600">Plan recomendado</div>
        <h3 className="mt-2 text-4xl font-black text-slate-900">Próximas acciones</h3>

        <div className="mt-6 space-y-3">
          {data.recommendations.map((item) => (
            <div key={item} className="rounded-2xl border bg-slate-50 p-5 font-semibold text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
