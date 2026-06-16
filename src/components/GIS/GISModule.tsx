export default function GISModule() {
  return (
    <section className="bg-white rounded-2xl shadow p-8">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            GIS
          </h2>

          <p className="text-slate-500">
            Sistema geográfico de predios y cultivos.
          </p>
        </div>

        <button className="bg-green-700 text-white px-5 py-3 rounded-xl hover:bg-green-600">
          + Nuevo Mapa
        </button>

      </div>

      <div className="border rounded-2xl p-10 text-center bg-slate-50">

        <p className="text-6xl mb-4">
          🗺️
        </p>

        <h3 className="text-xl font-bold text-slate-700">
          No existen mapas registrados
        </h3>

        <p className="text-slate-500">
          Cree el primer mapa GIS para comenzar.
        </p>

      </div>

    </section>
  );
}