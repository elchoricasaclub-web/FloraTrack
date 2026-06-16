export default function SaveProgressTestPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow">
        <div className="text-sm font-black uppercase tracking-widest text-green-600">
          FloraTrack Test
        </div>

        <h1 className="mt-3 text-5xl font-black text-slate-900">
          Prueba Guardar Avance
        </h1>

        <p className="mt-4 text-slate-500">
          Este botón usa formulario directo. Al guardar, debe enviarte automáticamente a Registros de Avance.
        </p>

        <form action="/api/progress-records" method="post" className="mt-8">
          <input type="hidden" name="moduleName" value="Prueba directa" />
          <input type="hidden" name="itemTitle" value="Botón Guardar Avance" />
          <input type="hidden" name="actionType" value="save-progress-form" />
          <input type="hidden" name="owner" value="Usuario actual" />
          <input type="hidden" name="status" value="Guardado" />
          <input type="hidden" name="evidence" value="Prueba de funcionamiento por formulario" />
          <input type="hidden" name="note" value="Registro creado desde botón de formulario directo." />

          <button
            type="submit"
            className="rounded-2xl bg-green-600 px-8 py-5 text-xl font-black text-white hover:bg-green-700"
          >
            Guardar avance de prueba
          </button>
        </form>

        <a
          href="/progress-records"
          className="mt-6 inline-block rounded-2xl border px-6 py-4 font-black text-slate-700"
        >
          Abrir Registros de Avance
        </a>
      </section>
    </main>
  );
}
