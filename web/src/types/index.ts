export * from './agricultural';

/**
 * Base interfaces for agricultural ERP and SaaS Domain models.
 * Implements strict data traceability matching GACP (WHO) and EMA guidelines.
 */

/**
 * Representa una Finca (Agricultural Property/Farm) bajo gestión SaaS
 */
export interface Finca {
  id: string;
  nombre: string;
  ubicacion: string;               // Geo-coordinates or physical address
  areaHectareas: number;          // Total area in hectares
  productorResponsable: string;    // Lead agronomist / grower in charge
  registroCertificacion?: string;  // Official registration code (e.g., GACP-REG-2026)
  telefono?: string;
  email?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Representa un Lote (Land/Greenhouse Block) dentro de una finca
 */
export interface Lote {
  id: string;
  codigoLote: string;              // e.g., "LT-CAN-03"
  fincaId: string;                 // Reference to Finca ownership
  nombreLote: string;              // Greenhouse A, Bed 4, open area plot
  areaMetrosCuadrados: number;
  estadoActual: import('./agricultural').CultivationPhase; // Sowing, Veg, Flowering, Harvest...
  cultivoId: string;               // Current running crop species/genetics id
  sueloTipo?: string;              // Substrate description: coco coir, peat-moss, clay-loam
  createdAt: string;
  updatedAt: string;
}

/**
 * Representa un Cultivo (Crop variety/cultivar profile)
 */
export interface Cultivo {
  id: string;
  nombreComun: string;             // Common crop name
  variedad: string;                // Specific strain / botanical cultivar (e.g. "Flora-Kush")
  tipoCultivo: string;             // Medical, food-grade, seed production, etc.
  origenSemilla: string;           // Provenance or nursery identification
  cicloDiasEstimado: number;       // Estimated duration of full cycle in days
  thcMaximo?: number;              // Cannabinoid potency limits if medicinal
  cbdMaximo?: number;              // Cannabinoid potency limits if medicinal
  gacpGuiaCultivoUrl?: string;     // Reference URL to official cultivation guidelines / SOP
  createdAt: string;
  updatedAt: string;
}

/**
 * Representa un Registro de Actividad diaria (Agricultural Activity Log)
 * Strictly conforms to ALCOA+ standards for pharmaceutical food crops verification.
 */
export interface RegistroActividad {
  id: string;
  loteId: string;                  // Active target batch under review
  tipoActividad: 
    | 'SIEMBRA' 
    | 'RIEGO' 
    | 'FERTILIZACION' 
    | 'CONTROL_PLAGAS' 
    | 'PODA' 
    | 'COSECHA' 
    | 'MONITOREO' 
    | 'REVISION_SOP';
  detalles: string;                 // In depth description (pH, EC, humidity, chemical compound applied etc.)
  responsableNombre: string;       // Certified GACP Technologist / Auditor signing off
  firmaAuditoria: string;          // Immutable digital or hand-off signature reference (ALCOA+ model)
  cantidadAplicada?: string;       // Quantity of water, nutrient, or bio-pesticide used
  esConformeGacp: boolean;         // Checked GACP requirement adherence
  evidenciaUrl?: string;           // Image or report reference link
  fechaActividad: string;          // Operational execution timestamp
  createdAt: string;
  updatedAt: string;
}

/**
 * Definición de Roles de Usuario para el SaaS Agrícola (FloraTrack)
 * Define privilegios para la supervisión de procesos (GACP/GMP) y ejecución de tareas de campo.
 */
export type RolUsuario = 'ADMINISTRATIVO' | 'OPERATIVO' | 'AUDITOR_EXTERNO';

export interface UsuarioSaaS {
  uid: string;
  email: string;
  displayName: string;
  rol: RolUsuario;
  fincaId?: string;               // Finca asignada (para administradores de finca u operativos)
  activo: boolean;
  ultimoAcceso?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Nombres oficiales de las colecciones en Firebase Firestore para el SaaS agrícola.
 * Proporciona un estándar estricto para las consultas y la persistencia de datos.
 */
export const COLECCIONES_FIRESTORE = {
  FINCAS: 'fincas',
  LOTES: 'lotes',
  CULTIVOS: 'cultivos',
  ACTIVIDADES: 'actividades_agricolas',
  USUARIOS: 'usuarios_saas'
} as const;
