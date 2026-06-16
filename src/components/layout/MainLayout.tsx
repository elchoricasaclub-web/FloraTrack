"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type Setter = (value: string) => void;

type MainLayoutProps = {
  children?: ReactNode;

  activeSection?: string;
  setActiveSection?: Setter;

  selectedSection?: string;
  setSelectedSection?: Setter;

  activeModule?: string;
  setActiveModule?: Setter;

  selectedModule?: string;
  setSelectedModule?: Setter;

  currentModule?: string;
  setCurrentModule?: Setter;

  activeMenu?: string;
  setActiveMenu?: Setter;

  activeTab?: string;
  setActiveTab?: Setter;

  onSelectModule?: Setter;
  onChangeModule?: Setter;
  onMenuClick?: Setter;

  [key: string]: any;
};

type MenuItem = {
  key: string;
  label: string;
  badge?: string;
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

const favoriteItems: MenuItem[] = [
  { key: "Dashboard", label: "Dashboard", badge: "Inicio" },
  { key: "Control Tower", label: "Control Tower", badge: "360" },
  { key: "Cultivos", label: "Cultivos", badge: "GACP" },
  { key: "CAPA", label: "CAPA", badge: "QMS" },
];

const menuGroups: MenuGroup[] = [
  {
    title: "Operación GACP",
    items: [
      { key: "Empresas", label: "Empresas" },
      { key: "Usuarios", label: "Usuarios" },
      { key: "Predios", label: "Predios" },
      { key: "GIS", label: "GIS" },
      { key: "Genéticas", label: "Genéticas" },
      { key: "Propagación", label: "Propagación" },
      { key: "Cultivos", label: "Cultivos" },
      { key: "Cosecha", label: "Cosecha" },
    ],
  },
  {
    title: "Procesos Estratégicos",
    items: [
      { key: "Micropropagación", label: "Micropropagación", badge: "Bio" },
      { key: "Live Rosin", label: "Live Rosin", badge: "Solventless" },
      { key: "LIMS", label: "LIMS", badge: "Lab" },
      { key: "ISO 17025", label: "ISO 17025", badge: "ISO" },
      { key: "COA", label: "COA" },
    ],
  },
  {
    title: "Calidad y Cumplimiento",
    items: [
      { key: "Plan de Cumplimiento", label: "Plan de Cumplimiento" },
      { key: "Certificaciones", label: "Certificaciones" },
      { key: "Auditorías", label: "Auditorías" },
      { key: "Audit Readiness", label: "Audit Readiness" },
      { key: "CAPA", label: "CAPA" },
      { key: "Documentos", label: "Documentos / SOP" },
      { key: "CSV Enterprise", label: "Validación CSV" },
    ],
  },
  {
    title: "SaaS, Seguridad e IA",
    items: [
      { key: "SaaS Multiempresa", label: "SaaS Multiempresa" },
      { key: "Security RBAC", label: "Security RBAC" },
      { key: "IA Regulatoria", label: "IA Regulatoria" },
      { key: "AI Gateway", label: "AI Gateway" },
      { key: "Private AI", label: "Private AI" },
    ],
  },
  {
    title: "Sistema",
    items: [
      { key: "UX Item Studio", label: "UX Item Studio" },
      { key: "Ítems por Módulo", label: "Ítems por Módulo" },
      { key: "App Doctor", label: "App Doctor" },
      { key: "Backup", label: "Backup" },
      { key: "Export Center", label: "Export Center" },
    ],
  },
];

function badgeClass(badge?: string) {
  if (!badge) return "hidden";
  if (badge === "Inicio") return "bg-green-100 text-green-700";
  if (badge === "360") return "bg-slate-900 text-white";
  if (badge === "GACP") return "bg-emerald-100 text-emerald-700";
  if (badge === "QMS") return "bg-amber-100 text-amber-700";
  if (badge === "Solventless") return "bg-purple-100 text-purple-700";
  if (badge === "Lab" || badge === "ISO") return "bg-blue-100 text-blue-700";
  return "bg-slate-100 text-slate-600";
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace("á", "a")
    .replace("é", "e")
    .replace("í", "i")
    .replace("ó", "o")
    .replace("ú", "u");
}

export default function MainLayout(props: MainLayoutProps) {
  const {
    children,

    activeSection,
    selectedSection,
    activeModule: activeModuleProp,
    selectedModule,
    currentModule,
    activeMenu,
    activeTab,

    setActiveSection,
    setSelectedSection,
    setActiveModule,
    setSelectedModule,
    setCurrentModule,
    setActiveMenu,
    setActiveTab,

    onSelectModule,
    onChangeModule,
    onMenuClick,
  } = props;

  const activeModule = String(
    activeSection ??
      selectedSection ??
      activeModuleProp ??
      selectedModule ??
      currentModule ??
      activeMenu ??
      activeTab ??
      "Dashboard"
  );

  const selectModule: Setter =
    setActiveSection ??
    setSelectedSection ??
    setActiveModule ??
    setSelectedModule ??
    setCurrentModule ??
    setActiveMenu ??
    setActiveTab ??
    onSelectModule ??
    onChangeModule ??
    onMenuClick ??
    (() => {});

  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    const clean = normalize(search.trim());

    if (!clean) return menuGroups;

    return menuGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          return (
            normalize(item.key).includes(clean) ||
            normalize(item.label).includes(clean) ||
            normalize(group.title).includes(clean)
          );
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [search]);

  const activeGroupTitle =
    menuGroups.find((group) => group.items.some((item) => item.key === activeModule))?.title ??
    "FloraTrack";

  function MenuButton({ item, compact = false }: { item: MenuItem; compact?: boolean }) {
    const active = item.key === activeModule || item.label === activeModule;

    return (
      <button
        onClick={() => selectModule(item.key)}
        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
          active
            ? "bg-green-600 text-white shadow-sm"
            : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        <span className={`truncate ${compact ? "text-sm" : "text-[15px]"} font-bold`}>
          {item.label}
        </span>

        {item.badge && (
          <span
            className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${
              active ? "bg-white/20 text-white" : badgeClass(item.badge)
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* GUARDADO_GLOBAL_DIRECTO */}
      <form
        action="/api/progress-records"
        method="post"
        className="fixed bottom-6 right-6 z-[99999] rounded-3xl border border-green-200 bg-white p-4 shadow-2xl"
      >
        <input type="hidden" name="moduleName" value="FloraTrack Global" />
        <input type="hidden" name="itemTitle" value="Guardar avance actual" />
        <input type="hidden" name="actionType" value="safe-global-save" />
        <input type="hidden" name="owner" value="Usuario actual" />
        <input type="hidden" name="status" value="Guardado" />
        <input type="hidden" name="evidence" value="Guardado global seguro" />
        <input type="hidden" name="note" value="Avance guardado desde botón global." />

        <div className="text-xs font-black uppercase tracking-widest text-green-600">
          Guardado seguro
        </div>

        <button
          type="submit"
          className="mt-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white hover:bg-green-700"
        >
          Guardar avance actual
        </button>

        <a
          href="/progress-records"
          className="mt-3 block rounded-xl border px-3 py-2 text-center text-xs font-black text-slate-700"
        >
          Ver registros
        </a>
      </form>

      <aside className="fixed left-0 top-0 z-40 h-screen w-[292px] border-r border-slate-200 bg-white">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-100 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-lg font-black text-white">
                F
              </div>

              <div>
                <div className="text-xl font-black leading-none text-slate-950">
                  FloraTrack
                </div>
                <div className="mt-1 text-[11px] font-black uppercase tracking-widest text-green-600">
                  Enterprise Platform
                </div>
              </div>
            </div>

            <div className="mt-5">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar módulo..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-green-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="border-b border-slate-100 px-4 py-4">
            <div className="mb-2 px-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
              Favoritos
            </div>

            <div className="space-y-1">
              {favoriteItems.map((item) => (
                <MenuButton key={item.key} item={item} compact />
              ))}
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-6">
              {filteredGroups.map((group) => (
                <div key={group.title}>
                  <div className="mb-2 px-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    {group.title}
                  </div>

                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <MenuButton key={item.key} item={item} />
                    ))}
                  </div>
                </div>
              ))}

              {filteredGroups.length === 0 && (
                <div className="rounded-2xl border bg-slate-50 p-4 text-center">
                  <div className="font-black text-slate-900">Sin resultados</div>
                  <div className="mt-1 text-sm text-slate-500">
                    No encontré ese módulo.
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="border-t border-slate-100 p-4">
            <div className="rounded-2xl bg-slate-950 p-4 text-white">
              <div className="text-xs font-black uppercase tracking-widest text-green-300">
                Estado
              </div>
              <div className="mt-1 text-base font-black">
                MVP Enterprise
              </div>
              <div className="mt-1 text-xs text-slate-300">
                Diseño limpio SaaS aplicado.
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-h-screen pl-[292px]">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-8 py-5 backdrop-blur">
          <div className="flex items-center justify-between gap-5">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-green-600">
                {activeGroupTitle}
              </div>

              <h1 className="mt-1 text-3xl font-black text-slate-950">
                {activeModule}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-2xl border bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50">
                Audit Trail
              </button>

              <button className="rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-green-700">
                Nuevo Registro
              </button>
            </div>
          </div>
        </header>

        <section className="p-8">
          {children}
        </section>
      </main>
    </div>
  );
}

