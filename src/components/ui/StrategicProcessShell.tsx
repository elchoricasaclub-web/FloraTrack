"use client";

import { useMemo, useState } from "react";

export type StrategicProcessItem = {
  id: string;
  title: string;
  moduleName: string;
  phase: string;
  metric: string;
  status: string;
  risk: string;
  owner: string;
  evidence: string;
  description: string;
  progress: number;
  actionLabel: string;
  flow: string[];
  kpis: string[];
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  createLabel: string;
  items: StrategicProcessItem[];
};

const variants = [
  { id: "premium", label: "Strategic Premium" },
  { id: "timeline", label: "Proceso Timeline" },
  { id: "audit", label: "Audit / QA Ready" },
  { id: "matrix", label: "Matriz Técnica" },
  { id: "compact", label: "Compacto Operativo" },
];

function statusClass(status: string) {
  const value = status.toLowerCase();

  if (
    value.includes("activo") ||
    value.includes("liberado") ||
    value.includes("aprobado") ||
    value.includes("estable") ||
    value.includes("validado")
  ) {
    return "bg-green-100 text-green-700 border-green-200";
  }

  if (
    value.includes("proceso") ||
    value.includes("pendiente") ||
    value.includes("monitoreo") ||
    value.includes("revisión") ||
    value.includes("preparación")
  ) {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  if (
    value.includes("crítico") ||
    value.includes("critico") ||
    value.includes("alerta") ||
    value.includes("cuarentena") ||
    value.includes("bloqueado")
  ) {
    return "bg-red-100 text-red-700 border-red-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

function riskClass(risk: string) {
  const value = risk.toLowerCase();

  if (value.includes("alto") || value.includes("crítico") || value.includes("critico")) {
    return "bg-red-600 text-white";
  }

  if (value.includes("medio")) {
    return "bg-amber-500 text-white";
  }

  return "bg-green-600 text-white";
}

function progressClass(progress: number) {
  if (progress >= 85) return "bg-green-600";
  if (progress >= 60) return "bg-amber-500";
  return "bg-red-500";
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${progressClass(value)}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function DetailDrawer({
  item,
  onClose,
}: {
  item: StrategicProcessItem | null;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40">
      <div className="h-full w-full max-w-2xl overflow-y-auto bg-white p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              Detalle técnico · {item.moduleName}
            </div>

            <h2 className="mt-2 text-4xl font-black text-slate-900">
              {item.title}
            </h2>

            <p className="mt-3 text-slate-500">
              {item.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl border px-4 py-3 font-black text-slate-700 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-xs font-bold text-slate-400">Fase</div>
            <div className="mt-1 text-xl font-black text-slate-900">{item.phase}</div>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-xs font-bold text-slate-400">Métrica</div>
            <div className="mt-1 text-xl font-black text-slate-900">{item.metric}</div>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-xs font-bold text-slate-400">Responsable</div>
            <div className="mt-1 text-xl font-black text-slate-900">{item.owner}</div>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-xs font-bold text-slate-400">Evidencia</div>
            <div className="mt-1 text-xl font-black text-slate-900">{item.evidence}</div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border p-6">
          <div className="mb-2 flex justify-between text-sm font-bold text-slate-500">
            <span>Avance técnico / QA</span>
            <span>{item.progress}%</span>
          </div>
          <ProgressBar value={item.progress} />
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-black text-slate-900">Flujo del proceso</h3>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {item.flow.map((step, index) => (
              <div key={step} className="rounded-2xl border bg-slate-50 p-5">
                <div className="text-xs font-black text-slate-400">Paso {index + 1}</div>
                <div className="mt-1 font-black text-slate-900">{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-black text-slate-900">Indicadores clave</h3>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {item.kpis.map((kpi) => (
              <div key={kpi} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="text-xs font-bold text-slate-400">KPI</div>
                <div className="mt-1 font-black text-slate-900">{kpi}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-2xl bg-green-600 px-5 py-4 font-black text-white">
            Abrir registro completo
          </button>

          <button className="rounded-2xl border px-5 py-4 font-black text-slate-700">
            Ver evidencia
          </button>

          <button className="rounded-2xl border px-5 py-4 font-black text-slate-700">
            Audit trail
          </button>
        </div>
      </div>
    </div>
  );
}

function StrategicCard({
  item,
  variant,
  onOpen,
}: {
  item: StrategicProcessItem;
  variant: string;
  onOpen: (item: StrategicProcessItem) => void;
}) {
  if (variant === "audit") {
    return (
      <div className="rounded-3xl border bg-slate-950 p-7 text-white shadow-sm">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-300">
              Audit / QA Ready · {item.moduleName}
            </div>

            <h3 className="mt-2 text-3xl font-black">{item.title}</h3>

            <p className="mt-3 text-slate-300">{item.description}</p>
          </div>

          <div className="rounded-2xl bg-white px-5 py-4 text-right text-slate-950">
            <div className="text-xs text-slate-500">Métrica</div>
            <div className="text-lg font-black">{item.metric}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-900 p-4">
            <div className="text-xs text-slate-400">Responsable</div>
            <div className="mt-1 font-black">{item.owner}</div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-4">
            <div className="text-xs text-slate-400">Evidencia</div>
            <div className="mt-1 font-black">{item.evidence}</div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-4">
            <div className="text-xs text-slate-400">Estado</div>
            <div className="mt-1 font-black">{item.status}</div>
          </div>
        </div>

        <div className="mt-6">
          <ProgressBar value={item.progress} />
        </div>

        <button
          onClick={() => onOpen(item)}
          className="mt-6 rounded-xl bg-green-600 px-5 py-3 font-black text-white"
        >
          {item.actionLabel}
        </button>
      </div>
    );
  }

  if (variant === "timeline") {
    return (
      <div className="rounded-3xl border bg-white p-7 shadow-sm">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              Proceso Timeline · {item.phase}
            </div>

            <h3 className="mt-2 text-3xl font-black text-slate-900">{item.title}</h3>

            <p className="mt-3 text-slate-500">{item.description}</p>
          </div>

          <span className={`h-fit rounded-full border px-4 py-2 text-xs font-black ${statusClass(item.status)}`}>
            {item.status}
          </span>
        </div>

        <div className="mt-7 grid grid-cols-4 gap-3">
          {item.flow.map((step, index) => (
            <div key={step} className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs font-black text-slate-400">Paso {index + 1}</div>
              <div className="mt-1 font-black text-slate-800">{step}</div>
              <div className={`mt-4 h-2 rounded-full ${index < 2 ? "bg-green-500" : "bg-slate-200"}`} />
            </div>
          ))}
        </div>

        <button
          onClick={() => onOpen(item)}
          className="mt-6 rounded-xl bg-green-600 px-5 py-3 font-black text-white"
        >
          {item.actionLabel}
        </button>
      </div>
    );
  }

  if (variant === "matrix") {
    return (
      <div className="rounded-3xl border bg-white p-7 shadow-sm">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              Matriz Técnica · {item.moduleName}
            </div>

            <h3 className="mt-2 text-3xl font-black text-slate-900">{item.title}</h3>

            <p className="mt-3 text-slate-500">{item.description}</p>
          </div>

          <div className={`rounded-2xl px-5 py-4 font-black ${riskClass(item.risk)}`}>
            {item.risk}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {item.kpis.map((kpi) => (
            <div key={kpi} className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-400">Indicador</div>
              <div className="mt-1 font-black text-slate-800">{kpi}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => onOpen(item)}
          className="mt-6 rounded-xl bg-green-600 px-5 py-3 font-black text-white"
        >
          {item.actionLabel}
        </button>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black text-green-600">{item.moduleName}</div>
            <h3 className="mt-1 text-xl font-black text-slate-900">{item.title}</h3>
          </div>

          <div className="rounded-xl bg-green-50 px-4 py-3 font-black text-green-700">
            {item.metric}
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-500">{item.description}</p>

        <div className="mt-4">
          <ProgressBar value={item.progress} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(item.status)}`}>
            {item.status}
          </span>

          <button
            onClick={() => onOpen(item)}
            className="rounded-xl bg-green-600 px-3 py-2 text-xs font-black text-white"
          >
            Abrir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border bg-white p-8 shadow-sm">
      <div className="absolute right-0 top-0 h-44 w-44 rounded-bl-full bg-green-100" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              {item.moduleName} · {item.phase}
            </div>

            <h3 className="mt-2 text-4xl font-black text-slate-900">{item.title}</h3>

            <p className="mt-4 max-w-4xl text-slate-500">{item.description}</p>
          </div>

          <div className="rounded-2xl bg-slate-950 px-6 py-5 text-right text-white">
            <div className="text-xs text-slate-300">Métrica</div>
            <div className="text-2xl font-black">{item.metric}</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm font-bold text-slate-500">
            <span>Avance estratégico</span>
            <span>{item.progress}%</span>
          </div>
          <ProgressBar value={item.progress} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">Responsable</div>
            <div className="mt-1 font-black text-slate-800">{item.owner}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">Evidencia</div>
            <div className="mt-1 font-black text-slate-800">{item.evidence}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">Estado</div>
            <div className="mt-1 font-black text-slate-800">{item.status}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className={`rounded-full border px-4 py-2 text-xs font-black ${statusClass(item.status)}`}>
            {item.status}
          </span>

          <span className={`rounded-full px-4 py-2 text-xs font-black ${riskClass(item.risk)}`}>
            Riesgo {item.risk}
          </span>

          <button
            onClick={() => onOpen(item)}
            className="rounded-full bg-green-600 px-4 py-2 text-xs font-black text-white"
          >
            {item.actionLabel}
          </button>

          <button className="rounded-full border px-4 py-2 text-xs font-black text-slate-700">
            Evidencia
          </button>

          <button className="rounded-full border px-4 py-2 text-xs font-black text-slate-700">
            Audit trail
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StrategicProcessShell({
  eyebrow,
  title,
  description,
  createLabel,
  items,
}: Props) {
  const [variant, setVariant] = useState("premium");
  const [status, setStatus] = useState("Todos");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState<StrategicProcessItem | null>(null);

  const statuses = useMemo(
    () => ["Todos", ...Array.from(new Set(items.map((item) => item.status)))],
    [items]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const statusOk = status === "Todos" || item.status === status;
      const queryOk =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.moduleName.toLowerCase().includes(query.toLowerCase()) ||
        item.phase.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());

      return statusOk && queryOk;
    });
  }, [items, status, query]);

  const activeItems = items.filter((item) =>
    ["activo", "estable", "validado", "liberado"].some((word) =>
      item.status.toLowerCase().includes(word)
    )
  ).length;

  const criticalItems = items.filter((item) =>
    item.risk.toLowerCase().includes("alto") ||
    item.risk.toLowerCase().includes("crítico") ||
    item.risk.toLowerCase().includes("critico")
  ).length;

  const averageProgress = Math.round(
    items.reduce((sum, item) => sum + item.progress, 0) / Math.max(1, items.length)
  );

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-sm font-black text-green-600">
              {eyebrow}
            </div>

            <h2 className="mt-2 text-5xl font-black text-slate-900">
              {title}
            </h2>

            <p className="mt-3 max-w-5xl text-slate-500 leading-relaxed">
              {description}
            </p>
          </div>

          <button className="rounded-2xl bg-green-600 px-6 py-4 font-black text-white shadow hover:bg-green-700">
            {createLabel}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-4">
          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-500">Ítems</div>
            <div className="mt-2 text-4xl font-black text-slate-900">{items.length}</div>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-500">Activos / OK</div>
            <div className="mt-2 text-4xl font-black text-green-600">{activeItems}</div>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-500">Riesgo alto</div>
            <div className="mt-2 text-4xl font-black text-red-600">{criticalItems}</div>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-500">Avance</div>
            <div className="mt-2 text-4xl font-black text-slate-900">{averageProgress}%</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow">
        <div className="grid grid-cols-12 gap-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Buscar en ${title}...`}
            className="col-span-4 rounded-2xl border px-5 py-4 font-semibold"
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="col-span-2 rounded-2xl border px-5 py-4 font-semibold"
          >
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={variant}
            onChange={(event) => setVariant(event.target.value)}
            className="col-span-4 rounded-2xl border px-5 py-4 font-semibold"
          >
            {variants.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={view}
            onChange={(event) => setView(event.target.value)}
            className="col-span-2 rounded-2xl border px-5 py-4 font-semibold"
          >
            <option value="grid">Grid</option>
            <option value="list">Lista</option>
          </select>
        </div>
      </div>

      <div className={view === "grid" ? "grid grid-cols-2 gap-6" : "space-y-6"}>
        {filteredItems.map((item) => (
          <StrategicCard key={item.id} item={item} variant={variant} onOpen={setSelected} />
        ))}
      </div>

      <DetailDrawer item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
