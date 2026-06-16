import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

const tables = {
  knowledge: "RegulatoryAiKnowledgePack",
  rules: "RegulatoryAiRule",
  assessments: "RegulatoryAiAssessment",
  recommendations: "RegulatoryAiRecommendation",
  gaps: "RegulatoryAiGapFinding",
  countryComparison: "RegulatoryAiCountryComparison",
  operationProfile: "RegulatoryAiOperationProfile",
  evidenceRequests: "RegulatoryAiEvidenceRequest",
  questions: "RegulatoryAiQuestionLog",
  roadmap: "RegulatoryAiRoadmapItem",
};

const externalTables = {
  standards: "CertificationStandardCatalog",
  regulatoryProfiles: "CompanyRegulatoryProfile",
  operationScopes: "RegulatoryOperationScope",
  evidenceVault: "EvidenceVaultItem",
  microLots: "MicroInVitroLot",
  microContamination: "MicroContaminationEvent",
  liveRosinFinished: "LiveRosinFinishedBatch",
  liveRosinRelease: "LiveRosinReleaseRecord",
  isoScope: "Iso17025AccreditationScope",
  csvRisks: "CsvRiskAssessment",
  csvDeviations: "CsvValidationDeviation",
  rbacAssignments: "RbacUserRoleAssignment",
  saasTenants: "SaasTenantAccount",
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
    "cerrado",
    "cerrada",
    "completado",
    "completada",
    "aprobado",
    "aprobada",
    "liberado",
    "liberada",
    "activo",
    "activa",
    "validado",
    "validada",
    "cumple",
  ];

  return !closed.some((item) => status.includes(item));
}

export async function GET() {
  try {
    const counters = {
      knowledge: await rawCount(tables.knowledge),
      rules: await rawCount(tables.rules),
      assessments: await rawCount(tables.assessments),
      recommendations: await rawCount(tables.recommendations),
      gaps: await rawCount(tables.gaps),
      countryComparison: await rawCount(tables.countryComparison),
      operationProfile: await rawCount(tables.operationProfile),
      evidenceRequests: await rawCount(tables.evidenceRequests),
      questions: await rawCount(tables.questions),
      roadmap: await rawCount(tables.roadmap),
    };

    const ecosystem = {
      standards: await rawCount(externalTables.standards),
      regulatoryProfiles: await rawCount(externalTables.regulatoryProfiles),
      operationScopes: await rawCount(externalTables.operationScopes),
      evidenceVault: await rawCount(externalTables.evidenceVault),
      microLots: await rawCount(externalTables.microLots),
      microContamination: await rawCount(externalTables.microContamination),
      liveRosinFinished: await rawCount(externalTables.liveRosinFinished),
      liveRosinRelease: await rawCount(externalTables.liveRosinRelease),
      isoScope: await rawCount(externalTables.isoScope),
      csvRisks: await rawCount(externalTables.csvRisks),
      csvDeviations: await rawCount(externalTables.csvDeviations),
      rbacAssignments: await rawCount(externalTables.rbacAssignments),
      saasTenants: await rawCount(externalTables.saasTenants),
    };

    const recommendations: any[] = await rawRecent(tables.recommendations, 50);
    const gaps: any[] = await rawRecent(tables.gaps, 50);
    const evidenceRequests: any[] = await rawRecent(tables.evidenceRequests, 50);
    const roadmap: any[] = await rawRecent(tables.roadmap, 50);

    const openRecommendations = recommendations.filter((item) =>
      isOpen(item.status)
    ).length;

    const openGaps = gaps.filter((item) =>
      isOpen(item.status)
    ).length;

    const pendingEvidence = evidenceRequests.filter((item) =>
      isOpen(item.approvalStatus || item.status)
    ).length;

    const pendingRoadmap = roadmap.filter((item) =>
      isOpen(item.status)
    ).length;

    const totalRecords = Object.values(counters).reduce(
      (sum, count) => sum + Number(count || 0),
      0
    );

    const ecosystemRecords = Object.values(ecosystem).reduce(
      (sum, count) => sum + Number(count || 0),
      0
    );

    const readiness = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          55 +
            Math.min(25, totalRecords * 2) +
            Math.min(20, ecosystemRecords) -
            openGaps * 5 -
            pendingEvidence * 4 -
            pendingRoadmap * 3
        )
      )
    );

    const autoSignals = [
      ecosystem.csvRisks > 0
        ? "Existen riesgos CSV: priorizar cierre antes de versión productiva."
        : "No se detectaron riesgos CSV registrados.",
      ecosystem.liveRosinRelease > 0
        ? "Live Rosin tiene registros de liberación: verificar COA y firma QA."
        : "Live Rosin requiere registros de liberación QA.",
      ecosystem.microContamination > 0
        ? "Micropropagación tiene eventos de contaminación: revisar CAPA y tendencia."
        : "Micropropagación sin eventos de contaminación registrados.",
      ecosystem.isoScope > 0
        ? "ISO/IEC 17025 ya tiene alcance inicial: completar métodos, incertidumbre y aptitud."
        : "Falta alcance ISO/IEC 17025.",
      ecosystem.rbacAssignments > 0
        ? "RBAC tiene asignaciones: revisar entrenamiento y MFA."
        : "Faltan asignaciones RBAC.",
    ];

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      module: "Motor de Inteligencia Regulatoria IA",
      readiness,
      totalRecords,
      ecosystemRecords,
      counters,
      ecosystem,
      alerts: {
        openRecommendations,
        openGaps,
        pendingEvidence,
        pendingRoadmap,
      },
      recent: {
        knowledge: await rawRecent(tables.knowledge),
        rules: await rawRecent(tables.rules),
        assessments: await rawRecent(tables.assessments),
        recommendations,
        gaps,
        countryComparison: await rawRecent(tables.countryComparison),
        operationProfile: await rawRecent(tables.operationProfile),
        evidenceRequests,
        questions: await rawRecent(tables.questions),
        roadmap,
      },
      autoSignals,
      recommendationsEngine: [
        "Conectar cada licencia y certificación con requisitos, evidencia, CAPA y auditoría.",
        "Cerrar brechas abiertas antes de declarar estado audit-ready.",
        "Completar evidencia documental para GACP, GMP, LIMS, Live Rosin, micropropagación e ISO 17025.",
        "Mantener motor IA como asistente de recomendación; la decisión final debe quedar en QA/regulatorio.",
        "Convertir las recomendaciones IA aprobadas en CAPA, plan de acción o requisito documental.",
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
