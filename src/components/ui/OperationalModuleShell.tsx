"use client";

import { useMemo, useState } from "react";

export type OperationalModuleItem = {
  id: string;
  title: string;
  moduleName: string;
  area: string;
  metric: string;
  status: string;
  priority: string;
  owner: string;
  evidence: string;
  description: string;
  progress: number;
  actionLabel: string;
  flow: string[];
};

type DrawerMode = "record" | "evidence" | "audit";

type DrawerState = {
  item: OperationalModuleItem;
  mode: DrawerMode;
} | null;

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  createLabel: string;
  items: OperationalModuleItem[];
};

const variants = [
  { id: "executive", label: "Ejecutivo Premium" },
  { id: "timeline", label: "Timeline Proceso" },
  { id: "audit", label: "Audit Ready" },
  { id: "compact", label: "Compacto Operativo" },
];

function statusClass(status: string) {
  const value = status.toLowerCase();

  if (value.includes("activo") || value.includes("estable") || value.includes("aprobado") || value.includes("liberado")) {
    return "bg-green-100 text-green-700 border-green-200";
  }

  if (value.includes("pendiente") || value.includes("proceso") || value.includes("monitoreo") || value.includes("revisión")) {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  if (value.includes("alerta") || value.includes("crítico") || value.includes("critico") || value.includes("bloqueado")) {
    return "bg-red-100 text-red-700 border-red-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

function priorityClass(priority: string) {
  const value = priority.toLowerCase();

  if (value.includes("crítica") || value.includes("critica")) return "bg-red-600 text-white";
  if (value.includes("alta")) return "bg-amber-500 text-white";
  return "bg-slate-700 text-white";
}

function barClass(progress: number) {
  if (progress >= 80) return "bg-green-600";
  if (progress >= 55) return "bg-amber-500";
  return "bg-red-500";
}

function drawerTitle(mode: DrawerMode) {
  if (mode === "evidence") return "Evidencia";
  if (mode === "audit") return "Audit Trail";
  return "Registro";
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${barClass(value)}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function ActionDrawer({
  drawer,
  onClose,
}: {
  drawer: DrawerState;
  onClose: () => void;
}) {
  if (!drawer) return null;

  const { item, mode } = drawer;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-950/50">
      <div className="h-full w-full max-w-3xl overflow-y-auto bg-white p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              {item.moduleName} · {drawerTitle(mode)}
            </div>

            <h2 className="mt-2 text-4xl font-black text-slate-900">
              {item.title}
            </h2>

            <p className="mt-3 text-slate-500">
              {item.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border px-4 py-3 font-black text-slate-700 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className={`rounded-full border px-4 py-2 text-xs font-black ${statusClass(item.status)}`}>
            {item.status}
          </span>

          <span className={`rounded-full px-4 py-2 text-xs font-black ${priorityClass(item.priority)}`}>
            {item.priority}
          </span>

          <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-black text-green-700">
            Acción abierta correctamente
          </span>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-xs font-bold text-slate-400">Área</div>
            <div className="mt-1 text-xl font-black text-slate-900">{item.area}</div>
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
            <span>Avance</span>
            <span>{item.progress}%</span>
          </div>
          <ProgressBar value={item.progress} />
        </div>

        {mode === "record" && (
          <div className="mt-8">
            <h3 className="text-2xl font-black text-slate-900">Flujo del registro</h3>

            <div className="mt-4 grid grid-cols-2 gap-4">
              {item.flow.map((step, index) => (
                <div key={step} className="rounded-2xl border bg-slate-50 p-5">
                  <div className="text-xs font-black text-slate-400">Paso {index + 1}</div>
                  <div className="mt-1 font-black text-slate-900">{step}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === "evidence" && (
          <div className="mt-8 rounded-3xl border bg-slate-50 p-6">
            <h3 className="text-2xl font-black text-slate-900">Paquete de evidencia</h3>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-white p-5 font-semibold text-slate-700">
                Evidencia principal: {item.evidence}
              </div>

              <div className="rounded-2xl bg-white p-5 font-semibold text-slate-700">
                Responsable: {item.owner}
              </div>

              <div className="rounded-2xl bg-white p-5 font-semibold text-slate-700">
                Estado QA: {item.status}
              </div>
            </div>
          </div>
        )}

        {mode === "audit" && (
          <div className="mt-8 rounded-3xl border bg-slate-50 p-6">
            <h3 className="text-2xl font-black text-slate-900">Audit trail simulado</h3>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="font-black text-slate-900">OPEN · {item.title}</div>
                <div className="mt-1 text-sm text-slate-500">
                  Acción registrada en interfaz · {new Date().toLocaleString()}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="font-black text-slate-900">QA REVIEW · {item.status}</div>
                <div className="mt-1 text-sm text-slate-500">
                  Responsable: {item.owner}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="font-black text-slate-900">EVIDENCE · {item.evidence}</div>
                <div className="mt-1 text-sm text-slate-500">
                  Evidencia vinculada al registro.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" className="rounded-2xl bg-green-600 px-5 py-4 font-black text-white">
            Guardar avance
          </button>

          <button type="button" className="rounded-2xl border px-5 py-4 font-black text-slate-700">
            Exportar evidencia
          </button>

          <button type="button" className="rounded-2xl border px-5 py-4 font-black text-slate-700">
            Crear CAPA
          </button>
        </div>
      </div>
    </div>
  );
}

function ModuleCard({
  item,
  variant,
  onOpen,
}: {
  item: OperationalModuleItem;
  variant: string;
  onOpen: (item: OperationalModuleItem, mode: DrawerMode) => void;
}) {
  if (variant === "timeline") {
    return (
      <div className="rounded-3xl border bg-white p-7 shadow-sm">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              Flujo de proceso · {item.moduleName}
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
            </div>
          ))}
        </div>

        <ActionButtons item={item} onOpen={onOpen} />
      </div>
    );
  }

  if (variant === "audit") {
    return (
      <div className="rounded-3xl border bg-slate-950 p-7 text-white shadow-sm">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-300">
              Audit Ready · {item.moduleName}
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

        <ActionButtons item={item} onOpen={onOpen} dark />
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="rounded-3xl border bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black text-green-600">{item.area}</div>
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

        <ActionButtons item={item} onOpen={onOpen} />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border bg-white p-8 shadow-sm">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-green-100" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              {item.moduleName} · {item.area}
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
            <span>Avance</span>
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
          <span className={`rounded-full px-4 py-2 text-xs font-black ${priorityClass(item.priority)}`}>
            {item.priority}
          </span>

          <span className={`rounded-full border px-4 py-2 text-xs font-black ${statusClass(item.status)}`}>
            {item.status}
          </span>

          <ActionButtons item={item} onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

function ActionButtons({
  item,
  onOpen,
  dark = false,
}: {
  item: OperationalModuleItem;
  onOpen: (item: OperationalModuleItem, mode: DrawerMode) => void;
  dark?: boolean;
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onOpen(item, "record")}
        className="rounded-full bg-green-600 px-4 py-2 text-xs font-black text-white hover:bg-green-700"
      >
        {item.actionLabel}
      </button>

      <button
        type="button"
        onClick={() => onOpen(item, "evidence")}
        className={`rounded-full border px-4 py-2 text-xs font-black ${
          dark ? "border-slate-700 text-slate-200 hover:bg-slate-900" : "text-slate-700 hover:bg-slate-50"
        }`}
      >
        Ver evidencia
      </button>

      <button
        type="button"
        onClick={() => onOpen(item, "audit")}
        className={`rounded-full border px-4 py-2 text-xs font-black ${
          dark ? "border-slate-700 text-slate-200 hover:bg-slate-900" : "text-slate-700 hover:bg-slate-50"
        }`}
      >
        Audit trail
      </button>
    </div>
  );
}

export default function OperationalModuleShell({
  eyebrow,
  title,
  description,
  createLabel,
  items,
}: Props) {
  const [variant, setVariant] = useState("executive");
  const [status, setStatus] = useState("Todos");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [drawer, setDrawer] = useState<DrawerState>(null);

  const statuses = useMemo(
    () => ["Todos", ...Array.from(new Set(items.map((item) => item.status)))],
    [items]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const statusOk = status === "Todos" || item.status === status;
      const queryOk =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.area.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.moduleName.toLowerCase().includes(query.toLowerCase());

      return statusOk && queryOk;
    });
  }, [items, status, query]);

  const activeItems = items.filter((item) =>
    ["activo", "estable", "liberado", "aprobado"].some((word) =>
      item.status.toLowerCase().includes(word)
    )
  ).length;

  const criticalItems = items.filter((item) =>
    item.priority.toLowerCase().includes("crítica") ||
    item.priority.toLowerCase().includes("critica")
  ).length;

  const averageProgress = Math.round(
    items.reduce((sum, item) => sum + item.progress, 0) / Math.max(1, items.length)
  );

  function openDrawer(item: OperationalModuleItem, mode: DrawerMode) {
    setDrawer({ item, mode });
  }

  function openNewRecord() {
    const newItem: OperationalModuleItem = {
      id: "new-record",
      title: createLabel.replace("+ ", ""),
      moduleName: title,
      area: "Nuevo registro",
      metric: "Formulario",
      status: "Borrador",
      priority: "Alta",
      owner: "Usuario actual",
      evidence: "Pendiente por cargar",
      description: `Crear un nuevo registro en el módulo ${title}.`,
      progress: 0,
      actionLabel: "Guardar",
      flow: ["Crear", "Completar", "Adjuntar evidencia", "Guardar"],
    };

    setDrawer({ item: newItem, mode: "record" });
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-sm font-black text-green-600">{eyebrow}</div>

            <h2 className="mt-2 text-5xl font-black text-slate-900">{title}</h2>

            <p className="mt-3 max-w-5xl text-slate-500 leading-relaxed">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={openNewRecord}
            className="rounded-2xl bg-green-600 px-6 py-4 font-black text-white shadow hover:bg-green-700"
          >
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
            <div className="text-sm font-bold text-slate-500">Críticos</div>
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
            className="col-span-5 rounded-2xl border px-5 py-4 font-semibold"
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
            className="col-span-3 rounded-2xl border px-5 py-4 font-semibold"
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
          <ModuleCard key={item.id} item={item} variant={variant} onOpen={openDrawer} />
        ))}
      </div>

      <ActionDrawer drawer={drawer} onClose={() => setDrawer(null)} />
    </section>
  );
}
