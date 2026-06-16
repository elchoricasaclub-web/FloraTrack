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
    id: row.id || id("rbac"),
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
  await safe("Role QA Manager", () =>
    insertOrIgnore("RbacRoleTemplate", {
      code: "ROLE-QA-MANAGER",
      roleName: "Director de Calidad / QA Manager",
      roleCategory: "Quality",
      description: "Responsable de QMS, liberación QA, CAPA, desviaciones, auditorías y aprobación documental.",
      defaultScope: "Tenant, sede y módulos QA/QMS/LIMS/GMP",
      riskLevel: "Alto",
      status: "Activo",
    })
  );

  await safe("Role Lab Analyst", () =>
    insertOrIgnore("RbacRoleTemplate", {
      code: "ROLE-LAB-ANALYST",
      roleName: "Analista de Laboratorio",
      roleCategory: "Laboratory",
      description: "Ejecuta ensayos, registra resultados y gestiona muestras bajo revisión.",
      defaultScope: "LIMS, muestras, análisis, instrumentos",
      riskLevel: "Medio",
      status: "Activo",
    })
  );

  await safe("Permission QA Release", () =>
    insertOrIgnore("RbacPermissionMatrix", {
      code: "PERM-QA-RELEASE",
      roleCode: "ROLE-QA-MANAGER",
      moduleName: "Liberación QA / COA / Lotes",
      permissionSet: "Crear, revisar, aprobar, liberar, rechazar, firmar",
      accessLevel: "Aprobación",
      requiresSignature: "Si",
      segregationRisk: "Alto",
      status: "Activo",
    })
  );

  await safe("Assignment Admin", () =>
    insertOrIgnore("RbacUserRoleAssignment", {
      code: "ASSIGN-ADMIN-001",
      tenantCode: "TENANT-GROWLIFECOL",
      userEmail: "admin@floratrack.local",
      roleCode: "ROLE-QA-MANAGER",
      siteScope: "Todas las sedes",
      moduleScope: "Todos los módulos regulados",
      assignedBy: "Super Admin",
      assignmentDate: "2026-06-14",
      trainingVerified: "Pendiente SOP sistema",
      status: "Activo",
    })
  );

  await safe("Access Review", () =>
    insertOrIgnore("RbacAccessReviewCycle", {
      code: "REV-ACC-001",
      tenantCode: "TENANT-GROWLIFECOL",
      reviewName: "Revisión inicial de accesos GxP",
      reviewPeriod: "Trimestral",
      reviewer: "QA Manager",
      findings: "MFA pendiente y entrenamiento SOP sistema pendiente.",
      actionsRequired: "Activar MFA y formalizar entrenamiento.",
      reviewStatus: "Pendiente",
      status: "Activo",
    })
  );

  await safe("Signature Policy", () =>
    insertOrIgnore("RbacElectronicSignaturePolicy", {
      code: "ESIGN-QA-RELEASE",
      policyName: "Firma electrónica para liberación QA",
      applicableModule: "COA, Liberación de lote, Live Rosin, GMP",
      signatureReason: "Aprobación, liberación, rechazo o cierre de registro crítico.",
      requiredRole: "ROLE-QA-MANAGER",
      meaningOfSignature: "Certifico revisión QA y decisión regulatoria del registro.",
      secondFactorRequired: "Si",
      status: "Activo",
    })
  );

  await safe("MFA Policy", () =>
    insertOrIgnore("RbacMfaPolicy", {
      code: "MFA-GXP-001",
      tenantCode: "TENANT-GROWLIFECOL",
      policyName: "MFA para usuarios críticos GxP",
      requiredForRoles: "Super Admin, QA Manager, Laboratorio, Regulatorio, Producción GMP",
      enforcementMode: "Pendiente implementacion",
      exceptionAllowed: "No",
      status: "Activo",
    })
  );

  await safe("Session Policy", () =>
    insertOrIgnore("RbacSessionControl", {
      code: "SESSION-GXP-001",
      tenantCode: "TENANT-GROWLIFECOL",
      sessionPolicy: "Sesión regulada con timeout e historial de acceso",
      timeoutMinutes: "30",
      ipRestriction: "Pendiente definir",
      deviceRestriction: "Pendiente definir",
      status: "Activo",
    })
  );

  await safe("SoD Rule", () =>
    insertOrIgnore("RbacSegregationRule", {
      code: "SOD-QA-PROD-001",
      ruleName: "Separación producción y liberación QA",
      conflictingRoles: "Operario Producción GMP vs QA Manager",
      conflictingActions: "Crear lote y liberar el mismo lote",
      riskDescription: "Una misma persona no debe producir y liberar sin revisión independiente.",
      mitigationControl: "Firma QA independiente y revisión de audit trail.",
      status: "Activo",
    })
  );

  await safe("Permission Exception", () =>
    insertOrIgnore("RbacPermissionException", {
      code: "EXC-001",
      tenantCode: "TENANT-GROWLIFECOL",
      userEmail: "admin@floratrack.local",
      requestedAccess: "Acceso total temporal durante implementación",
      justification: "Configuración inicial del sistema y validación de módulos.",
      approvedBy: "Dirección / QA",
      expiryDate: "2026-07-31",
      exceptionStatus: "Pendiente",
      status: "Activo",
    })
  );

  await safe("Control Test", () =>
    insertOrIgnore("RbacSecurityControlTest", {
      code: "CTRL-SEC-001",
      controlName: "Control de acceso por rol",
      testObjective: "Verificar que módulos críticos exijan rol autorizado y firma cuando aplique.",
      testResult: "Pendiente ejecución formal",
      evidence: "Capturas, logs, App Doctor y audit trail.",
      testedBy: "QA / CSV",
      testDate: "2026-06-14",
      status: "Pendiente",
    })
  );

  console.log("SEED SECURITY RBAC COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
