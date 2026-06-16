import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

const tables = {
  masterPlan: "CsvValidationMasterPlan",
  inventory: "CsvSystemInventory",
  urs: "CsvUserRequirement",
  frs: "CsvFunctionalRequirement",
  risk: "CsvRiskAssessment",
  traceability: "CsvTraceabilityMatrix",
  scripts: "CsvTestScript",
  execution: "CsvTestExecution",
  deviations: "CsvValidationDeviation",
  reports: "CsvValidationReport",
  periodicReview: "CsvPeriodicReview",
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
    "aprobado",
    "aprobada",
    "cerrado",
    "cerrada",
    "completado",
    "completada",
    "passed",
    "pass",
    "cumple",
    "validado",
    "validada",
    "activo",
    "activa",
  ];

  return !closed.some((item) => status.includes(item));
}

export async function GET() {
  try {
    const counters = {
      masterPlan: await rawCount(tables.masterPlan),
      inventory: await rawCount(tables.inventory),
      urs: await rawCount(tables.urs),
      frs: await rawCount(tables.frs),
      risk: await rawCount(tables.risk),
      traceability: await rawCount(tables.traceability),
      scripts: await rawCount(tables.scripts),
      execution: await rawCount(tables.execution),
      deviations: await rawCount(tables.deviations),
      reports: await rawCount(tables.reports),
      periodicReview: await rawCount(tables.periodicReview),
    };

    const urs: any[] = await rawRecent(tables.urs, 50);
    const risks: any[] = await rawRecent(tables.risk, 50);
    const traces: any[] = await rawRecent(tables.traceability, 50);
    const executions: any[] = await rawRecent(tables.execution, 50);
    const deviations: any[] = await rawRecent(tables.deviations, 50);
    const reports: any[] = await rawRecent(tables.reports, 50);

    const ursPending = urs.filter((item) =>
      isOpen(item.approvalStatus || item.status)
    ).length;

    const openRisks = risks.filter((item) =>
      isOpen(item.status)
    ).length;

    const tracePending = traces.filter((item) =>
      isOpen(item.traceStatus || item.status)
    ).length;

    const testsPending = executions.filter((item) =>
      isOpen(item.passFail || item.status)
    ).length;

    const deviationsOpen = deviations.filter((item) =>
      isOpen(item.closureStatus || item.status)
    ).length;

    const reportsPending = reports.filter((item) =>
      isOpen(item.reportStatus || item.status)
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
          55 +
            Math.min(30, totalRecords * 2) -
            ursPending * 3 -
            openRisks * 4 -
            tracePending * 4 -
            testsPending * 4 -
            deviationsOpen * 7 -
            reportsPending * 5
        )
      )
    );

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      module: "Validación CSV Enterprise",
      readiness,
      totalRecords,
      counters,
      alerts: {
        ursPending,
        openRisks,
        tracePending,
        testsPending,
        deviationsOpen,
        reportsPending,
      },
      recent: {
        masterPlan: await rawRecent(tables.masterPlan),
        inventory: await rawRecent(tables.inventory),
        urs,
        frs: await rawRecent(tables.frs),
        risk: risks,
        traceability: traces,
        scripts: await rawRecent(tables.scripts),
        execution: executions,
        deviations,
        reports,
        periodicReview: await rawRecent(tables.periodicReview),
      },
      recommendations: [
        "Todo requisito URS debe estar aprobado y trazado a función, riesgo y prueba.",
        "Los riesgos GxP altos deben tener mitigación antes de liberar el sistema.",
        "Toda prueba IQ/OQ/PQ debe tener evidencia, resultado, revisión y estado pass/fail.",
        "Las desviaciones de validación deben cerrarse antes del reporte final.",
        "El reporte final debe declarar si FloraTrack queda apto para uso regulado previsto.",
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
