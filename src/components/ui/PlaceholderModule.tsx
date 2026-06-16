"use client";

type PlaceholderModuleProps = {
  title?: string;
};

export default function PlaceholderModule({ title = "Módulo Enterprise" }: PlaceholderModuleProps) {
  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="border border-dashed border-slate-300 rounded-2xl p-10 bg-slate-50">
        <div className="text-sm font-bold text-green-600 mb-2">
          FloraTrack Enterprise
        </div>

        <h2 className="text-4xl font-black text-slate-800">
          {title}
        </h2>

        <p className="text-slate-500 mt-4 max-w-3xl leading-relaxed">
          Este módulo ya está conectado al menú central y queda reservado para
          especialización técnica. El Auto Repair lo creó para evitar errores de
          importación, rutas huérfanas o pantallas vacías mientras seguimos
          desarrollando el sistema GACP/GMP/GxP.
        </p>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white border rounded-xl p-5">
            <div className="text-xs text-slate-500">Estado</div>
            <div className="text-2xl font-black text-green-600 mt-2">
              Conectado
            </div>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <div className="text-xs text-slate-500">Tipo</div>
            <div className="text-2xl font-black text-slate-800 mt-2">
              Placeholder seguro
            </div>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <div className="text-xs text-slate-500">Siguiente paso</div>
            <div className="text-2xl font-black text-slate-800 mt-2">
              Especializar
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
