from pathlib import Path
from datetime import datetime
import shutil

ROOT = Path.cwd()
STAMP = datetime.now().strftime("%Y%m%d-%H%M%S")
BACKUP_DIR = Path("/home/usergrowlifecol/floratrack_backups") / f"patch-command-center-metrics-{STAMP}"

COMMAND = ROOT / "src/app/command-center/page.tsx"
AVANCE = ROOT / "AVANCE_FLORATRACK.md"
HANDOFF = ROOT / "CHATGPT_HANDOFF_FLORATRACK.md"

BACKUP_DIR.mkdir(parents=True, exist_ok=True)

for path in [COMMAND, AVANCE, HANDOFF]:
    if path.exists():
        shutil.copy2(path, BACKUP_DIR / path.name)

command_page = r'''"use client";

import { useEffect, useMemo, useState } from "react";

type AnyRecord = Record<string, unknown>;

type ModuleKey = "cambios" | "riesgos" | "workflows" | "auditTrail" | "reportes";

type ModuleConfig = {
  key: ModuleKey;
  title: string;
  shortTitle: string;
  href: string;
  tag: string;
  storageKey: string;
  description: string;
  accent: string;
};

type ModuleSnapshot = ModuleConfig & {
  records: AnyRecord[];
};

type HealthTone = "success" | "warning" | "danger" | "neutral";

const MODULES: ModuleConfig[] = [
  {
    key: "cambios",
    title: "Control de Cambios GxP",
    shortTitle: "Cambios",
    href: "/cambios",
    tag: "Change",
    storageKey: "floratrack_control_cambios_gxp_v1",
    description: "Solicitudes, impactos, decision QA, CAPA, evidencia y trazabilidad de cambios.",
    accent: "cyan",
  },
  {
    key: "riesgos",
    title: "Gestion de Riesgos QRM",
    shortTitle: "Riesgos",
    href: "/riesgos",
    tag: "QRM",
    storageKey: "floratrack_gestion_riesgos_gxp_v1",
    description: "RPN, severidad, probabilidad, detectabilidad, mitigacion y eficacia.",
    accent: "rose",
  },
  {
    key: "workflows",
    title: "Workflows QA",
    shortTitle: "Workflows",
    href: "/workflows",
    tag: "Workflow",
    storageKey: "floratrack_workflows_qa_v1",
    description: "Responsables, SLA, aprobaciones, firmas, escalamiento y cierre operativo.",
    accent: "violet",
  },
  {
    key: "auditTrail",
    title: "Audit Trail GxP",
    shortTitle: "Audit Trail",
    href: "/audit-trail",
    tag: "Audit",
    storageKey: "floratrack_audit_trail_gxp_v1",
    description: "Eventos auditados, estados, usuario, modulo, evidencia, hash y decision QA.",
    accent: "emerald",
  },
  {
    key: "reportes",
    title: "Reportes Programados",
    shortTitle: "Reportes",
    href: "/reportes-programados",
    tag: "Report",
    storageKey: "floratrack_reportes_programados_gxp_v1",
    description: "Cron, frecuencia, zona horaria, destinatarios, aprobador QA y exportaciones.",
    accent: "amber",
  },
];

function safeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function readStorageArray(key: string): AnyRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is AnyRecord => item !== null && typeof item === "object" && !Array.isArray(item));
  } catch {
    return [];
  }
}

function recordText(record: AnyRecord): string {
  return Object.values(record).map(safeText).join(" ").toLowerCase();
}

function fieldText(record: AnyRecord, keys: string[]): string {
  return keys.map((key) => safeText(record[key])).filter(Boolean).join(" ");
}

function hasAny(text: string, terms: string[]): boolean {
  const normalized = text.toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

function isHighOrCritical(record: AnyRecord): boolean {
  const text = recordText(record);
  return hasAny(text, ["critico", "critica", "crítico", "crítica", "alta", "alto", "high", "critical", "rpn 75", "rpn 80", "rpn 100"]);
}

function isPending(record: AnyRecord): boolean {
  const text = recordText(record);
  return hasAny(text, ["pendiente", "borrador", "abierto", "identificado", "creado", "en gestion", "en gestión"]);
}

function isClosed(record: AnyRecord): boolean {
  const text = recordText(record);
  return hasAny(text, ["cerrado", "cierre aprobado", "aprobado qa", "completado", "archivado"]);
}

function needsSignature(record: AnyRecord): boolean {
  const text = recordText(record);
  return hasAny(text, ["requiere firma", "firma electronica", "firma electrónica", "sí", "si"]) && hasAny(text, ["firma", "signature"]);
}

function hasEvidence(record: AnyRecord): boolean {
  const evidence = fieldText(record, ["evidencia", "hashReferencia", "firmaAsociada", "auditTrailReferencia", "observaciones"]);
  return evidence.length > 0;
}

function latestDate(records: AnyRecord[]): string {
  const candidates = records
    .map((record) =>
      fieldText(record, [
        "actualizadoEn",
        "creadoEn",
        "fechaEvento",
        "fechaCreacion",
        "fechaSolicitud",
        "fechaIdentificacion",
        "fechaInicio",
      ])
    )
    .filter(Boolean)
    .sort()
    .reverse();

  return candidates[0] || "Sin actividad";
}

function moduleHealth(records: AnyRecord[]): { tone: HealthTone; label: string; detail: string } {
  if (records.length === 0) {
    return {
      tone: "neutral",
      label: "Sin datos",
      detail: "Aun no hay registros locales en este modulo.",
    };
  }

  const high = records.filter(isHighOrCritical).length;
  const pending = records.filter(isPending).length;
  const evidence = records.filter(hasEvidence).length;
  const evidenceRate = records.length > 0 ? Math.round((evidence / records.length) * 100) : 0;

  if (high > 0 && pending > 0) {
    return {
      tone: "danger",
      label: "Atencion QA",
      detail: `${high} registros altos/criticos y ${pending} pendientes requieren revision.`,
    };
  }

  if (pending > 0 || evidenceRate < 70) {
    return {
      tone: "warning",
      label: "Seguimiento",
      detail: `${pending} pendientes. Evidencia disponible en ${evidenceRate}% de registros.`,
    };
  }

  return {
    tone: "success",
    label: "Controlado",
    detail: `Evidencia disponible en ${evidenceRate}% de registros.`,
  };
}

function metricNumber(value: number): string {
  return new Intl.NumberFormat("es-CO").format(value);
}

function downloadJson(name: string, payload: unknown) {
  if (typeof window === "undefined") return;

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export default function CommandCenterPage() {
  const [modules, setModules] = useState<ModuleSnapshot[]>(() =>
    MODULES.map((module) => ({
      ...module,
      records: [],
    }))
  );
  const [lastRefresh, setLastRefresh] = useState("Sin refrescar");
  const [query, setQuery] = useState("");

  function refresh() {
    const next = MODULES.map((module) => ({
      ...module,
      records: readStorageArray(module.storageKey),
    }));

    setModules(next);
    setLastRefresh(new Date().toLocaleString("es-CO", { hour12: false }));
  }

  useEffect(() => {
    refresh();
  }, []);

  const metrics = useMemo(() => {
    const allRecords = modules.flatMap((module) => module.records);
    const total = allRecords.length;
    const high = allRecords.filter(isHighOrCritical).length;
    const pending = allRecords.filter(isPending).length;
    const closed = allRecords.filter(isClosed).length;
    const signatures = allRecords.filter(needsSignature).length;
    const evidence = allRecords.filter(hasEvidence).length;

    const reportModule = modules.find((module) => module.key === "reportes");
    const activeReports = reportModule?.records.filter((record) => hasAny(recordText(record), ["activo", "aprobado qa"])).length || 0;

    const controlScore = total === 0 ? 0 : Math.max(0, Math.min(100, Math.round(((closed + evidence) / Math.max(total * 2, 1)) * 100 - high * 2)));

    return {
      total,
      high,
      pending,
      closed,
      signatures,
      evidence,
      activeReports,
      controlScore,
    };
  }, [modules]);

  const filteredModules = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return modules;

    return modules.filter((module) => {
      const moduleText = [module.title, module.shortTitle, module.description, module.tag].join(" ").toLowerCase();
      const recordMatch = module.records.some((record) => recordText(record).includes(term));
      return moduleText.includes(term) || recordMatch;
    });
  }, [modules, query]);

  const priorities = useMemo(() => {
    return modules
      .map((module) => {
        const health = moduleHealth(module.records);
        const high = module.records.filter(isHighOrCritical).length;
        const pending = module.records.filter(isPending).length;

        return {
          module,
          health,
          high,
          pending,
          weight: high * 3 + pending * 2 + (health.tone === "danger" ? 5 : health.tone === "warning" ? 2 : 0),
        };
      })
      .sort((a, b) => b.weight - a.weight);
  }, [modules]);

  function exportSnapshot() {
    const payload = {
      exportedAt: new Date().toISOString(),
      lastRefresh,
      metrics,
      modules: modules.map((module) => {
        const health = moduleHealth(module.records);
        return {
          key: module.key,
          title: module.title,
          route: module.href,
          storageKey: module.storageKey,
          totalRecords: module.records.length,
          highOrCritical: module.records.filter(isHighOrCritical).length,
          pending: module.records.filter(isPending).length,
          closed: module.records.filter(isClosed).length,
          withEvidence: module.records.filter(hasEvidence).length,
          latestActivity: latestDate(module.records),
          health,
        };
      }),
    };

    downloadJson(`floratrack-command-center-${new Date().toISOString().slice(0, 10)}.json`, payload);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900 shadow-2xl shadow-cyan-950/30">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.25fr_0.75fr] lg:p-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-300">FloraTrack Enterprise Command OS</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl">
                Command Center GxP con métricas reales
              </h1>
              <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300">
                Vista ejecutiva conectada a cambios, riesgos, workflows, audit trail y reportes programados. Diseñada para seguimiento QA, priorización GxP, evidencia, trazabilidad y preparación de auditoría.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button type="button" onClick={refresh} className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300">
                  Refrescar métricas
                </button>
                <button type="button" onClick={exportSnapshot} className="rounded-2xl border border-cyan-300/50 px-5 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-950/60">
                  Exportar snapshot JSON
                </button>
                <a href="/" className="rounded-2xl border border-slate-600 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                  Inicio
                </a>
              </div>

              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">Última lectura: {lastRefresh}</p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Score operativo</p>
              <div className="mt-5 flex items-end gap-3">
                <span className="text-6xl font-black text-white">{metrics.controlScore}%</span>
                <span className="pb-3 text-sm font-bold text-slate-400">control local</span>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-cyan-300" style={{ width: `${metrics.controlScore}%` }} />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Calculado desde registros cerrados, evidencia disponible y carga de registros críticos o pendientes.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
          <MetricCard label="Registros" value={metrics.total} detail="Todos los módulos" />
          <MetricCard label="Altos / críticos" value={metrics.high} detail="Priorización QA" />
          <MetricCard label="Pendientes" value={metrics.pending} detail="Seguimiento" />
          <MetricCard label="Cerrados" value={metrics.closed} detail="Cierre operativo" />
          <MetricCard label="Con evidencia" value={metrics.evidence} detail="Soporte GxP" />
          <MetricCard label="Firmas" value={metrics.signatures} detail="eSign / Part 11" />
          <MetricCard label="Reportes activos" value={metrics.activeReports} detail="Automatización" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-[2rem] border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Prioridad operativa</p>
                <h2 className="mt-2 text-2xl font-black text-white">Focos QA</h2>
              </div>
              <StatusBadge value={metrics.high > 0 ? "Atención" : metrics.pending > 0 ? "Seguimiento" : "Controlado"} />
            </div>

            <div className="mt-6 space-y-3">
              {priorities.map(({ module, health, high, pending }) => (
                <a key={module.key} href={module.href} className="block rounded-2xl border border-slate-800 bg-slate-950 p-4 transition hover:border-cyan-300/50 hover:bg-cyan-950/20">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-white">{module.shortTitle}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{health.detail}</p>
                    </div>
                    <StatusBadge value={health.label} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <MiniMetric label="Total" value={module.records.length} />
                    <MiniMetric label="Críticos" value={high} />
                    <MiniMetric label="Pend." value={pending} />
                  </div>
                </a>
              ))}
            </div>
          </aside>

          <section className="rounded-[2rem] border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Módulos conectados</p>
                <h2 className="mt-2 text-2xl font-black text-white">Mapa operativo FloraTrack</h2>
                <p className="mt-1 text-sm text-slate-400">Busca, navega y verifica el estado de cada módulo GxP.</p>
              </div>

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-cyan-400/40 transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 md:w-80"
                placeholder="Buscar módulo o registro..."
              />
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {filteredModules.map((module) => {
                const health = moduleHealth(module.records);
                const high = module.records.filter(isHighOrCritical).length;
                const pending = module.records.filter(isPending).length;
                const evidence = module.records.filter(hasEvidence).length;

                return (
                  <article key={module.key} className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-black text-white">{module.title}</h3>
                          <span className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-xs font-black text-cyan-200">
                            {module.tag}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{module.description}</p>
                      </div>
                      <StatusBadge value={health.label} />
                    </div>

                    <div className="mt-5 grid grid-cols-4 gap-2 text-center text-xs">
                      <MiniMetric label="Total" value={module.records.length} />
                      <MiniMetric label="Alta" value={high} />
                      <MiniMetric label="Pend." value={pending} />
                      <MiniMetric label="Evid." value={evidence} />
                    </div>

                    <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Última actividad: {latestDate(module.records)}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <a href={module.href} className="rounded-2xl bg-white px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-200">
                        Abrir módulo
                      </a>
                      <span className="rounded-2xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-400">
                        {module.storageKey}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </section>

        <section className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-6 shadow-xl">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Flujo trazable</p>
            <h2 className="mt-2 text-2xl font-black text-white">Cadena GxP integrada</h2>
            <p className="mt-1 text-sm text-slate-400">La cadena prioritaria ya conecta decisiones, riesgos, ejecución, evidencia y reportes.</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-5">
            <FlowStep number="01" title="Cambio" href="/cambios" detail="Solicitud, impacto y decision QA" />
            <FlowStep number="02" title="Riesgo" href="/riesgos" detail="QRM, RPN y mitigacion" />
            <FlowStep number="03" title="Workflow" href="/workflows" detail="SLA, responsable y escalamiento" />
            <FlowStep number="04" title="Audit Trail" href="/audit-trail" detail="Evento, hash y evidencia" />
            <FlowStep number="05" title="Reporte" href="/reportes-programados" detail="Cron, destinatarios y QA" />
          </div>
        </section>
      </section>
    </main>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-700 bg-slate-900 p-5 shadow-xl">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-black text-white">{metricNumber(value)}</p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </article>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2">
      <p className="text-[0.65rem] font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-base font-black text-white">{metricNumber(value)}</p>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const tone: HealthTone =
    normalized.includes("controlado") || normalized.includes("activo")
      ? "success"
      : normalized.includes("atencion") || normalized.includes("atención")
        ? "danger"
        : normalized.includes("seguimiento") || normalized.includes("pendiente")
          ? "warning"
          : "neutral";

  const className =
    tone === "success"
      ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-200"
      : tone === "danger"
        ? "border-red-300/40 bg-red-500/10 text-red-200"
        : tone === "warning"
          ? "border-amber-300/40 bg-amber-500/10 text-amber-200"
          : "border-slate-600 bg-slate-800 text-slate-200";

  return <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black ${className}`}>{value}</span>;
}

function FlowStep({ number, title, href, detail }: { number: string; title: string; href: string; detail: string }) {
  return (
    <a href={href} className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-5 transition hover:border-cyan-300/50 hover:bg-cyan-950/20">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">{number}</p>
      <h3 className="mt-3 text-xl font-black text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
    </a>
  );
}
'''

COMMAND.write_text(command_page)

avance_append = '''

## Command Center con metricas reales GxP

Se consolido `/command-center` como panel ejecutivo conectado a datos locales:
- Lee registros desde cambios, riesgos, workflows, audit trail y reportes programados.
- Calcula registros totales, altos/criticos, pendientes, cerrados, evidencia, firmas y reportes activos.
- Presenta salud operativa por modulo y cadena GxP integrada.
- Permite refrescar metricas y exportar snapshot JSON ejecutivo.
'''

handoff_append = '''

## Command Center con metricas reales GxP

Se actualizo `src/app/command-center/page.tsx` como dashboard cliente conectado a:
- `floratrack_control_cambios_gxp_v1`
- `floratrack_gestion_riesgos_gxp_v1`
- `floratrack_workflows_qa_v1`
- `floratrack_audit_trail_gxp_v1`
- `floratrack_reportes_programados_gxp_v1`

Incluye score operativo, prioridades QA, estado por modulo, flujo integrado y exportacion JSON.
'''

if AVANCE.exists():
    avance = AVANCE.read_text()
    if "Command Center con metricas reales GxP" not in avance:
        AVANCE.write_text(avance + avance_append)

if HANDOFF.exists():
    handoff = HANDOFF.read_text()
    if "Command Center con metricas reales GxP" not in handoff:
        HANDOFF.write_text(handoff + handoff_append)

print("PATCH COMPLETADO OK")
print(f"Backup creado en: {BACKUP_DIR}")
print("Archivos modificados:")
print("- src/app/command-center/page.tsx")
print("- AVANCE_FLORATRACK.md")
print("- CHATGPT_HANDOFF_FLORATRACK.md")
