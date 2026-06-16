import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

const tables = {
  tenants: "SaasTenantAccount",
  sites: "SaasTenantSite",
  access: "SaasUserAccessProfile",
  modules: "SaasModuleEntitlement",
  subscriptions: "SaasComplianceSubscription",
  onboarding: "SaasOnboardingChecklist",
  isolation: "SaasDataIsolationPolicy",
  security: "SaasSecurityEvent",
  integrations: "SaasApiIntegration",
  plans: "SaasBillingPlan",
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
    "habilitado",
    "habilitada",
    "validado",
    "validada",
  ];

  return !closed.some((item) => status.includes(item));
}

export async function GET() {
  try {
    const counters = {
      tenants: await rawCount(tables.tenants),
      sites: await rawCount(tables.sites),
      access: await rawCount(tables.access),
      modules: await rawCount(tables.modules),
      subscriptions: await rawCount(tables.subscriptions),
      onboarding: await rawCount(tables.onboarding),
      isolation: await rawCount(tables.isolation),
      security: await rawCount(tables.security),
      integrations: await rawCount(tables.integrations),
      plans: await rawCount(tables.plans),
    };

    const tenants: any[] = await rawRecent(tables.tenants, 50);
    const onboarding: any[] = await rawRecent(tables.onboarding, 50);
    const security: any[] = await rawRecent(tables.security, 50);
    const access: any[] = await rawRecent(tables.access, 50);
    const integrations: any[] = await rawRecent(tables.integrations, 50);

    const tenantsInImplementation = tenants.filter((item) =>
      String(item.lifecycleStatus || "").toLowerCase().includes("implement")
    ).length;

    const onboardingPending = onboarding.filter((item) =>
      isOpen(item.completionStatus || item.status)
    ).length;

    const securityOpen = security.filter((item) =>
      isOpen(item.status)
    ).length;

    const accessRisk = access.filter((item) =>
      isOpen(item.trainingStatus) || isOpen(item.mfaStatus)
    ).length;

    const integrationsPending = integrations.filter((item) =>
      isOpen(item.validationStatus)
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
            onboardingPending * 4 -
            securityOpen * 6 -
            accessRisk * 4 -
            integrationsPending * 3
        )
      )
    );

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      module: "SaaS Multiempresa Enterprise",
      readiness,
      totalRecords,
      counters,
      alerts: {
        tenantsInImplementation,
        onboardingPending,
        securityOpen,
        accessRisk,
        integrationsPending,
      },
      recent: {
        tenants,
        sites: await rawRecent(tables.sites),
        access,
        modules: await rawRecent(tables.modules),
        subscriptions: await rawRecent(tables.subscriptions),
        onboarding,
        isolation: await rawRecent(tables.isolation),
        security,
        integrations,
        plans: await rawRecent(tables.plans),
      },
      recommendations: [
        "Todo cliente debe tener tenant, país, plan, industria, perfil regulatorio y módulos habilitados.",
        "Cada sede debe declarar operaciones licenciadas antes de habilitar módulos críticos.",
        "Todo usuario debe tener rol, alcance, entrenamiento vigente y MFA controlado.",
        "La plataforma debe aplicar aislamiento lógico por tenant y política de backup/exportación.",
        "Toda integración API debe validarse antes de activarse en ambiente regulado.",
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
