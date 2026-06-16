import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type ScopeKey =
  | "gacp"
  | "gmp"
  | "lims"
  | "qms"
  | "regulatory"
  | "data-integrity"
  | "supplier"
  | "facility"
  | "product"
  | "full";

type EvidenceSource = {
  title: string;
  delegate: string;
  module: string;
  section: string;
};

const scopes: Record<ScopeKey, EvidenceSource[]> = {
  gacp: [
    { title: "Predios", delegate: "farm", module: "Predios", section: "Operación Agrícola" },
    { title: "Genéticas", delegate: "genetic", module: "Genéticas", section: "Material Vegetal" },
    { title: "Cultivos", delegate: "crop", module: "Cultivos", section: "Cultivo" },
    { title: "Cosechas", delegate: "harvest", module: "Cosecha", section: "Cosecha" },
    { title: "Genealogía de lotes", delegate: "lotGenealogy", module: "Genealogía Lotes", section: "Trazabilidad" },
    { title: "Eventos de trazabilidad", delegate: "traceabilityEvent", module: "Eventos Trazabilidad", section: "Trazabilidad" },
    { title: "Consumo de materiales", delegate: "materialConsumption", module: "Consumo Materiales", section: "Trazabilidad" },
  ],
  gmp: [
    { title: "Productos", delegate: "product", module: "Productos", section: "Producto" },
    { title: "Producción", delegate: "productionOrder", module: "Producción", section: "Producción" },
    { title: "Batch Records", delegate: "batchRecord", module: "Batch Records", section: "Batch Record" },
    { title: "Envasado", delegate: "packagingRecord", module: "Envasado", section: "Envasado" },
    { title: "Rendimientos", delegate: "processYield", module: "Rendimientos Proceso", section: "Proceso" },
    { title: "Estabilidad", delegate: "stabilityStudy", module: "Estabilidad", section: "Estabilidad" },
    { title: "Retención", delegate: "retentionSample", module: "Retención", section: "Muestras de retención" },
  ],
  lims: [
    { title: "Muestras", delegate: "sample", module: "Muestras", section: "Laboratorio" },
    { title: "Análisis", delegate: "analysis", module: "Análisis", section: "Laboratorio" },
    { title: "COA", delegate: "cOA", module: "COA", section: "Liberación" },
    { title: "Métodos analíticos", delegate: "analyticalMethod", module: "Métodos Analíticos", section: "Métodos" },
    { title: "Especificaciones", delegate: "productSpecification", module: "Especificaciones", section: "Especificaciones" },
    { title: "Cadena de custodia", delegate: "chainOfCustodyRecord", module: "Cadena Custodia", section: "Custodia" },
    { title: "OOS/OOT", delegate: "oosInvestigation", module: "OOS", section: "Investigaciones" },
  ],
  qms: [
    { title: "SOP", delegate: "sopDocument", module: "SOP", section: "Documentos" },
    { title: "Registros controlados", delegate: "controlledRecord", module: "Registros", section: "Registros" },
    { title: "Firmas electrónicas", delegate: "electronicSignature", module: "Firmas", section: "Firmas" },
    { title: "CAPA", delegate: "capaAction", module: "CAPA", section: "CAPA" },
    { title: "Desviaciones", delegate: "deviation", module: "Desviaciones", section: "Desviaciones" },
    { title: "No conformidades", delegate: "nonConformity", module: "No Conformidades", section: "No Conformidades" },
    { title: "Control de cambios", delegate: "changeControl", module: "Control Cambios", section: "Cambios" },
    { title: "Auditorías", delegate: "qualityAudit", module: "Auditorías", section: "Auditorías" },
  ],
  regulatory: [
    { title: "Licencias", delegate: "regulatoryLicense", module: "Licencias", section: "Licencias" },
    { title: "Cupos", delegate: "quota", module: "Cupos", section: "Cupos" },
    { title: "PEAS", delegate: "peasRecord", module: "PEAS", section: "PEAS" },
    { title: "Registros ICA", delegate: "icaRecord", module: "Registros ICA", section: "ICA" },
    { title: "INVIMA", delegate: "invimaProcedure", module: "Trámites INVIMA", section: "INVIMA" },
    { title: "Normativa", delegate: "regulatoryFramework", module: "Normativa", section: "Marco legal" },
    { title: "Requisitos", delegate: "regulatoryRequirement", module: "Requisitos Normativos", section: "Requisitos" },
    { title: "Brechas", delegate: "complianceGap", module: "Brechas Cumplimiento", section: "Brechas" },
    { title: "Planes", delegate: "compliancePlan", module: "Plan Cumplimiento", section: "Planes" },
  ],
  "data-integrity": [
    { title: "ALCOA+", delegate: "dataIntegrityReview", module: "ALCOA+", section: "Integridad de Datos" },
    { title: "Audit Trail", delegate: "auditTrail", module: "Auditoría Sistema", section: "Audit Trail" },
    { title: "Revisión Audit Trail", delegate: "auditTrailReview", module: "Revisión Audit Trail", section: "Audit Trail" },
    { title: "Revisión de accesos", delegate: "accessPeriodicReview", module: "Revisión Accesos", section: "Accesos" },
    { title: "Validación CSV", delegate: "validationProtocol", module: "Validación CSV", section: "CSV" },
    { title: "Pruebas CSV", delegate: "validationTest", module: "Pruebas CSV", section: "CSV" },
    { title: "Part 11 / Annex 11", delegate: "electronicRecordControl", module: "21 CFR Part 11", section: "Registros electrónicos" },
  ],
  supplier: [
    { title: "Proveedores", delegate: "supplier", module: "Proveedores", section: "Proveedores" },
    { title: "Compras", delegate: "purchaseOrder", module: "Compras", section: "Compras" },
    { title: "Recepción", delegate: "receptionRecord", module: "Recepción", section: "Recepción" },
    { title: "Cuarentena", delegate: "quarantineItem", module: "Cuarentena", section: "Cuarentena" },
    { title: "Liberación", delegate: "releaseRecord", module: "Liberación", section: "Liberación" },
    { title: "Homologación", delegate: "supplierQualification", module: "Homologación Proveedores", section: "Homologación" },
    { title: "Auditoría proveedores", delegate: "supplierAuditRecord", module: "Auditoría Proveedores", section: "Auditoría" },
    { title: "Riesgo proveedores", delegate: "supplierRiskProfile", module: "Riesgo Proveedores", section: "Riesgo" },
  ],
  facility: [
    { title: "Equipos", delegate: "equipment", module: "Equipos", section: "Equipos" },
    { title: "Calibraciones", delegate: "calibrationRecord", module: "Calibraciones", section: "Calibraciones" },
    { title: "Mantenimiento", delegate: "maintenanceRecord", module: "Mantenimiento", section: "Mantenimiento" },
    { title: "Limpieza", delegate: "cleaningRecord", module: "Limpieza", section: "Limpieza" },
    { title: "Bioseguridad", delegate: "biosafetyRecord", module: "Bioseguridad", section: "Bioseguridad" },
    { title: "Residuos", delegate: "wasteRecord", module: "Residuos", section: "Residuos" },
    { title: "Puntos monitoreo", delegate: "envMonitoringPoint", module: "Puntos Monitoreo", section: "EMS" },
    { title: "Resultados ambientales", delegate: "envMonitoringResult", module: "Resultados Ambientales", section: "EMS" },
    { title: "Excursiones", delegate: "environmentalExcursion", module: "Excursiones Ambientales", section: "EMS" },
    { title: "Calificación equipos", delegate: "equipmentQualification", module: "Calificación Equipos", section: "Validación" },
  ],
  product: [
    { title: "Formulaciones", delegate: "productFormulation", module: "Formulaciones", section: "Desarrollo" },
    { title: "BOM", delegate: "billOfMaterial", module: "BOM Fórmula Maestra", section: "Fórmula Maestra" },
    { title: "Instrucciones fabricación", delegate: "manufacturingInstruction", module: "Instrucciones Fabricación", section: "Fabricación" },
    { title: "Transferencia tecnológica", delegate: "techTransferRecord", module: "Transferencia Tecnológica", section: "Transferencia" },
    { title: "PQR/APR", delegate: "productQualityReview", module: "Revisión Producto", section: "PQR/APR" },
    { title: "Tendencias calidad", delegate: "qualityTrend", module: "Tendencias Calidad", section: "Tendencias" },
    { title: "Estabilidad", delegate: "stabilityTrendReview", module: "Tendencias Estabilidad", section: "Estabilidad" },
    { title: "Capacidad proceso", delegate: "processCapabilityReview", module: "Capacidad Proceso", section: "Proceso" },
  ],
  full: [],
};

scopes.full = [
  ...scopes.gacp,
  ...scopes.gmp,
  ...scopes.lims,
  ...scopes.qms,
  ...scopes.regulatory,
  ...scopes["data-integrity"],
  ...scopes.supplier,
  ...scopes.facility,
  ...scopes.product,
];

function normalizeRecord(record: any) {
  return {
    id: record.id,
    code:
      record.code ||
      record.title ||
      record.name ||
      record.productName ||
      record.batchCode ||
      record.supplierName ||
      record.areaName ||
      record.id,
    title:
      record.title ||
      record.name ||
      record.productName ||
      record.issue ||
      record.metric ||
      record.standard ||
      record.requirement ||
      record.supplierName ||
      record.areaName ||
      record.processName ||
      record.equipmentName ||
      null,
    status:
      record.status ||
      record.approvalStatus ||
      record.processStatus ||
      record.trend ||
      null,
    owner:
      record.owner ||
      record.responsible ||
      record.auditor ||
      record.analyst ||
      record.performedBy ||
      record.executedBy ||
      null,
    createdAt: record.createdAt || null,
    dueDate: record.dueDate || record.reviewDate || record.auditDate || record.expirationDate || null,
  };
}

function isOpen(record: any) {
  const value = String(record.status || record.approvalStatus || record.processStatus || "").toLowerCase();

  if (!value) return false;

  const closed = [
    "cerrado",
    "cerrada",
    "cumple",
    "aprobado",
    "aprobada",
    "completado",
    "completada",
    "liberado",
    "liberada",
    "transferida",
    "mitigado",
    "mitigada",
  ];

  return !closed.some((item) => value.includes(item));
}

async function collectSource(source: EvidenceSource) {
  try {
    const delegate = (prisma as any)[source.delegate];

    if (!delegate) {
      return {
        ...source,
        ok: false,
        count: 0,
        open: 0,
        evidence: [],
        error: `Delegate no existe: ${source.delegate}`,
      };
    }

    const [count, evidence] = await Promise.all([
      delegate.count(),
      delegate.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      }).catch(() => []),
    ]);

    const normalized = evidence.map(normalizeRecord);
    const open = evidence.filter(isOpen).length;

    return {
      ...source,
      ok: true,
      count,
      open,
      evidence: normalized,
      error: "",
    };
  } catch (error) {
    return {
      ...source,
      ok: false,
      count: 0,
      open: 0,
      evidence: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function getScopeTitle(scope: ScopeKey) {
  const titles: Record<ScopeKey, string> = {
    gacp: "Paquete Auditoría GACP",
    gmp: "Paquete Auditoría GMP",
    lims: "Paquete Auditoría LIMS / COA",
    qms: "Paquete Auditoría QMS",
    regulatory: "Paquete Auditoría Regulatorio",
    "data-integrity": "Paquete Auditoría Data Integrity / CSV",
    supplier: "Paquete Auditoría Supplier QA",
    facility: "Paquete Auditoría Facility / EMS",
    product: "Paquete Auditoría Desarrollo Producto / PQR",
    full: "Paquete Auditoría Maestro Full Enterprise",
  };

  return titles[scope];
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const scopeParam = String(url.searchParams.get("scope") || "full") as ScopeKey;
    const scope: ScopeKey = scopes[scopeParam] ? scopeParam : "full";

    const sources = scopes[scope];
    const sections = await Promise.all(sources.map(collectSource));

    const totalRecords = sections.reduce((sum, item) => sum + item.count, 0);
    const totalOpen = sections.reduce((sum, item) => sum + item.open, 0);
    const errors = sections.filter((item) => !item.ok);
    const sectionsWithEvidence = sections.filter((item) => item.count > 0);

    const readiness =
      sections.length === 0
        ? 0
        : Math.max(
            0,
            Math.round(
              ((sections.length - errors.length) / sections.length) * 100 -
                Math.min(totalOpen * 2, 30)
            )
          );

    const requiredIndex = sections.map((item) => ({
      section: item.section,
      module: item.module,
      title: item.title,
      delegate: item.delegate,
      required: true,
      availableRecords: item.count,
      openItems: item.open,
      status: item.ok
        ? item.count > 0
          ? item.open > 0
            ? "Con pendientes"
            : "Con evidencia"
          : "Sin registros"
        : "Error técnico",
      error: item.error,
    }));

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      scope,
      title: getScopeTitle(scope),
      readiness,
      summary: {
        sections: sections.length,
        sectionsWithEvidence: sectionsWithEvidence.length,
        totalRecords,
        totalOpen,
        technicalErrors: errors.length,
      },
      requiredIndex,
      sections,
      executiveConclusion:
        totalOpen > 0
          ? "El paquete contiene evidencia, pero existen registros abiertos que deben cerrarse o justificarse antes de auditoría."
          : errors.length > 0
          ? "El paquete requiere corrección técnica de algunos módulos antes de auditoría."
          : "El paquete está técnicamente consolidado y sin pendientes abiertos detectados.",
      recommendations: [
        "Revisar el índice requerido y completar módulos sin registros.",
        "Cerrar o justificar registros abiertos antes de auditoría.",
        "Exportar JSON/HTML como soporte preliminar del paquete.",
        "Complementar con SOP aprobados, firmas electrónicas y evidencia adjunta cuando se active carga documental.",
      ],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
