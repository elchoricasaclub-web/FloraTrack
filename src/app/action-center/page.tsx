"use client";

import { useEffect, useState } from "react";

type ActionRecord = {
  id: string;
  createdAt: string;
  label: string;
  moduleName: string;
  actionType: string;
  route?: string;
  note?: string;
};

export default function ActionCenterPage() {
  const [actions, setActions] = useState<ActionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadActions() {
    setLoading(true);

    try {
      const response = await fetch("/api/button-actions", {
        cache: "no-store"
      });

      const data = await response.json();

      if (data.ok) {
        setActions(data.actions || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActions();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <section className="rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl">
        <div className="text-xs font-black uppercase tracking-widest text-green-400">
          FloraTrack · Action Center
        </div>

        <h1 className="mt-3 text-6xl font-black">
          Centro de Acciones
        </h1>

        <p className="mt-4 max-w-4xl text-slate-300">
          Panel para revisar botones activados, navegación, exportaciones y acciones conectadas dentro de la app.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={loadActions}
            className="rounded-2xl bg-green-600 px-6 py-4 font-black text-white"
          >
            Actualizar
          </button>

          <a href="/" className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white">
            Volver al Dashboard
          </a>

          <a href="/new-record" className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white">
            Nuevo Registro
          </a>

          <a href="/progress-records" className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white">
            Avances
          </a>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-4 gap-4">
        <article className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-xs font-black uppercase text-slate-400">Acciones registradas</div>
          <div className="mt-2 text-4xl font-black text-slate-900">{actions.length}</div>
        </article>

        <article className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-xs font-black uppercase text-slate-400">Navegación</div>
          <div className="mt-2 text-4xl font-black text-green-600">
            {actions.filter((action) => action.actionType === "navigation").length}
          </div>
        </article>

        <article className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-xs font-black uppercase text-slate-400">Exportaciones</div>
          <div className="mt-2 text-4xl font-black text-blue-600">
            {actions.filter((action) => action.actionType === "export").length}
          </div>
        </article>

        <article className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-xs font-black uppercase text-slate-400">Estado</div>
          <div className="mt-2 text-4xl font-black text-green-600">Activo</div>
        </article>
      </section>

      <section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              Historial
            </div>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Últimas acciones de botones
            </h2>
          </div>

          <button
            type="button"
            onClick={loadActions}
            className="rounded-2xl border px-5 py-3 font-black text-slate-700"
          >
            Actualizar lista
          </button>
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl bg-slate-50 p-6 font-bold text-slate-500">
            Cargando acciones...
          </div>
        ) : actions.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-slate-50 p-6 font-bold text-slate-500">
            Todavía no hay acciones registradas.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {actions.map((action) => (
              <article key={action.id} className="rounded-3xl border p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {action.moduleName}
                    </div>

                    <h3 className="mt-1 text-2xl font-black text-slate-900">
                      {action.label}
                    </h3>

                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      {action.note || "Acción registrada."}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">
                    {action.actionType}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="font-black text-slate-400">ID</div>
                    <div className="mt-1 font-bold text-slate-700">{action.id}</div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="font-black text-slate-400">Fecha</div>
                    <div className="mt-1 font-bold text-slate-700">
                      {new Date(action.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="font-black text-slate-400">Ruta</div>
                    <div className="mt-1 break-all font-bold text-slate-700">
                      {action.route || "Sin ruta"}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
