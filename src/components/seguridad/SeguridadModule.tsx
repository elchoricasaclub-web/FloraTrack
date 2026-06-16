"use client";

export default function SeguridadModule() {
  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Seguridad</h2>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Gestión de roles, permisos, accesos críticos, autenticación,
            trazabilidad de sesiones, auditoría de usuarios y control de privilegios.
          </p>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
          + Nueva Política
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Usuarios activos</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Roles</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Alertas</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Cumplimiento</div>
          <div className="text-3xl font-bold text-slate-800">0%</div>
        </div>
      </div>

      <div className="border rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">🔐</div>
        <h3 className="text-2xl font-bold text-slate-700">
          No existen políticas de seguridad registradas
        </h3>
        <p className="text-slate-500 mt-2">
          Configure accesos, permisos, bitácoras, autenticación y control de privilegios.
        </p>
      </div>
    </section>
  );
}
