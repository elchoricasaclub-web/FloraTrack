import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

const tables = {
  runtimes: "PrivateAiRuntime",
  models: "PrivateAiLocalModel",
  corpus: "PrivateAiDocumentCorpus",
  indexes: "PrivateAiVectorIndex",
  embeddingJobs: "PrivateAiEmbeddingJob",
  ragPipelines: "PrivateAiRagPipeline",
  privacyControls: "PrivateAiPrivacyControl",
  inferenceTests: "PrivateAiInferenceTest",
  deploymentPlans: "PrivateAiDeploymentPlan",
  modelValidation: "PrivateAiModelValidation",
};

async function rawCount(table: string) {
  try {
    const result: any = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) as count FROM "${table}"`
    );

    return Number(result?.[0]?.count || 0);
  } catch {
    return 0;
  }
}

async function rawRecent(table: string, take = 20) {
  try {
    return await prisma.$queryRawUnsafe(
      `SELECT * FROM "${table}" ORDER BY "createdAt" DESC LIMIT ${take}`
    );
  } catch {
    return [];
  }
}

function isOpen(value: unknown) {
  const status = String(value || "").toLowerCase();

  if (!status) return true;

  const closed = [
    "activo",
    "activa",
    "aprobado",
    "aprobada",
    "validado",
    "validada",
    "conectado",
    "conectada",
    "completado",
    "completada",
    "cerrado",
    "cerrada",
    "local",
  ];

  return !closed.some((item) => status.includes(item));
}

export async function GET() {
  try {
    const counters = {
      runtimes: await rawCount(tables.runtimes),
      models: await rawCount(tables.models),
      corpus: await rawCount(tables.corpus),
      indexes: await rawCount(tables.indexes),
      embeddingJobs: await rawCount(tables.embeddingJobs),
      ragPipelines: await rawCount(tables.ragPipelines),
      privacyControls: await rawCount(tables.privacyControls),
      inferenceTests: await rawCount(tables.inferenceTests),
      deploymentPlans: await rawCount(tables.deploymentPlans),
      modelValidation: await rawCount(tables.modelValidation),
    };

    const runtimes: any[] = await rawRecent(tables.runtimes, 50);
    const models: any[] = await rawRecent(tables.models, 50);
    const corpus: any[] = await rawRecent(tables.corpus, 50);
    const indexes: any[] = await rawRecent(tables.indexes, 50);
    const pipelines: any[] = await rawRecent(tables.ragPipelines, 50);
    const tests: any[] = await rawRecent(tables.inferenceTests, 50);
    const deployments: any[] = await rawRecent(tables.deploymentPlans, 50);
    const validations: any[] = await rawRecent(tables.modelValidation, 50);

    const runtimePending = runtimes.filter((item) =>
      isOpen(item.operationalStatus || item.status)
    ).length;

    const modelsPending = models.filter((item) =>
      isOpen(item.validationStatus || item.status)
    ).length;

    const corpusPending = corpus.filter((item) =>
      isOpen(item.approvalStatus || item.status)
    ).length;

    const indexPending = indexes.filter((item) =>
      isOpen(item.indexingStatus || item.status)
    ).length;

    const pipelinePending = pipelines.filter((item) =>
      isOpen(item.validationStatus || item.status)
    ).length;

    const testsPending = tests.filter((item) =>
      isOpen(item.passFail || item.status)
    ).length;

    const deploymentPending = deployments.filter((item) =>
      isOpen(item.status)
    ).length;

    const validationPending = validations.filter((item) =>
      isOpen(item.approvalDecision || item.status)
    ).length;

    const totalRecords = Object.values(counters).reduce(
      (sum, count) => sum + Number(count || 0),
      0
    );

    const readiness = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          45 +
            Math.min(35, totalRecords * 2) -
            runtimePending * 5 -
            modelsPending * 4 -
            corpusPending * 4 -
            indexPending * 4 -
            pipelinePending * 5 -
            testsPending * 4 -
            deploymentPending * 3 -
            validationPending * 5
        )
      )
    );

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      module: "IA Privada Local Enterprise",
      readiness,
      totalRecords,
      counters,
      alerts: {
        runtimePending,
        modelsPending,
        corpusPending,
        indexPending,
        pipelinePending,
        testsPending,
        deploymentPending,
        validationPending,
      },
      recent: {
        runtimes,
        models,
        corpus,
        indexes,
        embeddingJobs: await rawRecent(tables.embeddingJobs),
        ragPipelines: pipelines,
        privacyControls: await rawRecent(tables.privacyControls),
        inferenceTests: tests,
        deploymentPlans: deployments,
        modelValidation: validations,
      },
      architectureDecision: [
        "La IA privada debe ejecutarse dentro del perímetro del cliente o servidor controlado por FloraTrack.",
        "Los documentos sensibles no deben enviarse a APIs externas.",
        "El primer paso técnico es conectar runtime local mediante endpoint interno, por ejemplo OLLAMA_LOCAL_URL o PRIVATE_LLM_ENDPOINT.",
        "El segundo paso es construir RAG privado con documentos aprobados, versionados e indexados por tenant.",
        "El tercer paso es validar respuestas con pruebas CSV, revisión humana y límites regulatorios.",
      ],
      recommendations: [
        "Instalar runtime local en servidor controlado antes de procesar documentos reales.",
        "Crear corpus documental por tenant y aprobar qué documentos pueden indexarse.",
        "Ejecutar escaneo de datos sensibles antes de crear embeddings.",
        "Validar modelo y pipeline RAG con preguntas conocidas y criterios de aceptación.",
        "Mantener revisión humana obligatoria para recomendaciones legales, regulatorias y QA.",
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
