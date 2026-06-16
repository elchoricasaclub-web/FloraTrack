import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

const tables = {
  roles: "RbacRoleTemplate",
  permissions: "RbacPermissionMatrix",
  assignments: "RbacUserRoleAssignment",
  reviews: "RbacAccessReviewCycle",
  signatures: "RbacElectronicSignaturePolicy",
  mfa: "RbacMfaPolicy",
  sessions: "RbacSessionControl",
  segregation: "RbacSegregationRule",
  exceptions: "RbacPermissionException",
  controlTests: "RbacSecurityControlTest",
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
    "cerrado",
    "cerrada",
    "completado",
    "completada",
    "aprobado",
    "aprobada",
    "vigente",
    "validado",
    "validada",
    "implementado",
    "implementada",
  ];

  return !closed.some((item) => status.includes(item));
}

export async function GET() {
  try {
    const counters = {
      roles: await rawCount(tables.roles),
      permissions: await rawCount(tables.permissions),
      assignments: await rawCount(tables.assignments),
      reviews: await rawCount(tables.reviews),
      signatures: await rawCount(tables.signatures),
      mfa: await rawCount(tables.mfa),
      sessions: await rawCount(tables.sessions),
      segregation: await rawCount(tables.segregation),
      exceptions: await rawCount(tables.exceptions),
      controlTests: await rawCount(tables.controlTests),
    };

    const assignments: any[] = await rawRecent(tables.assignments, 50);
    const reviews: any[] = await rawRecent(tables.reviews, 50);
    const exceptions: any[] = await rawRecent(tables.exceptions, 50);
    const controlTests: any[] = await rawRecent(tables.controlTests, 50);
    const mfa: any[] = await rawRecent(tables.mfa, 50);

    const trainingPending = assignments.filter((item) =>
      isOpen(item.trainingVerified)
    ).length;

    const accessReviewsPending = reviews.filter((item) =>
      isOpen(item.reviewStatus)
    ).length;

    const exceptionsOpen = exceptions.filter((item) =>
      isOpen(item.exceptionStatus)
    ).length;

    const controlsPending = controlTests.filter((item) =>
      isOpen(item.status)
    ).length;

    const mfaPending = mfa.filter((item) =>
      isOpen(item.enforcementMode)
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
            trainingPending * 4 -
            accessReviewsPending * 5 -
            exceptionsOpen * 5 -
            controlsPending * 4 -
            mfaPending * 5
        )
      )
    );

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      module: "Seguridad RBAC Enterprise",
      readiness,
      totalRecords,
      counters,
      alerts: {
        trainingPending,
        accessReviewsPending,
        exceptionsOpen,
        controlsPending,
        mfaPending,
      },
      recent: {
        roles: await rawRecent(tables.roles),
        permissions: await rawRecent(tables.permissions),
        assignments,
        reviews,
        signatures: await rawRecent(tables.signatures),
        mfa,
        sessions: await rawRecent(tables.sessions),
        segregation: await rawRecent(tables.segregation),
        exceptions,
        controlTests,
      },
      recommendations: [
        "Todo usuario debe tener rol, alcance por tenant/sede/módulo y entrenamiento verificado.",
        "Los módulos críticos deben exigir firma electrónica con significado de firma definido.",
        "Los roles conflictivos deben bloquearse mediante reglas de segregación de funciones.",
        "La revisión periódica de accesos debe ejecutarse y documentarse al menos trimestralmente.",
        "MFA debe activarse para administradores, QA, liberación de lote, laboratorio y regulatorio.",
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
