"use client";

export default function SOPModule() {
  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            SOP
          </h2>

          <p className="text-slate-500 mt-2">
            Gestión de Procedimientos Operativos Estándar para actividades GACP,
            GMP, calidad, laboratorio, cultivo, cosecha, limpieza, trazabilidad,
            seguridad y cumplimiento regulatorio.
          </p>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
          + Nuevo SOP
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            SOP registrados
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            En revisión
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            Vigentes
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">
            Obsoletos
          </div>
          <div className="text-3xl font-bold text-slate-800">
            0
          </div>
        </div>
      </div>

      <div className="border rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">
          📘
        </div>

        <h3 className="text-2xl font-bold text-slate-700">
          No existen SOP registrados
        </h3>

        <p className="text-slate-500 mt-2">
          Cree el primer procedimiento operativo estándar para iniciar el sistema
          documental de cumplimiento.
        </p>
      </div>
    </section>
  );
}