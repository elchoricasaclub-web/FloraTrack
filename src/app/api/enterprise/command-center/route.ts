import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

async function safeCount(delegateName: string, where: any = undefined) {
  try {
    const delegate = (prisma as any)[delegateName];

    if (!delegate) {
      return {
        ok: false,
        count: 0,
        error: `Delegate no existe: ${delegateName}`,
      };
    }

    const count = await delegate.count(where ? { where } : undefined);

    return {
      ok: true,
      count,
      error: "",
    };
  } catch (error) {
    return {
      ok: false,
      count: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function safeRecent(delegateName: string, take = 5) {
  try {
    const delegate = (prisma as any)[delegateName];

    if (!delegate) {
      return [];
    }

    const data = await delegate.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take,
    });

    return data.map((item: any) => ({
      id: item.id,
      code:
        item.code ||
        item.title ||
        item.productName ||
        item.batchCode ||
        item.supplierName ||
        item.areaName ||
        item.id,
      title:
        item.title ||
        item.productName ||
        item.issue ||
        item.metric ||
        item.standard ||
        item.requirement ||
        item.supplierName ||
        item.areaName ||
        item.processName ||
        item.equipmentName ||
        null,
      status:
        item.status ||
        item.approvalStatus ||
        item.processStatus ||
        item.trend ||
        null,
      owner:
        item.owner ||
        item.responsible ||
        item.auditor ||
        item.analyst ||
        item.performedBy ||
        item.executedBy ||
        null,
      createdAt: item.createdAt || null,
    }));
  } catch {
    return [];
  }
}

function openStatusWhere() {
  return {
    status: {
      notIn: [
        "Cerrada",
        "Cerrado",
        "Completado",
        "Completada",
        "Aprobada",
        "Aprobado",
        "Cumple",
        "Liberado",
        "Liberada",
        "Transferida",
        "Mitigado",
        "Mitigada",
      ],
    },
  };
}

export async function GET() {
  try {
    const [
      companies,
      users,
      farms,
      genetics,
      crops,
      harvests,
      samples,
      analyses,
      coas,
      licenses,
      quotas,
      peas,
      ica,
      invima,
      sops,
      records,
      signatures,
      suppliers,
      rawMaterials,
      products,
      equipment,
      environmentalPoints,
      environmentalExcursions,
      capaOpen,
      deviationsOpen,
      oosOpen,
      gapsOpen,
      supplierRisksOpen,
      dataIntegrityOpen,
      pqrOpen,
      techTransferOpen,
      auditTrail,
      generatedDocuments,
      backups,
    ] = await Promise.all([
      safeCount("company"),
      safeCount("user"),
      safeCount("farm"),
      safeCount("genetic"),
      safeCount("crop"),
      safeCount("harvest"),
      safeCount("sample"),
      safeCount("analysis"),
      safeCount("cOA"),
      safeCount("regulatoryLicense"),
      safeCount("quota"),
      safeCount("peasRecord"),
      safeCount("icaRecord"),
      safeCount("invimaProcedure"),
      safeCount("sopDocument"),
      safeCount("controlledRecord"),
      safeCount("electronicSignature"),
      safeCount("supplier"),
      safeCount("rawMaterial"),
      safeCount("product"),
      safeCount("equipment"),
      safeCount("envMonitoringPoint"),
      safeCount("environmentalExcursion", openStatusWhere()),
      safeCount("capaAction", openStatusWhere()),
      safeCount("deviation", openStatusWhere()),
      safeCount("oosInvestigation", openStatusWhere()),
      safeCount("complianceGap", openStatusWhere()),
      safeCount("supplierRiskProfile", openStatusWhere()),
      safeCount("dataIntegrityReview", openStatusWhere()),
      safeCount("productQualityReview", openStatusWhere()),
      safeCount("techTransferRecord", openStatusWhere()),
      safeCount("auditTrail"),
      safeCount("generatedDocument"),
      safeCount("backupRecord"),
    ]);

    const pillars = [
      {
        key: "executive",
        title: "Comando Ejecutivo",
        description: "Control Tower, App Doctor, motor de reglas, alertas, calendario y reportes.",
        modules: ["Control Tower", "App Doctor", "Motor Reglas", "Dashboard", "Alertas", "Reportes"],
        score: 95,
        records: auditTrail.count + generatedDocuments.count + backups.count,
        status: "Operativo",
      },
      {
        key: "gacp",
        title: "Operación Agrícola GACP",
        description: "Predios, genética, cultivos, propagación, cosecha, trazabilidad agrícola y lotes.",
        modules: ["Predios", "GIS", "Genéticas", "Propagación", "Cultivos", "Cosecha", "Genealogía Lotes"],
        score: farms.count + genetics.count + crops.count + harvests.count > 0 ? 90 : 65,
        records: farms.count + genetics.count + crops.count + harvests.count,
        status: "En construcción avanzada",
      },
      {
        key: "gmp",
        title: "Producción GMP / Derivados",
        description: "Producción, batch records, BHO, Live Rosin, envasado, retención y estabilidad.",
        modules: ["Producción", "Batch Records", "Envasado", "Estabilidad", "Retención", "Rendimientos Proceso"],
        score: 85,
        records: products.count,
        status: "Base técnica lista",
      },
      {
        key: "lims",
        title: "Laboratorio LIMS / COA",
        description: "Muestras, análisis, COA, métodos analíticos, especificaciones, OOS y cadena de custodia.",
        modules: ["Muestras", "Análisis", "COA", "Métodos Analíticos", "Especificaciones", "OOS"],
        score: samples.count + analyses.count + coas.count > 0 ? 92 : 70,
        records: samples.count + analyses.count + coas.count + oosOpen.count,
        status: oosOpen.count > 0 ? "Con alertas OOS" : "Operativo",
      },
      {
        key: "regulatory",
        title: "Regulatorio Colombia",
        description: "Licencias, cupos, PEAS, ICA, INVIMA, vencimientos, requisitos, brechas y radicaciones.",
        modules: ["Licencias", "Cupos", "PEAS", "Registros ICA", "Trámites INVIMA", "Brechas Cumplimiento"],
        score: gapsOpen.count > 0 ? 75 : 90,
        records: licenses.count + quotas.count + peas.count + ica.count + invima.count,
        status: gapsOpen.count > 0 ? "Brechas abiertas" : "Operativo",
      },
      {
        key: "qms",
        title: "Sistema de Calidad QMS",
        description: "SOP, registros, firmas electrónicas, CAPA, desviaciones, auditorías y control de cambios.",
        modules: ["SOP", "Registros", "Firmas", "CAPA", "Desviaciones", "Auditorías", "Control Cambios"],
        score: capaOpen.count + deviationsOpen.count > 0 ? 72 : 92,
        records: sops.count + records.count + signatures.count + capaOpen.count + deviationsOpen.count,
        status: capaOpen.count + deviationsOpen.count > 0 ? "Acciones QA abiertas" : "Operativo",
      },
      {
        key: "supplier",
        title: "Inventario / Supplier QA",
        description: "Proveedores, compras, recepción, cuarentena, liberación, materias primas y homologación.",
        modules: ["Proveedores", "Compras", "Recepción", "Cuarentena", "Liberación", "Homologación Proveedores"],
        score: supplierRisksOpen.count > 0 ? 78 : 90,
        records: suppliers.count + rawMaterials.count + supplierRisksOpen.count,
        status: supplierRisksOpen.count > 0 ? "Riesgos proveedor abiertos" : "Operativo",
      },
      {
        key: "facility",
        title: "Facility / EMS / Validación",
        description: "Equipos, calibraciones, mantenimiento, limpieza, monitoreo ambiental, calificación y validación.",
        modules: ["Equipos", "Calibraciones", "Mantenimiento", "Puntos Monitoreo", "Excursiones Ambientales", "Calificación Equipos"],
        score: environmentalExcursions.count > 0 ? 76 : 90,
        records: equipment.count + environmentalPoints.count + environmentalExcursions.count,
        status: environmentalExcursions.count > 0 ? "Excursiones ambientales abiertas" : "Operativo",
      },
      {
        key: "data",
        title: "Data Integrity / CSV",
        description: "ALCOA+, audit trail, revisión de accesos, validación CSV, Part 11 y Annex 11.",
        modules: ["ALCOA+", "Revisión Audit Trail", "Revisión Accesos", "Validación CSV", "21 CFR Part 11"],
        score: dataIntegrityOpen.count > 0 ? 74 : 88,
        records: dataIntegrityOpen.count + auditTrail.count,
        status: dataIntegrityOpen.count > 0 ? "Revisión DI abierta" : "Operativo",
      },
      {
        key: "development",
        title: "Desarrollo Producto",
        description: "Formulaciones, BOM, instrucciones maestras, transferencia tecnológica, PQR/APR y tendencias.",
        modules: ["Formulaciones", "BOM Fórmula Maestra", "Instrucciones Fabricación", "Transferencia Tecnológica", "Revisión Producto"],
        score: techTransferOpen.count + pqrOpen.count > 0 ? 80 : 90,
        records: techTransferOpen.count + pqrOpen.count,
        status: techTransferOpen.count > 0 ? "Transferencias abiertas" : "Operativo",
      },
    ];

    const alerts = [
      {
        label: "CAPA abiertas",
        count: capaOpen.count,
        severity: "Alta",
        module: "CAPA",
      },
      {
        label: "Desviaciones abiertas",
        count: deviationsOpen.count,
        severity: "Alta",
        module: "Desviaciones",
      },
      {
        label: "OOS abiertos",
        count: oosOpen.count,
        severity: "Crítica",
        module: "OOS",
      },
      {
        label: "Brechas regulatorias",
        count: gapsOpen.count,
        severity: "Alta",
        module: "Brechas Cumplimiento",
      },
      {
        label: "Riesgos proveedor",
        count: supplierRisksOpen.count,
        severity: "Media",
        module: "Riesgo Proveedores",
      },
      {
        label: "Excursiones ambientales",
        count: environmentalExcursions.count,
        severity: "Alta",
        module: "Excursiones Ambientales",
      },
      {
        label: "Data Integrity abierta",
        count: dataIntegrityOpen.count,
        severity: "Alta",
        module: "ALCOA+",
      },
      {
        label: "Transferencias tecnológicas",
        count: techTransferOpen.count,
        severity: "Media",
        module: "Transferencia Tecnológica",
      },
    ];

    const totalRecords = pillars.reduce((sum, item) => sum + item.records, 0);
    const totalAlerts = alerts.reduce((sum, item) => sum + item.count, 0);
    const averageScore = Math.round(
      pillars.reduce((sum, item) => sum + item.score, 0) / pillars.length
    );

    const recent = {
      auditTrail: await safeRecent("auditTrail", 8),
      documents: await safeRecent("generatedDocument", 5),
      capa: await safeRecent("capaAction", 5),
      deviations: await safeRecent("deviation", 5),
      oos: await safeRecent("oosInvestigation", 5),
      regulatory: await safeRecent("complianceGap", 5),
    };

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      app: "FloraTrack Enterprise Command Center",
      score: averageScore,
      totals: {
        pillars: pillars.length,
        totalRecords,
        totalAlerts,
        criticalAlerts: alerts.filter((item) => item.severity === "Crítica" && item.count > 0).length,
        companies: companies.count,
        users: users.count,
      },
      pillars,
      alerts,
      recent,
      recommendations: [
        totalAlerts > 0
          ? "Hay alertas activas. Priorizar Motor Reglas, CAPA, OOS, brechas regulatorias y excursiones ambientales."
          : "No se detectan alertas abiertas relevantes.",
        "Usar Control Tower para visión global de registros y App Doctor para estabilidad técnica.",
        "Usar Exportaciones y Generador Documental para paquetes de auditoría, radicación y revisión gerencial.",
        "Próximo objetivo técnico recomendado: consolidar Dashboard visual, PDF/Word exportable y validación CSV del sistema.",
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
