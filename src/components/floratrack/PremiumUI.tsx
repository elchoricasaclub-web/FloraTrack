"use client";

import { type ReactNode } from "react";
import type { ModuleItem } from "../../lib/floratrackModules";

type Tone = "emerald" | "sky" | "amber" | "rose" | "violet" | "slate" | "blue" | "cyan" | "pink";

const toneMap: Record<Tone, string> = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  sky: "border-sky-200 bg-sky-50 text-sky-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  pink: "border-pink-200 bg-pink-50 text-pink-700",
};

const riskTone: Record<ModuleItem["risk"], Tone> = {
  Bajo: "emerald",
  Medio: "sky",
  Alto: "amber",
  Crítico: "rose",
};

const groupIcon: Record<string, string> = {
  GACP: "🌱",
  GMP: "🏭",
  QA: "✓",
  Base: "⌂",
  Audit: "◎",
  Supplier: "◆",
  Sanitation: "✦",
  Pest: "◌",
  Waste: "♻",
  Recall: "!",
  Stability: "◈",
  Security: "⌁",
  Company: "▣",
  Reports: "◧",
  GIS: "⌖",
  Notifications: "◍",
  DataOps: "⟐",
  Regulatory: "⚖",
  eSign: "✍",
  Validation: "◬",
  Backup: "↺",
  Integrations: "⇄",
  Workflow: "→",
  Automation: "⚙",
  Change: "△",
  Risk: "⚠",
  ReportAutomation: "▤",
  RegulatoryApi: "◇",
};

export function StatusBadge({
  value,
  tone = "emerald",
}: {
  value: string;
  tone?: Tone;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black ${toneMap[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}

export function ActionButton({
  href,
  children,
  variant = "primary",
  onClick,
}: {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "dark" | "ghost" | "danger";
  onClick?: () => void;
}) {
  const className =
    variant === "primary"
      ? "bg-slate-950 text-white shadow-xl shadow-slate-200 hover:-translate-y-0.5 hover:bg-emerald-600"
      : variant === "secondary"
      ? "border border-slate-200 bg-white text-slate-950 shadow-sm hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
      : variant === "dark"
      ? "bg-white text-slate-950 shadow-xl hover:-translate-y-0.5 hover:bg-emerald-100"
      : variant === "danger"
      ? "bg-rose-600 text-white shadow-xl shadow-rose-100 hover:-translate-y-0.5 hover:bg-rose-500"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950";

  if (href) {
    return (
      <a href={href} className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-black transition ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-black transition ${className}`}>
      {children}
    </button>
  );
}

export function MetricCard({
  label,
  value,
  description,
  tone = "slate",
  progress,
}: {
  label: string;
  value: string | number;
  description?: string;
  tone?: Tone;
  progress?: number;
}) {
  return (
    <article className="ft-card-hover rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
          <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
        <span className={`rounded-2xl border px-3 py-2 text-xs font-black ${toneMap[tone]}`}>Live</span>
      </div>

      {description && <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">{description}</p>}

      {typeof progress === "number" && (
        <div className="mt-5">
          <ProgressIndicator value={progress} />
        </div>
      )}
    </article>
  );
}

export function ProgressIndicator({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-black text-slate-500">
        <span>Progreso</span>
        <span>{safe}%</span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 transition-all duration-500"
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar módulo, proceso, riesgo, QA...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-3xl border border-slate-200 bg-white/90 py-4 pl-11 pr-5 text-sm font-bold text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
}

export function FilterChips({
  filters,
  active,
  onChange,
}: {
  filters: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${
            active === filter
              ? "border-slate-950 bg-slate-950 text-white shadow-lg"
              : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export function ModuleCard({
  module,
  index = 0,
  featured = false,
  onInspect,
}: {
  module: ModuleItem;
  index?: number;
  featured?: boolean;
  onInspect?: () => void;
}) {
  const tone = riskTone[module.risk];
  const icon = groupIcon[module.group] ?? "◇";

  return (
    <article
      className={`ft-enter ft-card-hover group relative overflow-hidden rounded-[2rem] border bg-white p-6 shadow-sm ${
        featured ? "border-emerald-200 ring-4 ring-emerald-50" : "border-slate-200"
      }`}
      style={{ animationDelay: `${Math.min(index * 34, 260)}ms` }}
    >
      <div className="absolute right-0 top-0 h-28 w-28 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-emerald-100 via-cyan-100 to-transparent opacity-70 transition group-hover:scale-125" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-xl shadow-inner">
            {icon}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge value={module.tag} tone={module.group === "Risk" ? "rose" : module.group === "RegulatoryApi" ? "violet" : "emerald"} />
              <StatusBadge value={module.status} tone="sky" />
            </div>

            <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950">{module.title}</h3>
            <p className="mt-1 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">{module.subtitle}</p>
          </div>
        </div>

        <StatusBadge value={`Riesgo ${module.risk}`} tone={tone} />
      </div>

      <p className="relative mt-5 min-h-20 text-sm font-semibold leading-7 text-slate-600">{module.description}</p>

      <div className="relative mt-6 flex flex-wrap items-center gap-3">
        <ActionButton href={module.href}>Abrir módulo</ActionButton>
        <ActionButton variant="secondary" onClick={onInspect}>Vista rápida</ActionButton>
      </div>
    </article>
  );
}

export function ItemCard({
  title,
  description,
  meta,
  status = "Activo",
  tone = "emerald",
  actionLabel = "Abrir",
  href,
}: {
  title: string;
  description: string;
  meta?: string;
  status?: string;
  tone?: Tone;
  actionLabel?: string;
  href?: string;
}) {
  return (
    <article className="ft-card-hover rounded-[1.65rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <StatusBadge value={status} tone={tone} />
          <h4 className="mt-4 text-lg font-black text-slate-950">{title}</h4>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">↗</div>
      </div>

      <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">{description}</p>
      {meta && <p className="mt-3 text-xs font-black uppercase tracking-wide text-slate-400">{meta}</p>}

      {href && (
        <a href={href} className="mt-4 inline-flex text-sm font-black text-emerald-700 hover:text-emerald-500">
          {actionLabel} →
        </a>
      )}
    </article>
  );
}

export function NotificationCard({
  title,
  description,
  tone = "amber",
}: {
  title: string;
  description: string;
  tone?: Tone;
}) {
  return (
    <div className={`rounded-[1.5rem] border p-4 ${toneMap[tone]}`}>
      <p className="text-sm font-black">{title}</p>
      <p className="mt-1 text-sm font-semibold opacity-80">{description}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-2xl text-white">◇</div>
      <h3 className="mt-5 text-2xl font-black text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-slate-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-8 w-32 animate-pulse rounded-full bg-slate-100" />
      <div className="mt-5 h-8 w-2/3 animate-pulse rounded-xl bg-slate-100" />
      <div className="mt-3 h-4 w-full animate-pulse rounded-xl bg-slate-100" />
      <div className="mt-2 h-4 w-4/5 animate-pulse rounded-xl bg-slate-100" />
      <div className="mt-6 h-12 w-40 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  );
}

export function DetailDrawer({
  module,
  onClose,
}: {
  module: ModuleItem | null;
  onClose: () => void;
}) {
  if (!module) return null;

  const icon = groupIcon[module.group] ?? "◇";

  return (
    <div className="fixed inset-0 z-[9998] bg-slate-950/35 p-4 backdrop-blur-sm" onClick={onClose}>
      <aside
        className="ml-auto flex h-full w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="border-b border-slate-200 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-2xl text-white">{icon}</div>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950">{module.title}</h2>
              <p className="mt-2 text-sm font-bold text-slate-500">{module.subtitle}</p>
            </div>

            <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-black hover:bg-slate-100">
              Cerrar
            </button>
          </div>
        </header>

        <div className="ft-scrollbar flex-1 space-y-5 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-3">
            <StatusBadge value={module.status} tone="emerald" />
            <StatusBadge value={`Riesgo ${module.risk}`} tone={riskTone[module.risk]} />
            <StatusBadge value={module.tag} tone="sky" />
            <StatusBadge value={module.group} tone="violet" />
          </div>

          <p className="text-base font-semibold leading-8 text-slate-600">{module.description}</p>

          <div className="rounded-[1.5rem] bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Items internos sugeridos</p>
            <div className="mt-4 space-y-3">
              {["Registro maestro", "Validaciones obligatorias", "Evidencia y audit trail", "Exportación JSON", "Aprobación QA"].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                  <span>{item}</span>
                  <span className="text-emerald-600">Activo</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="border-t border-slate-200 p-6">
          <ActionButton href={module.href}>Abrir módulo completo</ActionButton>
        </footer>
      </aside>
    </div>
  );
}

export function ModalConfirm({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
        <h3 className="text-2xl font-black text-slate-950">{title}</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <ActionButton variant="secondary" onClick={onCancel}>Cancelar</ActionButton>
          <ActionButton variant="danger" onClick={onConfirm}>Confirmar</ActionButton>
        </div>
      </section>
    </div>
  );
}
