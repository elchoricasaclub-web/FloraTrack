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
      recordLabel: record.code || record.areaName || record.pointCode || record.parameter || record.id,
      responsible: record.owner || record.performedBy || record.analyst || "FloraTrack EMS Seed",
      status: record.status || "Activo",
      snapshot: JSON.stringify(record),
    },
  }).catch(() => {});
}

async function main() {
  const points = [
    {
      code: "EM-PNT-001",
      areaName: "Área de extracción BHO",
      pointType: "Aire viable",
      classification: "No clasificada controlada",
      frequency: "Mensual",
      limitValue: "≤ 100 UFC/m3",
      owner: "QA Microbiología",
      status: "Activo",
    },
    {
      code: "EM-PNT-002",
      areaName: "Laboratorio QA",
      pointType: "Superficie",
      classification: "No clasificada controlada",
      frequency: "Mensual",
      limitValue: "≤ 50 UFC/placa",
      owner: "Jefe de Laboratorio",
      status: "Activo",
    },
    {
      code: "EM-PNT-003",
      areaName: "Sala de envasado",
      pointType: "Aire no viable",
      classification: "ISO 8",
      frequency: "Semanal",
      limitValue: "Según ISO 14644",
      owner: "QA Manager",
      status: "Activo",
    },
  ];

  for (const item of points) {
    const record = await ensure(prisma.envMonitoringPoint, { code: item.code }, item);
    await audit("Puntos Monitoreo", "SEED EMS ENTERPRISE", record);
  }

  const runs = [
    {
      code: "EM-RUN-2026-001",
      areaName: "Área de extracción BHO",
      runType: "Rutina",
      performedBy: "Analista Microbiología",
      status: "Ejecutada",
      runDate: new Date(),
    },
    {
      code: "EM-RUN-2026-002",
      areaName: "Sala de envasado",
      runType: "Post limpieza",
      performedBy: "QA Manager",
      status: "En revisión QA",
      runDate: new Date(),
    },
  ];

  for (const item of runs) {
    const record = await ensure(prisma.envMonitoringRun, { code: item.code }, item);
    await audit("Rondas Ambientales", "SEED EMS ENTERPRISE", record);
  }

  const results = [
    {
      code: "EM-RES-001",
      runCode: "EM-RUN-2026-001",
      pointCode: "EM-PNT-001",
      parameter: "UFC aire viable",
      resultValue: "45",
      limitValue: "≤ 100",
      unit: "UFC/m3",
      analyst: "Analista Microbiología",
      status: "Cumple",
    },
    {
      code: "EM-RES-002",
      runCode: "EM-RUN-2026-001",
      pointCode: "EM-PNT-002",
      parameter: "UFC superficie",
      resultValue: "12",
      limitValue: "≤ 50",
      unit: "UFC/placa",
      analyst: "Analista Microbiología",
      status: "Cumple",
    },
    {
      code: "EM-RES-003",
      runCode: "EM-RUN-2026-002",
      pointCode: "EM-PNT-003",
      parameter: "Partículas no viables",
      resultValue: "Alerta",
      limitValue: "Según ISO 14644",
      unit: "partículas/m3",
      analyst: "QA Manager",
      status: "Alerta",
    },
  ];

  for (const item of results) {
    const record = await ensure(prisma.envMonitoringResult, { code: item.code }, item);
    await audit("Resultados Ambientales", "SEED EMS ENTERPRISE", record);
  }

  const excursion = await ensure(
    prisma.environmentalExcursion,
    { code: "EM-EXC-001" },
    {
      code: "EM-EXC-001",
      pointCode: "EM-PNT-003",
      parameter: "Partículas no viables",
      resultValue: "Alerta",
      limitValue: "Según ISO 14644",
      issue: "Resultado en nivel de alerta durante monitoreo post limpieza.",
      rootCause: "Pendiente investigación de limpieza, flujo de personal y HVAC.",
      action: "Repetir limpieza, verificar HVAC, ejecutar muestreo confirmatorio y evaluar CAPA.",
      owner: "QA Manager",
      status: "En investigación",
      dueDate: addDays(7),
    }
  );
  await audit("Excursiones Ambientales", "SEED EMS ENTERPRISE", excursion);

  console.log("SEED MONITOREO AMBIENTAL GMP ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
