"use client";

export default function ProductosModule() {
  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Productos
          </h2>

          <p className="text-slate-500 mt-2">
            Gestión de productos terminados, semielaborados, lotes,
            presentaciones comerciales, liberación de calidad, trazabilidad,
            stock, vencimientos y estado regulatorio para procesos GACP y GMP.
          </p>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
          + Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            Productos registrados
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            En cuarentena
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            Liberados
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            Bloqueados
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>
      </div>

      <div className="border rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">
          📦
        </div>

        <h3 className="text-2xl font-bold text-slate-700">
          No existen productos registrados
        </h3>

        <p className="text-slate-500 mt-2">
          Registre el primer producto para iniciar el control de inventario,
          liberación de calidad y trazabilidad.
        </p>
      </div>
    </section>
  );
}