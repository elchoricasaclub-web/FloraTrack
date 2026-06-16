export default function AlertasModule() {
  const stats = [
    { label: "Alertas activas", value: "0" },
    { label: "Críticas", value: "0" },
    { label: "Pendientes", value: "0" },
    { label: "Atendidas", value: "0" }
  ];

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Alertas</h2>
          <p className="text-slate-500 mt-2 max-w-xl">
            Motor de alertas para vencimientos, desviaciones, riesgos críticos, documentos pendientes, análisis de laboratorio, licencias, cupos y actividades regulatorias.
          </p>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg">
          + Nueva Alerta
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((item) => (
          <div key={item.label} className="border rounded-xl p-4 bg-white">
            <div className="text-sm text-slate-500">{item.label}</div>
            <div className="text-3xl font-bold text-slate-800">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="border rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">🔔</div>

        <h3 className="text-2xl font-bold text-slate-700">
          No existen alertas configuradas
        </h3>

        <p className="text-slate-500 mt-3 max-w-md mx-auto">
          Cree alertas inteligentes para anticipar incumplimientos, vencimientos y eventos críticos.
        </p>
      </div>
    </section>
  );
}
