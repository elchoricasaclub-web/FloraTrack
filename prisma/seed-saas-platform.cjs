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
    id: row.id || id("saas"),
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
  await safe("Tenant TENANT-GROWLIFECOL", () =>
    insertOrIgnore("SaasTenantAccount", {
      code: "TENANT-GROWLIFECOL",
      tenantName: "Growlifecol / FloraTrack Demo",
      legalName: "Growlifecol S.A.S.",
      country: "Colombia",
      industry: "Cannabis medicinal, GACP, GMP, micropropagacion, Live Rosin, laboratorio QC",
      plan: "Enterprise Regulated",
      lifecycleStatus: "Implementacion",
      complianceTier: "GxP Regulated",
      primaryContact: "Administrador FloraTrack",
      notes: "Tenant demo para expansión SaaS multiempresa.",
      status: "Activo",
    })
  );

  await safe("Site SITE-GROW-001", () =>
    insertOrIgnore("SaasTenantSite", {
      code: "SITE-GROW-001",
      tenantCode: "TENANT-GROWLIFECOL",
      siteName: "Sede Operativa Cannabis Medicinal",
      city: "Boyacá / Colombia",
      country: "Colombia",
      siteType: "Cultivo, laboratorio, derivados",
      licensedOperations: "Semillas, cultivo, derivados, laboratorio QC, micropropagacion, Live Rosin según licencia aplicable.",
      status: "Activo",
    })
  );

  await safe("Access ACCESS-ADMIN-001", () =>
    insertOrIgnore("SaasUserAccessProfile", {
      code: "ACCESS-ADMIN-001",
      tenantCode: "TENANT-GROWLIFECOL",
      userEmail: "admin@floratrack.local",
      fullName: "Super Admin FloraTrack",
      roleName: "Super Admin / QA Admin",
      accessScope: "Todos los módulos y sedes",
      trainingStatus: "Pendiente formalizar SOP sistema",
      mfaStatus: "Pendiente activación",
      status: "Activo",
    })
  );

  await safe("Module MOD-FULL-001", () =>
    insertOrIgnore("SaasModuleEntitlement", {
      code: "MOD-FULL-001",
      tenantCode: "TENANT-GROWLIFECOL",
      moduleName: "Full Enterprise Compliance Suite",
      serviceLine: "GACP, GMP, LIMS, QMS, ISO 17025, Micropropagacion, Live Rosin, Regulatorio",
      entitlementLevel: "Full",
      enabledStatus: "Habilitado",
      restrictions: "Uso sujeto a licencias y autorizaciones del cliente.",
      status: "Activo",
    })
  );

  await safe("Subscription SUB-COMPLIANCE-001", () =>
    insertOrIgnore("SaasComplianceSubscription", {
      code: "SUB-COMPLIANCE-001",
      tenantCode: "TENANT-GROWLIFECOL",
      subscriptionName: "Enterprise Compliance Platform",
      regulatoryScope: "Colombia + internacional premium",
      includedStandards: "WHO GACP, EMA GACP, EU GMP, ISO 14644, ISO 17025, ASTM D37, Colombia cannabis medicinal",
      renewalDate: "2027-06-14",
      slaLevel: "Enterprise",
      status: "Activo",
    })
  );

  await safe("Onboarding ONB-001", () =>
    insertOrIgnore("SaasOnboardingChecklist", {
      code: "ONB-001",
      tenantCode: "TENANT-GROWLIFECOL",
      onboardingStep: "Configurar perfil regulatorio y módulos habilitados",
      ownerRole: "Administrador SaaS / QA",
      dueDate: "2026-07-01",
      evidenceRequired: "Perfil regulatorio aprobado, lista de licencias, sedes y responsables.",
      completionStatus: "Pendiente",
      status: "Activo",
    })
  );

  await safe("Isolation ISO-DATA-001", () =>
    insertOrIgnore("SaasDataIsolationPolicy", {
      code: "ISO-DATA-001",
      tenantCode: "TENANT-GROWLIFECOL",
      isolationMode: "Logical tenant isolation",
      dataResidency: "Colombia / cloud region por definir",
      retentionPolicy: "Retención regulatoria según contrato y norma aplicable",
      backupPolicy: "Backup programado y exportación controlada",
      exportPolicy: "Exportación JSON, HTML, PDF/Word futuro con control documental",
      status: "Activo",
    })
  );

  await safe("Security SEC-001", () =>
    insertOrIgnore("SaasSecurityEvent", {
      code: "SEC-001",
      tenantCode: "TENANT-GROWLIFECOL",
      eventType: "MFA pendiente",
      severity: "Alta",
      userEmail: "admin@floratrack.local",
      description: "Usuario administrador requiere activación futura de MFA y política de contraseñas.",
      actionTaken: "Pendiente implementación auth enterprise.",
      status: "Abierto",
    })
  );

  await safe("Integration API-001", () =>
    insertOrIgnore("SaasApiIntegration", {
      code: "API-001",
      tenantCode: "TENANT-GROWLIFECOL",
      integrationName: "API LIMS / Sensores / ERP futuro",
      integrationType: "REST API / Webhook",
      endpointScope: "Exportación de evidencias, resultados QC y trazabilidad",
      authType: "Token / OAuth futuro",
      validationStatus: "Pendiente CSV",
      status: "Planeado",
    })
  );

  await safe("Plan PLAN-ENTERPRISE-001", () =>
    insertOrIgnore("SaasBillingPlan", {
      code: "PLAN-ENTERPRISE-001",
      planName: "Enterprise Regulated",
      planTier: "Enterprise",
      monthlyPrice: "Por definir",
      includedModules: "Full Compliance Suite, Audit Builder, Document Generator, Micropropagacion, Live Rosin, ISO 17025",
      userLimit: "Ilimitado según contrato",
      tenantLimit: "Multiempresa",
      status: "Activo",
    })
  );

  console.log("SEED SAAS MULTIEMPRESA COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
