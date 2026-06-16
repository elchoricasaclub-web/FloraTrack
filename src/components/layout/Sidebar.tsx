type SidebarProps = {
  activeModule: string;
  setActiveModule: (module: string) => void;
};

const menu = [
  { label: "Dashboard", type: "item" },

  { label: "EMPRESAS", type: "section" },
  { label: "Empresas", type: "item" },
  { label: "Usuarios", type: "item" },
  { label: "Roles", type: "item" },

  { label: "OPERACIONES", type: "section" },
  { label: "Predios", type: "item" },
  { label: "GIS", type: "item" },
  { label: "Cultivos", type: "item" },
  { label: "Genéticas", type: "item" },
  { label: "Propagación", type: "item" },
  { label: "Cosecha", type: "item" },

  { label: "CALIDAD", type: "section" },
  { label: "GACP", type: "item" },
  { label: "GMP", type: "item" },
  { label: "Auditorías", type: "item" },
  { label: "CAPA", type: "item" },
  { label: "Riesgos", type: "item" },

  { label: "LABORATORIO", type: "section" },
  { label: "Muestras", type: "item" },
  { label: "Análisis", type: "item" },
  { label: "COA", type: "item" },

  { label: "INVENTARIO", type: "section" },
  { label: "Materias Primas", type: "item" },
  { label: "Insumos", type: "item" },
  { label: "Productos", type: "item" },

  { label: "DOCUMENTOS", type: "section" },
  { label: "SOP", type: "item" },
  { label: "Registros", type: "item" },
  { label: "Firmas", type: "item" },

  { label: "INTELIGENCIA ARTIFICIAL", type: "section" },
  { label: "Auditor IA", type: "item" },
  { label: "SOP IA", type: "item" },
  { label: "Riesgos IA", type: "item" },

  { label: "CONFIGURACIÓN", type: "section" },
  { label: "Empresa", type: "item" },
  { label: "Suscripción", type: "item" },
  { label: "Seguridad", type: "item" },
];

export default function Sidebar({
  activeModule,
  setActiveModule,
}: SidebarProps) {
  return (
    <aside className="w-72 min-h-screen bg-slate-950 text-white p-4 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-400">
          FloraTrack
        </h1>

        <p className="text-xs text-slate-400 mt-2">
          Enterprise Compliance Platform
        </p>

        <p className="text-xs text-slate-500 mt-2">
          GACP • GMP • GIS • IA • Traceability
        </p>
      </div>

      <nav className="space-y-2">
        {menu.map((item, index) => {
          if (item.type === "section") {
            return (
              <div
                key={index}
                className="bg-green-950 text-green-300 font-bold rounded-xl px-4 py-3 mt-6"
              >
                {item.label}
              </div>
            );
          }

          return (
            <button
              key={index}
              onClick={() => setActiveModule(item.label)}
              className={
                activeModule === item.label
                  ? "w-full text-left bg-green-500 text-white font-bold rounded-xl px-4 py-3"
                  : "w-full text-left bg-green-900 hover:bg-green-700 transition rounded-xl px-4 py-3"
              }
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}