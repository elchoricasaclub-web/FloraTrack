export default function TrazabilidadModule() {
  const stats = [
    { label: "Lotes trazados", value: "0" },
    { label: "Eventos", value: "0" },
    { label: "Movimientos", value: "0" },
    { label: "Bloqueos", value: "0" }
  ];

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Trazabilidad Global</h2>
          <p className="text-slate-500 mt-2 max-w-xl">
            Seguimiento integral desde genética, propagación, cultivo, cosecha, muestras, análisis, inventario, producto terminado, COA y liberación comercial.
          </p>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg">
          + Nueva Consulta
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
        <div className="text-6xl mb-4">🔗</div>

        <h3 className="text-2xl font-bold text-slate-700">
          No existen eventos de trazabilidad registrados
        </h3>

        <p className="text-slate-500 mt-3 max-w-md mx-auto">
          Active la trazabilidad para reconstruir la historia completa de cada lote, muestra, insumo o producto.
        </p>
      </div>
    </section>
  );
}
