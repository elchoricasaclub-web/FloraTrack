export type RoleName =
  | "Super Admin"
  | "Director Calidad"
  | "Operador GACP";

export type ModuleCatalogItem = {
  module: string;
  area: string;
};

export const moduleCatalog: ModuleCatalogItem[] = [
  { module: "Dashboard", area: "Inicio" },

  { module: "Empresas", area: "Empresas" },
  { module: "Usuarios", area: "Empresas" },
  { module: "Roles", area: "Empresas" },

  { module: "Predios", area: "Operaciones Agrícolas" },
  { module: "GIS", area: "Operaciones Agrícolas" },
  { module: "Cultivos", area: "Operaciones Agrícolas" },
  { module: "Genéticas", area: "Operaciones Agrícolas" },
  { module: "Propagación", area: "Operaciones Agrícolas" },
  { module: "Cosecha", area: "Operaciones Agrícolas" },

  { module: "GACP", area: "Calidad" },
  { module: "GMP", area: "Calidad" },
  { module: "Auditorías", area: "Calidad" },
  { module: "CAPA", area: "Calidad" },
  { module: "Riesgos", area: "Calidad" },
  { module: "Desviaciones", area: "Calidad" },
  { module: "No Conformidades", area: "Calidad" },
  { module: "Control de Cambios", area: "Calidad" },

  { module: "Licencias", area: "Regulatorio" },
  { module: "Cupos", area: "Regulatorio" },
  { module: "PEAS", area: "Regulatorio" },
  { module: "Registros ICA", area: "Regulatorio" },
  { module: "Trámites INVIMA", area: "Regulatorio" },
  { module: "Autoridades", area: "Regulatorio" },
  { module: "Vencimientos", area: "Regulatorio" },

  { module: "Muestras", area: "Laboratorio" },
  { module: "Análisis", area: "Laboratorio" },
  { module: "COA", area: "Laboratorio" },

  { module: "Materias Primas", area: "Inventario" },
  { module: "Insumos", area: "Inventario" },
  { module: "Productos", area: "Inventario" },

  { module: "SOP", area: "Documentos" },
  { module: "Registros", area: "Documentos" },
  { module: "Firmas", area: "Documentos" },

  { module: "Proveedores", area: "Compras y Almacén" },
  { module: "Compras", area: "Compras y Almacén" },
  { module: "Recepción", area: "Compras y Almacén" },
  { module: "Cuarentena", area: "Compras y Almacén" },
  { module: "Liberación", area: "Compras y Almacén" },

  { module: "Equipos", area: "Equipos y Ambiental" },
  { module: "Calibraciones", area: "Equipos y Ambiental" },
  { module: "Limpieza", area: "Equipos y Ambiental" },
  { module: "Bioseguridad", area: "Equipos y Ambiental" },
  { module: "Residuos", area: "Equipos y Ambiental" },
  { module: "Ambiental", area: "Equipos y Ambiental" },

  { module: "Capacitaciones", area: "Capacitación" },
  { module: "Mantenimiento", area: "Capacitación" },

  { module: "Reportes", area: "Control Enterprise" },
  { module: "Trazabilidad", area: "Control Enterprise" },
  { module: "Alertas", area: "Control Enterprise" },
  { module: "Calendario", area: "Control Enterprise" },

  { module: "Auditor IA", area: "Inteligencia Artificial" },
  { module: "SOP IA", area: "Inteligencia Artificial" },
  { module: "Riesgos IA", area: "Inteligencia Artificial" },

  { module: "Empresa", area: "Sistema" },
  { module: "Configuración", area: "Sistema" },
  { module: "Datos Maestros", area: "Sistema" },
  { module: "Permisos", area: "Sistema" },
  { module: "Auditoría Sistema", area: "Sistema" },
  { module: "Backup", area: "Sistema" },
];

export const allModules = moduleCatalog.map((item) => item.module);

export const rolePermissions: Record<RoleName, string[]> = {
  "Super Admin": allModules,

  "Director Calidad": [
    "Dashboard",
    "Empresas",
    "Usuarios",
    "Roles",

    "Predios",
    "GIS",
    "Cultivos",
    "Genéticas",
    "Propagación",
    "Cosecha",

    "GACP",
    "GMP",
    "Auditorías",
    "CAPA",
    "Riesgos",
    "Desviaciones",
    "No Conformidades",
    "Control de Cambios",

    "Licencias",
    "Cupos",
    "PEAS",
    "Registros ICA",
    "Trámites INVIMA",
    "Autoridades",
    "Vencimientos",

    "Muestras",
    "Análisis",
    "COA",

    "Materias Primas",
    "Insumos",
    "Productos",

    "SOP",
    "Registros",
    "Firmas",

    "Proveedores",
    "Compras",
    "Recepción",
    "Cuarentena",
    "Liberación",

    "Equipos",
    "Calibraciones",
    "Limpieza",
    "Bioseguridad",
    "Residuos",
    "Ambiental",

    "Capacitaciones",
    "Mantenimiento",

    "Reportes",
    "Trazabilidad",
    "Alertas",
    "Calendario",

    "Auditor IA",
    "SOP IA",
    "Riesgos IA",

    "Empresa",
    "Configuración",
    "Datos Maestros",
    "Permisos",
    "Auditoría Sistema",
  ],

  "Operador GACP": [
    "Dashboard",

    "Predios",
    "GIS",
    "Cultivos",
    "Genéticas",
    "Propagación",
    "Cosecha",

    "GACP",
    "Riesgos",
    "Desviaciones",

    "Muestras",

    "Materias Primas",
    "Insumos",

    "SOP",
    "Registros",

    "Equipos",
    "Limpieza",
    "Bioseguridad",
    "Residuos",

    "Capacitaciones",

    "Trazabilidad",
    "Alertas",
    "Calendario",
  ],
};

export function getPermissions(role: string) {
  if (role === "Super Admin") {
    return rolePermissions["Super Admin"];
  }

  if (role === "Director Calidad") {
    return rolePermissions["Director Calidad"];
  }

  if (role === "Operador GACP") {
    return rolePermissions["Operador GACP"];
  }

  return ["Dashboard"];
}

export function canAccess(role: string, module: string) {
  return getPermissions(role).includes(module);
}
