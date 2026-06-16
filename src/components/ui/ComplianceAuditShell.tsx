"use client";

import { useEffect, useMemo, useState } from "react";

export type ComplianceAuditItem = {
  id: string;
  title: string;
  moduleName: string;
  area: string;
  standard: string;
  metric: string;
  status: string;
  risk: string;
  owner: string;
  dueDate: string;
  evidence: string;
  documentRef: string;
  description: string;
  progress: number;
  actionLabel: string;
  auditTrail: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  createLabel: string;
  items: ComplianceAuditItem[];
};

type DrawerMode = "record" | "evidence" | "audit" | "capa";

type DrawerState = {
  item: ComplianceAuditItem;
  mode: DrawerMode;
} | null;

type ActionLog = {
  id: string;
  createdAt: string;
  moduleName: string;
  itemTitle: string;
  actionType: string;
  owner?: string;
  status?: string;
  evidence?: string;
};

const variants = [
  { id: "audit", label: "Audit Ready" },
  { id: "evidence", label: "Evidence Matrix" },
  { id: "regtech", label: "RegTech Card" },
  { id: "compact", label: "Compacto QA" },
  { id: "timeline", label: "Timeline Cierre" },
];

function statusClass(status: string) {
  const value = status.toLowerCase();

  if (
    value.includes("cerrado") ||
    value.includes("aprobado") ||
    value.includes("vigente") ||
    value.includes("cumple") ||
    value.includes("validado")
  ) {
    return "bg-green-100 text-green-700 border-green-200";
  }

  if (
    value.includes("pendiente") ||
    value.includes("proceso") ||
    value.includes("revisión") ||
    value.includes("borrador") ||
    value.includes("programado")
  ) {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  if (
    value.includes("abierto") ||
    value.includes("vencido") ||
    value.includes("crítico") ||
    value.includes("critico") ||
    value.includes("desviación") ||
    value.includes("desviacion")
  ) {
    return "bg-red-100 text-red-700 border-red-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

function riskClass(risk: string) {
  const value = risk.toLowerCase();

  if (value.includes("crítico") || value.includes("critico") || value.includes("alto")) {
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

function modeTitle(mode: DrawerMode) {
  if (mode === "evidence") return "Evidencia regulatoria";
  if (mode === "audit") return "Audit trail";
  if (mode === "capa") return "Crear CAPA";
  return "Detalle regulatorio";
}

function actionName(mode: DrawerMode) {
  if (mode === "evidence") return "evidence";
  if (mode === "audit") return "audit";
  if (mode === "capa") return "capa";
  return "open";
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

function ComplianceDrawer({
  drawer,
  onClose,
}: {
  drawer: DrawerState;
  onClose: () => void;
}) {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!drawer) return;

    async function registerAction() {
      try {
        setSaved(false);

        await fetch("/api/module-actions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            moduleName: drawer?.item.moduleName,
            itemTitle: drawer?.item.title,
            actionType: actionName(drawer?.mode ?? "record"),
            owner: drawer?.item.owner,
            status: drawer?.item.status,
            evidence: drawer?.item.evidence,
          }),
        });

        const response = await fetch("/api/module-actions", {
          cache: "no-store",
        });

        const json = await response.json();
        setLogs(json.logs ?? []);
        setSaved(true);
      } catch {
        setSaved(false);
      }
    }

    registerAction();
  }, [drawer]);

  if (!drawer) return null;

  const { item, mode } = drawer;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-950/50">
      <div className="h-full w-full max-w-3xl overflow-y-auto bg-white p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              {item.moduleName} · {modeTitle(mode)}
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

          <span className={`rounded-full px-4 py-2 text-xs font-black ${riskClass(item.risk)}`}>
            Riesgo {item.risk}
          </span>

          {saved && (
            <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-black text-green-700">
              Acción registrada
            </span>
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-xs font-bold text-slate-400">Norma / estándar</div>
            <div className="mt-1 text-xl font-black text-slate-900">{item.standard}</div>
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
            <div className="text-xs font-bold text-slate-400">Fecha objetivo</div>
            <div className="mt-1 text-xl font-black text-slate-900">{item.dueDate}</div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border p-6">
          <div className="mb-2 flex justify-between text-sm font-bold text-slate-500">
            <span>Avance de cierre</span>
            <span>{item.progress}%</span>
          </div>

          <ProgressBar value={item.progress} />
        </div>

        {mode === "record" && (
          <div className="mt-8 rounded-3xl border bg-slate-50 p-6">
            <h3 className="text-2xl font-black text-slate-900">
              Información regulatoria
            </h3>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-white p-5 font-semibold text-slate-700">
                Área: {item.area}
              </div>

              <div className="rounded-2xl bg-white p-5 font-semibold text-slate-700">
                Documento asociado: {item.documentRef}
              </div>

              <div className="rounded-2xl bg-white p-5 font-semibold text-slate-700">
                Audit trail base: {item.auditTrail}
              </div>
            </div>
          </div>
        )}

        {mode === "evidence" && (
          <div className="mt-8 rounded-3xl border bg-slate-50 p-6">
            <h3 className="text-2xl font-black text-slate-900">
              Paquete de evidencia
            </h3>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-white p-5 font-semibold text-slate-700">
                Evidencia requerida: {item.evidence}
              </div>

              <div className="rounded-2xl bg-white p-5 font-semibold text-slate-700">
                Documento soporte: {item.documentRef}
              </div>

              <div className="rounded-2xl bg-white p-5 font-semibold text-slate-700">
                Responsable de evidencia: {item.owner}
              </div>

              <div className="rounded-2xl bg-white p-5 font-semibold text-slate-700">
                Norma aplicable: {item.standard}
              </div>
            </div>
          </div>
        )}

        {mode === "audit" && (
          <div className="mt-8 rounded-3xl border bg-slate-50 p-6">
            <h3 className="text-2xl font-black text-slate-900">
              Historial de acciones
            </h3>

            <div className="mt-4 space-y-3">
              {logs.slice(0, 10).map((log) => (
                <div key={log.id} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-black text-slate-900">
                        {log.actionType.toUpperCase()} · {log.itemTitle}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {log.moduleName} · {log.status ?? "Sin estado"}
                      </div>
                    </div>

                    <div className="text-xs font-bold text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}

              {logs.length === 0 && (
                <div className="rounded-2xl bg-white p-5 font-semibold text-slate-500">
                  Todavía no hay acciones registradas.
                </div>
              )}
            </div>
          </div>
        )}

        {mode === "capa" && (
          <div className="mt-8 rounded-3xl border bg-red-50 p-6">
            <h3 className="text-2xl font-black text-slate-900">
              CAPA propuesta
            </h3>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-white p-5 font-semibold text-slate-700">
                Origen: {item.title}
              </div>

              <div className="rounded-2xl bg-white p-5 font-semibold text-slate-700">
                Riesgo: {item.risk}
              </div>

              <div className="rounded-2xl bg-white p-5 font-semibold text-slate-700">
                Acción requerida: investigar causa raíz, definir responsable, plazo, eficacia y evidencia.
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
            Enviar a QA
          </button>
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
  item: ComplianceAuditItem;
  onOpen: (item: ComplianceAuditItem, mode: DrawerMode) => void;
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

      <button
        type="button"
        onClick={() => onOpen(item, "capa")}
        className={`rounded-full border px-4 py-2 text-xs font-black ${
          dark ? "border-slate-700 text-slate-200 hover:bg-slate-900" : "text-red-700 hover:bg-red-50"
        }`}
      >
        Crear CAPA
      </button>
    </div>
  );
}

function RenderCard({
  item,
  variant,
  onOpen,
}: {
  item: ComplianceAuditItem;
  variant: string;
  onOpen: (item: ComplianceAuditItem, mode: DrawerMode) => void;
}) {
  if (variant === "audit") {
    return (
      <div className="rounded-3xl border bg-slate-950 p-7 text-white shadow-sm">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-300">
              Audit Ready · {item.moduleName} · {item.standard}
            </div>

            <h3 className="mt-2 text-3xl font-black">{item.title}</h3>

            <p className="mt-3 text-slate-300">{item.description}</p>
          </div>

          <div className="rounded-2xl bg-white px-5 py-4 text-right text-slate-950">
            <div className="text-xs text-slate-500">Métrica</div>
            <div className="text-lg font-black">{item.metric}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="rounded-2xl bg-slate-900 p-4">
            <div className="text-xs text-slate-400">Responsable</div>
            <div className="mt-1 font-black">{item.owner}</div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-4">
            <div className="text-xs text-slate-400">Evidencia</div>
            <div className="mt-1 font-black">{item.evidence}</div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-4">
            <div className="text-xs text-slate-400">Documento</div>
            <div className="mt-1 font-black">{item.documentRef}</div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-4">
            <div className="text-xs text-slate-400">Vencimiento</div>
            <div className="mt-1 font-black">{item.dueDate}</div>
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
      <div className="rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black text-green-600">{item.moduleName}</div>
            <h3 className="mt-1 text-xl font-black text-slate-900">{item.title}</h3>
          </div>

          <div className={`rounded-xl px-4 py-3 font-black ${riskClass(item.risk)}`}>
            {item.risk}
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

  if (variant === "timeline") {
    const flow = ["Requisito", "Evidencia", "Revisión QA", "Cierre"];

    return (
      <div className="rounded-3xl border bg-white p-7 shadow-sm">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              Timeline de cierre · {item.moduleName}
            </div>

            <h3 className="mt-2 text-3xl font-black text-slate-900">{item.title}</h3>

            <p className="mt-3 text-slate-500">{item.description}</p>
          </div>

          <span className={`h-fit rounded-full border px-4 py-2 text-xs font-black ${statusClass(item.status)}`}>
            {item.status}
          </span>
        </div>

        <div className="mt-7 grid grid-cols-4 gap-3">
          {flow.map((step, index) => (
            <div key={step} className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs font-black text-slate-400">Paso {index + 1}</div>
              <div className="mt-1 font-black text-slate-800">{step}</div>
              <div className={`mt-4 h-2 rounded-full ${index < 2 ? "bg-green-500" : "bg-slate-200"}`} />
            </div>
          ))}
        </div>

        <ActionButtons item={item} onOpen={onOpen} />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border bg-white p-8 shadow-sm">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-red-50" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-red-600">
              {variant === "evidence" ? "Evidence Matrix" : "RegTech Compliance"} · {item.standard}
            </div>

            <h3 className="mt-2 text-4xl font-black text-slate-900">{item.title}</h3>

            <p className="mt-4 max-w-4xl text-slate-500">{item.description}</p>
          </div>

          <div className="rounded-2xl bg-slate-950 px-6 py-5 text-right text-white">
            <div className="text-xs text-slate-300">Riesgo</div>
            <div className="text-2xl font-black">{item.risk}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">Área</div>
            <div className="mt-1 font-black text-slate-800">{item.area}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">Due date</div>
            <div className="mt-1 font-black text-slate-800">{item.dueDate}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">Owner</div>
            <div className="mt-1 font-black text-slate-800">{item.owner}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">Estado</div>
            <div className="mt-1 font-black text-slate-800">{item.status}</div>
          </div>
        </div>

        <div className="mt-6">
          <ProgressBar value={item.progress} />
        </div>

        <ActionButtons item={item} onOpen={onOpen} />
      </div>
    </div>
  );
}

export default function ComplianceAuditShell({
  eyebrow,
  title,
  description,
  createLabel,
  items,
}: Props) {
  const [variant, setVariant] = useState("audit");
  const [status, setStatus] = useState("Todos");
  const [risk, setRisk] = useState("Todos");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [drawer, setDrawer] = useState<DrawerState>(null);

  const statuses = useMemo(
    () => ["Todos", ...Array.from(new Set(items.map((item) => item.status)))],
    [items]
  );

  const risks = useMemo(
    () => ["Todos", ...Array.from(new Set(items.map((item) => item.risk)))],
    [items]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const statusOk = status === "Todos" || item.status === status;
      const riskOk = risk === "Todos" || item.risk === risk;
      const queryOk =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.area.toLowerCase().includes(query.toLowerCase()) ||
        item.standard.toLowerCase().includes(query.toLowerCase()) ||
        item.evidence.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());

      return statusOk && riskOk && queryOk;
    });
  }, [items, status, risk, query]);

  const openItems = items.filter((item) =>
    ["pendiente", "abierto", "revisión", "vencido", "borrador"].some((word) =>
      item.status.toLowerCase().includes(word)
    )
  ).length;

  const criticalItems = items.filter((item) =>
    item.risk.toLowerCase().includes("crítico") ||
    item.risk.toLowerCase().includes("critico") ||
    item.risk.toLowerCase().includes("alto")
  ).length;

  const averageProgress = Math.round(
    items.reduce((sum, item) => sum + item.progress, 0) / Math.max(1, items.length)
  );

  function openNewRequirement() {
    const newItem: ComplianceAuditItem = {
      id: "new-requirement",
      title: createLabel.replace("+ ", ""),
      moduleName: title,
      area: "Nuevo requisito",
      standard: "Pendiente definir",
      metric: "Formulario",
      status: "Borrador",
      risk: "Medio",
      owner: "Usuario actual",
      dueDate: new Date().toISOString().slice(0, 10),
      evidence: "Pendiente por cargar",
      documentRef: "DOC-PENDIENTE",
      description: `Crear un nuevo registro regulatorio en el módulo ${title}.`,
      progress: 0,
      actionLabel: "Guardar",
      auditTrail: "Creación inicial",
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
            onClick={openNewRequirement}
            className="rounded-2xl bg-green-600 px-6 py-4 font-black text-white shadow hover:bg-green-700"
          >
            {createLabel}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-4">
          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-500">Ítems auditables</div>
            <div className="mt-2 text-4xl font-black text-slate-900">{items.length}</div>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-500">Abiertos / Pendientes</div>
            <div className="mt-2 text-4xl font-black text-amber-600">{openItems}</div>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-500">Riesgo alto</div>
            <div className="mt-2 text-4xl font-black text-red-600">{criticalItems}</div>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-500">Cierre</div>
            <div className="mt-2 text-4xl font-black text-slate-900">{averageProgress}%</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow">
        <div className="grid grid-cols-12 gap-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Buscar evidencia, requisito o documento en ${title}...`}
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
            value={risk}
            onChange={(event) => setRisk(event.target.value)}
            className="col-span-2 rounded-2xl border px-5 py-4 font-semibold"
          >
            {risks.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={variant}
            onChange={(event) => setVariant(event.target.value)}
            className="col-span-2 rounded-2xl border px-5 py-4 font-semibold"
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
          <RenderCard key={item.id} item={item} variant={variant} onOpen={(selected, mode) => setDrawer({ item: selected, mode })} />
        ))}
      </div>

      <ComplianceDrawer drawer={drawer} onClose={() => setDrawer(null)} />
    </section>
  );
}
