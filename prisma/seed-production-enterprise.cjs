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
      recordLabel: record.code || record.productName || record.batchCode || record.id,
      responsible: record.responsible || record.operator || "FloraTrack Producción Seed",
      status: record.status || "Activo",
      snapshot: JSON.stringify(record),
    },
  }).catch(() => {});
}

async function main() {
  const order = await ensure(
    prisma.productionOrder,
    { code: "OP-2026-001" },
    {
      code: "OP-2026-001",
      productName: "Extracto Live Rosin Blueberry Indica",
      processType: "Live Rosin",
      batchSize: 5,
      unit: "kg",
      responsible: "Responsable GMP",
      status: "Planificada",
      dueDate: addDays(7),
    }
  );
  await audit("Producción", "SEED PRODUCCIÓN ENTERPRISE", order);

  const batch = await ensure(
    prisma.productionBatch,
    { code: "LOT-LR-2026-001" },
    {
      code: "LOT-LR-2026-001",
      productName: "Extracto Live Rosin Blueberry Indica",
      geneticName: "Blueberry Indica",
      sourceLot: "COS-2026-001",
      productionDate: new Date(),
      quantity: 1.2,
      unit: "kg",
      status: "Cuarentena",
    }
  );
  await audit("Lotes", "SEED PRODUCCIÓN ENTERPRISE", batch);

  const steps = [
    {
      code: "BR-LR-001",
      batchCode: "LOT-LR-2026-001",
      step: "Recepción de bubble hash liofilizado",
      operator: "Operario Producción",
      parameter: "Humedad residual",
      result: "Dentro de especificación",
      status: "Cumple",
    },
    {
      code: "BR-LR-002",
      batchCode: "LOT-LR-2026-001",
      step: "Prensado sin solvente",
      operator: "Operario Producción",
      parameter: "Temperatura 78°C",
      result: "Cumple",
      status: "Cumple",
    },
    {
      code: "BR-LR-003",
      batchCode: "LOT-LR-2026-001",
      step: "Recolección de extracto",
      operator: "Operario Producción",
      parameter: "Rendimiento",
      result: "Pendiente revisión QA",
      status: "Revisión QA",
    },
  ];

  for (const step of steps) {
    const record = await ensure(prisma.batchRecord, { code: step.code }, step);
    await audit("Batch Records", "SEED PRODUCCIÓN ENTERPRISE", record);
  }

  const packaging = await ensure(
    prisma.packagingRecord,
    { code: "ENV-LR-2026-001" },
    {
      code: "ENV-LR-2026-001",
      batchCode: "LOT-LR-2026-001",
      productName: "Extracto Live Rosin Blueberry Indica",
      packagingType: "Frasco ámbar 1 g",
      unitsPackaged: 500,
      labelControl: "Etiqueta controlada QA V1",
      responsible: "Responsable Empaque",
      status: "En proceso",
    }
  );
  await audit("Envasado", "SEED PRODUCCIÓN ENTERPRISE", packaging);

  const stability = await ensure(
    prisma.stabilityStudy,
    { code: "EST-LR-2026-001" },
    {
      code: "EST-LR-2026-001",
      batchCode: "LOT-LR-2026-001",
      condition: "25°C / 60% HR",
      timePoint: "T0",
      result: "Pendiente análisis inicial",
      status: "En estudio",
      dueDate: addDays(30),
    }
  );
  await audit("Estabilidad", "SEED PRODUCCIÓN ENTERPRISE", stability);

  const retention = await ensure(
    prisma.retentionSample,
    { code: "RET-LR-2026-001" },
    {
      code: "RET-LR-2026-001",
      batchCode: "LOT-LR-2026-001",
      sampleType: "Extracto",
      location: "Nevera retención QA - Estante A1",
      quantity: 10,
      unit: "g",
      status: "Retenida",
    }
  );
  await audit("Retención", "SEED PRODUCCIÓN ENTERPRISE", retention);

  console.log("SEED PRODUCCIÓN GMP ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
