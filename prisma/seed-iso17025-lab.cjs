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
    id: row.id || id("lab"),
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
  await safe("ISO Scope", () =>
    insertOrIgnore("Iso17025AccreditationScope", {
      code: "ISO17025-SCOPE-001",
      companyName: "FloraTrack Demo / Growlifecol",
      labName: "Laboratorio QC Cannabis Medicinal",
      accreditationBody: "ONAC / Organismo acreditador aplicable",
      country: "Colombia",
      standardVersion: "ISO/IEC 17025:2017",
      testAreas: "Potencia cannabinoides, humedad, microbiologia, contaminantes, terpenos",
      scopeStatus: "En implementacion",
      expiryDate: "Pendiente",
      responsible: "Jefe Laboratorio QC",
      status: "Activo",
    })
  );

  await safe("Requirement ISO17025-REQ-001", () =>
    insertOrIgnore("Iso17025RequirementItem", {
      code: "ISO17025-REQ-001",
      clauseCode: "7.2",
      clauseTitle: "Selección, verificación y validación de métodos",
      requirementText: "El laboratorio debe usar métodos apropiados y asegurar que estén validados o verificados para su uso previsto.",
      evidenceRequired: "Protocolo de validación, reporte, criterios de aceptación, aprobación QA.",
      sopRequired: "SOP-LAB-MET-VAL",
      responsibleRole: "Jefe Laboratorio / QA",
      riskLevel: "Alto",
      status: "Vigente",
    })
  );

  await safe("Method Validation VAL-MET-001", () =>
    insertOrIgnore("LabMethodValidationRecord", {
      code: "VAL-MET-001",
      methodCode: "MET-CAN-HPLC-001",
      methodName: "Cuantificación cannabinoides por HPLC",
      matrixType: "Flor / extracto / Live Rosin",
      validationParameters: "Linealidad, precisión, exactitud, especificidad, rango, robustez",
      acceptanceCriteria: "Según protocolo aprobado",
      validationStatus: "Pendiente aprobacion final",
      approvedBy: "QA / Jefe Laboratorio",
      status: "Borrador",
    })
  );

  await safe("Instrument INS-LAB-001", () =>
    insertOrIgnore("LabInstrumentControl", {
      code: "INS-LAB-001",
      instrumentName: "HPLC QC",
      instrumentType: "Cromatografía líquida",
      serialNumber: "HPLC-001",
      location: "Laboratorio QC",
      calibrationDueDate: "2026-12-31",
      qualificationStatus: "IQ/OQ/PQ pendiente",
      maintenanceStatus: "Planificado",
      responsible: "Jefe Laboratorio",
      status: "Activo",
    })
  );

  await safe("Calibration CAL-17025-001", () =>
    insertOrIgnore("LabCalibrationRecord17025", {
      code: "CAL-17025-001",
      instrumentCode: "INS-LAB-001",
      calibrationDate: "2026-06-14",
      dueDate: "2026-12-14",
      provider: "Proveedor acreditado / aprobado",
      certificateNumber: "CERT-CAL-001",
      result: "Conforme",
      uncertainty: "Según certificado",
      status: "Vigente",
    })
  );

  await safe("Uncertainty UNC-001", () =>
    insertOrIgnore("LabMeasurementUncertainty", {
      code: "UNC-001",
      methodCode: "MET-CAN-HPLC-001",
      analyte: "THC / CBD",
      matrixType: "Flor y extractos",
      uncertaintyValue: "Pendiente estimación",
      coverageFactor: "k=2",
      confidenceLevel: "95%",
      reviewedBy: "Jefe Laboratorio",
      status: "En revision",
    })
  );

  await safe("Proficiency PT-001", () =>
    insertOrIgnore("LabProficiencyTestRecord", {
      code: "PT-001",
      provider: "Proveedor ensayo aptitud",
      roundCode: "ROUND-CAN-001",
      analyte: "Cannabinoides",
      methodCode: "MET-CAN-HPLC-001",
      resultEvaluation: "Pendiente",
      correctiveAction: "No aplica hasta resultado",
      responsible: "Jefe Laboratorio",
      status: "Pendiente",
    })
  );

  await safe("Custody CUST-17025-001", () =>
    insertOrIgnore("LabSampleCustody17025", {
      code: "CUST-17025-001",
      sampleCode: "SMP-LR-001",
      receivedBy: "Analista QC",
      receivedDate: "2026-06-14",
      conditionAtReceipt: "Muestra íntegra / cadena de custodia registrada",
      storageCondition: "Almacenamiento controlado",
      custodyStatus: "Recibida",
      status: "Activa",
    })
  );

  await safe("Review REV-RES-001", () =>
    insertOrIgnore("LabResultReviewRecord", {
      code: "REV-RES-001",
      sampleCode: "SMP-LR-001",
      methodCode: "MET-CAN-HPLC-001",
      analyst: "Analista QC",
      resultSummary: "Resultados pendientes de revisión final",
      specificationDecision: "Pendiente",
      reviewer: "Jefe Laboratorio",
      reviewStatus: "Pendiente revision",
      status: "Activo",
    })
  );

  await safe("Control Chart CC-LAB-001", () =>
    insertOrIgnore("LabControlChartRecord", {
      code: "CC-LAB-001",
      methodCode: "MET-CAN-HPLC-001",
      qcSample: "QC-CAN-001",
      parameterName: "Respuesta estándar",
      valueRecorded: "Pendiente",
      trendStatus: "Normal",
      investigationRequired: "No",
      status: "Activo",
    })
  );

  console.log("SEED ISO 17025 LAB COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
