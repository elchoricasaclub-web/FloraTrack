const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function ensure(delegate, where, data) {
  const existing = await delegate.findFirst({ where });
  if (existing) return existing;
  return delegate.create({ data });
}

async function audit(module, action, record) {
  await prisma.auditTrail.create({
    data: {
      module,
      action,
      recordId: record.id,
      recordLabel: record.code || record.principle || record.period || record.id,
      responsible: record.responsible || record.reviewer || "FloraTrack Data Integrity Seed",
      status: record.status || "Activo",
      snapshot: JSON.stringify(record),
    },
  }).catch(() => {});
}

async function main() {
  const principles = [
    {
      code: "ALCOA-A",
      principle: "Attributable",
      area: "Sistema",
      finding: "Todo registro debe estar asociado a usuario, responsable, firma o evento de auditoría.",
      evidence: "Audit Trail + Usuarios + Firmas electrónicas.",
      score: 85,
      responsible: "QA Manager",
      status: "En progreso",
      dueDate: addDays(20),
    },
    {
      code: "ALCOA-L",
      principle: "Legible",
      area: "Documentos",
      finding: "Los registros deben ser legibles, estructurados y exportables.",
      evidence: "Módulos CRUD + Reportes HTML/JSON.",
      score: 90,
      responsible: "Director de Calidad",
      status: "Cumple",
      dueDate: addDays(30),
    },
    {
      code: "ALCOA-C",
      principle: "Contemporaneous",
      area: "Operación",
      finding: "Los registros deben generarse en tiempo real o con justificación documentada.",
      evidence: "createdAt / updatedAt en Prisma.",
      score: 80,
      responsible: "Responsable GACP",
      status: "En progreso",
      dueDate: addDays(25),
    },
    {
      code: "ALCOA-O",
      principle: "Original",
      area: "Sistema",
      finding: "Debe preservarse el registro original y sus cambios mediante audit trail.",
      evidence: "AuditTrail snapshot JSON.",
      score: 82,
      responsible: "Administrador FloraTrack",
      status: "En progreso",
      dueDate: addDays(20),
    },
    {
      code: "ALCOA-A2",
      principle: "Accurate",
      area: "Calidad",
      finding: "Los datos deben ser exactos, revisados y aprobados por QA cuando aplique.",
      evidence: "Aprobaciones, Firmas, COA, CAPA.",
      score: 78,
      responsible: "QA Manager",
      status: "En progreso",
      dueDate: addDays(15),
    },
    {
      code: "ALCOA-COMPLETE",
      principle: "Complete",
      area: "Trazabilidad",
      finding: "La cadena cultivo-cosecha-muestra-análisis-COA debe estar completa.",
      evidence: "Módulo Trazabilidad.",
      score: 88,
      responsible: "Responsable GACP",
      status: "Cumple",
      dueDate: addDays(40),
    },
    {
      code: "ALCOA-CONSISTENT",
      principle: "Consistent",
      area: "Sistema",
      finding: "Los datos deben tener formatos y catálogos consistentes.",
      evidence: "Datos Maestros + Configuración.",
      score: 84,
      responsible: "Administrador FloraTrack",
      status: "En progreso",
      dueDate: addDays(30),
    },
    {
      code: "ALCOA-ENDURING",
      principle: "Enduring",
      area: "Backup",
      finding: "Los datos deben conservarse durante el periodo definido y estar respaldados.",
      evidence: "Backup Enterprise.",
      score: 75,
      responsible: "Administrador FloraTrack",
      status: "En progreso",
      dueDate: addDays(18),
    },
    {
      code: "ALCOA-AVAILABLE",
      principle: "Available",
      area: "Reportes",
      finding: "Los datos deben estar disponibles para revisión, auditoría y exportación.",
      evidence: "Reportes, Backup, Auditoría Sistema.",
      score: 86,
      responsible: "Director de Calidad",
      status: "Cumple",
      dueDate: addDays(30),
    },
  ];

  for (const item of principles) {
    const record = await ensure(prisma.dataIntegrityReview, { code: item.code }, item);
    await audit("ALCOA+", "SEED DATA INTEGRITY", record);
  }

  const auditReviews = [
    {
      code: "ATR-2026-001",
      period: "2026-Q2",
      module: "Calidad",
      reviewer: "QA Manager",
      findings: "Eventos de calidad auditados correctamente.",
      actions: "Mantener revisión mensual y exportar evidencia.",
      status: "Cumple",
      dueDate: addDays(15),
    },
    {
      code: "ATR-2026-002",
      period: "2026-Q2",
      module: "Sistema",
      reviewer: "Administrador FloraTrack",
      findings: "Se requiere formalizar revisión de backup y accesos.",
      actions: "Crear SOP Data Integrity y anexar evidencia.",
      status: "Con hallazgos",
      dueDate: addDays(10),
    },
  ];

  for (const item of auditReviews) {
    const record = await ensure(prisma.auditTrailReview, { code: item.code }, item);
    await audit("Revisión Audit Trail", "SEED DATA INTEGRITY", record);
  }

  const accessReviews = [
    {
      code: "ACC-REV-001",
      period: "2026-Q2",
      userName: "Administrador FloraTrack",
      role: "Super Admin",
      reviewer: "QA Manager",
      finding: "Acceso crítico permitido por fase de desarrollo.",
      action: "Revisar segregación de funciones antes de producción.",
      status: "Acción requerida",
      dueDate: addDays(12),
    },
    {
      code: "ACC-REV-002",
      period: "2026-Q2",
      userName: "Director de Calidad",
      role: "QA Manager",
      reviewer: "Administrador FloraTrack",
      finding: "Acceso adecuado a módulos QA.",
      action: "Mantener y revisar trimestralmente.",
      status: "Aprobado",
      dueDate: addDays(45),
    },
  ];

  for (const item of accessReviews) {
    const record = await ensure(prisma.accessPeriodicReview, { code: item.code }, item);
    await audit("Revisión Accesos", "SEED DATA INTEGRITY", record);
  }

  console.log("SEED DATA INTEGRITY / ALCOA+ COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
