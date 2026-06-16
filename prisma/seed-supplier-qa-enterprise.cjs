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
      recordLabel: record.code || record.supplierName || record.materialName || record.id,
      responsible: record.owner || record.auditor || "FloraTrack Supplier QA Seed",
      status: record.status || record.approvalStatus || "Activo",
      snapshot: JSON.stringify(record),
    },
  }).catch(() => {});
}

async function main() {
  const qualifications = [
    {
      code: "SUP-QAL-001",
      supplierName: "Proveedor Extractos y Empaques Andinos",
      category: "Crítico",
      qualificationType: "Inicial",
      score: 86,
      owner: "QA Manager",
      status: "Aprobado condicional",
      dueDate: addDays(30),
    },
    {
      code: "SUP-QAL-002",
      supplierName: "Laboratorio Analítico Aliado",
      category: "Crítico",
      qualificationType: "Recalificación",
      score: 92,
      owner: "Director de Calidad",
      status: "Aprobado",
      dueDate: addDays(90),
    },
  ];

  for (const item of qualifications) {
    const record = await ensure(prisma.supplierQualification, { code: item.code }, item);
    await audit("Homologación Proveedores", "SEED SUPPLIER QA", record);
  }

  const audits = [
    {
      code: "SUP-AUD-001",
      supplierName: "Proveedor Extractos y Empaques Andinos",
      auditType: "Documental",
      auditor: "QA Manager",
      findings: "Falta evidencia de control de cambios en especificaciones de empaque.",
      score: 78,
      status: "Con hallazgos",
      auditDate: new Date(),
    },
    {
      code: "SUP-AUD-002",
      supplierName: "Laboratorio Analítico Aliado",
      auditType: "Remota",
      auditor: "Director de Calidad",
      findings: "Sistema documental y trazabilidad analítica conformes.",
      score: 94,
      status: "Aprobada",
      auditDate: new Date(),
    },
  ];

  for (const item of audits) {
    const record = await ensure(prisma.supplierAuditRecord, { code: item.code }, item);
    await audit("Auditoría Proveedores", "SEED SUPPLIER QA", record);
  }

  const materials = [
    {
      code: "MAT-APP-001",
      supplierName: "Proveedor Extractos y Empaques Andinos",
      materialName: "Frasco ámbar 1g",
      materialCode: "EMP-FRA-001",
      specification: "Frasco ámbar grado farmacéutico con tapa compatible.",
      approvalStatus: "Aprobado condicional",
      owner: "QA Manager",
    },
    {
      code: "MAT-APP-002",
      supplierName: "Laboratorio Analítico Aliado",
      materialName: "Servicio análisis HPLC cannabinoides",
      materialCode: "SERV-HPLC-001",
      specification: "Método validado para cuantificación de cannabinoides.",
      approvalStatus: "Aprobado",
      owner: "Jefe de Laboratorio",
    },
  ];

  for (const item of materials) {
    const record = await ensure(prisma.supplierMaterialApproval, { code: item.code }, item);
    await audit("Aprobación Materiales", "SEED SUPPLIER QA", record);
  }

  const risks = [
    {
      code: "SUP-RISK-001",
      supplierName: "Proveedor Extractos y Empaques Andinos",
      riskArea: "Continuidad suministro",
      riskLevel: "Alto",
      mitigation: "Mantener proveedor alterno aprobado y stock mínimo de seguridad.",
      owner: "Compras / QA",
      status: "En monitoreo",
      reviewDate: addDays(30),
    },
    {
      code: "SUP-RISK-002",
      supplierName: "Laboratorio Analítico Aliado",
      riskArea: "Data Integrity",
      riskLevel: "Medio",
      mitigation: "Solicitar evidencia de audit trail, revisión de datos y respaldo de cromatogramas.",
      owner: "QA Manager",
      status: "Abierto",
      reviewDate: addDays(20),
    },
  ];

  for (const item of risks) {
    const record = await ensure(prisma.supplierRiskProfile, { code: item.code }, item);
    await audit("Riesgo Proveedores", "SEED SUPPLIER QA", record);
  }

  console.log("SEED SUPPLIER QA ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
