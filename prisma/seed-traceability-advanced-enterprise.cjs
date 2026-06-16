const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
      recordLabel: record.code || record.batchCode || record.childLot || record.id,
      responsible: record.responsible || "FloraTrack Trazabilidad Seed",
      status: record.status || "Activo",
      snapshot: JSON.stringify(record),
    },
  }).catch(() => {});
}

async function main() {
  const genealogy = [
    {
      code: "GEN-LOT-001",
      parentLot: "COS-2026-001",
      childLot: "DRY-2026-001",
      productName: "Flor seca Blueberry Indica",
      transformationType: "Secado",
      quantity: 12.5,
      unit: "kg",
      status: "Activo",
    },
    {
      code: "GEN-LOT-002",
      parentLot: "DRY-2026-001",
      childLot: "LOT-LR-2026-001",
      productName: "Extracto Live Rosin Blueberry Indica",
      transformationType: "Live Rosin",
      quantity: 1.2,
      unit: "kg",
      status: "Activo",
    },
    {
      code: "GEN-LOT-003",
      parentLot: "LOT-LR-2026-001",
      childLot: "PT-LR-2026-001",
      productName: "Producto terminado Live Rosin 1g",
      transformationType: "Envasado",
      quantity: 500,
      unit: "unidades",
      status: "Liberado",
    },
  ];

  for (const item of genealogy) {
    const record = await ensure(prisma.lotGenealogy, { code: item.code }, item);
    await audit("Genealogía de Lotes", "SEED TRAZABILIDAD AVANZADA", record);
  }

  const events = [
    {
      code: "TR-EVT-001",
      eventType: "Creación lote",
      module: "Cosecha",
      recordCode: "COS-2026-001",
      batchCode: "COS-2026-001",
      description: "Creación de lote de cosecha medicinal Blueberry Indica.",
      responsible: "Responsable GACP",
      status: "Registrado",
      eventDate: new Date(),
    },
    {
      code: "TR-EVT-002",
      eventType: "Consumo material",
      module: "Producción",
      recordCode: "CONS-2026-001",
      batchCode: "LOT-LR-2026-001",
      description: "Consumo de material liofilizado para prensado Live Rosin.",
      responsible: "Responsable GMP",
      status: "Revisado",
      eventDate: new Date(),
    },
    {
      code: "TR-EVT-003",
      eventType: "Liberación QA",
      module: "COA",
      recordCode: "COA-2026-001",
      batchCode: "PT-LR-2026-001",
      description: "Liberación QA posterior a COA aprobado.",
      responsible: "QA Manager",
      status: "Aprobado",
      eventDate: new Date(),
    },
  ];

  for (const item of events) {
    const record = await ensure(prisma.traceabilityEvent, { code: item.code }, item);
    await audit("Eventos de Trazabilidad", "SEED TRAZABILIDAD AVANZADA", record);
  }

  const consumption = [
    {
      code: "CONS-2026-001",
      batchCode: "LOT-LR-2026-001",
      materialName: "Bubble hash liofilizado",
      materialLot: "BH-2026-001",
      quantity: 5,
      unit: "kg",
      processStep: "Prensado sin solvente",
      responsible: "Operario Producción",
      status: "Consumido",
    },
    {
      code: "CONS-2026-002",
      batchCode: "PT-LR-2026-001",
      materialName: "Frasco ámbar 1g",
      materialLot: "EMP-2026-001",
      quantity: 500,
      unit: "unidades",
      processStep: "Envasado",
      responsible: "Responsable Empaque",
      status: "Revisado QA",
    },
  ];

  for (const item of consumption) {
    const record = await ensure(prisma.materialConsumption, { code: item.code }, item);
    await audit("Consumo de Materiales", "SEED TRAZABILIDAD AVANZADA", record);
  }

  const yields = [
    {
      code: "YLD-2026-001",
      batchCode: "LOT-LR-2026-001",
      processName: "Live Rosin",
      inputQuantity: 5,
      outputQuantity: 1.2,
      unit: "kg",
      yieldPercent: 24,
      responsible: "Responsable GMP",
      status: "Revisión QA",
    },
    {
      code: "YLD-2026-002",
      batchCode: "PT-LR-2026-001",
      processName: "Envasado",
      inputQuantity: 1.2,
      outputQuantity: 0.5,
      unit: "kg equivalente",
      yieldPercent: 41.67,
      responsible: "QA Manager",
      status: "Registrado",
    },
  ];

  for (const item of yields) {
    const record = await ensure(prisma.processYield, { code: item.code }, item);
    await audit("Rendimientos de Proceso", "SEED TRAZABILIDAD AVANZADA", record);
  }

  console.log("SEED TRAZABILIDAD AVANZADA ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
