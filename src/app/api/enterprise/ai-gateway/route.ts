import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

const tables = {
  providers: "EnterpriseAiProviderConnection",
  models: "EnterpriseAiModelProfile",
  prompts: "EnterpriseAiPromptTemplate",
  contextSources: "EnterpriseAiContextSource",
  knowledgeBases: "EnterpriseAiKnowledgeBase",
  guardrails: "EnterpriseAiGuardrailPolicy",
  requests: "EnterpriseAiRequestLog",
  evaluations: "EnterpriseAiResponseEvaluation",
  usage: "EnterpriseAiUsageMeter",
  jobs: "EnterpriseAiAutomationJob",
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
  ];

  return !closed.some((item) => status.includes(item));
}

export async function GET() {
  try {
    const counters = {
      providers: await rawCount(tables.providers),
      models: await rawCount(tables.models),
      prompts: await rawCount(tables.prompts),
      contextSources: await rawCount(tables.contextSources),
      knowledgeBases: await rawCount(tables.knowledgeBases),
      guardrails: await rawCount(tables.guardrails),
      requests: await rawCount(tables.requests),
      evaluations: await rawCount(tables.evaluations),
      usage: await rawCount(tables.usage),
      jobs: await rawCount(tables.jobs),
    };

    const providers: any[] = await rawRecent(tables.providers, 50);
    const prompts: any[] = await rawRecent(tables.prompts, 50);
    const guardrails: any[] = await rawRecent(tables.guardrails, 50);
    const requests: any[] = await rawRecent(tables.requests, 50);
    const evaluations: any[] = await rawRecent(tables.evaluations, 50);
    const jobs: any[] = await rawRecent(tables.jobs, 50);

    const providersPending = providers.filter((item) =>
      isOpen(item.status || item.connectionMode)
    ).length;

    const promptsPending = prompts.filter((item) =>
      isOpen(item.approvalStatus || item.status)
    ).length;

    const requestsPendingReview = requests.filter((item) =>
      isOpen(item.humanReview || item.status)
    ).length;

    const evaluationsPending = evaluations.filter((item) =>
      isOpen(item.status)
    ).length;

    const jobsPending = jobs.filter((item) =>
      isOpen(item.status || item.lastRunStatus)
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
          50 +
            Math.min(30, totalRecords * 2) -
            providersPending * 6 -
            promptsPending * 4 -
            requestsPendingReview * 3 -
            evaluationsPending * 3 -
            jobsPending * 3
        )
      )
    );

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      module: "AI Gateway Enterprise",
      readiness,
      totalRecords,
      counters,
      alerts: {
        providersPending,
        promptsPending,
        requestsPendingReview,
        evaluationsPending,
        jobsPending,
      },
      recent: {
        providers,
        models: await rawRecent(tables.models),
        prompts,
        contextSources: await rawRecent(tables.contextSources),
        knowledgeBases: await rawRecent(tables.knowledgeBases),
        guardrails,
        requests,
        evaluations,
        usage: await rawRecent(tables.usage),
        jobs,
      },
      architectureDecision: [
        "Fase actual: crear AI Gateway interno con políticas, auditoría, prompts aprobados y referencias seguras a proveedor externo.",
        "Fase siguiente: conectar proveedor externo mediante variable de entorno, sin guardar llaves en base de datos.",
        "Fase avanzada: crear RAG privado con SOP, normativas, expedientes, auditorías y documentos del cliente.",
        "Fase premium: evaluar IA propia o modelo especializado solo cuando exista dataset curado, gobierno de datos y validación.",
        "Todas las respuestas IA regulatorias deben quedar sujetas a revisión humana QA/regulatoria.",
      ],
      recommendations: [
        "No almacenar API keys en base de datos; usar secretEnvName y variables de entorno.",
        "Aprobar prompts críticos antes de usarlos en módulos GxP.",
        "Registrar cada solicitud IA en audit log con contexto usado, proveedor, modelo y revisión humana.",
        "Bloquear recomendaciones que parezcan autorización legal automática.",
        "Separar IA de soporte documental de decisiones regulatorias finales.",
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
