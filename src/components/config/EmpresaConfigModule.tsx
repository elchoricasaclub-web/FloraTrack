"use client";

export default function EmpresaConfigModule() {
  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Empresa</h2>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Configuración maestra de la organización, razón social, licencias,
            responsables técnicos, responsables de calidad, sedes, predios,
            alcance regulatorio y parámetros base de operación.
          </p>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
          + Configurar Empresa
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Empresas</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Sedes</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Responsables</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Estado</div>
          <div className="text-3xl font-bold text-slate-800">OK</div>
        </div>
      </div>

      <div className="border rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">🏢</div>
        <h3 className="text-2xl font-bold text-slate-700">
          No existe configuración empresarial registrada
        </h3>
        <p className="text-slate-500 mt-2">
          Registre la empresa, responsables, sedes, predios, licencias y alcance regulatorio.
        </p>
      </div>
    </section>
  );
}
