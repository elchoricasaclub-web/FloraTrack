"use client";

export default function InsumosModule() {
  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Insumos
          </h2>

          <p className="text-slate-500 mt-2">
            Control de insumos agrícolas, reactivos, materiales de laboratorio,
            consumibles, lotes, vencimientos, stock, recepción, liberación y
            trazabilidad para procesos GACP y GMP.
          </p>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
          + Nuevo Insumo
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            Insumos registrados
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            Disponibles
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            Bajo stock
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            Vencidos
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>
      </div>

      <div className="border rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">
          🧪
        </div>

        <h3 className="text-2xl font-bold text-slate-700">
          No existen insumos registrados
        </h3>

        <p className="text-slate-500 mt-2">
          Registre el primer insumo para iniciar el control de inventario.
        </p>
      </div>
    </section>
  );
}