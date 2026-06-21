/**
 * Type Definitions for Agricultural GACP/GMP SaaS - FloraTrack
 * Strictly compliant with WHO GACP guidelines for cultivation and EMA EU-GMP for medical crops.
 */

export type CultivationPhase =
  | 'SOWING'          // Siembra
  | 'PROPAGATION'     // Propagación
  | 'VEGETATIVE'      // Vegetativo
  | 'FLOWERING'       // Floración
  | 'HARVEST'         // Cosecha
  | 'DRYING'          // Secado
  | 'CURING'          // Curado
  | 'ANALYSIS'        // Control de Calidad / Laboratorio
  | 'APPROVED';       // Aprobado para Distribución (Lanzamiento de Lote)

export interface IoTTelemetry {
  timestamp: string;
  ambientTemp: number;     // °C
  relativeHumidity: number; // %
  soilMoisture: number;     // %
  irrigationPh: number;     // pH units
  electricalConductivity: number; // mS/cm
  co2Levels: number;        // ppm
  dli: number;             // Daily Light Integral (mol/m²/day)
}

export interface GacpRequirement {
  id: string;
  section: 'GENETICS' | 'SOIL_WATER' | 'HYGIENE' | 'PEST_CONTROL' | 'HARVEST_PROCESS' | 'DOCUMENTATION';
  code: string;           // e.g., "GACP-HYG-01"
  description: string;
  criticality: 'CRITICAL' | 'MAJOR' | 'MINOR';
  verified: boolean;
  notes?: string;
  checkedBy?: string;
  updatedAt: string;
}

export interface AuditRecord {
  id: string;
  auditorId: string;
  auditorName: string;
  signature: string;       // Cryptographic handoff or ALCOA+ electronic signature
  sectionsAudited: string[];
  compliantCount: number;
  totalRequirements: number;
  score: number;           // 0 - 100
  recommendations: string[];
  timestamp: string;
}

export interface HeavyMetalMRL {
  cadmium: number; // Max Limit (WHO limit: 0.3 mg/kg)
  lead: number;    // Max Limit (WHO limit: 5.0 mg/kg)
  mercury: number; // Max Limit (WHO limit: 0.1 mg/kg)
  arsenic: number; // Max Limit (WHO limit: 1.0 mg/kg)
}

export interface LabAnalysisCertificate {
  certificateId: string;
  laboratoryName: string;
  analystName: string;
  releasedAt: string;
  moistureContent: number;      // e.g., 9.2% (Target: 8% - 12%)
  microbialPurity: 'PASS' | 'FAIL';
  heavyMetals: {
    cadmiumValue: number;
    leadValue: number;
    mercuryValue: number;
    arsenicValue: number;
    status: 'PASS' | 'FAIL';
  };
  pesticideResidues: 'PASS' | 'FAIL';
  thcContent: number;           // %
  cbdContent: number;           // %
  terpeneProfile: Record<string, number>; // Terpene names and %
}

export type AuditSystemLogAction = 'CREATION' | 'EDITION' | 'SIGNATURE' | 'VALIDATION' | 'SYSTEM_SYNC';

export interface AuditSystemLog {
  id: string;
  action: AuditSystemLogAction;
  details: string;
  performedBy: string; // User ID / Name
  timestamp: string;
  batchId?: string; // Optional reference to a specific batch
  hash: string; // Local SHA-256 integrity hash of this log entry to enforce immutability
}

export interface CropBatch {
  id: string;
  batchCode: string;       // e.g., LT-CAN-2026-X812
  variety: string;         // Botanical name / cultivar (e.g. Flora-Kush)
  greenhouseId: string;     // Target greenhouse / growth chamber
  stage: CultivationPhase;
  complianceScore: number;  // Calculated cumulative audit score (0-100)
  gacpCertified: boolean;
  gmpCertified: boolean;
  hash: string;            // SHA-256 integrity block signature
  blockchainTxId?: string; // Optional immutable ledger tracking
  createdAt: string;
  updatedAt: string;
  expectedAuditDate?: string;
  certificateExpiryDate?: string;
  telemetryStream?: IoTTelemetry[];
  activeAudits?: GacpRequirement[];
  labCertificate?: LabAnalysisCertificate;
}
