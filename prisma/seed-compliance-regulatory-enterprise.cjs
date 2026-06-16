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
      recordLabel: record.code || record.standard || record.requirement || record.title || record.id,
      responsible: record.owner || "FloraTrack Normativa Seed",
      status: record.status || "Activo",
      snapshot: JSON.stringify(record),
    },
  }).catch(() => {});
}

async function main() {
  const frameworks = [
    {
      code: "COL-CANNABIS-001",
      country: "Colombia",
      authority: "Ministerio de Justicia / Ministerio de Salud / INVIMA / ICA",
      standard: "Marco regulatorio colombiano de cannabis medicinal",
      scope: "Licencias, cupos, PEAS, fabricación de derivados, productos, trazabilidad y control.",
      version: "Vigente",
      status: "Vigente",
      effectiveDate: new Date(),
    },
    {
      code: "WHO-GACP-001",
      country: "Internacional",
      authority: "WHO",
      standard: "GACP para plantas medicinales",
      scope: "Buenas prácticas agrícolas y de recolección.",
      version: "Referencia",
      status: "Referencia",
      effectiveDate: new Date(),
    },
    {
      code: "EU-GMP-ANNEX11",
      country: "Unión Europea",
      authority: "European Commission",
      standard: "EU GMP Annex 11",
      scope: "Sistemas computarizados GxP.",
      version: "Referencia",
      status: "Referencia",
      effectiveDate: new Date(),
    },
    {
      code: "FDA-21CFR-PART11",
      country: "Estados Unidos",
      authority: "FDA",
      standard: "21 CFR Part 11",
      scope: "Registros electrónicos y firmas electrónicas.",
      version: "Referencia",
      status: "Referencia",
      effectiveDate: new Date(),
    },
  ];

  for (const item of frameworks) {
    const record = await ensure(prisma.regulatoryFramework, { code: item.code }, item);
    await audit("Normativa", "SEED NORMATIVA ENTERPRISE", record);
  }

  const requirements = [
    {
      code: "REQ-GACP-001",
      frameworkCode: "WHO-GACP-001",
      area: "GACP",
      requirement: "Trazabilidad completa de predio, cultivo, genética, cosecha y material vegetal.",
      evidence: "Predios, Cultivos, Genéticas, Cosecha, Trazabilidad.",
      owner: "Responsable GACP",
      status: "Cumple",
      dueDate: addDays(30),
    },
    {
      code: "REQ-GMP-001",
      frameworkCode: "COL-CANNABIS-001",
      area: "GMP",
      requirement: "Batch records, liberación QA, COA, estabilidad, retención y control de lotes.",
      evidence: "Producción, Lotes, Batch Records, COA, Estabilidad, Retención.",
      owner: "Responsable GMP",
      status: "En progreso",
      dueDate: addDays(45),
    },
    {
      code: "REQ-DI-001",
      frameworkCode: "FDA-21CFR-PART11",
      area: "Data Integrity",
      requirement: "Audit trail, firmas electrónicas, control de accesos y backup verificable.",
      evidence: "ALCOA+, Firmas, Auditoría Sistema, Backup.",
      owner: "QA Manager",
      status: "En progreso",
      dueDate: addDays(20),
    },
    {
      code: "REQ-CSV-001",
      frameworkCode: "EU-GMP-ANNEX11",
      area: "Validación GxP",
      requirement: "Sistema computarizado validado mediante URS, IQ, OQ, PQ y matriz de trazabilidad.",
      evidence: "Validación CSV, Part 11, Annex 11.",
      owner: "Administrador FloraTrack",
      status: "En progreso",
      dueDate: addDays(60),
    },
  ];

  for (const item of requirements) {
    const record = await ensure(prisma.regulatoryRequirement, { code: item.code }, item);
    await audit("Requisitos Normativos", "SEED NORMATIVA ENTERPRISE", record);
  }

  const gaps = [
    {
      code: "GAP-CSV-001",
      requirementCode: "REQ-CSV-001",
      gap: "Falta reporte final de validación CSV firmado por QA.",
      severity: "Alta",
      actionPlan: "Completar ejecución OQ/PQ, generar reporte final y firma electrónica.",
      owner: "QA Manager",
      status: "En ejecución",
      dueDate: addDays(30),
    },
    {
      code: "GAP-DI-001",
      requirementCode: "REQ-DI-001",
      gap: "Debe formalizarse revisión periódica de audit trail.",
      severity: "Media",
      actionPlan: "Crear SOP de revisión de audit trail y programar revisión mensual.",
      owner: "Director de Calidad",
      status: "Abierta",
      dueDate: addDays(15),
    },
  ];

  for (const item of gaps) {
    const record = await ensure(prisma.complianceGap, { code: item.code }, item);
    await audit("Brechas de Cumplimiento", "SEED NORMATIVA ENTERPRISE", record);
  }

  const plan = await ensure(
    prisma.compliancePlan,
    { code: "PLAN-COMP-2026-001" },
    {
      code: "PLAN-COMP-2026-001",
      title: "Plan maestro de cumplimiento normativo FloraTrack / Growlifecol",
      area: "Dirección / Calidad / Regulatorio",
      objective: "Consolidar cumplimiento GACP/GMP/GxP, licencias, derivados, data integrity, CSV y postmercado.",
      progress: 78,
      owner: "Dirección General",
      status: "Activo",
      dueDate: addDays(90),
    }
  );
  await audit("Plan de Cumplimiento", "SEED NORMATIVA ENTERPRISE", plan);

  console.log("SEED CUMPLIMIENTO NORMATIVO ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
