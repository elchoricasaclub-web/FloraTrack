const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function escapeSql(value) {
  return String(value ?? "").replace(/'/g, "''");
}

function nowIso() {
  return new Date().toISOString();
}

function id(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

async function insertOrIgnore(table, row) {
  const fullRow = {
    id: row.id || id("csv"),
    ...row,
    createdAt: row.createdAt || nowIso(),
    updatedAt: row.updatedAt || nowIso(),
  };

  const columns = Object.keys(fullRow);
  const sqlColumns = columns.map((column) => `"${column}"`).join(", ");
  const sqlValues = columns
    .map((column) => `'${escapeSql(fullRow[column])}'`)
    .join(", ");

  const sql = `INSERT OR IGNORE INTO "${table}" (${sqlColumns}) VALUES (${sqlValues})`;

  await prisma.$executeRawUnsafe(sql);
}

async function safe(label, fn) {
  try {
    await fn();
    console.log("OK:", label);
  } catch (error) {
    console.log("WARN:", label, error.message);
  }
}

async function main() {
  await safe("Master Plan CSV", () =>
    insertOrIgnore("CsvValidationMasterPlan", {
      code: "CSV-VMP-001",
      systemName: "FloraTrack Enterprise Compliance Platform",
      systemVersion: "MVP Enterprise",
      validationScope: "Módulos GACP, GMP, LIMS, QMS, Regulatorio, Micropropagación, Live Rosin, ISO 17025, SaaS y RBAC.",
      validationApproach: "Validación basada en riesgo con URS, FRS, matriz de trazabilidad, IQ/OQ/PQ y reporte final.",
      riskBasedRationale: "Sistema con impacto GxP por trazabilidad, calidad, liberación QA, COA, registros electrónicos y auditoría.",
      ownerRole: "QA / CSV Lead",
      approvalStatus: "Pendiente aprobación",
      status: "Activo",
    })
  );

  await safe("System Inventory", () =>
    insertOrIgnore("CsvSystemInventory", {
      code: "CSV-SYS-001",
      systemName: "FloraTrack",
      moduleName: "Full Enterprise Suite",
      gxpImpact: "Si",
      dataCriticality: "Alta",
      supplier: "Desarrollo interno",
      hostingModel: "Local dev / SaaS futuro",
      validationCategory: "GAMP configurable / custom application",
      status: "Activo",
    })
  );

  await safe("URS", () =>
    insertOrIgnore("CsvUserRequirement", {
      code: "URS-001",
      requirementTitle: "Control de trazabilidad regulatoria",
      requirementText: "El sistema debe permitir reconstruir la trazabilidad desde genética, cultivo, lote, laboratorio, COA y liberación.",
      businessProcess: "GACP/GMP/LIMS",
      regulatoryReference: "GACP, GMP, Data Integrity, trazabilidad farmacéutica",
      priority: "Crítica",
      acceptanceCriteria: "El usuario puede consultar registros relacionados y exportar evidencia del lote.",
      approvalStatus: "Pendiente",
      status: "Activo",
    })
  );

  await safe("FRS", () =>
    insertOrIgnore("CsvFunctionalRequirement", {
      code: "FRS-001",
      ursCode: "URS-001",
      functionName: "Trazabilidad por lote",
      functionDescription: "Relacionar genética, cultivo, cosecha, biomasa, proceso, muestra, análisis, COA y liberación QA.",
      moduleName: "Trazabilidad / Live Rosin / LIMS",
      technicalControl: "Identificadores de lote, APIs, audit trail y módulos conectados.",
      testable: "Si",
      status: "Activo",
    })
  );

  await safe("Risk", () =>
    insertOrIgnore("CsvRiskAssessment", {
      code: "CSV-RISK-001",
      processName: "Liberación de lote",
      failureMode: "Lote liberado sin COA aprobado o sin revisión QA.",
      impact: "Alto impacto regulatorio y de calidad.",
      probability: "Media",
      detectability: "Media",
      riskPriority: "Alta",
      mitigation: "Estado cuarentena, firma QA, COA obligatorio y audit trail.",
      residualRisk: "Medio si controles se validan.",
      status: "Abierto",
    })
  );

  await safe("Traceability", () =>
    insertOrIgnore("CsvTraceabilityMatrix", {
      code: "CSV-RTM-001",
      ursCode: "URS-001",
      frsCode: "FRS-001",
      riskCode: "CSV-RISK-001",
      testScriptCode: "CSV-TEST-OQ-001",
      evidenceRef: "Evidencia de consulta de trazabilidad y exportación.",
      traceStatus: "Pendiente",
      status: "Activo",
    })
  );

  await safe("Test Script", () =>
    insertOrIgnore("CsvTestScript", {
      code: "CSV-TEST-OQ-001",
      testType: "OQ",
      testTitle: "Verificar trazabilidad completa del lote",
      moduleName: "Trazabilidad / Live Rosin / LIMS",
      objective: "Confirmar que el sistema permite consultar y evidenciar trazabilidad de lote.",
      preconditions: "Datos demo cargados, usuario autorizado, módulos activos.",
      steps: "Abrir lote, consultar origen, revisar COA, verificar liberación QA y exportar evidencia.",
      expectedResult: "Trazabilidad visible, registros completos y sin error crítico.",
      approvalStatus: "Pendiente",
      status: "Borrador",
    })
  );

  await safe("Execution", () =>
    insertOrIgnore("CsvTestExecution", {
      code: "CSV-EXEC-001",
      testScriptCode: "CSV-TEST-OQ-001",
      executedBy: "QA / CSV",
      executionDate: "2026-06-14",
      actualResult: "Pendiente ejecución formal",
      passFail: "Pendiente",
      evidence: "Captura de pantalla / export JSON / audit trail",
      reviewer: "QA Manager",
      status: "Pendiente",
    })
  );

  await safe("Deviation", () =>
    insertOrIgnore("CsvValidationDeviation", {
      code: "CSV-DEV-001",
      testExecutionCode: "CSV-EXEC-001",
      deviationTitle: "Pendiente formalización de evidencia de prueba",
      severity: "Media",
      rootCause: "Validación en desarrollo incremental.",
      correctiveAction: "Ejecutar prueba formal y adjuntar evidencia.",
      impactAssessment: "No liberar versión productiva hasta cierre.",
      closureStatus: "Abierta",
      status: "Activo",
    })
  );

  await safe("Report", () =>
    insertOrIgnore("CsvValidationReport", {
      code: "CSV-RPT-001",
      reportTitle: "Reporte Final de Validación FloraTrack",
      systemName: "FloraTrack Enterprise Compliance Platform",
      summary: "Reporte preliminar de validación CSV para sistema regulatorio.",
      deviationsSummary: "Desviaciones abiertas pendientes de cierre.",
      finalConclusion: "Sistema en fase de validación; no liberar productivo hasta cierre CSV.",
      approvedBy: "QA / Dirección",
      approvalDate: "",
      reportStatus: "Borrador",
      status: "Activo",
    })
  );

  await safe("Periodic Review", () =>
    insertOrIgnore("CsvPeriodicReview", {
      code: "CSV-PR-001",
      systemName: "FloraTrack Enterprise Compliance Platform",
      reviewPeriod: "Trimestral / Semestral",
      reviewer: "QA / CSV",
      changeSummary: "Cambios incrementales de módulos enterprise.",
      incidentsSummary: "Pendiente revisión posterior a estabilización.",
      auditTrailSummary: "Audit trail debe revisarse por periodo.",
      continuedValidation: "Pendiente hasta completar IQ/OQ/PQ.",
      reviewStatus: "Pendiente",
      status: "Activo",
    })
  );

  console.log("SEED CSV VALIDATION ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
