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
    id: row.id || id("aigw"),
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
  await safe("Provider External", () =>
    insertOrIgnore("EnterpriseAiProviderConnection", {
      code: "AI-PROV-EXTERNAL-001",
      providerName: "Proveedor IA externo principal",
      providerType: "External LLM API",
      baseUrlRef: "AI_PROVIDER_BASE_URL",
      secretEnvName: "AI_PROVIDER_API_KEY",
      dataPolicy: "No enviar datos personales, secretos, expedientes completos ni información sensible sin aprobación.",
      enabledModules: "Regulatory AI, Document Generator, Audit Builder, CAPA, CSV, QMS",
      connectionMode: "Pendiente configuracion ENV",
      status: "Pendiente",
    })
  );

  await safe("Provider Private Future", () =>
    insertOrIgnore("EnterpriseAiProviderConnection", {
      code: "AI-PROV-PRIVATE-RAG",
      providerName: "RAG privado FloraTrack futuro",
      providerType: "Private RAG / Vector DB",
      baseUrlRef: "PRIVATE_RAG_ENDPOINT",
      secretEnvName: "PRIVATE_RAG_TOKEN",
      dataPolicy: "Uso exclusivo con documentos aprobados, indexados y versionados por tenant.",
      enabledModules: "SOP, Dossier, Auditorias, Certificaciones, LIMS, Micropropagacion, Live Rosin",
      connectionMode: "Diseño futuro",
      status: "Planeado",
    })
  );

  await safe("Model RegTech", () =>
    insertOrIgnore("EnterpriseAiModelProfile", {
      code: "AI-MODEL-REGTECH-001",
      providerCode: "AI-PROV-EXTERNAL-001",
      modelAlias: "regtech-reasoning",
      useCase: "Análisis regulatorio, brechas, recomendaciones, expedientes y auditoría.",
      temperaturePolicy: "Baja para cumplimiento regulatorio",
      maxTokensPolicy: "Controlado por módulo",
      costTier: "Enterprise",
      validationStatus: "Pendiente CSV",
      status: "Activo",
    })
  );

  await safe("Prompt Gap Assessment", () =>
    insertOrIgnore("EnterpriseAiPromptTemplate", {
      code: "AI-PROMPT-GAP-001",
      templateName: "Gap Assessment Regulatorio",
      moduleName: "Inteligencia Regulatoria IA",
      promptPurpose: "Analizar requisitos, evidencias y brechas para generar recomendaciones auditables.",
      systemInstruction: "Responder como asistente regulatorio. No emitir autorización legal. Exigir revisión humana QA/regulatoria.",
      userInputSchema: "tenantCode, country, operationScope, standards, evidenceSummary",
      outputSchema: "score, gaps, recommendations, evidenceRequests, humanReviewRequired",
      riskLevel: "Alto",
      approvalStatus: "Pendiente QA",
      status: "Borrador",
    })
  );

  await safe("Context Regulatory Tables", () =>
    insertOrIgnore("EnterpriseAiContextSource", {
      code: "AI-CTX-REG-001",
      sourceName: "Matriz normativa y evidencia FloraTrack",
      sourceType: "Database tables",
      moduleName: "Certificaciones / Regulatory AI",
      freshnessPolicy: "Actualizar antes de cada evaluación crítica",
      allowedForAi: "Pendiente QA",
      dataSensitivity: "Regulado",
      ownerRole: "QA / Regulatorio",
      status: "Activo",
    })
  );

  await safe("Knowledge Base Colombia", () =>
    insertOrIgnore("EnterpriseAiKnowledgeBase", {
      code: "AI-KB-COL-001",
      kbName: "Base RAG Colombia Cannabis Medicinal",
      jurisdiction: "Colombia",
      domainArea: "Cannabis medicinal, licencias, ICA, INVIMA, MinJusticia, MinSalud",
      sourceSummary: "Normativa, guías, matrices internas, SOP y expedientes aprobados.",
      indexingStatus: "Pendiente",
      lastRefresh: "",
      ownerRole: "Regulatorio",
      status: "Planeado",
    })
  );

  await safe("Guardrail Legal", () =>
    insertOrIgnore("EnterpriseAiGuardrailPolicy", {
      code: "AI-GUARD-LEGAL-001",
      policyName: "No autorización legal automática",
      restrictionArea: "Regulatorio / Legal",
      ruleText: "La IA no puede declarar que una empresa está legalmente autorizada. Solo puede recomendar revisión documental y validación humana.",
      blockedContent: "Autorizaciones automáticas, conclusiones legales definitivas, sustitución de abogado/regulador.",
      escalationRule: "Enviar a Representante Legal / Director Regulatorio.",
      humanReviewRequired: "Si",
      status: "Activo",
    })
  );

  await safe("Request Demo", () =>
    insertOrIgnore("EnterpriseAiRequestLog", {
      code: "AI-REQ-001",
      tenantCode: "TENANT-GROWLIFECOL",
      moduleName: "Regulatory AI",
      userQuestion: "¿Qué falta para conectar IA externa de forma segura a FloraTrack?",
      providerCode: "AI-PROV-EXTERNAL-001",
      modelAlias: "regtech-reasoning",
      contextUsed: "Regulatory AI, CSV, RBAC, SaaS, matriz normativa",
      responseSummary: "Crear AI Gateway, usar variables de entorno, aprobar prompts, registrar auditoría y exigir revisión humana.",
      humanReview: "Pendiente QA",
      status: "Registrado",
    })
  );

  await safe("Evaluation Demo", () =>
    insertOrIgnore("EnterpriseAiResponseEvaluation", {
      code: "AI-EVAL-001",
      requestCode: "AI-REQ-001",
      evaluationType: "Revisión QA respuesta IA",
      accuracyScore: "Pendiente",
      complianceScore: "Pendiente",
      reviewer: "QA / Regulatorio",
      findings: "Primera evaluación pendiente.",
      actionRequired: "Definir criterio de aceptación de respuestas IA.",
      status: "Pendiente",
    })
  );

  await safe("Usage Demo", () =>
    insertOrIgnore("EnterpriseAiUsageMeter", {
      code: "AI-USAGE-001",
      tenantCode: "TENANT-GROWLIFECOL",
      providerCode: "AI-PROV-EXTERNAL-001",
      modelAlias: "regtech-reasoning",
      requestCount: "0",
      tokenEstimate: "0",
      costEstimate: "0",
      billingPeriod: "2026-06",
      status: "Activo",
    })
  );

  await safe("Job Gap Scan", () =>
    insertOrIgnore("EnterpriseAiAutomationJob", {
      code: "AI-JOB-GAPSCAN-001",
      tenantCode: "TENANT-GROWLIFECOL",
      jobName: "Escaneo semanal de brechas regulatorias",
      triggerType: "Programado",
      targetModule: "Regulatory AI / Certificaciones / CSV",
      promptTemplateCode: "AI-PROMPT-GAP-001",
      schedulePolicy: "Semanal futuro",
      lastRunStatus: "Nunca ejecutado",
      status: "Pendiente",
    })
  );

  console.log("SEED AI GATEWAY ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
