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
      recordLabel: record.code || record.productName || record.processName || record.metric || record.id,
      responsible: record.owner || "FloraTrack Quality Intelligence Seed",
      status: record.status || "Activo",
      snapshot: JSON.stringify(record),
    },
  }).catch(() => {});
}

async function main() {
  const trends = [
    {
      code: "QT-DEV-2026-001",
      area: "Calidad",
      metric: "Desviaciones abiertas",
      period: "2026-Q2",
      value: 3,
      unit: "casos",
      trend: "Estable",
      conclusion: "Las desviaciones se mantienen bajo control; continuar seguimiento CAPA.",
      owner: "QA Manager",
      status: "En revisión QA",
    },
    {
      code: "QT-OOS-2026-001",
      area: "Laboratorio",
      metric: "OOS/OOT",
      period: "2026-Q2",
      value: 1,
      unit: "casos",
      trend: "Alerta",
      conclusion: "Se requiere seguimiento de investigación OOS antes de liberar lote.",
      owner: "Jefe de Laboratorio",
      status: "Abierta",
    },
    {
      code: "QT-COMP-2026-001",
      area: "Postmercado",
      metric: "Quejas de producto",
      period: "2026-Q2",
      value: 0,
      unit: "casos",
      trend: "Mejora",
      conclusion: "Sin quejas registradas en el periodo.",
      owner: "Director de Calidad",
      status: "Cerrada",
    },
  ];

  for (const item of trends) {
    const record = await ensure(prisma.qualityTrend, { code: item.code }, item);
    await audit("Tendencias Calidad", "SEED QUALITY INTELLIGENCE", record);
  }

  const pqr = await ensure(
    prisma.productQualityReview,
    { code: "PQR-LR-2026-001" },
    {
      code: "PQR-LR-2026-001",
      productName: "Live Rosin Blueberry Indica",
      period: "2026",
      batches: 3,
      deviations: 1,
      complaints: 0,
      oosCount: 1,
      conclusion: "Producto en fase inicial de revisión. Requiere cierre de OOS y confirmación de estabilidad.",
      owner: "QA Manager",
      status: "En revisión QA",
      dueDate: addDays(45),
    }
  );
  await audit("Revisión Producto PQR", "SEED QUALITY INTELLIGENCE", pqr);

  const stability = [
    {
      code: "STAB-TREND-001",
      productName: "Live Rosin Blueberry Indica",
      batchCode: "PT-LR-2026-001",
      condition: "25°C / 60% HR",
      parameter: "Potencia cannabinoides",
      resultValue: "Dentro de tendencia",
      trend: "Estable",
      conclusion: "No se observa degradación relevante en el punto evaluado.",
      owner: "Jefe de Laboratorio",
      status: "Cumple",
      reviewDate: new Date(),
    },
    {
      code: "STAB-TREND-002",
      productName: "Live Rosin Blueberry Indica",
      batchCode: "PT-LR-2026-001",
      condition: "40°C / 75% HR",
      parameter: "Terpenos",
      resultValue: "Disminución leve",
      trend: "Alerta",
      conclusion: "Mantener seguimiento en condición acelerada.",
      owner: "QA Manager",
      status: "En revisión",
      reviewDate: new Date(),
    },
  ];

  for (const item of stability) {
    const record = await ensure(prisma.stabilityTrendReview, { code: item.code }, item);
    await audit("Tendencias Estabilidad", "SEED QUALITY INTELLIGENCE", record);
  }

  const capability = [
    {
      code: "CPK-PRS-001",
      processName: "Prensado Live Rosin",
      batchCode: "LOT-LR-2026-001",
      parameter: "Temperatura placas",
      cpk: 1.33,
      sigmaLevel: 4,
      conclusion: "Proceso preliminarmente capaz, requiere más lotes para confirmación estadística.",
      owner: "Responsable GMP",
      status: "En análisis",
    },
    {
      code: "CPK-ENV-001",
      processName: "Envasado 1g",
      batchCode: "PT-LR-2026-001",
      parameter: "Peso neto",
      cpk: 1.1,
      sigmaLevel: 3.5,
      conclusion: "Proceso requiere ajuste fino y monitoreo adicional.",
      owner: "QA Manager",
      status: "CAPA requerida",
    },
  ];

  for (const item of capability) {
    const record = await ensure(prisma.processCapabilityReview, { code: item.code }, item);
    await audit("Capacidad Proceso", "SEED QUALITY INTELLIGENCE", record);
  }

  console.log("SEED QUALITY INTELLIGENCE / PQR APR ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
