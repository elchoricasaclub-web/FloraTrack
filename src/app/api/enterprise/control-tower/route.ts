import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type MetricConfig = {
  label: string;
  delegate: string;
  module: string;
  category: string;
};

const metrics: MetricConfig[] = [
  { category: "Sistema / Empresas", label: "Empresas", delegate: "company", module: "Empresas" },
  { category: "Sistema / Empresas", label: "Usuarios", delegate: "user", module: "Usuarios" },
  { category: "Sistema / Empresas", label: "Roles", delegate: "securityRole", module: "Roles" },
  { category: "Sistema / Empresas", label: "Permisos", delegate: "securityPermission", module: "Permisos" },
  { category: "Sistema / Empresas", label: "Audit Trail", delegate: "auditTrail", module: "Auditoría Sistema" },
  { category: "Sistema / Empresas", label: "Backups", delegate: "backupRecord", module: "Backup" },

  { category: "Operación GACP", label: "Predios", delegate: "farm", module: "Predios" },
  { category: "Operación GACP", label: "Genéticas", delegate: "genetic", module: "Genéticas" },
  { category: "Operación GACP", label: "Cultivos", delegate: "crop", module: "Cultivos" },
  { category: "Operación GACP", label: "Cosechas", delegate: "harvest", module: "Cosecha" },
  { category: "Operación GACP", label: "Genealogía Lotes", delegate: "lotGenealogy", module: "Genealogía Lotes" },
  { category: "Operación GACP", label: "Eventos Trazabilidad", delegate: "traceabilityEvent", module: "Eventos Trazabilidad" },
  { category: "Operación GACP", label: "Consumo Materiales", delegate: "materialConsumption", module: "Consumo Materiales" },
  { category: "Operación GACP", label: "Rendimientos Proceso", delegate: "processYield", module: "Rendimientos Proceso" },

  { category: "Laboratorio / LIMS", label: "Muestras", delegate: "sample", module: "Muestras" },
  { category: "Laboratorio / LIMS", label: "Análisis", delegate: "analysis", module: "Análisis" },
  { category: "Laboratorio / LIMS", label: "COA", delegate: "cOA", module: "COA" },
  { category: "Laboratorio / LIMS", label: "Métodos Analíticos", delegate: "analyticalMethod", module: "Métodos Analíticos" },
  { category: "Laboratorio / LIMS", label: "Especificaciones", delegate: "productSpecification", module: "Especificaciones" },
  { category: "Laboratorio / LIMS", label: "Cadena Custodia", delegate: "chainOfCustodyRecord", module: "Cadena Custodia" },
  { category: "Laboratorio / LIMS", label: "OOS", delegate: "oosInvestigation", module: "OOS" },

  { category: "Regulatorio", label: "Licencias", delegate: "regulatoryLicense", module: "Licencias" },
  { category: "Regulatorio", label: "Cupos", delegate: "quota", module: "Cupos" },
  { category: "Regulatorio", label: "PEAS", delegate: "peasRecord", module: "PEAS" },
  { category: "Regulatorio", label: "Registros ICA", delegate: "icaRecord", module: "Registros ICA" },
  { category: "Regulatorio", label: "Trámites INVIMA", delegate: "invimaProcedure", module: "Trámites INVIMA" },
  { category: "Regulatorio", label: "Vencimientos", delegate: "expiration", module: "Vencimientos" },
  { category: "Regulatorio", label: "Normativa", delegate: "regulatoryFramework", module: "Normativa" },
  { category: "Regulatorio", label: "Requisitos Normativos", delegate: "regulatoryRequirement", module: "Requisitos Normativos" },
  { category: "Regulatorio", label: "Brechas Cumplimiento", delegate: "complianceGap", module: "Brechas Cumplimiento" },
  { category: "Regulatorio", label: "Plan Cumplimiento", delegate: "compliancePlan", module: "Plan Cumplimiento" },

  { category: "QMS / Calidad", label: "SOP", delegate: "sopDocument", module: "SOP" },
  { category: "QMS / Calidad", label: "Registros", delegate: "controlledRecord", module: "Registros" },
  { category: "QMS / Calidad", label: "Firmas", delegate: "electronicSignature", module: "Firmas" },
  { category: "QMS / Calidad", label: "Desviaciones", delegate: "deviation", module: "Desviaciones" },
  { category: "QMS / Calidad", label: "No Conformidades", delegate: "nonConformity", module: "No Conformidades" },
  { category: "QMS / Calidad", label: "CAPA", delegate: "capaAction", module: "CAPA" },
  { category: "QMS / Calidad", label: "Riesgos", delegate: "riskAssessment", module: "Riesgos" },
  { category: "QMS / Calidad", label: "Control Cambios", delegate: "changeControl", module: "Control de Cambios" },
  { category: "QMS / Calidad", label: "Auditorías", delegate: "qualityAudit", module: "Auditorías" },
  { category: "QMS / Calidad", label: "Evidencias", delegate: "evidenceRecord", module: "Evidencias" },
  { category: "QMS / Calidad", label: "Paquetes Auditoría", delegate: "auditPackage", module: "Exportaciones" },

  { category: "Producción GMP", label: "Producción", delegate: "productionOrder", module: "Producción" },
  { category: "Producción GMP", label: "Lotes", delegate: "productionBatch", module: "Lotes" },
  { category: "Producción GMP", label: "Batch Records", delegate: "batchRecord", module: "Batch Records" },
  { category: "Producción GMP", label: "Envasado", delegate: "packagingRecord", module: "Envasado" },
  { category: "Producción GMP", label: "Estabilidad", delegate: "stabilityStudy", module: "Estabilidad" },
  { category: "Producción GMP", label: "Retención", delegate: "retentionSample", module: "Retención" },

  { category: "Inventario / Supplier QA", label: "Proveedores", delegate: "supplier", module: "Proveedores" },
  { category: "Inventario / Supplier QA", label: "Compras", delegate: "purchaseOrder", module: "Compras" },
  { category: "Inventario / Supplier QA", label: "Recepción", delegate: "receptionRecord", module: "Recepción" },
  { category: "Inventario / Supplier QA", label: "Cuarentena", delegate: "quarantineItem", module: "Cuarentena" },
  { category: "Inventario / Supplier QA", label: "Liberación", delegate: "releaseRecord", module: "Liberación" },
  { category: "Inventario / Supplier QA", label: "Materias Primas", delegate: "rawMaterial", module: "Materias Primas" },
  { category: "Inventario / Supplier QA", label: "Insumos", delegate: "inputItem", module: "Insumos" },
  { category: "Inventario / Supplier QA", label: "Productos", delegate: "product", module: "Productos" },
  { category: "Inventario / Supplier QA", label: "Homologación Proveedores", delegate: "supplierQualification", module: "Homologación Proveedores" },
  { category: "Inventario / Supplier QA", label: "Auditoría Proveedores", delegate: "supplierAuditRecord", module: "Auditoría Proveedores" },
  { category: "Inventario / Supplier QA", label: "Aprobación Materiales", delegate: "supplierMaterialApproval", module: "Aprobación Materiales" },
  { category: "Inventario / Supplier QA", label: "Riesgo Proveedores", delegate: "supplierRiskProfile", module: "Riesgo Proveedores" },

  { category: "Facility / EMS", label: "Equipos", delegate: "equipment", module: "Equipos" },
  { category: "Facility / EMS", label: "Calibraciones", delegate: "calibrationRecord", module: "Calibraciones" },
  { category: "Facility / EMS", label: "Mantenimiento", delegate: "maintenanceRecord", module: "Mantenimiento" },
  { category: "Facility / EMS", label: "Limpieza", delegate: "cleaningRecord", module: "Limpieza" },
  { category: "Facility / EMS", label: "Bioseguridad", delegate: "biosafetyRecord", module: "Bioseguridad" },
  { category: "Facility / EMS", label: "Residuos", delegate: "wasteRecord", module: "Residuos" },
  { category: "Facility / EMS", label: "Ambiental", delegate: "environmentalRecord", module: "Ambiental" },
  { category: "Facility / EMS", label: "Puntos Monitoreo", delegate: "envMonitoringPoint", module: "Puntos Monitoreo" },
  { category: "Facility / EMS", label: "Rondas Ambientales", delegate: "envMonitoringRun", module: "Rondas Ambientales" },
  { category: "Facility / EMS", label: "Resultados Ambientales", delegate: "envMonitoringResult", module: "Resultados Ambientales" },
  { category: "Facility / EMS", label: "Excursiones Ambientales", delegate: "environmentalExcursion", module: "Excursiones Ambientales" },

  { category: "Calificación / Validación", label: "Calificación Equipos", delegate: "equipmentQualification", module: "Calificación Equipos" },
  { category: "Calificación / Validación", label: "Pruebas Calificación", delegate: "qualificationTest", module: "Pruebas Calificación" },
  { category: "Calificación / Validación", label: "Sistemas Críticos", delegate: "criticalUtilitySystem", module: "Sistemas Críticos" },
  { category: "Calificación / Validación", label: "Áreas Clasificadas", delegate: "classifiedArea", module: "Áreas Clasificadas" },
  { category: "Calificación / Validación", label: "Validación CSV", delegate: "validationProtocol", module: "Validación CSV" },
  { category: "Calificación / Validación", label: "Pruebas CSV", delegate: "validationTest", module: "Validación CSV" },
  { category: "Calificación / Validación", label: "Part 11 / Annex 11", delegate: "electronicRecordControl", module: "21 CFR Part 11" },

  { category: "Data Integrity", label: "ALCOA+", delegate: "dataIntegrityReview", module: "ALCOA+" },
  { category: "Data Integrity", label: "Revisión Audit Trail", delegate: "auditTrailReview", module: "Revisión Audit Trail" },
  { category: "Data Integrity", label: "Revisión Accesos", delegate: "accessPeriodicReview", module: "Revisión Accesos" },

  { category: "Dossier / Documentos", label: "Dossier Maestro", delegate: "dossierMaster", module: "Dossier Maestro" },
  { category: "Dossier / Documentos", label: "Secciones Dossier", delegate: "dossierSection", module: "Secciones Dossier" },
  { category: "Dossier / Documentos", label: "Radicaciones", delegate: "dossierSubmission", module: "Radicaciones" },
  { category: "Dossier / Documentos", label: "Plantillas", delegate: "documentTemplate", module: "Plantillas" },
  { category: "Dossier / Documentos", label: "Documentos Generados", delegate: "generatedDocument", module: "Documentos Generados" },

  { category: "Desarrollo Producto", label: "Formulaciones", delegate: "productFormulation", module: "Formulaciones" },
  { category: "Desarrollo Producto", label: "BOM", delegate: "billOfMaterial", module: "BOM Fórmula Maestra" },
  { category: "Desarrollo Producto", label: "Instrucciones Fabricación", delegate: "manufacturingInstruction", module: "Instrucciones Fabricación" },
  { category: "Desarrollo Producto", label: "Transferencia Tecnológica", delegate: "techTransferRecord", module: "Transferencia Tecnológica" },

  { category: "Postmercado", label: "Clientes", delegate: "customerAccount", module: "Clientes" },
  { category: "Postmercado", label: "Pedidos", delegate: "salesOrder", module: "Pedidos" },
  { category: "Postmercado", label: "Despachos", delegate: "dispatchRecord", module: "Despachos" },
  { category: "Postmercado", label: "Devoluciones", delegate: "returnRecord", module: "Devoluciones" },
  { category: "Postmercado", label: "Quejas", delegate: "complaintRecord", module: "Quejas" },
  { category: "Postmercado", label: "Recall", delegate: "recallRecord", module: "Recall" },
  { category: "Postmercado", label: "Farmacovigilancia", delegate: "pharmacovigilanceCase", module: "Farmacovigilancia" },

  { category: "Quality Intelligence", label: "Tendencias Calidad", delegate: "qualityTrend", module: "Tendencias Calidad" },
  { category: "Quality Intelligence", label: "Revisión Producto", delegate: "productQualityReview", module: "Revisión Producto" },
  { category: "Quality Intelligence", label: "Tendencias Estabilidad", delegate: "stabilityTrendReview", module: "Tendencias Estabilidad" },
  { category: "Quality Intelligence", label: "Capacidad Proceso", delegate: "processCapabilityReview", module: "Capacidad Proceso" },
  { category: "Quality Intelligence", label: "Indicadores", delegate: "kpiMetric", module: "Indicadores" },
  { category: "Quality Intelligence", label: "Objetivos", delegate: "businessObjective", module: "Objetivos" },
  { category: "Quality Intelligence", label: "Revisión Gerencial", delegate: "managementReview", module: "Revisión Gerencial" },
  { category: "Quality Intelligence", label: "Audit Readiness", delegate: "auditReadinessItem", module: "Audit Readiness" },
  { category: "Quality Intelligence", label: "Recomendaciones IA", delegate: "aiRecommendation", module: "Auditor IA" },
];

function summarizeRecord(record: any) {
  return {
    id: record.id,
    code: record.code || record.name || record.title || record.productName || record.batchCode || record.id,
    title:
      record.title ||
      record.productName ||
      record.equipmentName ||
      record.supplierName ||
      record.areaName ||
      record.metric ||
      record.standard ||
      record.requirement ||
      record.name ||
      null,
    status: record.status || record.approvalStatus || record.processStatus || record.trend || null,
    createdAt: record.createdAt || null,
  };
}

async function safeMetric(config: MetricConfig) {
  try {
    const delegate = (prisma as any)[config.delegate];

    if (!delegate) {
      return {
        ...config,
        ok: false,
        count: 0,
        recent: [],
        error: `Delegate Prisma no existe: ${config.delegate}`,
      };
    }

    const [count, recent] = await Promise.all([
      delegate.count(),
      delegate.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
      }).catch(() => []),
    ]);

    return {
      ...config,
      ok: true,
      count,
      recent: recent.map(summarizeRecord),
    };
  } catch (error) {
    return {
      ...config,
      ok: false,
      count: 0,
      recent: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function safeSignal(label: string, delegateName: string, where: any, severity: string, module: string) {
  try {
    const delegate = (prisma as any)[delegateName];

    if (!delegate) {
      return {
        label,
        count: 0,
        severity,
        module,
        ok: false,
        error: `Delegate no existe: ${delegateName}`,
      };
    }

    const count = await delegate.count({ where });

    return {
      label,
      count,
      severity,
      module,
      ok: true,
    };
  } catch (error) {
    return {
      label,
      count: 0,
      severity,
      module,
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET() {
  try {
    const metricResults = await Promise.all(metrics.map(safeMetric));

    const grouped = metricResults.reduce((acc: any[], metric) => {
      const existing = acc.find((item) => item.category === metric.category);

      if (existing) {
        existing.modules.push(metric);
        existing.total += metric.count;
        existing.errors += metric.ok ? 0 : 1;
      } else {
        acc.push({
          category: metric.category,
          total: metric.count,
          errors: metric.ok ? 0 : 1,
          modules: [metric],
        });
      }

      return acc;
    }, []);

    const signals = await Promise.all([
      safeSignal(
        "CAPA abiertas",
        "capaAction",
        { status: { notIn: ["Cerrada", "Completado", "Aprobada"] } },
        "Alta",
        "CAPA"
      ),
      safeSignal(
        "Desviaciones abiertas",
        "deviation",
        { status: { notIn: ["Cerrada", "Completado", "Aprobada"] } },
        "Alta",
        "Desviaciones"
      ),
      safeSignal(
        "Brechas normativas abiertas",
        "complianceGap",
        { status: { notIn: ["Cerrada", "Completado", "Aprobada"] } },
        "Alta",
        "Brechas Cumplimiento"
      ),
      safeSignal(
        "OOS abiertos",
        "oosInvestigation",
        { status: { notIn: ["Cerrada", "Completado", "Aprobada"] } },
        "Crítica",
        "OOS"
      ),
      safeSignal(
        "Excursiones ambientales abiertas",
        "environmentalExcursion",
        { status: { notIn: ["Cerrada", "Completado", "Aprobada"] } },
        "Alta",
        "Excursiones Ambientales"
      ),
      safeSignal(
        "Riesgos proveedor abiertos",
        "supplierRiskProfile",
        { status: { notIn: ["Cerrado", "Mitigado"] } },
        "Media",
        "Riesgo Proveedores"
      ),
      safeSignal(
        "Revisiones ALCOA+ abiertas",
        "dataIntegrityReview",
        { status: { notIn: ["Cerrada", "Cumple"] } },
        "Alta",
        "ALCOA+"
      ),
      safeSignal(
        "Transferencias tecnológicas abiertas",
        "techTransferRecord",
        { status: { notIn: ["Cerrada", "Transferida"] } },
        "Media",
        "Transferencia Tecnológica"
      ),
    ]);

    const totalRecords = metricResults.reduce((sum, item) => sum + item.count, 0);
    const totalModules = metricResults.length;
    const operationalModules = metricResults.filter((item) => item.ok).length;
    const modulesWithError = metricResults.filter((item) => !item.ok);
    const criticalSignals = signals.filter((item) => item.count > 0);
    const readiness =
      totalModules === 0 ? 0 : Math.round((operationalModules / totalModules) * 100);

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      app: "FloraTrack Enterprise",
      score: readiness,
      totals: {
        totalRecords,
        totalModules,
        operationalModules,
        modulesWithError: modulesWithError.length,
        criticalSignals: criticalSignals.length,
        categories: grouped.length,
      },
      signals,
      modulesWithError,
      grouped,
      recommendations: [
        readiness >= 95
          ? "La plataforma tiene una cobertura enterprise alta. Priorizar validación CSV, SOP de uso y capacitación."
          : "Existen módulos con errores o delegates faltantes. Ejecutar revisión técnica antes de auditoría.",
        criticalSignals.length > 0
          ? "Existen señales abiertas de calidad/regulatorio. Priorizar CAPA, OOS, brechas y excursiones ambientales."
          : "No se detectan señales críticas abiertas en el Control Tower.",
        "Recomendación: usar Exportaciones + Generador Documental para crear paquetes de auditoría por área.",
        "Recomendación: después de cada migración nueva, reiniciar npm run dev si Prisma Client no refresca.",
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
