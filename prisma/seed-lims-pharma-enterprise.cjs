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
      recordLabel: record.code || record.title || record.productName || record.id,
      responsible: record.owner || record.fromPerson || record.toPerson || "FloraTrack LIMS Seed",
      status: record.status || "Activo",
      snapshot: JSON.stringify(record),
    },
  }).catch(() => {});
}

async function main() {
  const methods = [
    {
      code: "MET-HPLC-CAN-001",
      title: "Cuantificación de cannabinoides por HPLC",
      matrix: "Flor",
      technique: "HPLC",
      version: "1.0",
      owner: "Jefe de Laboratorio",
      status: "Aprobado",
    },
    {
      code: "MET-GCMS-TER-001",
      title: "Perfil de terpenos por GC-MS",
      matrix: "Extracto",
      technique: "GC-MS",
      version: "1.0",
      owner: "Jefe de Laboratorio",
      status: "Validado",
    },
    {
      code: "MET-MICRO-001",
      title: "Análisis microbiológico de producto terminado",
      matrix: "Producto terminado",
      technique: "Microbiología",
      version: "1.0",
      owner: "Microbiología QA",
      status: "Aprobado",
    },
  ];

  for (const item of methods) {
    const record = await ensure(prisma.analyticalMethod, { code: item.code }, item);
    await audit("Métodos Analíticos", "SEED LIMS ENTERPRISE", record);
  }

  const specifications = [
    {
      code: "SPEC-FLOR-THC-001",
      productName: "Flor medicinal premium",
      parameter: "THC total",
      limitValue: "Según registro / especificación interna",
      methodCode: "MET-HPLC-CAN-001",
      owner: "QA Manager",
      status: "Activa",
    },
    {
      code: "SPEC-EXT-TER-001",
      productName: "Extracto Live Rosin Blueberry Indica",
      parameter: "Perfil terpénico",
      limitValue: "Perfil característico aprobado",
      methodCode: "MET-GCMS-TER-001",
      owner: "QA Manager",
      status: "Activa",
    },
    {
      code: "SPEC-PT-MICRO-001",
      productName: "Producto terminado cannabis medicinal",
      parameter: "Microbiología",
      limitValue: "Cumple especificación microbiológica",
      methodCode: "MET-MICRO-001",
      owner: "Director de Calidad",
      status: "Activa",
    },
  ];

  for (const item of specifications) {
    const record = await ensure(prisma.productSpecification, { code: item.code }, item);
    await audit("Especificaciones", "SEED LIMS ENTERPRISE", record);
  }

  const custody = [
    {
      code: "COC-2026-001",
      sampleCode: "MUE-2026-001",
      fromPerson: "Responsable GACP",
      toPerson: "Analista Laboratorio",
      location: "Laboratorio QA - Recepción de muestras",
      transferDate: new Date(),
      status: "Recibida",
    },
    {
      code: "COC-2026-002",
      sampleCode: "MUE-2026-002",
      fromPerson: "Producción GMP",
      toPerson: "Jefe de Laboratorio",
      location: "Laboratorio QA - Cuarentena analítica",
      transferDate: new Date(),
      status: "En análisis",
    },
  ];

  for (const item of custody) {
    const record = await ensure(prisma.chainOfCustodyRecord, { code: item.code }, item);
    await audit("Cadena de Custodia", "SEED LIMS ENTERPRISE", record);
  }

  const oos = await ensure(
    prisma.oosInvestigation,
    { code: "OOS-2026-001" },
    {
      code: "OOS-2026-001",
      sampleCode: "MUE-2026-002",
      analysisCode: "ANA-2026-002",
      result: "Resultado fuera de tendencia simulada",
      issue: "Resultado analítico requiere investigación OOS/OOT antes de liberación.",
      rootCause: "Pendiente investigación de laboratorio.",
      action: "Retener lote, revisar método, revisar muestra y ejecutar análisis confirmatorio.",
      owner: "QA Manager",
      status: "En investigación",
      dueDate: addDays(10),
    }
  );
  await audit("OOS", "SEED LIMS ENTERPRISE", oos);

  console.log("SEED LIMS / LAB QA ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
