export default function AuditTrailPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-950">
      <section className="rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl">
        <div className="text-xs font-black uppercase tracking-widest text-green-400">
          FloraTrack · Audit Trail
        </div>

        <h1 className="mt-4 text-7xl font-black">Audit Trail</h1>

        <p className="mt-4 max-w-4xl text-slate-200">
          Trazabilidad de acciones, navegación, registros y evidencias funcionales de la plataforma.
        </p>

        <div className="mt-8 flex gap-3">
          <a href="/" className="rounded-2xl bg-green-600 px-6 py-4 font-black text-white">
            Volver al Dashboard
          </a>

          <a href="/progress-records" className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white">
            Ver avances
          </a>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border bg-white p-8">
        <h2 className="text-3xl font-black">Eventos registrados</h2>

        <p className="mt-3 text-slate-500">
          Módulo activo. En la siguiente fase conectaremos este historial a todos los botones y formularios reales.
        </p>
      </section>
    </main>
  );
}
