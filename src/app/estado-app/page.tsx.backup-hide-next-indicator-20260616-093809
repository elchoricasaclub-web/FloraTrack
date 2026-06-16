"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

type StorageSummary = {
  key: string;
  records: number;
  sizeKb: number;
};

type AppDiagnostics = {
  origin: string;
  path: string;
  online: boolean;
  viewport: string;
  userAgent: string;
  exportedAt: string;
  localStorageKeys: number;
  floratrackKeys: number;
  estimatedStorageKb: number;
  summaries: StorageSummary[];
};

function safeParse(value: string | null) {
  try {
    return JSON.parse(value || "null");
  } catch {
    return value;
  }
}

function getDiagnostics(): AppDiagnostics {
  if (typeof window === "undefined") {
    return {
      origin: "server",
      path: "/estado-app",
      online: true,
      viewport: "pending",
      userAgent: "pending",
      exportedAt: new Date().toISOString(),
      localStorageKeys: 0,
      floratrackKeys: 0,
      estimatedStorageKb: 0,
      summaries: [],
    };
  }

  const summaries: StorageSummary[] = [];
  let estimatedStorage = 0;

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (!key) continue;

    const value = window.localStorage.getItem(key) || "";
    estimatedStorage += key.length + value.length;

    if (key.startsWith("floratrack_")) {
      const parsed = safeParse(value);
      const records = Array.isArray(parsed) ? parsed.length : parsed ? 1 : 0;

      summaries.push({
        key,
        records,
        sizeKb: Math.round((value.length / 1024) * 100) / 100,
      });
    }
  }

  return {
    origin: window.location.origin,
    path: window.location.pathname,
    online: navigator.onLine,
    viewport: `${window.innerWidth} x ${window.innerHeight}`,
    userAgent: navigator.userAgent,
    exportedAt: new Date().toISOString(),
    localStorageKeys: window.localStorage.length,
    floratrackKeys: summaries.length,
    estimatedStorageKb: Math.round((estimatedStorage / 1024) * 100) / 100,
    summaries: summaries.sort((a, b) => b.records - a.records),
  };
}

export default function EstadoAppPage() {
  const [diagnostics, setDiagnostics] = useState<AppDiagnostics | null>(null);
  const [notice, setNotice] = useState<string>("");

  useEffect(() => {
    setDiagnostics(getDiagnostics());

    function updateOnlineStatus() {
      setDiagnostics(getDiagnostics());
    }

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    window.addEventListener("resize", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      window.removeEventListener("resize", updateOnlineStatus);
    };
  }, []);

  const totals = useMemo(() => {
    if (!diagnostics) {
      return {
        records: 0,
        activeStores: 0,
        emptyStores: 0,
      };
    }

    const records = diagnostics.summaries.reduce((sum, item) => sum + item.records, 0);
    const activeStores = diagnostics.summaries.filter((item) => item.records > 0).length;
    const emptyStores = diagnostics.summaries.filter((item) => item.records === 0).length;

    return {
      records,
      activeStores,
      emptyStores,
    };
  }, [diagnostics]);

  function refreshDiagnostics() {
    setDiagnostics(getDiagnostics());
    setNotice("Diagnóstico actualizado correctamente.");

    window.setTimeout(() => setNotice(""), 4000);
  }

  function exportDiagnostics() {
    const payload = getDiagnostics();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `floratrack-estado-app-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);

    setNotice("Diagnóstico exportado correctamente.");
    window.setTimeout(() => setNotice(""), 4000);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      {notice && (
        <div className="fixed right-5 top-5 z-[9999] rounded-[2rem] border border-emerald-300 bg-slate-950 px-6 py-4 text-sm font-black text-white shadow-2xl">
          {notice}
        </div>
      )}

      <section className="mx-auto max-w-7xl space-y-6">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-emerald-950 to-cyan-950 p-7 text-white shadow-2xl">
          <div className="absolute right-0 top-0 h-52 w-52 translate-x-16 -translate-y-16 rounded-full bg-emerald-300/20 blur-2xl" />
          <div className="absolute bottom-0 left-10 h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />

          <div className="relative">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-200">
              FloraTrack System Module
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              Estado de la App
            </h1>

            <p className="mt-3 max-w-5xl text-base font-semibold leading-8 text-slate-200">
              Módulo centralizado para revisar salud del sistema, almacenamiento local,
              módulos activos, entorno de ejecución, conectividad, diagnósticos y exportación
              de estado sin interferir con la información de pantalla.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge>Sin overlay flotante</Badge>
              <Badge>Diagnóstico</Badge>
              <Badge>LocalStorage</Badge>
              <Badge>Command Center</Badge>
              <Badge>Dev indicator oculto</Badge>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-5">
          <Metric title="Estado" value={diagnostics?.online ? "Online" : "Offline"} tone={diagnostics?.online ? "emerald" : "red"} />
          <Metric title="Stores FloraTrack" value={diagnostics?.floratrackKeys ?? 0} tone="sky" />
          <Metric title="Registros locales" value={totals.records} tone="emerald" />
          <Metric title="Stores activos" value={totals.activeStores} tone="amber" />
          <Metric title="Uso estimado KB" value={diagnostics?.estimatedStorageKb ?? 0} tone="slate" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Panel de control</h2>
                <p className="mt-1 text-sm font-semibold text-slate-400">
                  Acciones rápidas para revisar o exportar el estado.
                </p>
              </div>

              <StatusPill value={diagnostics?.online ? "Activo" : "Offline"} />
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <ActionButton onClick={refreshDiagnostics}>Actualizar diagnóstico</ActionButton>
              <ActionButton onClick={exportDiagnostics}>Exportar JSON</ActionButton>
              <ActionLink href="/">Command Center</ActionLink>
              <ActionLink href="/dashboard-clasico">Dashboard clásico</ActionLink>
              <ActionLink href="/bho">BHO</ActionLink>
              <ActionLink href="/live-rosin">Live Rosin</ActionLink>
              <ActionLink href="/bubble-hash">Bubble Hash</ActionLink>
              <ActionLink href="/minjusticia">Ministerio de Justicia</ActionLink>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Entorno</p>

              <div className="mt-4 grid gap-3 text-sm">
                <Data label="Origen" value={diagnostics?.origin ?? "Cargando"} />
                <Data label="Ruta actual" value={diagnostics?.path ?? "Cargando"} />
                <Data label="Viewport" value={diagnostics?.viewport ?? "Cargando"} />
                <Data label="Exportado / revisado" value={diagnostics?.exportedAt ?? "Cargando"} />
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5">
              <h2 className="text-2xl font-black text-white">Almacenamiento local</h2>
              <p className="mt-1 text-sm font-semibold text-slate-400">
                Resumen de claves FloraTrack guardadas en el navegador.
              </p>
            </div>

            <div className="max-h-[760px] space-y-3 overflow-auto pr-2">
              {!diagnostics ? (
                <EmptyState title="Cargando diagnóstico..." />
              ) : diagnostics.summaries.length === 0 ? (
                <EmptyState title="No hay datos locales FloraTrack" />
              ) : (
                diagnostics.summaries.map((item) => (
                  <article key={item.key} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-black text-white">{item.key}</p>
                        <p className="mt-1 text-xs font-bold text-slate-500">
                          {item.records} registros · {item.sizeKb} KB
                        </p>
                      </div>

                      <StatusPill value={item.records > 0 ? "Con datos" : "Vacío"} />
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300"
                        style={{ width: `${Math.min(100, Math.max(6, item.records * 8))}%` }}
                      />
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </section>

        <section className="rounded-[2rem] border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-2xl font-black text-white">Notas de diseño</h2>
          <p className="mt-3 max-w-5xl text-sm font-semibold leading-7 text-slate-400">
            El indicador flotante de desarrollo fue retirado para evitar interferencias visuales.
            Desde ahora el estado de la app vive como módulo propio y auditable dentro de FloraTrack.
            Los errores reales de compilación seguirán apareciendo cuando existan.
          </p>
        </section>
      </section>
    </main>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-white">
      {children}
    </span>
  );
}

function Metric({
  title,
  value,
  tone = "slate",
}: {
  title: string;
  value: string | number;
  tone?: "slate" | "emerald" | "amber" | "red" | "sky";
}) {
  const toneClass =
    tone === "emerald" ? "text-emerald-300" :
    tone === "amber" ? "text-amber-300" :
    tone === "red" ? "text-red-300" :
    tone === "sky" ? "text-sky-300" :
    "text-white";

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-xl">
      <p className="text-sm font-bold text-slate-400">{title}</p>
      <p className={`mt-2 text-3xl font-black ${toneClass}`}>{value}</p>
    </div>
  );
}

function StatusPill({ value }: { value: string }) {
  const className =
    value === "Activo" || value === "Con datos"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Offline"
      ? "border-red-400/40 bg-red-500/10 text-red-200"
      : "border-slate-400/40 bg-slate-500/10 text-slate-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-black ${className}`}>
      {value}
    </span>
  );
}

function ActionButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5"
    >
      {children}
    </button>
  );
}

function ActionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-center text-sm font-black text-white transition hover:border-emerald-300 hover:bg-slate-800"
    >
      {children}
    </a>
  );
}

function Data({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-slate-200">{value}</p>
    </div>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm font-bold text-slate-400">
      {title}
    </div>
  );
}
