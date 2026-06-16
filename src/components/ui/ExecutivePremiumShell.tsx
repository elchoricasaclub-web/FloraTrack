"use client";

import { useMemo, useState } from "react";

export type ExecutivePremiumItem = {
  id: string;
  title: string;
  moduleName: string;
  category: string;
  score: number;
  metric: string;
  trend: string;
  status: string;
  risk: string;
  owner: string;
  insight: string;
  description: string;
  actionLabel: string;
  metrics: string[];
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: string;
  items: ExecutivePremiumItem[];
};

const variants = [
  { id: "premium", label: "Executive Premium" },
  { id: "control", label: "Control Tower" },
  { id: "scoreboard", label: "Scoreboard" },
  { id: "compact", label: "Compacto Ejecutivo" },
];

function scoreClass(score: number) {
  if (score >= 85) return "text-green-600";
  if (score >= 65) return "text-amber-600";
  return "text-red-600";
}

function scoreBar(score: number) {
  if (score >= 85) return "bg-green-600";
  if (score >= 65) return "bg-amber-500";
  return "bg-red-500";
}

function statusClass(status: string) {
  const value = status.toLowerCase();

  if (
    value.includes("activo") ||
    value.includes("estable") ||
    value.includes("operativo") ||
    value.includes("aprobado") ||
    value.includes("ok")
  ) {
    return "bg-green-100 text-green-700 border-green-200";
  }

  if (
    value.includes("pendiente") ||
    value.includes("revisión") ||
    value.includes("monitoreo") ||
    value.includes("implementación")
  ) {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  if (
    value.includes("crítico") ||
    value.includes("critico") ||
    value.includes("alerta") ||
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

function ProgressBar({ score }: { score: number }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${scoreBar(score)}`}
        style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
      />
    </div>
  );
}

function PremiumCard({ item }: { item: ExecutivePremiumItem }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-white p-8 shadow-sm">
      <div className="absolute right-0 top-0 h-44 w-44 rounded-bl-full bg-green-100" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              {item.moduleName} · {item.category}
            </div>

            <h3 className="mt-2 text-4xl font-black text-slate-900">
              {item.title}
            </h3>

            <p className="mt-4 max-w-4xl text-slate-500">
              {item.description}
            </p>
          </div>

          <div className="rounded-3xl bg-slate-950 px-7 py-6 text-right text-white">
            <div className="text-xs text-slate-300">Score</div>
            <div className="text-5xl font-black">{item.score}%</div>
            <div className="mt-1 text-xs text-green-300">{item.trend}</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm font-bold text-slate-500">
            <span>Readiness ejecutivo</span>
            <span>{item.metric}</span>
          </div>
          <ProgressBar score={item.score} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">Responsable</div>
            <div className="mt-1 font-black text-slate-800">{item.owner}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">Insight</div>
            <div className="mt-1 font-black text-slate-800">{item.insight}</div>
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

          <button className="rounded-full bg-green-600 px-4 py-2 text-xs font-black text-white">
            {item.actionLabel}
          </button>

          <button className="rounded-full border px-4 py-2 text-xs font-black text-slate-700">
            Ver detalle
          </button>

          <button className="rounded-full border px-4 py-2 text-xs font-black text-slate-700">
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
}

function ControlTowerCard({ item }: { item: ExecutivePremiumItem }) {
  return (
    <div className="rounded-3xl border bg-slate-950 p-7 text-white shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-green-300">
            Command Signal · {item.moduleName}
          </div>

          <h3 className="mt-2 text-3xl font-black">{item.title}</h3>

          <p className="mt-3 text-slate-300">{item.description}</p>
        </div>

        <div className="rounded-3xl bg-white px-6 py-5 text-right text-slate-950">
          <div className="text-xs text-slate-500">Score</div>
          <div className="text-4xl font-black">{item.score}%</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {item.metrics.map((metric) => (
          <div key={metric} className="rounded-2xl bg-slate-900 p-4">
            <div className="text-xs text-slate-400">Indicador</div>
            <div className="mt-1 font-black">{metric}</div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <ProgressBar score={item.score} />
      </div>
    </div>
  );
}

function ScoreboardCard({ item }: { item: ExecutivePremiumItem }) {
  return (
    <div className="rounded-3xl border bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-green-600">
            Scoreboard · {item.category}
          </div>
          <h3 className="mt-2 text-3xl font-black text-slate-900">{item.title}</h3>
          <p className="mt-3 text-slate-500">{item.insight}</p>
        </div>

        <div className={`text-6xl font-black ${scoreClass(item.score)}`}>
          {item.score}%
        </div>
      </div>

      <div className="mt-6">
        <ProgressBar score={item.score} />
      </div>

      <div className="mt-6 grid grid-cols-4 gap-3">
        {item.metrics.map((metric) => (
          <div key={metric} className="rounded-2xl border bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">KPI</div>
            <div className="mt-1 font-black text-slate-800">{metric}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompactCard({ item }: { item: ExecutivePremiumItem }) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black text-green-600">{item.moduleName}</div>
          <h3 className="mt-1 text-xl font-black text-slate-900">{item.title}</h3>
        </div>

        <div className={`text-4xl font-black ${scoreClass(item.score)}`}>
          {item.score}%
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">{item.description}</p>

      <div className="mt-4">
        <ProgressBar score={item.score} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(item.status)}`}>
          {item.status}
        </span>

        <span className="text-xs font-bold text-slate-400">{item.owner}</span>
      </div>
    </div>
  );
}

function RenderCard({
  item,
  variant,
}: {
  item: ExecutivePremiumItem;
  variant: string;
}) {
  if (variant === "control") return <ControlTowerCard item={item} />;
  if (variant === "scoreboard") return <ScoreboardCard item={item} />;
  if (variant === "compact") return <CompactCard item={item} />;
  return <PremiumCard item={item} />;
}

export default function ExecutivePremiumShell({
  eyebrow,
  title,
  description,
  primaryAction,
  items,
}: Props) {
  const [variant, setVariant] = useState("premium");
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(items.map((item) => item.category)))],
    [items]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const categoryOk = category === "Todos" || item.category === category;
      const queryOk =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.moduleName.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());

      return categoryOk && queryOk;
    });
  }, [items, category, query]);

  const averageScore = Math.round(
    items.reduce((sum, item) => sum + item.score, 0) / Math.max(1, items.length)
  );

  const highRisk = items.filter((item) =>
    item.risk.toLowerCase().includes("alto") ||
    item.risk.toLowerCase().includes("crítico") ||
    item.risk.toLowerCase().includes("critico")
  ).length;

  const okItems = items.filter((item) => item.score >= 85).length;

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-bl-full bg-green-500/20" />

        <div className="relative z-10 flex items-start justify-between gap-6">
          <div>
            <div className="text-sm font-black text-green-300">
              {eyebrow}
            </div>

            <h2 className="mt-2 text-6xl font-black">
              {title}
            </h2>

            <p className="mt-4 max-w-5xl text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>

          <button className="rounded-2xl bg-green-600 px-6 py-4 font-black text-white shadow hover:bg-green-700">
            {primaryAction}
          </button>
        </div>

        <div className="relative z-10 mt-10 grid grid-cols-4 gap-4">
          <div className="rounded-3xl bg-white/10 p-5">
            <div className="text-sm font-bold text-slate-300">Score ejecutivo</div>
            <div className="mt-2 text-5xl font-black text-white">{averageScore}%</div>
          </div>

          <div className="rounded-3xl bg-white/10 p-5">
            <div className="text-sm font-bold text-slate-300">Ítems</div>
            <div className="mt-2 text-5xl font-black text-white">{items.length}</div>
          </div>

          <div className="rounded-3xl bg-white/10 p-5">
            <div className="text-sm font-bold text-slate-300">OK / Premium</div>
            <div className="mt-2 text-5xl font-black text-green-300">{okItems}</div>
          </div>

          <div className="rounded-3xl bg-white/10 p-5">
            <div className="text-sm font-bold text-slate-300">Riesgo alto</div>
            <div className="mt-2 text-5xl font-black text-red-300">{highRisk}</div>
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
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="col-span-3 rounded-2xl border px-5 py-4 font-semibold"
          >
            {categories.map((item) => (
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
          <RenderCard key={item.id} item={item} variant={variant} />
        ))}
      </div>
    </section>
  );
}
