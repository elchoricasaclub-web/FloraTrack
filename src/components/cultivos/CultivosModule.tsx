"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Cultivo = {
  id: string;
  createdAt: string;
  nombre: string;
  codigo: string;
  area: string;
  genetica: string;
  responsable: string;
  estado: string;
  riesgo: string;
  avance: number;
  evidencia: string;
  nota: string;
};

type CultivoForm = {
  nombre: string;
  codigo: string;
  area: string;
  genetica: string;
  responsable: string;
  estado: string;
  riesgo: string;
  avance: number;
  evidencia: string;
  nota: string;
};

const emptyForm: CultivoForm = {
  nombre: "",
  codigo: "",
  area: "Producción agrícola",
  genetica: "",
  responsable: "Responsable GACP",
  estado: "Borrador",
  riesgo: "Medio",
  avance: 0,
  evidencia: "",
  nota: ""
};

function statusClass(status: string) {
  const value = status.toLowerCase();

  if (value.includes("activo") || value.includes("cerrado")) {
    return "bg-green-100 text-green-700";
  }

  if (value.includes("alerta") || value.includes("crítico") || value.includes("critico")) {
    return "bg-red-100 text-red-700";
  }

  return "bg-amber-100 text-amber-700";
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

function progressClass(value: number) {
  if (value >= 80) return "bg-green-600";
  if (value >= 55) return "bg-amber-500";
  return "bg-red-500";
}

export default function CultivosModule() {
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [selected, setSelected] = useState<Cultivo | null>(null);
  const [form, setForm] = useState<CultivoForm>(emptyForm);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [message, setMessage] = useState("");

  async function loadCultivos() {
    const response = await fetch("/api/cultivos", {
      cache: "no-store"
    });

    const data = await response.json();
    setCultivos(data.records ?? []);
  }

  useEffect(() => {
    loadCultivos();
  }, []);

  const statuses = useMemo(() => {
    return ["Todos", ...Array.from(new Set(cultivos.map((item) => item.estado)))];
  }, [cultivos]);

  const filteredCultivos = useMemo(() => {
    return cultivos.filter((item) => {
      const statusOk = status === "Todos" || item.estado === status;

      const text = `${item.nombre} ${item.codigo} ${item.area} ${item.genetica} ${item.responsable}`.toLowerCase();
      const queryOk = text.includes(query.toLowerCase());

      return statusOk && queryOk;
    });
  }, [cultivos, query, status]);

  async function createCultivo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("/api/cultivos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await response.json();

    if (data.ok) {
      setMessage("Cultivo creado correctamente.");
      setForm(emptyForm);
      setSelected(data.record);
      await loadCultivos();
    }
  }

  async function updateCultivo(item: Cultivo, changes: Partial<Cultivo>) {
    const response = await fetch("/api/cultivos", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: item.id,
        ...changes
      })
    });

    const data = await response.json();

    if (data.ok) {
      const updatedItem = {
        ...item,
        ...changes
      };

      setSelected(updatedItem);
      setMessage("Cultivo actualizado correctamente.");
      await loadCultivos();
    }
  }

  async function saveProgress(item: Cultivo) {
    await fetch("/api/progress-records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        moduleName: "Cultivos",
        itemTitle: item.nombre,
        actionType: "save-progress",
        owner: item.responsable,
        status: "Guardado",
        evidence: item.evidencia,
        note: `Avance guardado para ${item.nombre}. Progreso actual: ${item.avance}%.`
      })
    });

    setMessage("Avance guardado correctamente.");
  }

  async function createCapa(item: Cultivo) {
    await fetch("/api/progress-records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        moduleName: "CAPA / Cultivos",
        itemTitle: `CAPA para ${item.nombre}`,
        actionType: "capa",
        owner: item.responsable,
        status: "Abierto",
        evidence: item.evidencia,
        note: `CAPA creada desde Cultivos por riesgo ${item.riesgo}.`
      })
    });

    setMessage("CAPA creada y registrada.");
  }

  function exportEvidence(item: Cultivo) {
    const blob = new Blob([JSON.stringify(item, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${item.codigo}-evidencia.json`;
    link.click();

    URL.revokeObjectURL(url);
    setMessage("Evidencia exportada.");
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow">
        <div className="text-sm font-black uppercase tracking-widest text-green-600">
          Operativo · GACP
        </div>

        <div className="mt-2 flex items-start justify-between gap-6">
          <div>
            <h2 className="text-5xl font-black text-slate-900">
              Cultivos
            </h2>

            <p className="mt-3 max-w-5xl text-slate-500">
              Módulo funcional para crear, abrir, actualizar, guardar avances, exportar evidencia y crear CAPA de cultivos GACP.
            </p>
          </div>

          <button
            type="button"
            onClick={loadCultivos}
            className="rounded-2xl border px-6 py-4 font-black text-slate-700 hover:bg-slate-50"
          >
            Actualizar
          </button>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl bg-green-50 p-5 font-black text-green-700">
            {message}
          </div>
        )}

        <div className="mt-8 grid grid-cols-4 gap-4">
          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-500">Registros</div>
            <div className="mt-2 text-5xl font-black text-slate-900">{cultivos.length}</div>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-500">Activos</div>
            <div className="mt-2 text-5xl font-black text-green-600">
              {cultivos.filter((item) => item.estado === "Activo").length}
            </div>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-500">Alertas</div>
            <div className="mt-2 text-5xl font-black text-red-600">
              {cultivos.filter((item) => item.estado === "Alerta").length}
            </div>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-5">
            <div className="text-sm font-bold text-slate-500">Promedio avance</div>
            <div className="mt-2 text-5xl font-black text-slate-900">
              {Math.round(cultivos.reduce((sum, item) => sum + Number(item.avance || 0), 0) / Math.max(1, cultivos.length))}%
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={createCultivo} className="rounded-3xl bg-white p-8 shadow">
        <h3 className="text-3xl font-black text-slate-900">
          Crear cultivo real
        </h3>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <input value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} placeholder="Nombre del cultivo" className="rounded-2xl border px-5 py-4 font-semibold" />
          <input value={form.codigo} onChange={(event) => setForm({ ...form, codigo: event.target.value })} placeholder="Código" className="rounded-2xl border px-5 py-4 font-semibold" />
          <input value={form.genetica} onChange={(event) => setForm({ ...form, genetica: event.target.value })} placeholder="Genética" className="rounded-2xl border px-5 py-4 font-semibold" />
          <input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} placeholder="Área" className="rounded-2xl border px-5 py-4 font-semibold" />
          <input value={form.responsable} onChange={(event) => setForm({ ...form, responsable: event.target.value })} placeholder="Responsable" className="rounded-2xl border px-5 py-4 font-semibold" />

          <select value={form.estado} onChange={(event) => setForm({ ...form, estado: event.target.value })} className="rounded-2xl border px-5 py-4 font-semibold">
            <option>Borrador</option>
            <option>Activo</option>
            <option>En proceso</option>
            <option>Alerta</option>
            <option>Cerrado</option>
          </select>

          <select value={form.riesgo} onChange={(event) => setForm({ ...form, riesgo: event.target.value })} className="rounded-2xl border px-5 py-4 font-semibold">
            <option>Bajo</option>
            <option>Medio</option>
            <option>Alto</option>
            <option>Crítico</option>
          </select>

          <input type="number" value={form.avance} onChange={(event) => setForm({ ...form, avance: Number(event.target.value) })} placeholder="Avance %" className="rounded-2xl border px-5 py-4 font-semibold" />
          <input value={form.evidencia} onChange={(event) => setForm({ ...form, evidencia: event.target.value })} placeholder="Evidencia" className="rounded-2xl border px-5 py-4 font-semibold" />
        </div>

        <textarea value={form.nota} onChange={(event) => setForm({ ...form, nota: event.target.value })} placeholder="Nota técnica del cultivo" className="mt-4 min-h-[120px] w-full rounded-2xl border px-5 py-4 font-semibold" />

        <button type="submit" className="mt-6 rounded-2xl bg-green-600 px-7 py-4 font-black text-white hover:bg-green-700">
          Crear cultivo real
        </button>
      </form>

      <div className="rounded-3xl bg-white p-6 shadow">
        <div className="grid grid-cols-12 gap-4">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cultivo..." className="col-span-8 rounded-2xl border px-5 py-4 font-semibold" />

          <select value={status} onChange={(event) => setStatus(event.target.value)} className="col-span-4 rounded-2xl border px-5 py-4 font-semibold">
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {filteredCultivos.map((item) => (
          <article key={item.id} className="rounded-3xl border bg-white p-7 shadow-sm">
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              Cultivos · {item.area}
            </div>

            <div className="mt-2 flex items-start justify-between gap-5">
              <div>
                <h3 className="text-3xl font-black text-slate-900">{item.nombre}</h3>
                <p className="mt-2 text-slate-500">{item.nota}</p>
              </div>

              <div className="rounded-2xl bg-slate-950 px-5 py-4 text-right text-white">
                <div className="text-xs text-slate-300">Código</div>
                <div className="text-xl font-black">{item.codigo}</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm font-bold text-slate-500">
                <span>Avance</span>
                <span>{item.avance}%</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${progressClass(item.avance)}`} style={{ width: `${Math.max(0, Math.min(100, item.avance))}%` }} />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className={`rounded-full px-4 py-2 text-xs font-black ${riskClass(item.riesgo)}`}>{item.riesgo}</span>
              <span className={`rounded-full px-4 py-2 text-xs font-black ${statusClass(item.estado)}`}>{item.estado}</span>

              <button type="button" onClick={() => setSelected(item)} className="rounded-full bg-green-600 px-4 py-2 text-xs font-black text-white">
                Abrir cultivo
              </button>

              <button type="button" onClick={() => exportEvidence(item)} className="rounded-full border px-4 py-2 text-xs font-black text-slate-700">
                Exportar evidencia
              </button>

              <button type="button" onClick={() => createCapa(item)} className="rounded-full border px-4 py-2 text-xs font-black text-red-700">
                Crear CAPA
              </button>
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[9998] flex justify-end bg-slate-950/40">
          <aside className="h-full w-full max-w-3xl overflow-y-auto bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-green-600">
                  Cultivos · Registro real
                </div>

                <h2 className="mt-2 text-4xl font-black text-slate-900">
                  {selected.nombre}
                </h2>

                <p className="mt-3 text-slate-500">
                  {selected.nota}
                </p>
              </div>

              <button type="button" onClick={() => setSelected(null)} className="rounded-2xl border px-4 py-3 font-black text-slate-700">
                Cerrar
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border bg-slate-50 p-5">
                <div className="text-xs font-bold text-slate-400">Código</div>
                <div className="mt-1 text-xl font-black text-slate-900">{selected.codigo}</div>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-5">
                <div className="text-xs font-bold text-slate-400">Área</div>
                <div className="mt-1 text-xl font-black text-slate-900">{selected.area}</div>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-5">
                <div className="text-xs font-bold text-slate-400">Genética</div>
                <div className="mt-1 text-xl font-black text-slate-900">{selected.genetica}</div>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-5">
                <div className="text-xs font-bold text-slate-400">Responsable</div>
                <div className="mt-1 text-xl font-black text-slate-900">{selected.responsable}</div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-4 gap-3">
              <button type="button" onClick={() => updateCultivo(selected, { avance: Math.min(100, Number(selected.avance) + 10) })} className="rounded-2xl bg-slate-950 px-5 py-4 font-black text-white">
                +10% avance
              </button>

              <button type="button" onClick={() => updateCultivo(selected, { estado: "Activo" })} className="rounded-2xl border px-5 py-4 font-black text-green-700">
                Marcar activo
              </button>

              <button type="button" onClick={() => updateCultivo(selected, { estado: "Alerta", riesgo: "Crítico" })} className="rounded-2xl border px-5 py-4 font-black text-red-700">
                Marcar alerta
              </button>

              <button type="button" onClick={() => saveProgress(selected)} className="rounded-2xl bg-green-600 px-5 py-4 font-black text-white">
                Guardar avance
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => exportEvidence(selected)} className="rounded-2xl border px-5 py-4 font-black text-slate-700">
                Exportar evidencia
              </button>

              <button type="button" onClick={() => createCapa(selected)} className="rounded-2xl border px-5 py-4 font-black text-red-700">
                Crear CAPA
              </button>

              <a href="/progress-records" className="rounded-2xl border px-5 py-4 font-black text-slate-700">
                Ver avances
              </a>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
