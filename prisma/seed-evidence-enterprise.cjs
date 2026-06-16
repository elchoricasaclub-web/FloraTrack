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
      recordLabel: record.code || record.title || record.name || record.id,
      responsible: record.owner || record.auditor || "FloraTrack Evidence Seed",
      status: record.status || "Activo",
      snapshot: JSON.stringify(record),
    },
  }).catch(() => {});
}

async function main() {
  const evidences = [
    {
      code: "EVD-GACP-001",
      standard: "WHO GACP",
      module: "GACP",
      requirementCode: "REQ-GACP-001",
      evidenceType: "Registro",
      title: "Matriz de capacitación GACP por cargo crítico",
      location: "Módulo Capacitaciones / Registros controlados",
      owner: "Responsable GACP",
      status: "Disponible",
    },
    {
      code: "EVD-GACP-002",
      standard: "WHO GACP",
      module: "Trazabilidad",
      requirementCode: "REQ-GACP-002",
      evidenceType: "Reporte",
      title: "Cadena de trazabilidad cultivo-cosecha-muestra-análisis-COA",
      location: "Módulo Trazabilidad",
      owner: "Director de Calidad",
      status: "Disponible",
    },
    {
      code: "EVD-GMP-001",
      standard: "EU GMP",
      module: "Calidad",
      requirementCode: "REQ-GMP-001",
      evidenceType: "SOP",
      title: "SOP de desviaciones, CAPA, riesgos y control de cambios",
      location: "Módulos SOP / CAPA / Desviaciones / Riesgos",
      owner: "QA Manager",
      status: "En revisión",
    },
    {
      code: "EVD-DI-001",
      standard: "WHO Data Integrity",
      module: "Sistema",
      requirementCode: "REQ-DI-001",
      evidenceType: "Audit Trail",
      title: "Audit trail centralizado con snapshot y responsable",
      location: "Módulo Auditoría Sistema",
      owner: "Administrador FloraTrack",
      status: "Disponible",
    },
    {
      code: "EVD-P11-001",
      standard: "21 CFR Part 11",
      module: "Firmas",
      requirementCode: "REQ-P11-001",
      evidenceType: "Firma",
      title: "Firmas electrónicas asociadas a SOP y registros",
      location: "Módulo Firmas",
      owner: "QA Manager",
      status: "Disponible",
    },
    {
      code: "EVD-A11-001",
      standard: "EU Annex 11",
      module: "Validación GxP",
      requirementCode: "REQ-A11-001",
      evidenceType: "Reporte",
      title: "Protocolos CSV URS/IQ/OQ/PQ y controles Annex 11",
      location: "Módulos Validación CSV / EU Annex 11",
      owner: "Administrador FloraTrack",
      status: "En revisión",
    },
    {
      code: "EVD-BKP-001",
      standard: "EU Annex 11",
      module: "Backup",
      requirementCode: "A11-002",
      evidenceType: "Backup",
      title: "Backup enterprise JSON y health check del sistema",
      location: "Módulo Backup",
      owner: "Administrador FloraTrack",
      status: "Disponible",
    },
  ];

  for (const item of evidences) {
    const record = await ensure(prisma.evidenceRecord, { code: item.code }, item);
    await audit("Evidencias", "SEED EVIDENCE ENTERPRISE", record);
  }

  const packages = [
    {
      code: "PKG-GACP-READY",
      name: "Paquete auditoría WHO GACP",
      standard: "WHO GACP",
      auditor: "Auditor externo GACP",
      status: "En preparación",
      targetDate: addDays(60),
      notes: "Paquete maestro para evaluación GACP: personal, trazabilidad, predios, genéticas, cultivos, cosecha y registros.",
    },
    {
      code: "PKG-GXP-DATA",
      name: "Paquete Data Integrity / CSV / Part 11 / Annex 11",
      standard: "EU Annex 11",
      auditor: "Auditor GxP Sistemas",
      status: "En preparación",
      targetDate: addDays(75),
      notes: "Paquete técnico para validación del sistema, registros electrónicos, firmas, audit trail, backup y control de cambios.",
    },
    {
      code: "PKG-QA-GMP",
      name: "Paquete QA / GMP / CAPA",
      standard: "EU GMP",
      auditor: "Auditor QA/GMP",
      status: "En preparación",
      targetDate: addDays(90),
      notes: "Paquete de calidad: desviaciones, CAPA, no conformidades, riesgos, auditorías y control de cambios.",
    },
  ];

  for (const item of packages) {
    const record = await ensure(prisma.auditPackage, { code: item.code }, item);
    await audit("Paquetes Auditoría", "SEED EVIDENCE ENTERPRISE", record);
  }

  const items = [
    {
      code: "ITM-GACP-001",
      packageCode: "PKG-GACP-READY",
      module: "GACP",
      evidenceCode: "EVD-GACP-001",
      title: "Capacitación GACP por cargo crítico",
      status: "Disponible",
    },
    {
      code: "ITM-GACP-002",
      packageCode: "PKG-GACP-READY",
      module: "Trazabilidad",
      evidenceCode: "EVD-GACP-002",
      title: "Trazabilidad completa desde cultivo hasta COA",
      status: "Disponible",
    },
    {
      code: "ITM-GXP-001",
      packageCode: "PKG-GXP-DATA",
      module: "Sistema",
      evidenceCode: "EVD-DI-001",
      title: "Audit trail con integridad de datos",
      status: "Disponible",
    },
    {
      code: "ITM-GXP-002",
      packageCode: "PKG-GXP-DATA",
      module: "Firmas",
      evidenceCode: "EVD-P11-001",
      title: "Firmas electrónicas Part 11",
      status: "Disponible",
    },
    {
      code: "ITM-GXP-003",
      packageCode: "PKG-GXP-DATA",
      module: "Validación GxP",
      evidenceCode: "EVD-A11-001",
      title: "Protocolos CSV y controles Annex 11",
      status: "En revisión",
    },
    {
      code: "ITM-QA-001",
      packageCode: "PKG-QA-GMP",
      module: "Calidad",
      evidenceCode: "EVD-GMP-001",
      title: "Sistema QA con desviaciones, CAPA, riesgos y cambios",
      status: "En revisión",
    },
    {
      code: "ITM-BKP-001",
      packageCode: "PKG-GXP-DATA",
      module: "Backup",
      evidenceCode: "EVD-BKP-001",
      title: "Backup enterprise y health check",
      status: "Disponible",
    },
  ];

  for (const item of items) {
    const record = await ensure(prisma.auditPackageItem, { code: item.code }, item);
    await audit("Ítems Auditoría", "SEED EVIDENCE ENTERPRISE", record);
  }

  console.log("SEED EVIDENCE ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
