"use client";

import { useMemo, useState } from "react";

type ItemType = {
  id: string;
  title: string;
  module: string;
  category: string;
  purpose: string;
  priority: string;
  status: string;
  metric: string;
  progress: number;
  responsible: string;
  evidence: string;
  description: string;
  tags: string[];
  recommendedUse: string;
};

const itemTypes: ItemType[] = [
  {
    id: "kpi",
    title: "KPI Ejecutivo",
    module: "Dashboard / Command Center",
    category: "Dashboard",
    purpose: "Mostrar métricas críticas de cumplimiento, calidad o producción.",
    priority: "Alta",
    status: "Activo",
    metric: "92%",
    progress: 92,
    responsible: "Dirección / QA",
    evidence: "Score global actualizado",
    description: "Ideal para score global, cumplimiento GACP/GMP, readiness CSV, estado audit-ready o avance regulatorio.",
    tags: ["Score", "Readiness", "Dashboard"],
    recommendedUse: "Dashboard ejecutivo, Control Tower, Command Center.",
  },
  {
    id: "compliance",
    title: "Estado de Cumplimiento",
    module: "Certificaciones / Licencias",
    category: "Regulatorio",
    purpose: "Mostrar cumplimiento por norma, licencia, país o requisito.",
    priority: "Crítica",
    status: "En revisión",
    metric: "78%",
    progress: 78,
    responsible: "Regulatorio",
    evidence: "Matriz normativa",
    description: "Permite ver si una licencia, certificación o estándar está vigente, pendiente, vencido o en brecha.",
    tags: ["Regulatorio", "Licencia", "Norma"],
    recommendedUse: "Matriz normativa, perfil regulatorio, auditoría.",
  },
  {
    id: "risk",
    title: "Riesgo / CAPA",
    module: "QMS / CAPA / Riesgos",
    category: "Calidad",
    purpose: "Mostrar riesgo, severidad, acción correctiva y responsable.",
    priority: "Crítica",
    status: "Abierto",
    metric: "Alto",
    progress: 35,
    responsible: "QA Manager",
    evidence: "CAPA / análisis causa raíz",
    description: "Diseñado para desviaciones, no conformidades, riesgos regulatorios, OOS, CAPA y brechas.",
    tags: ["CAPA", "Riesgo", "Desviación"],
    recommendedUse: "QMS, auditorías, motor de reglas, brechas IA.",
  },
  {
    id: "batch",
    title: "Lote / Trazabilidad",
    module: "Producción / Live Rosin / Cultivo",
    category: "Trazabilidad",
    purpose: "Mostrar estado de lote desde genética hasta producto final.",
    priority: "Alta",
    status: "Cuarentena",
    metric: "FIN-LR-001",
    progress: 64,
    responsible: "Producción / QA",
    evidence: "Batch record / COA",
    description: "Ideal para lotes de biomasa, Bubble Hash, Live Rosin, cosecha, lote in vitro o producto terminado.",
    tags: ["Lote", "Trazabilidad", "QA"],
    recommendedUse: "Live Rosin, micropropagación, GMP, cosecha.",
  },
  {
    id: "document",
    title: "Documento / SOP",
    module: "Gestión Documental",
    category: "Documental",
    purpose: "Mostrar documentos, versiones, aprobación y vigencia.",
    priority: "Media",
    status: "Pendiente aprobación",
    metric: "v1.0",
    progress: 50,
    responsible: "QA Documental",
    evidence: "SOP / versión controlada",
    description: "Para SOP, políticas, plantillas, expedientes, reportes, anexos, registros y documentos maestros.",
    tags: ["SOP", "Documento", "Versión"],
    recommendedUse: "Document Generator, Dossier, CSV, QMS.",
  },
  {
    id: "audit",
    title: "Auditoría / Checklist",
    module: "Audit Builder",
    category: "Auditoría",
    purpose: "Mostrar avance de checklist, hallazgos y evidencias.",
    priority: "Alta",
    status: "En progreso",
    metric: "34/52",
    progress: 65,
    responsible: "Auditor interno",
    evidence: "Checklist / hallazgos",
    description: "Útil para auditorías internas, externas, proveedores, GACP, GMP, ISO 17025 y salas limpias.",
    tags: ["Auditoría", "Checklist", "Evidencia"],
    recommendedUse: "Audit Builder, auditorías proveedor, audit readiness.",
  },
  {
    id: "lab",
    title: "Muestra / COA",
    module: "LIMS / ISO 17025",
    category: "Laboratorio",
    purpose: "Mostrar muestra, método, revisión y decisión frente a especificación.",
    priority: "Alta",
    status: "Pendiente revisión",
    metric: "SMP-LR-001",
    progress: 58,
    responsible: "Jefe laboratorio",
    evidence: "Resultado analítico / COA",
    description: "Para muestras QC, COA, métodos analíticos, incertidumbre, instrumentos y liberación QA.",
    tags: ["LIMS", "COA", "Muestra"],
    recommendedUse: "Laboratorio QC, ISO 17025, COA.",
  },
  {
    id: "micro",
    title: "Micropropagación",
    module: "Micropropagación vegetal",
    category: "Micropropagación",
    purpose: "Mostrar lote in vitro, explantes, contaminación, subcultivo y aclimatación.",
    priority: "Alta",
    status: "Multiplicación",
    metric: "IVL-001",
    progress: 72,
    responsible: "Jefe micropropagación",
    evidence: "Registro in vitro",
    description: "Diseñado para banco genético, plantas madre, medios, cabinas, autoclave, contaminación y trazabilidad genética.",
    tags: ["In vitro", "Explante", "Genética"],
    recommendedUse: "Laboratorio de micropropagación.",
  },
  {
    id: "ai",
    title: "Recomendación IA",
    module: "Regulatory AI / Private AI",
    category: "IA",
    purpose: "Mostrar recomendación, confianza, revisión humana y acción siguiente.",
    priority: "Crítica",
    status: "Revisión humana",
    metric: "Alta confianza",
    progress: 40,
    responsible: "QA / Regulatorio",
    evidence: "Log IA / revisión humana",
    description: "Para recomendaciones regulatorias, brechas, solicitudes de evidencia, roadmap IA y RAG privado futuro.",
    tags: ["IA", "RegTech", "Revisión QA"],
    recommendedUse: "Regulatory AI, AI Gateway, Private AI.",
  },
  {
    id: "saas",
    title: "Tenant / Cliente SaaS",
    module: "SaaS Multiempresa",
    category: "SaaS",
    purpose: "Mostrar cliente, plan, módulos activos, onboarding y riesgo.",
    priority: "Media",
    status: "Implementación",
    metric: "Enterprise",
    progress: 48,
    responsible: "Admin SaaS",
    evidence: "Onboarding / plan activo",
    description: "Para clientes, sedes, permisos, módulos habilitados, suscripciones, seguridad e integraciones.",
    tags: ["Tenant", "SaaS", "Multiempresa"],
    recommendedUse: "SaaS Platform, RBAC, billing, onboarding.",
  },
];

const variants = [
  { id: "executive", name: "Ejecutivo Premium" },
  { id: "compact", name: "Compacto Operativo" },
  { id: "timeline", name: "Timeline Proceso" },
  { id: "audit", name: "Audit Ready" },
  { id: "kanban", name: "Kanban Card" },
  { id: "glass", name: "Glass Modern" },
];

const categories = ["Todos", ...Array.from(new Set(itemTypes.map((item) => item.category)))];

function statusStyle(status: string) {
  const lower = status.toLowerCase();

  if (lower.includes("activo") || lower.includes("vigente") || lower.includes("completado")) {
    return "bg-green-100 text-green-700 border-green-200";
  }

  if (lower.includes("pendiente") || lower.includes("revisión") || lower.includes("implementación") || lower.includes("progreso")) {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  if (lower.includes("abierto") || lower.includes("crítica") || lower.includes("alto") || lower.includes("cuarentena")) {
    return "bg-red-100 text-red-700 border-red-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

function priorityStyle(priority: string) {
  const lower = priority.toLowerCase();

  if (lower.includes("crítica")) return "bg-red-600 text-white";
  if (lower.includes("alta")) return "bg-amber-500 text-white";
  return "bg-slate-700 text-white";
}

function progressStyle(value: number) {
  if (value >= 85) return "bg-green-600";
  if (value >= 60) return "bg-amber-500";
  return "bg-red-500";
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
      <div
        className={`h-full rounded-full ${progressStyle(value)}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <button className="rounded-xl bg-green-600 px-4 py-2 text-sm font-black text-white">
        Abrir
      </button>
      <button className="rounded-xl border px-4 py-2 text-sm font-black text-slate-700">
        Evidencia
      </button>
      <button className="rounded-xl border px-4 py-2 text-sm font-black text-slate-700">
        Audit trail
      </button>
    </div>
  );
}

function ExecutiveCard({ item, dense }: { item: ItemType; dense: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border bg-white shadow-sm ${dense ? "p-5" : "p-8"}`}>
      <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-green-100" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              {item.module}
            </div>

            <h3 className={`${dense ? "text-2xl" : "text-4xl"} mt-2 font-black text-slate-900`}>
              {item.title}
            </h3>
          </div>

          <div className="rounded-2xl bg-slate-950 px-5 py-4 text-right text-white">
            <div className="text-xs text-slate-300">Métrica</div>
            <div className="text-2xl font-black">{item.metric}</div>
          </div>
        </div>

        <p className="mt-5 text-slate-500">
          {item.description}
        </p>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm font-bold text-slate-500">
            <span>Avance</span>
            <span>{item.progress}%</span>
          </div>
          <ProgressBar value={item.progress} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">Responsable</div>
            <div className="mt-1 font-black text-slate-800">{item.responsible}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">Evidencia</div>
            <div className="mt-1 font-black text-slate-800">{item.evidence}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">Categoría</div>
            <div className="mt-1 font-black text-slate-800">{item.category}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className={`rounded-full px-4 py-2 text-xs font-black ${priorityStyle(item.priority)}`}>
            {item.priority}
          </span>

          <span className={`rounded-full border px-4 py-2 text-xs font-black ${statusStyle(item.status)}`}>
            {item.status}
          </span>

          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
              {tag}
            </span>
          ))}
        </div>

        <ActionButtons />
      </div>
    </div>
  );
}

function CompactCard({ item }: { item: ItemType }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-black text-green-600">{item.module}</div>
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

      <div className="mt-4 flex items-center justify-between">
        <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusStyle(item.status)}`}>
          {item.status}
        </span>

        <span className="text-xs font-bold text-slate-400">{item.responsible}</span>
      </div>
    </div>
  );
}

function TimelineCard({ item }: { item: ItemType }) {
  const steps = ["Registro", "Revisión", "Evidencia", "Aprobación"];

  return (
    <div className="rounded-3xl border bg-white p-7 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-green-600">
            {item.title}
          </div>

          <h3 className="mt-2 text-2xl font-black text-slate-900">
            {item.purpose}
          </h3>
        </div>

        <span className={`rounded-full border px-4 py-2 text-xs font-black ${statusStyle(item.status)}`}>
          {item.status}
        </span>
      </div>

      <div className="mt-7 grid grid-cols-4 gap-3">
        {steps.map((step, index) => (
          <div key={step} className="rounded-2xl border bg-slate-50 p-4">
            <div className="text-xs font-black text-slate-400">Paso {index + 1}</div>
            <div className="mt-1 font-black text-slate-700">{step}</div>
            <div className={`mt-3 h-2 rounded-full ${index < 2 ? "bg-green-500" : "bg-slate-200"}`} />
          </div>
        ))}
      </div>

      <p className="mt-6 text-slate-500">{item.recommendedUse}</p>
      <ActionButtons />
    </div>
  );
}

function AuditCard({ item }: { item: ItemType }) {
  return (
    <div className="rounded-3xl border bg-slate-950 p-7 text-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-green-300">
            Audit Ready Item
          </div>

          <h3 className="mt-2 text-3xl font-black">{item.title}</h3>

          <p className="mt-3 text-slate-300">{item.description}</p>
        </div>

        <div className="rounded-2xl bg-white px-5 py-4 text-right text-slate-950">
          <div className="text-xs text-slate-500">Estado</div>
          <div className="text-lg font-black">{item.status}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-slate-900 p-4">
          <div className="text-xs text-slate-400">Responsable</div>
          <div className="mt-1 font-black">{item.responsible}</div>
        </div>

        <div className="rounded-2xl bg-slate-900 p-4">
          <div className="text-xs text-slate-400">Evidencia</div>
          <div className="mt-1 font-black">{item.evidence}</div>
        </div>

        <div className="rounded-2xl bg-slate-900 p-4">
          <div className="text-xs text-slate-400">Prioridad</div>
          <div className="mt-1 font-black">{item.priority}</div>
        </div>
      </div>

      <div className="mt-6">
        <ProgressBar value={item.progress} />
      </div>
    </div>
  );
}

function KanbanCard({ item }: { item: ItemType }) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <span className={`rounded-full px-3 py-1 text-xs font-black ${priorityStyle(item.priority)}`}>
          {item.priority}
        </span>
        <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusStyle(item.status)}`}>
          {item.status}
        </span>
      </div>

      <h3 className="mt-5 text-2xl font-black text-slate-900">{item.title}</h3>
      <p className="mt-2 text-sm text-slate-500">{item.description}</p>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="text-xs font-bold text-slate-400">Módulo</div>
        <div className="mt-1 font-black text-slate-800">{item.module}</div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400">Avance</div>
          <div className="font-black text-slate-800">{item.progress}%</div>
        </div>
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center font-black text-green-700">
          {item.progress}
        </div>
      </div>
    </div>
  );
}

function GlassCard({ item }: { item: ItemType }) {
  return (
    <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-white via-green-50 to-slate-100 p-8 shadow-sm">
      <div className="rounded-3xl border border-white bg-white/70 p-7 shadow-sm">
        <div className="text-xs font-black uppercase tracking-widest text-green-600">
          {item.category}
        </div>

        <h3 className="mt-2 text-4xl font-black text-slate-900">
          {item.title}
        </h3>

        <p className="mt-4 text-slate-600">
          {item.description}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/80 p-4">
            <div className="text-xs text-slate-400">Métrica</div>
            <div className="text-xl font-black text-slate-900">{item.metric}</div>
          </div>

          <div className="rounded-2xl bg-white/80 p-4">
            <div className="text-xs text-slate-400">Estado</div>
            <div className="text-xl font-black text-slate-900">{item.status}</div>
          </div>

          <div className="rounded-2xl bg-white/80 p-4">
            <div className="text-xs text-slate-400">Responsable</div>
            <div className="text-xl font-black text-slate-900">{item.responsible}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RenderVariant({ item, variant, dense }: { item: ItemType; variant: string; dense: boolean }) {
  if (variant === "compact") return <CompactCard item={item} />;
  if (variant === "timeline") return <TimelineCard item={item} />;
  if (variant === "audit") return <AuditCard item={item} />;
  if (variant === "kanban") return <KanbanCard item={item} />;
  if (variant === "glass") return <GlassCard item={item} />;
  return <ExecutiveCard item={item} dense={dense} />;
}

export default function ModernItemStudioModule() {
  const [selectedItemId, setSelectedItemId] = useState("kpi");
  const [selectedVariant, setSelectedVariant] = useState("executive");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [dense, setDense] = useState(false);
  const [previewMode, setPreviewMode] = useState("individual");

  const filteredItems = useMemo(() => {
    return itemTypes.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.module.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = category === "Todos" || item.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  const selectedItem = useMemo(
    () => itemTypes.find((item) => item.id === selectedItemId) || itemTypes[0],
    [selectedItemId]
  );

  return (
    <section className="rounded-2xl bg-white p-8 shadow">
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <div className="mb-2 text-sm font-black text-green-600">
            FloraTrack UX/UI Enterprise
          </div>

          <h2 className="text-5xl font-black text-slate-900">
            UX Item Studio v2
          </h2>

          <p className="mt-3 max-w-5xl text-slate-500 leading-relaxed">
            Laboratorio visual avanzado para escoger diseños item por item:
            tarjetas ejecutivas, compactas, timeline, audit-ready, kanban y glass.
            Permite filtrar, comparar y decidir qué estilo aplicar a cada módulo real.
          </p>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4 text-right">
          <div className="text-xs font-bold text-slate-500">Item activo</div>
          <div className="text-xl font-black text-slate-900">{selectedItem.title}</div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-12 gap-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar item, módulo o categoría..."
          className="col-span-5 rounded-2xl border px-5 py-4 font-semibold"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="col-span-3 rounded-2xl border px-5 py-4 font-semibold"
        >
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <select
          value={previewMode}
          onChange={(event) => setPreviewMode(event.target.value)}
          className="col-span-2 rounded-2xl border px-5 py-4 font-semibold"
        >
          <option value="individual">Vista individual</option>
          <option value="grid">Vista comparativa</option>
        </select>

        <button
          onClick={() => setDense((value) => !value)}
          className="col-span-2 rounded-2xl border bg-slate-950 px-5 py-4 font-black text-white"
        >
          {dense ? "Modo amplio" : "Modo denso"}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-3 rounded-3xl border bg-slate-50 p-4">
          <h3 className="mb-4 text-xl font-black text-slate-900">
            Items
          </h3>

          <div className="space-y-2 max-h-[780px] overflow-auto pr-1">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selectedItemId === item.id
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-green-300"
                }`}
              >
                <div className="font-black">{item.title}</div>
                <div className={`mt-1 text-xs ${
                  selectedItemId === item.id ? "text-green-50" : "text-slate-500"
                }`}>
                  {item.module}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="col-span-9 space-y-6">
          <div className="rounded-3xl border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  Variantes visuales
                </h3>
                <p className="text-slate-500">
                  Selecciona el estilo para el item activo o compáralos en cuadrícula.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedVariant === variant.id
                      ? "border-green-600 bg-green-50"
                      : "border-slate-200 bg-white hover:border-green-300"
                  }`}
                >
                  <div className="font-black text-slate-900">{variant.name}</div>
                </button>
              ))}
            </div>
          </div>

          {previewMode === "individual" ? (
            <RenderVariant item={selectedItem} variant={selectedVariant} dense={dense} />
          ) : (
            <div className="grid grid-cols-2 gap-5">
              {filteredItems.map((item) => (
                <RenderVariant key={item.id} item={item} variant={selectedVariant} dense={dense} />
              ))}
            </div>
          )}

          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-2xl border bg-white p-5">
              <div className="text-sm font-bold text-slate-500">Uso recomendado</div>
              <div className="mt-2 text-lg font-black text-slate-900">{selectedItem.recommendedUse}</div>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <div className="text-sm font-bold text-slate-500">Prioridad UX</div>
              <div className="mt-2 text-lg font-black text-slate-900">{selectedItem.priority}</div>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <div className="text-sm font-bold text-slate-500">Responsable</div>
              <div className="mt-2 text-lg font-black text-slate-900">{selectedItem.responsible}</div>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <div className="text-sm font-bold text-slate-500">Evidencia</div>
              <div className="mt-2 text-lg font-black text-slate-900">{selectedItem.evidence}</div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
