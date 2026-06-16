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
      recordLabel: record.code || record.standard || record.requirement || record.gap || record.id,
      responsible: record.responsible || "FloraTrack Standards Seed",
      status: record.status || "Activo",
      snapshot: JSON.stringify(record),
    },
  }).catch(() => {});
}

async function main() {
  const requirements = [
    {
      code: "REQ-GACP-001",
      standard: "GACP",
      chapter: "Cultivo y trazabilidad",
      requirement: "El sistema debe mantener trazabilidad completa de predio, genética, cultivo, cosecha, muestra, análisis y COA.",
      area: "GACP",
      criticality: "Crítica",
      status: "Activo",
    },
    {
      code: "REQ-GMP-001",
      standard: "GMP",
      chapter: "Batch record",
      requirement: "Todo lote productivo debe contar con batch record completo, revisión QA, control de proceso y liberación documentada.",
      area: "Producción GMP",
      criticality: "Crítica",
      status: "Activo",
    },
    {
      code: "REQ-DI-001",
      standard: "ALCOA+",
      chapter: "Data Integrity",
      requirement: "Los registros deben ser atribuibles, legibles, contemporáneos, originales, exactos, completos, consistentes, perdurables y disponibles.",
      area: "Data Integrity",
      criticality: "Crítica",
      status: "Activo",
    },
    {
      code: "REQ-P11-001",
      standard: "21 CFR Part 11",
      chapter: "Registros electrónicos",
      requirement: "El sistema debe controlar acceso, audit trail, firmas electrónicas, integridad de datos y conservación de registros.",
      area: "Sistema",
      criticality: "Alta",
      status: "Activo",
    },
    {
      code: "REQ-A11-001",
      standard: "EU Annex 11",
      chapter: "Sistemas computarizados",
      requirement: "El sistema computarizado debe estar validado y contar con control de cambios, backup, seguridad y revisión periódica.",
      area: "Validación GxP",
      criticality: "Alta",
      status: "Activo",
    },
    {
      code: "REQ-REG-001",
      standard: "Ministerio de Justicia",
      chapter: "Cannabis medicinal",
      requirement: "La empresa debe controlar licencias, cupos, PEAS, vencimientos, trámites y evidencia regulatoria.",
      area: "Regulatorio",
      criticality: "Crítica",
      status: "Activo",
    },
    {
      code: "REQ-ICA-001",
      standard: "ICA",
      chapter: "Material vegetal",
      requirement: "Las genéticas, semillas, propagación y registros deben conservar trazabilidad documental y soporte de autorización.",
      area: "ICA",
      criticality: "Alta",
      status: "Activo",
    },
    {
      code: "REQ-INVIMA-001",
      standard: "INVIMA",
      chapter: "Producto terminado",
      requirement: "Los productos deben contar con formulación, lote, estabilidad, retención, liberación, quejas y postmercado cuando aplique.",
      area: "INVIMA",
      criticality: "Alta",
      status: "Activo",
    },
  ];

  for (const item of requirements) {
    const record = await ensure(prisma.complianceRequirement, { code: item.code }, item);
    await audit("Normativa", "SEED NORMATIVA ENTERPRISE", record);
  }

  const assessments = [
    {
      code: "ASSESS-GACP-001",
      requirementCode: "REQ-GACP-001",
      area: "GACP",
      evidence: "Módulo Trazabilidad + Predios + Genéticas + Cultivos + Cosecha + Muestras + COA.",
      score: 90,
      finding: "Trazabilidad operativa en ambiente local.",
      status: "Cumple",
      responsible: "Responsable GACP",
      dueDate: addDays(30),
    },
    {
      code: "ASSESS-GMP-001",
      requirementCode: "REQ-GMP-001",
      area: "Producción GMP",
      evidence: "Producción, Lotes, Batch Records, Envasado, Estabilidad y Retención.",
      score: 78,
      finding: "Se requiere completar revisión QA y aprobación formal de lote.",
      status: "Cumple parcialmente",
      responsible: "Responsable GMP",
      dueDate: addDays(20),
    },
    {
      code: "ASSESS-DI-001",
      requirementCode: "REQ-DI-001",
      area: "Data Integrity",
      evidence: "ALCOA+, Auditoría Sistema, Backup, Firmas y Revisión Accesos.",
      score: 82,
      finding: "Sistema con audit trail; falta formalizar SOP de revisión periódica.",
      status: "Cumple parcialmente",
      responsible: "QA Manager",
      dueDate: addDays(15),
    },
    {
      code: "ASSESS-CSV-001",
      requirementCode: "REQ-A11-001",
      area: "Validación GxP",
      evidence: "Validación CSV, Part 11, Annex 11.",
      score: 75,
      finding: "Falta completar reporte final de validación.",
      status: "Cumple parcialmente",
      responsible: "Administrador FloraTrack",
      dueDate: addDays(25),
    },
  ];

  for (const item of assessments) {
    const record = await ensure(prisma.complianceAssessment, { code: item.code }, item);
    await audit("Matriz Cumplimiento", "SEED NORMATIVA ENTERPRISE", record);
  }

  const gaps = [
    {
      code: "GAP-001",
      gap: "Formalizar SOP de Data Integrity y revisión periódica de audit trail.",
      source: "Matriz cumplimiento",
      rootCause: "Sistema en fase de construcción enterprise local.",
      action: "Crear SOP-DI-001, aprobarlo con firma electrónica y programar revisión mensual.",
      responsible: "QA Manager",
      priority: "Alta",
      status: "Abierta",
      dueDate: addDays(15),
    },
    {
      code: "GAP-002",
      gap: "Completar reporte final de validación CSV.",
      source: "Validación GxP",
      rootCause: "Validación en curso.",
      action: "Consolidar URS, matriz de trazabilidad, IQ, OQ, PQ, desviaciones y aprobación QA.",
      responsible: "Administrador FloraTrack",
      priority: "Alta",
      status: "En ejecución",
      dueDate: addDays(25),
    },
    {
      code: "GAP-003",
      gap: "Completar evidencia de revisión QA para liberación de lote GMP.",
      source: "Producción GMP",
      rootCause: "Flujo productivo creado, pendiente cierre documental.",
      action: "Crear aprobación QA, firma electrónica y checklist de liberación.",
      responsible: "Responsable GMP",
      priority: "Media",
      status: "Abierta",
      dueDate: addDays(20),
    },
  ];

  for (const item of gaps) {
    const record = await ensure(prisma.gapActionPlan, { code: item.code }, item);
    await audit("Brechas", "SEED NORMATIVA ENTERPRISE", record);
  }

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
