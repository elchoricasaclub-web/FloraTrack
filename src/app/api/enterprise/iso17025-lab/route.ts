import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

const tables = {
  scope: "Iso17025AccreditationScope",
  requirements: "Iso17025RequirementItem",
  methodValidation: "LabMethodValidationRecord",
  instruments: "LabInstrumentControl",
  calibrations: "LabCalibrationRecord17025",
  uncertainty: "LabMeasurementUncertainty",
  proficiency: "LabProficiencyTestRecord",
  custody: "LabSampleCustody17025",
  review: "LabResultReviewRecord",
  controlCharts: "LabControlChartRecord",
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

function isPending(value: unknown) {
  const status = String(value || "").toLowerCase();

  if (!status) return true;

  const closed = [
    "aprobado",
    "aprobada",
    "vigente",
    "conforme",
    "cerrado",
    "cerrada",
    "activo",
    "activa",
    "validado",
    "validada",
  ];

  return !closed.some((item) => status.includes(item));
}

export async function GET() {
  try {
    const counters = {
      scope: await rawCount(tables.scope),
      requirements: await rawCount(tables.requirements),
      methodValidation: await rawCount(tables.methodValidation),
      instruments: await rawCount(tables.instruments),
      calibrations: await rawCount(tables.calibrations),
      uncertainty: await rawCount(tables.uncertainty),
      proficiency: await rawCount(tables.proficiency),
      custody: await rawCount(tables.custody),
      review: await rawCount(tables.review),
      controlCharts: await rawCount(tables.controlCharts),
    };

    const validations: any[] = await rawRecent(tables.methodValidation, 50);
    const instruments: any[] = await rawRecent(tables.instruments, 50);
    const proficiency: any[] = await rawRecent(tables.proficiency, 50);
    const reviews: any[] = await rawRecent(tables.review, 50);

    const pendingValidations = validations.filter((item) =>
      isPending(item.validationStatus || item.status)
    ).length;

    const instrumentsPending = instruments.filter((item) =>
      isPending(item.qualificationStatus || item.calibrationDueDate || item.status)
    ).length;

    const proficiencyPending = proficiency.filter((item) =>
      isPending(item.resultEvaluation || item.status)
    ).length;

    const pendingReviews = reviews.filter((item) =>
      isPending(item.reviewStatus || item.status)
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
            pendingValidations * 5 -
            instrumentsPending * 4 -
            proficiencyPending * 5 -
            pendingReviews * 3
        )
      )
    );

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      module: "Laboratorio QC ISO/IEC 17025 Enterprise",
      readiness,
      totalRecords,
      alerts: {
        pendingValidations,
        instrumentsPending,
        proficiencyPending,
        pendingReviews,
      },
      counters,
      recent: {
        scope: await rawRecent(tables.scope),
        requirements: await rawRecent(tables.requirements),
        methodValidation: validations,
        instruments,
        calibrations: await rawRecent(tables.calibrations),
        uncertainty: await rawRecent(tables.uncertainty),
        proficiency,
        custody: await rawRecent(tables.custody),
        review: reviews,
        controlCharts: await rawRecent(tables.controlCharts),
      },
      recommendations: [
        "Todo método usado para COA debe tener validación, verificación o justificación técnica documentada.",
        "Todo instrumento crítico debe tener calibración, mantenimiento y calificación vigente.",
        "La cadena de custodia debe estar completa desde recepción hasta emisión de resultado.",
        "La incertidumbre de medición debe estar documentada para métodos cuantitativos relevantes.",
        "Los ensayos de aptitud deben revisarse y activar CAPA cuando el resultado no sea satisfactorio.",
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
