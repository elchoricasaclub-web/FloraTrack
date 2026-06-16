"use client";

export default function RegistrosModule() {
  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Registros
          </h2>

          <p className="text-slate-500 mt-2">
            Control de registros maestros, formatos diligenciados, evidencias,
            bitácoras, trazabilidad documental, responsables, fechas, versiones
            y cumplimiento GACP/GMP.
          </p>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
          + Nuevo Registro
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            Registros creados
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            Pendientes
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            Completados
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            Con desviación
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>
      </div>

      <div className="border rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">
          🗂️
        </div>

        <h3 className="text-2xl font-bold text-slate-700">
          No existen registros creados
        </h3>

        <p className="text-slate-500 mt-2">
          Cree el primer registro para iniciar la captura documental del sistema
          de calidad.
        </p>
      </div>
    </section>
  );
}