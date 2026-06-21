"use client";

import { useMemo, useState } from "react";

export type ExecutivePremiumItem = {
  id: string; title: string; moduleName: string; category: string;
  score: number; metric: string; trend: string; status: string;
  risk: string; owner: string; insight: string; description: string;
  actionLabel: string; metrics: string[];
};

type Props = { eyebrow: string; title: string; description: string; primaryAction: string; items: ExecutivePremiumItem[]; };

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
  if (value.includes("activo") || value.includes("estable") || value.includes("operativo") || value.includes("ok")) return "bg-green-100 text-green-700 border-green-200";
  if (value.includes("pendiente") || value.includes("revisión") || value.includes("monitoreo")) return "bg-amber-100 text-amber-700 border-amber-200";
  if (value.includes("crítico") || value.includes("alerta")) return "bg-red-100 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function riskClass(risk: string) {
  const value = risk.toLowerCase();
  if (value.includes("alto") || value.includes("crítico")) return "bg-red-600 text-white";
  if (value.includes("medio")) return "bg-amber-500 text-white";
  return "bg-green-600 text-white";
}

function ProgressBar({ score }: { score: number }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full rounded-full ${scoreBar(score)}`} style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
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
            <h3 className="mt-2 text-4xl font-black text-slate-900">{item.title}</h3>
            <p className="mt-4 max-w-4xl text-slate-500">{item.description}</p>
          </div>
          <div className="rounded-3xl bg-slate-950 px-7 py-6 text-right text-white">
            <div className="text-xs text-slate-300">Score</div>
            <div className="text-5xl font-black">{item.score}%</div>
            <div className="mt-1 text-xs text-green-300">{item.trend}</div>
          </div>
        </div>
        <div className="mt-6">
          <ProgressBar score={item.score} />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-bold text-slate-400">Responsable</div><div className="mt-1 font-black text-slate-800">{item.owner}</div></div>
          <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-bold text-slate-400">Insight</div><div className="mt-1 font-black text-slate-800">{item.insight}</div></div>
          <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-bold text-slate-400">Estado</div><div className="mt-1 font-black text-slate-800">{item.status}</div></div>
        </div>
      </div>
    </div>
  );
}

function RenderCard({ item, variant }: { item: ExecutivePremiumItem; variant: string; }) {
  return <PremiumCard item={item} />;
}

export default function ExecutivePremiumShell({ eyebrow, title, description, primaryAction, items }: Props) {
  const [variant, setVariant] = useState("premium");
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");

  const categories = useMemo(() => ["Todos", ...Array.from(new Set(items.map((item) => item.category)))], [items]);
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const categoryOk = category === "Todos" || item.category === category;
      return categoryOk;
    });
  }, [items, category, query]);

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-bl-full bg-green-500/20" />
        <div className="relative z-10 flex items-start justify-between gap-6">
          <div>
            <div className="text-sm font-black text-green-300">{eyebrow}</div>
            <h2 className="mt-2 text-6xl font-black">{title}</h2>
            <p className="mt-4 max-w-5xl text-slate-300 leading-relaxed">{description}</p>
          </div>
          <button className="rounded-2xl bg-green-600 px-6 py-4 font-black text-white shadow hover:bg-green-700">{primaryAction}</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {filteredItems.map((item) => <RenderCard key={item.id} item={item} variant={variant} />)}
      </div>
    </section>
  );
}
