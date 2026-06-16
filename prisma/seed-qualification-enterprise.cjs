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
      recordLabel: record.code || record.equipmentName || record.testName || record.name || record.areaName || record.id,
      responsible: record.responsible || record.executedBy || record.owner || "FloraTrack Qualification Seed",
      status: record.status || "Activo",
      snapshot: JSON.stringify(record),
    },
  }).catch(() => {});
}

async function main() {
  const qualifications = [
    {
      code: "EQ-QUAL-001",
      equipmentName: "Liofilizadora Harvest Right",
      qualificationType: "IQ",
      protocolCode: "PROT-IQ-LIO-001",
      reportCode: "REP-IQ-LIO-001",
      responsible: "QA Manager",
      status: "Aprobada",
      dueDate: addDays(180),
    },
    {
      code: "EQ-QUAL-002",
      equipmentName: "Prensa Live Rosin",
      qualificationType: "OQ",
      protocolCode: "PROT-OQ-PRS-001",
      reportCode: "REP-OQ-PRS-001",
      responsible: "Responsable GMP",
      status: "En ejecución",
      dueDate: addDays(30),
    },
    {
      code: "EQ-QUAL-003",
      equipmentName: "HPLC Cannabinoides",
      qualificationType: "PQ",
      protocolCode: "PROT-PQ-HPLC-001",
      reportCode: "REP-PQ-HPLC-001",
      responsible: "Jefe de Laboratorio",
      status: "Planificada",
      dueDate: addDays(45),
    },
  ];

  for (const item of qualifications) {
    const record = await ensure(prisma.equipmentQualification, { code: item.code }, item);
    await audit("Calificación Equipos", "SEED QUALIFICATION ENTERPRISE", record);
  }

  const tests = [
    {
      code: "QTEST-001",
      qualificationCode: "EQ-QUAL-001",
      testName: "Verificación instalación eléctrica y ubicación",
      acceptanceCriteria: "Equipo instalado conforme a URS y manual fabricante.",
      result: "Cumple",
      executedBy: "Técnico Mantenimiento",
      status: "Cumple",
      executedAt: new Date(),
    },
    {
      code: "QTEST-002",
      qualificationCode: "EQ-QUAL-002",
      testName: "Verificación temperatura de placas",
      acceptanceCriteria: "Temperatura estable dentro del rango definido.",
      result: "Pendiente segundo ciclo",
      executedBy: "Responsable GMP",
      status: "Pendiente",
      executedAt: null,
    },
    {
      code: "QTEST-003",
      qualificationCode: "EQ-QUAL-003",
      testName: "Linealidad método HPLC",
      acceptanceCriteria: "R2 dentro del criterio de validación.",
      result: "Pendiente ejecución",
      executedBy: "Analista Laboratorio",
      status: "Pendiente",
      executedAt: null,
    },
  ];

  for (const item of tests) {
    const record = await ensure(prisma.qualificationTest, { code: item.code }, item);
    await audit("Pruebas Calificación", "SEED QUALIFICATION ENTERPRISE", record);
  }

  const utilities = [
    {
      code: "UTIL-HVAC-001",
      name: "Sistema HVAC área de extracción",
      systemType: "HVAC",
      area: "Extracción GMP",
      criticality: "Crítica",
      owner: "Mantenimiento / QA",
      status: "En calificación",
      reviewDate: addDays(30),
    },
    {
      code: "UTIL-FRIO-001",
      name: "Cadena de frío muestras y retención",
      systemType: "Cadena de frío",
      area: "Laboratorio QA",
      criticality: "Alta",
      owner: "Jefe de Laboratorio",
      status: "Activo",
      reviewDate: addDays(60),
    },
  ];

  for (const item of utilities) {
    const record = await ensure(prisma.criticalUtilitySystem, { code: item.code }, item);
    await audit("Sistemas Críticos", "SEED QUALIFICATION ENTERPRISE", record);
  }

  const areas = [
    {
      code: "AREA-GMP-001",
      areaName: "Área de extracción BHO",
      classification: "No clasificada controlada",
      pressureCascade: "Presión negativa controlada",
      temperatureRange: "18-25 °C",
      humidityRange: "40-60% HR",
      owner: "Responsable GMP",
      status: "En monitoreo",
      reviewDate: addDays(45),
    },
    {
      code: "AREA-LAB-001",
      areaName: "Laboratorio QA",
      classification: "No clasificada controlada",
      pressureCascade: "Presión positiva relativa",
      temperatureRange: "18-25 °C",
      humidityRange: "40-60% HR",
      owner: "Jefe de Laboratorio",
      status: "Calificada",
      reviewDate: addDays(90),
    },
  ];

  for (const item of areas) {
    const record = await ensure(prisma.classifiedArea, { code: item.code }, item);
    await audit("Áreas Clasificadas", "SEED QUALIFICATION ENTERPRISE", record);
  }

  console.log("SEED CALIFICACION / VALIDACION ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
