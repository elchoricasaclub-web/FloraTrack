"use client";

import { useEffect, useState } from "react";

type RecordItem = {
  id: string;
  createdAt: string;
  moduleName: string;
  title: string;
  type: string;
  owner: string;
  status: string;
  priority: string;
  note: string;
};

export default function RecordsCenterPage() {
  const [records, setRecords] = useState<RecordItem[]>([]);

  async function loadRecords() {
    const response = await fetch("/api/universal-records", { cache: "no-store" });
    const data = await response.json();
    setRecords(data.records ?? []);
  }

  useEffect(() => {
    loadRecords();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <section className="rounded-3xl bg-slate-950 p-8 text-white shadow">
        <div className="text-sm font-black uppercase tracking-widest text-green-300">
          FloraTrack System
        </div>

        <h1 className="mt-3 text-6xl font-black">
          Records Center
        </h1>

        <p className="mt-4 text-slate-300">
          Registros creados: {records.length}
        </p>

        <div className="mt-6 flex gap-3">
          <button onClick={loadRecords} className="rounded-2xl bg-green-600 px-6 py-4 font-black text-white">
            Actualizar
          </button>

          <a href="/" className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white">
            Volver
          </a>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-6">
        {records.map((record) => (
          <article key={record.id} className="rounded-3xl border bg-white p-7 shadow-sm">
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              {record.moduleName} · {record.type}
            </div>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              {record.title}
            </h2>

            <p className="mt-3 text-slate-500">
              {record.note}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-bold text-slate-400">Estado</div>
                <div className="mt-1 font-black text-slate-800">{record.status}</div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-bold text-slate-400">Prioridad</div>
                <div className="mt-1 font-black text-slate-800">{record.priority}</div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-bold text-slate-400">Responsable</div>
                <div className="mt-1 font-black text-slate-800">{record.owner}</div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-bold text-slate-400">Fecha</div>
                <div className="mt-1 font-black text-slate-800">
                  {new Date(record.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
