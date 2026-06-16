"use client";

export default function BackupsModule() {
  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Backups</h2>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Respaldo de información crítica, restauración, exportación documental,
            continuidad operativa, evidencia regulatoria y protección de datos.
          </p>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
          + Crear Backup
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Backups</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Automáticos</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Restauraciones</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Estado</div>
          <div className="text-3xl font-bold text-slate-800">OK</div>
        </div>
      </div>

      <div className="border rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">💾</div>
        <h3 className="text-2xl font-bold text-slate-700">
          No existen backups registrados
        </h3>
        <p className="text-slate-500 mt-2">
          Configure respaldos automáticos, restauración, exportación y conservación documental.
        </p>
      </div>
    </section>
  );
}
