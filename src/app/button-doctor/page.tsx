"use client";

import { useEffect, useState } from "react";

type ButtonAction = {
  id: string;
  createdAt: string;
  moduleName: string;
  buttonText: string;
  actionType: string;
  pageUrl: string;
  status: string;
};

export default function ButtonDoctorPage() {
  const [records, setRecords] = useState<ButtonAction[]>([]);

  async function loadRecords() {
    const response = await fetch("/api/button-actions", { cache: "no-store" });
    const data = await response.json();
    setRecords(data.records ?? []);
  }

  useEffect(() => {
    loadRecords();
  }, []);

  const modules = Array.from(new Set(records.map((record) => record.moduleName)));
  const saveButtons = records.filter((record) => record.actionType === "save-progress").length;
  const openButtons = records.filter((record) => record.actionType === "open").length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <section className="rounded-3xl bg-white p-8 shadow">
        <div className="text-sm font-black uppercase tracking-widest text-green-600">
          FloraTrack QA
        </div>

        <h1 className="mt-3 text-6xl font-black text-slate-900">
          Button Doctor
        </h1>

        <p className="mt-4 max-w-5xl text-slate-500">
          Panel para revisar qué botones han sido presionados, en qué módulo, y qué tipo de acción generan.
        </p>

        <button
          onClick={loadRecords}
          className="mt-6 rounded-2xl bg-green-600 px-6 py-4 font-black text-white"
        >
          Reanalizar botones
        </button>
      </section>

      <section className="mt-8 grid grid-cols-4 gap-4">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-sm font-bold text-slate-500">Botones probados</div>
          <div className="mt-2 text-5xl font-black text-slate-900">{records.length}</div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-sm font-bold text-slate-500">Módulos tocados</div>
          <div className="mt-2 text-5xl font-black text-green-600">{modules.length}</div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-sm font-bold text-slate-500">Guardar avance</div>
          <div className="mt-2 text-5xl font-black text-amber-600">{saveButtons}</div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-sm font-bold text-slate-500">Abrir / Ver</div>
          <div className="mt-2 text-5xl font-black text-blue-600">{openButtons}</div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-6">
        {records.map((record) => (
          <article key={record.id} className="rounded-3xl border bg-white p-7 shadow-sm">
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              {record.moduleName}
            </div>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              {record.buttonText}
            </h2>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <div className="font-black text-slate-900">{record.actionType}</div>
              <div className="mt-1 text-sm text-slate-500">{record.status}</div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
