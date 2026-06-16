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
    id: row.id || id("pai"),
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
  await safe("Runtime Local", () =>
    insertOrIgnore("PrivateAiRuntime", {
      code: "PAI-RUN-LOCAL-001",
      runtimeName: "Runtime Local FloraTrack",
      runtimeType: "Ollama / LM Studio / Private LLM Server",
      deploymentMode: "Local / On-Premise",
      endpointRef: "OLLAMA_LOCAL_URL or PRIVATE_LLM_ENDPOINT",
      hardwareProfile: "CPU local para pruebas; GPU recomendada para producción privada.",
      dataBoundary: "Sin salida de datos a proveedores externos.",
      operationalStatus: "Planeado",
      status: "Activo",
    })
  );

  await safe("Local Model", () =>
    insertOrIgnore("PrivateAiLocalModel", {
      code: "PAI-MODEL-REGTECH-LOCAL",
      runtimeCode: "PAI-RUN-LOCAL-001",
      modelName: "Modelo local RegTech privado",
      modelFamily: "LLM local instruct / reasoning",
      modelSize: "Por definir según hardware",
      useCase: "Responder sobre SOP, normativas, auditorías, expedientes y trazabilidad sin enviar datos fuera.",
      privacyRating: "Muy alta",
      validationStatus: "Pendiente CSV",
      status: "Planeado",
    })
  );

  await safe("Corpus Regulado", () =>
    insertOrIgnore("PrivateAiDocumentCorpus", {
      code: "PAI-CORPUS-GXP-001",
      corpusName: "Corpus GxP FloraTrack",
      tenantCode: "TENANT-GROWLIFECOL",
      domainArea: "GACP, GMP, ISO 17025, Live Rosin, micropropagación, licencias, SOP, auditorías",
      documentTypes: "SOP, políticas, expedientes, COA, licencias, matrices, auditorías, CAPA",
      sensitivityLevel: "Altamente regulado",
      approvalStatus: "Pendiente QA",
      status: "Borrador",
    })
  );

  await safe("Vector Index", () =>
    insertOrIgnore("PrivateAiVectorIndex", {
      code: "PAI-INDEX-GXP-001",
      corpusCode: "PAI-CORPUS-GXP-001",
      indexName: "Índice privado GxP por tenant",
      embeddingModel: "Modelo embeddings local por definir",
      storageMode: "Local / tenant-isolated",
      refreshPolicy: "Solo documentos aprobados y versionados",
      indexingStatus: "Pendiente",
      status: "Planeado",
    })
  );

  await safe("Embedding Job", () =>
    insertOrIgnore("PrivateAiEmbeddingJob", {
      code: "PAI-EMB-GXP-001",
      corpusCode: "PAI-CORPUS-GXP-001",
      jobName: "Indexación inicial documentos GxP",
      sourceScope: "Documentos aprobados por QA/regulatorio",
      chunkingPolicy: "Chunking por sección, código documental y versión",
      piiScanStatus: "Pendiente",
      jobStatus: "Pendiente",
      status: "Activo",
    })
  );

  await safe("RAG Pipeline", () =>
    insertOrIgnore("PrivateAiRagPipeline", {
      code: "PAI-RAG-GXP-001",
      pipelineName: "RAG Privado GxP FloraTrack",
      runtimeCode: "PAI-RUN-LOCAL-001",
      indexCode: "PAI-INDEX-GXP-001",
      retrievalPolicy: "Buscar solo documentos aprobados del tenant activo.",
      answerPolicy: "Responder con referencias internas, nivel de confianza y obligación de revisión humana.",
      humanReviewRequired: "Si",
      validationStatus: "Pendiente CSV",
      status: "Planeado",
    })
  );

  await safe("Privacy Control", () =>
    insertOrIgnore("PrivateAiPrivacyControl", {
      code: "PAI-CTRL-NO-EXTERNAL",
      controlName: "Bloqueo de envío externo",
      controlArea: "Privacidad / Data Boundary",
      ruleText: "Los documentos regulados, licencias, COA, SOP y expedientes no pueden enviarse a proveedores externos sin aprobación explícita.",
      enforcementMode: "Manual ahora / automático futuro",
      evidenceRequired: "Política aprobada, configuración endpoint local y prueba de no exfiltración.",
      ownerRole: "QA / Seguridad / Admin SaaS",
      status: "Activo",
    })
  );

  await safe("Inference Test", () =>
    insertOrIgnore("PrivateAiInferenceTest", {
      code: "PAI-TEST-GXP-001",
      pipelineCode: "PAI-RAG-GXP-001",
      testQuestion: "¿Qué evidencia falta para liberar un lote Live Rosin?",
      expectedBehavior: "Debe responder solo con base en documentos aprobados y exigir revisión QA.",
      actualBehavior: "Pendiente ejecución",
      riskFinding: "Pendiente",
      passFail: "Pendiente",
      reviewedBy: "QA / CSV",
      status: "Pendiente",
    })
  );

  await safe("Deployment Plan", () =>
    insertOrIgnore("PrivateAiDeploymentPlan", {
      code: "PAI-DEPLOY-001",
      planName: "Despliegue IA privada FloraTrack",
      deploymentTarget: "Servidor local controlado / servidor privado GPU / on-premise cliente",
      infrastructureNeeds: "Runtime LLM local, almacenamiento vectorial, backup, logs, RBAC, endpoint interno.",
      securityNeeds: "Aislamiento tenant, no salida externa, control de acceso, audit trail, revisión humana.",
      validationNeeds: "CSV, pruebas de inferencia, límites, dataset aprobado, criterios de aceptación.",
      estimatedPhase: "Fase IA Privada",
      ownerRole: "Arquitecto Plataforma / QA / Seguridad",
      status: "Planeado",
    })
  );

  await safe("Model Validation", () =>
    insertOrIgnore("PrivateAiModelValidation", {
      code: "PAI-VAL-LOCAL-001",
      modelCode: "PAI-MODEL-REGTECH-LOCAL",
      validationScope: "Validar respuestas regulatorias sobre SOP, COA, CAPA, licencias y trazabilidad.",
      testDataset: "Preguntas controladas con respuestas esperadas aprobadas por QA/regulatorio.",
      acceptanceCriteria: "No inventar autorizaciones, citar documentos internos, pedir revisión humana en decisiones críticas.",
      limitations: "Modelo local puede tener menor capacidad que proveedor externo; compensar con RAG y documentos aprobados.",
      approvalDecision: "Pendiente",
      approvedBy: "QA / Regulatorio",
      status: "Borrador",
    })
  );

  console.log("SEED PRIVATE AI ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
