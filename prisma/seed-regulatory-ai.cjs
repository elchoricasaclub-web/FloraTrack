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
    id: row.id || id("regai"),
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
  await safe("Knowledge Colombia Cannabis", () =>
    insertOrIgnore("RegulatoryAiKnowledgePack", {
      code: "AI-KNOW-COL-CANNABIS",
      packName: "Colombia Cannabis Medicinal",
      jurisdiction: "Colombia",
      regulatoryArea: "Licencias, cupos, derivados, semillas, cultivo, INVIMA, ICA",
      sourceType: "Normativa legal / guía interna",
      summary: "Marco base para operaciones de cannabis medicinal y científico en Colombia.",
      applicability: "Growlifecol, cultivo, derivados, micropropagación, laboratorio y Live Rosin sujeto a licencias.",
      confidenceLevel: "Alta",
      status: "Activo",
    })
  );

  await safe("Knowledge WHO EMA GACP", () =>
    insertOrIgnore("RegulatoryAiKnowledgePack", {
      code: "AI-KNOW-GACP",
      packName: "WHO / EMA GACP",
      jurisdiction: "Internacional / Unión Europea",
      regulatoryArea: "Cultivo, cosecha, material vegetal medicinal",
      sourceType: "Guía regulatoria",
      summary: "Buenas prácticas agrícolas y de recolección aplicables a plantas medicinales y material herbal.",
      applicability: "Cultivo, flores farmacéuticas, material vegetal, trazabilidad de genética y cosecha.",
      confidenceLevel: "Alta",
      status: "Activo",
    })
  );

  await safe("Knowledge ISO17025", () =>
    insertOrIgnore("RegulatoryAiKnowledgePack", {
      code: "AI-KNOW-ISO17025",
      packName: "ISO/IEC 17025 Laboratorio QC",
      jurisdiction: "Internacional / ONAC Colombia",
      regulatoryArea: "Laboratorios de ensayo y calibración",
      sourceType: "Acreditación / estándar técnico",
      summary: "Competencia técnica, imparcialidad y validez de resultados de laboratorio.",
      applicability: "COA, métodos, incertidumbre, instrumentos, calibración, ensayos de aptitud.",
      confidenceLevel: "Alta",
      status: "Activo",
    })
  );

  await safe("Rule COA Release", () =>
    insertOrIgnore("RegulatoryAiRule", {
      code: "AI-RULE-COA-RELEASE",
      ruleName: "Bloqueo de liberación sin COA aprobado",
      jurisdiction: "Internacional / Colombia",
      operationType: "GMP / Live Rosin / Producto terminado",
      triggerCondition: "Lote terminado en cuarentena o liberación pendiente.",
      recommendationLogic: "Solicitar COA aprobado, revisión QA, firma electrónica y cierre de batch record.",
      riskLevel: "Crítico",
      status: "Activo",
    })
  );

  await safe("Rule Micro Contamination", () =>
    insertOrIgnore("RegulatoryAiRule", {
      code: "AI-RULE-MICRO-CONT",
      ruleName: "Contaminación en micropropagación",
      jurisdiction: "Internacional",
      operationType: "Micropropagación vegetal",
      triggerCondition: "Evento de contaminación abierto o recurrente.",
      recommendationLogic: "Bloquear lote, investigar causa, revisar limpieza, sala, cabina, medio, operador y abrir CAPA si aplica.",
      riskLevel: "Alto",
      status: "Activo",
    })
  );

  await safe("Assessment Growlifecol", () =>
    insertOrIgnore("RegulatoryAiAssessment", {
      code: "AI-ASSESS-GROW-001",
      tenantCode: "TENANT-GROWLIFECOL",
      companyName: "Growlifecol / FloraTrack Demo",
      country: "Colombia",
      operationScope: "GACP, GMP, micropropagación, Live Rosin, LIMS, ISO 17025, SaaS regulatorio",
      assessmentType: "Evaluación inicial RegTech",
      score: "75",
      conclusion: "Arquitectura amplia creada; faltan evidencias, cierre CSV, MFA, auditoría formal y documentos finales.",
      assessedBy: "Motor IA Regulatorio",
      status: "Borrador",
    })
  );

  await safe("Recommendation CSV", () =>
    insertOrIgnore("RegulatoryAiRecommendation", {
      code: "AI-REC-CSV-001",
      tenantCode: "TENANT-GROWLIFECOL",
      moduleName: "Validación CSV Enterprise",
      recommendationTitle: "Cerrar URS, RTM, OQ/PQ y reporte final",
      recommendationText: "Antes de declarar FloraTrack listo para uso regulado, se deben aprobar URS, ejecutar pruebas IQ/OQ/PQ, cerrar desviaciones y emitir reporte final.",
      priority: "Crítica",
      regulatoryImpact: "Data Integrity / GxP / sistema computarizado",
      targetDate: "2026-07-31",
      ownerRole: "QA / CSV Lead",
      status: "Abierta",
    })
  );

  await safe("Gap MFA", () =>
    insertOrIgnore("RegulatoryAiGapFinding", {
      code: "AI-GAP-MFA-001",
      tenantCode: "TENANT-GROWLIFECOL",
      gapArea: "Seguridad / RBAC",
      gapDescription: "MFA pendiente para usuarios críticos y administradores.",
      applicableStandard: "Data Integrity / Part 11 / Annex 11 readiness",
      severity: "Alta",
      suggestedCapa: "Implementar política MFA y registrar verificación de acceso.",
      evidenceRequired: "Captura configuración MFA, revisión de acceso y prueba de control.",
      status: "Abierta",
    })
  );

  await safe("Country Comparison Colombia UE", () =>
    insertOrIgnore("RegulatoryAiCountryComparison", {
      code: "AI-COUNTRY-COL-EU-001",
      sourceCountry: "Colombia",
      targetCountry: "Unión Europea",
      operationType: "Cannabis medicinal / material vegetal / derivados",
      differenceSummary: "La exportación premium exige mayor robustez documental, GACP/GMP, COA confiable y auditoría de proveedores.",
      additionalRequirements: "EMA GACP, EU GMP según producto, ISO 17025 para laboratorio, trazabilidad completa y dossier técnico.",
      exportImpact: "Alto impacto; requiere paquete documental y auditoría previa.",
      readinessStatus: "En análisis",
      status: "Activo",
    })
  );

  await safe("Operation Profile Full", () =>
    insertOrIgnore("RegulatoryAiOperationProfile", {
      code: "AI-OP-GROW-001",
      tenantCode: "TENANT-GROWLIFECOL",
      operationName: "Plataforma cannabis medicinal multidisciplinaria",
      industry: "Cannabis medicinal, flores farmacéuticas, micropropagación, extracción solventless, laboratorio QC",
      activities: "Cultivo, genética, propagación, micropropagación, biomasa, Live Rosin, laboratorio, COA, cumplimiento regulatorio.",
      licensesNeeded: "Licencias cannabis Colombia, ICA/INVIMA/FNE/MinJusticia según modalidad.",
      standardsRecommended: "WHO GACP, EMA GACP, GMP, ISO 14644, ISO/IEC 17025, ASTM D37.",
      premiumCertifications: "ISO 9001, ISO 17025 acreditado, GACP/GMP auditado, ISO 14001/45001.",
      riskLevel: "Alto",
      status: "Activo",
    })
  );

  await safe("Evidence Request Licenses", () =>
    insertOrIgnore("RegulatoryAiEvidenceRequest", {
      code: "AI-EVID-LIC-001",
      tenantCode: "TENANT-GROWLIFECOL",
      requirementRef: "COL-CANNABIS-811-227",
      evidenceTitle: "Licencias y modalidades autorizadas",
      evidenceReason: "Definir operaciones permitidas por empresa, sede y producto.",
      ownerRole: "Representante legal / Regulatorio",
      dueDate: "2026-07-15",
      approvalStatus: "Pendiente",
      status: "Abierta",
    })
  );

  await safe("Question Log", () =>
    insertOrIgnore("RegulatoryAiQuestionLog", {
      code: "AI-Q-001",
      tenantCode: "TENANT-GROWLIFECOL",
      userQuestion: "¿Qué falta para que FloraTrack sea una plataforma SaaS regulatoria audit-ready?",
      answerSummary: "Cerrar CSV, evidencias, MFA/RBAC, documentación maestra, auditoría interna, CAPA y exportación de expediente.",
      sourceScope: "Módulos internos FloraTrack y matriz regulatoria",
      confidenceLevel: "Alta",
      followUpAction: "Crear Audit Readiness Final y expediente maestro exportable.",
      status: "Registrada",
    })
  );

  await safe("Roadmap Audit Ready", () =>
    insertOrIgnore("RegulatoryAiRoadmapItem", {
      code: "AI-ROAD-AUDIT-001",
      tenantCode: "TENANT-GROWLIFECOL",
      roadmapArea: "Audit Ready Final",
      roadmapAction: "Consolidar evidencia, cerrar CSV, ejecutar auditoría interna y generar expediente final.",
      phase: "Fase final enterprise",
      priority: "Crítica",
      dependency: "CSV, RBAC, Document Generator, Audit Builder, App Doctor",
      expectedOutcome: "FloraTrack preparado para demo regulatoria y auditoría interna.",
      status: "Pendiente",
    })
  );

  console.log("SEED REGULATORY AI COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
