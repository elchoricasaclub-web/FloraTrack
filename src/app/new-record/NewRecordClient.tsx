"use client";

import { useSearchParams } from "next/navigation";

export function NewRecordContent() {
  const searchParams = useSearchParams();
  const hasValidationError = searchParams.get("validation") === "1";
  const fields = (searchParams.get("fields") || "")
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      {hasValidationError && (
        <div className="fixed right-6 top-24 z-[100000] w-[440px] rounded-3xl border border-red-200 bg-white p-6 shadow-2xl">
          <div className="text-xs font-black uppercase tracking-widest text-red-600">
            Validación del servidor
          </div>

          <h3 className="mt-2 text-2xl font-black text-slate-900">
            No se guardó el registro
          </h3>

          <p className="mt-2 text-sm font-semibold text-slate-600">
            El sistema bloqueó el guardado porque falta información obligatoria.
          </p>

          <ul className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
            {fields.map((field) => (
              <li key={field}>• {field}</li>
            ))}
          </ul>
        </div>
      )}

      <section className="mx-auto max-w-5xl rounded-3xl bg-white p-10 shadow">
        <div className="text-sm font-black uppercase tracking-widest text-green-600">
          FloraTrack · Registro real
        </div>

        <h1 className="mt-3 text-6xl font-black text-slate-900">
          Nuevo Registro
        </h1>

        <p className="mt-4 max-w-4xl text-slate-500">
          Formulario funcional conectado al botón Nuevo Registro del Dashboard. No permite guardar registros vacíos o genéricos.
        </p>

        <form action="/api/universal-records" method="post" className="mt-8 space-y-5">
          <input type="hidden" name="moduleName" value="Dashboard" />

          <div>
            <label className="text-sm font-black text-slate-500">Título</label>
            <input
              name="title"
              placeholder="Ejemplo: Registro inspección área propagación"
              required
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-black text-slate-500">Tipo</label>
              <select name="type" required defaultValue="" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold">
                <option value="">Seleccione tipo</option>
                <option>Registro operativo</option>
                <option>Evidencia GACP</option>
                <option>Acción correctiva CAPA</option>
                <option>Documento SOP</option>
                <option>Auditoría</option>
                <option>Calidad</option>
                <option>Regulatorio</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-black text-slate-500">Prioridad</label>
              <select name="priority" required defaultValue="" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold">
                <option value="">Seleccione prioridad</option>
                <option>Baja</option>
                <option>Media</option>
                <option>Alta</option>
                <option>Crítica</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-black text-slate-500">Estado</label>
              <select name="status" required defaultValue="" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold">
                <option value="">Seleccione estado</option>
                <option>Creado</option>
                <option>En revisión</option>
                <option>En ejecución</option>
                <option>Cerrado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Responsable</label>
            <input
              name="owner"
              placeholder="Nombre del responsable"
              required
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Nota</label>
            <textarea
              name="note"
              placeholder="Describe claramente el registro, evidencia, actividad o hallazgo."
              required
              className="mt-2 min-h-[140px] w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-green-600 px-7 py-4 font-black text-white"
            >
              Guardar nuevo registro
            </button>

            <a
              href="/records-center"
              className="rounded-2xl border px-7 py-4 font-black text-slate-700"
            >
              Ver registros
            </a>

            <a
              href="/"
              className="rounded-2xl border px-7 py-4 font-black text-slate-700"
            >
              Volver al Dashboard
            </a>
          </div>
        </form>
      </section>
    </main>
  );
}

export function NewRecordFallback() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <section className="mx-auto max-w-5xl rounded-3xl bg-white p-10 shadow">
        <div className="text-sm font-black uppercase tracking-widest text-green-600">FloraTrack</div>
        <h1 className="mt-3 text-5xl font-black text-slate-900">Cargando nuevo registro</h1>
        <p className="mt-4 text-slate-500">Preparando validaciones y parametros de la ruta.</p>
      </section>
    </main>
  );
}
