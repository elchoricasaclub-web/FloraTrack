"use client";

import { useState } from "react";

const links = [
  { label: "Dashboard", href: "/" },
  { label: "Nuevo Registro", href: "/new-record" },
  { label: "Audit Trail", href: "/audit-trail" },
  { label: "Registros", href: "/progress-records" },
  { label: "Cultivos", href: "/cultivos" },
  { label: "Propagación", href: "/propagacion" },
  { label: "Cosecha", href: "/cosecha" },
  { label: "Genéticas", href: "/geneticas" },
  { label: "Predios", href: "/predios" }
];

export default function AppStatusDock() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-2xl"
      >
        Estado App
      </button>

      {open && (
        <section className="fixed bottom-5 left-5 z-50 w-[360px] rounded-[2rem] border bg-white p-6 text-slate-950 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-green-600">
                FloraTrack System
              </div>
              <h2 className="mt-2 text-3xl font-black">Estado App</h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                Ventana informativa. No guarda datos. No duplica acciones.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border px-4 py-2 text-sm font-black"
            >
              Cerrar
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-green-50 p-4">
              <div className="text-xs font-black text-green-700">Servidor</div>
              <div className="mt-1 text-xl font-black text-green-700">Activo</div>
            </div>

            <div className="rounded-2xl bg-green-50 p-4">
              <div className="text-xs font-black text-green-700">Validación</div>
              <div className="mt-1 text-xl font-black text-green-700">ON</div>
            </div>

            <div className="rounded-2xl bg-slate-100 p-4">
              <div className="text-xs font-black text-slate-500">Modo</div>
              <div className="mt-1 text-xl font-black">MVP</div>
            </div>

            <div className="rounded-2xl bg-slate-100 p-4">
              <div className="text-xs font-black text-slate-500">App</div>
              <div className="mt-1 text-xl font-black">FloraTrack</div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-2xl border px-4 py-3 text-center text-sm font-black hover:bg-slate-950 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
