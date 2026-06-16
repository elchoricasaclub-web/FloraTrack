"use client";

export default function IntegracionesModule() {
  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Integraciones</h2>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Conexión con laboratorios, ERP, sensores IoT, mapas GIS, firmas electrónicas,
            trazabilidad, reportes regulatorios, inventario y servicios externos.
          </p>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
          + Nueva Integración
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Integraciones</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Activas</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Pendientes</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Errores</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>
      </div>

      <div className="border rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">🔗</div>
        <h3 className="text-2xl font-bold text-slate-700">
          No existen integraciones registradas
        </h3>
        <p className="text-slate-500 mt-2">
          Conecte FloraTrack con laboratorios, ERP, sensores, GIS, reportes e IA.
        </p>
      </div>
    </section>
  );
}
