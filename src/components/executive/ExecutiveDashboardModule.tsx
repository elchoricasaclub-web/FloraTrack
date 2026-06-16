"use client";

export default function ExecutiveDashboardModule() {
  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Dashboard Ejecutivo</h2>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Vista estratégica de cumplimiento GACP, GMP, operaciones, calidad,
            laboratorio, inventario, riesgos, auditorías e indicadores críticos
            para toma de decisiones gerenciales.
          </p>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
          + Generar Informe
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Cumplimiento global</div>
          <div className="text-3xl font-bold text-slate-800">0%</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Riesgos críticos</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">CAPA abiertas</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Auditorías pendientes</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border rounded-xl p-5">
          <h3 className="font-bold text-slate-700">Estado GACP</h3>
          <p className="text-slate-500 text-sm mt-2">
            Control agrícola, predios, cultivos, propagación, cosecha y registros.
          </p>
          <div className="text-3xl font-bold mt-4">0%</div>
        </div>

        <div className="border rounded-xl p-5">
          <h3 className="font-bold text-slate-700">Estado GMP</h3>
          <p className="text-slate-500 text-sm mt-2">
            Control documental, procesos, limpieza, calidad y liberación.
          </p>
          <div className="text-3xl font-bold mt-4">0%</div>
        </div>

        <div className="border rounded-xl p-5">
          <h3 className="font-bold text-slate-700">Estado Regulatorio</h3>
          <p className="text-slate-500 text-sm mt-2">
            Licencias, vencimientos, cupos, permisos y obligaciones críticas.
          </p>
          <div className="text-3xl font-bold mt-4">0%</div>
        </div>
      </div>

      <div className="border rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-2xl font-bold text-slate-700">
          No existen indicadores ejecutivos consolidados
        </h3>
        <p className="text-slate-500 mt-2">
          Cuando existan registros operativos, FloraTrack calculará el estado general de cumplimiento.
        </p>
      </div>
    </section>
  );
}
