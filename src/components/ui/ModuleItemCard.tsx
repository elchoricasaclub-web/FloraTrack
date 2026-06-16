type ModuleItemCardProps = {
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
  actionLabel?: string;
  flow?: string[];
  variant?: string;
};

function statusClass(status: string) {
  const value = status.toLowerCase();

  if (value.includes("activo") || value.includes("aprobado") || value.includes("vigente") || value.includes("estable")) {
    return "bg-green-100 text-green-700 border-green-200";
  }

  if (value.includes("pendiente") || value.includes("proceso") || value.includes("revisión") || value.includes("monitoreo")) {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  if (value.includes("crítico") || value.includes("bloqueado") || value.includes("cuarentena") || value.includes("alerta")) {
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

function progressClass(progress: number) {
  if (progress >= 80) return "bg-green-600";
  if (progress >= 55) return "bg-amber-500";
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

export default function ModuleItemCard({
  title,
  moduleName,
  area,
  metric,
  status,
  priority,
  owner,
  evidence,
  description,
  progress,
  actionLabel = "Abrir registro",
  flow = [],
  variant = "executive",
}: ModuleItemCardProps) {
  if (variant === "audit") {
    return (
      <div className="rounded-3xl border bg-slate-950 p-7 text-white shadow-sm">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-300">
              Audit Ready · {moduleName} · {area}
            </div>

            <h3 className="mt-2 text-3xl font-black">{title}</h3>

            <p className="mt-3 text-slate-300">{description}</p>
          </div>

          <div className="rounded-2xl bg-white px-5 py-4 text-right text-slate-950">
            <div className="text-xs text-slate-500">Métrica</div>
            <div className="text-lg font-black">{metric}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-900 p-4">
            <div className="text-xs text-slate-400">Responsable</div>
            <div className="mt-1 font-black">{owner}</div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-4">
            <div className="text-xs text-slate-400">Evidencia</div>
            <div className="mt-1 font-black">{evidence}</div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-4">
            <div className="text-xs text-slate-400">Estado</div>
            <div className="mt-1 font-black">{status}</div>
          </div>
        </div>

        <div className="mt-6">
          <ProgressBar value={progress} />
        </div>
      </div>
    );
  }

  if (variant === "timeline") {
    return (
      <div className="rounded-3xl border bg-white p-7 shadow-sm">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              Flujo de proceso · {moduleName}
            </div>

            <h3 className="mt-2 text-3xl font-black text-slate-900">{title}</h3>

            <p className="mt-3 text-slate-500">{description}</p>
          </div>

          <span className={`h-fit rounded-full border px-4 py-2 text-xs font-black ${statusClass(status)}`}>
            {status}
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

        <button className="mt-6 rounded-xl bg-green-600 px-5 py-3 font-black text-white">
          {actionLabel}
        </button>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black text-green-600">{area}</div>
            <h3 className="mt-1 text-xl font-black text-slate-900">{title}</h3>
          </div>

          <div className="rounded-xl bg-green-50 px-4 py-3 font-black text-green-700">
            {metric}
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-500">{description}</p>

        <div className="mt-4">
          <ProgressBar value={progress} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(status)}`}>
            {status}
          </span>

          <span className="text-xs font-bold text-slate-400">{owner}</span>
        </div>
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
              {moduleName} · {area}
            </div>

            <h3 className="mt-2 text-4xl font-black text-slate-900">{title}</h3>

            <p className="mt-4 max-w-4xl text-slate-500">{description}</p>
          </div>

          <div className="rounded-2xl bg-slate-950 px-6 py-5 text-right text-white">
            <div className="text-xs text-slate-300">Métrica</div>
            <div className="text-2xl font-black">{metric}</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm font-bold text-slate-500">
            <span>Avance</span>
            <span>{progress}%</span>
          </div>

          <ProgressBar value={progress} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">Responsable</div>
            <div className="mt-1 font-black text-slate-800">{owner}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">Evidencia</div>
            <div className="mt-1 font-black text-slate-800">{evidence}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-bold text-slate-400">Estado</div>
            <div className="mt-1 font-black text-slate-800">{status}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className={`rounded-full px-4 py-2 text-xs font-black ${priorityClass(priority)}`}>
            {priority}
          </span>

          <span className={`rounded-full border px-4 py-2 text-xs font-black ${statusClass(status)}`}>
            {status}
          </span>

          <button className="rounded-full bg-green-600 px-4 py-2 text-xs font-black text-white">
            {actionLabel}
          </button>

          <button className="rounded-full border px-4 py-2 text-xs font-black text-slate-700">
            Ver evidencia
          </button>

          <button className="rounded-full border px-4 py-2 text-xs font-black text-slate-700">
            Audit trail
          </button>
        </div>
      </div>
    </div>
  );
}
