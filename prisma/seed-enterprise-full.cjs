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

async function audit(module, action, record, status = "Activo") {
  const exists = await prisma.auditTrail.findFirst({
    where: {
      module,
      action,
      recordId: record.id,
    },
  });

  if (!exists) {
    await prisma.auditTrail.create({
      data: {
        module,
        action,
        recordId: record.id,
        recordLabel: record.code || record.name || record.title || record.number || record.id,
        responsible: "FloraTrack Enterprise Seed",
        status,
        snapshot: JSON.stringify(record),
      },
    });
  }
}

async function main() {
  const company = await ensure(
    prisma.company,
    { name: "Growlifecol S.A.S." },
    {
      name: "Growlifecol S.A.S.",
      nit: "901000000-1",
      city: "Sutamarchán, Boyacá",
      status: "Activa",
    }
  );
  await audit("Empresas", "SEED ENTERPRISE", company, company.status);

  const admin = await ensure(
    prisma.user,
    { email: "admin@floratrack.local" },
    {
      name: "Administrador FloraTrack",
      email: "admin@floratrack.local",
      role: "Super Admin",
      status: "Activo",
      companyId: company.id,
    }
  );
  await audit("Usuarios", "SEED ENTERPRISE", admin, admin.status);

  const qa = await ensure(
    prisma.user,
    { email: "calidad@floratrack.local" },
    {
      name: "Director de Calidad",
      email: "calidad@floratrack.local",
      role: "QA Manager",
      status: "Activo",
      companyId: company.id,
    }
  );
  await audit("Usuarios", "SEED ENTERPRISE", qa, qa.status);

  const gacp = await ensure(
    prisma.user,
    { email: "gacp@floratrack.local" },
    {
      name: "Responsable GACP",
      email: "gacp@floratrack.local",
      role: "GACP Manager",
      status: "Activo",
      companyId: company.id,
    }
  );
  await audit("Usuarios", "SEED ENTERPRISE", gacp, gacp.status);

  const farm = await ensure(
    prisma.farm,
    { name: "Predio Principal Growlifecol" },
    {
      name: "Predio Principal Growlifecol",
      city: "Sutamarchán",
      areaHa: 5.09,
      status: "Activo",
      companyId: company.id,
    }
  );
  await audit("Predios", "SEED ENTERPRISE", farm, farm.status);

  const genetic = await ensure(
    prisma.genetic,
    { name: "Blueberry Indica" },
    {
      name: "Blueberry Indica",
      origin: "Banco maestro interno",
      type: "Medicinal",
      status: "Autorizada",
    }
  );
  await audit("Genéticas", "SEED ENTERPRISE", genetic, genetic.status);

  const crop = await ensure(
    prisma.crop,
    { code: "CULT-2026-001" },
    {
      code: "CULT-2026-001",
      stage: "Floración",
      status: "Activo",
      farmId: farm.id,
      geneticId: genetic.id,
    }
  );
  await audit("Cultivos", "SEED ENTERPRISE", crop, crop.status);

  const harvest = await ensure(
    prisma.harvest,
    { code: "COS-2026-001" },
    {
      code: "COS-2026-001",
      wetWeight: 120.5,
      status: "Aprobado",
      cropId: crop.id,
    }
  );
  await audit("Cosecha", "SEED ENTERPRISE", harvest, harvest.status);

  const sample = await ensure(
    prisma.sample,
    { code: "MUE-2026-001" },
    {
      code: "MUE-2026-001",
      type: "Flor",
      status: "Aprobado",
      harvestId: harvest.id,
    }
  );
  await audit("Muestras", "SEED ENTERPRISE", sample, sample.status);

  const analysis = await ensure(
    prisma.analysis,
    { code: "ANA-2026-001" },
    {
      code: "ANA-2026-001",
      type: "Potencia",
      result: "Cumple especificación interna",
      status: "Aprobado",
      sampleId: sample.id,
    }
  );
  await audit("Análisis", "SEED ENTERPRISE", analysis, analysis.status);

  const coa = await ensure(
    prisma.cOA,
    { code: "COA-2026-001" },
    {
      code: "COA-2026-001",
      result: "Cumple",
      status: "Aprobado",
      analysisId: analysis.id,
    }
  );
  await audit("COA", "SEED ENTERPRISE", coa, coa.status);

  const license = await ensure(
    prisma.regulatoryLicense,
    { number: "LIC-GROW-SEM-001" },
    {
      number: "LIC-GROW-SEM-001",
      type: "Semillas",
      authority: "Ministerio de Justicia",
      status: "Vigente",
      expiresAt: addDays(45),
      companyId: company.id,
    }
  );
  await audit("Licencias", "SEED ENTERPRISE", license, license.status);

  const quota = await ensure(
    prisma.quota,
    { code: "CUPO-2026-001" },
    {
      code: "CUPO-2026-001",
      type: "Producción",
      amount: 300,
      status: "Aprobado",
      companyId: company.id,
    }
  );
  await audit("Cupos", "SEED ENTERPRISE", quota, quota.status);

  const peas = await ensure(
    prisma.peasRecord,
    { code: "PEAS-2026-001" },
    {
      code: "PEAS-2026-001",
      geneticName: "Blueberry Indica",
      amount: 300,
      status: "Aprobado",
      companyId: company.id,
    }
  );
  await audit("PEAS", "SEED ENTERPRISE", peas, peas.status);

  const ica = await ensure(
    prisma.icaRecord,
    { code: "ICA-REG-001" },
    {
      code: "ICA-REG-001",
      geneticName: "Blueberry Indica",
      holder: "Growlifecol S.A.S.",
      status: "Aprobado",
    }
  );
  await audit("Registros ICA", "SEED ENTERPRISE", ica, ica.status);

  const invima = await ensure(
    prisma.invimaProcedure,
    { filingNumber: "INVIMA-2026-001" },
    {
      filingNumber: "INVIMA-2026-001",
      product: "Crema CBD Natural",
      category: "Cosmético",
      status: "Borrador",
      companyId: company.id,
    }
  );
  await audit("Trámites INVIMA", "SEED ENTERPRISE", invima, invima.status);

  const authority = await ensure(
    prisma.authority,
    { name: "Ministerio de Justicia y del Derecho" },
    {
      name: "Ministerio de Justicia y del Derecho",
      contact: "Ventanilla regulatoria",
      area: "Cannabis medicinal",
      status: "Activa",
    }
  );
  await audit("Autoridades", "SEED ENTERPRISE", authority, authority.status);

  const expiration = await ensure(
    prisma.expiration,
    { code: "VEN-2026-001" },
    {
      code: "VEN-2026-001",
      concept: "Revisión anual de licencia de semillas",
      responsible: "Responsable Regulatorio",
      dueDate: addDays(30),
      status: "Próximo",
      companyId: company.id,
    }
  );
  await audit("Vencimientos", "SEED ENTERPRISE", expiration, expiration.status);

  const sop = await ensure(
    prisma.sopDocument,
    { code: "SOP-GACP-001" },
    {
      code: "SOP-GACP-001",
      title: "Manejo de cultivo medicinal bajo GACP",
      area: "GACP",
      version: "1.0",
      status: "Aprobado",
      owner: "Director de Calidad",
      effectiveDate: addDays(5),
    }
  );
  await audit("SOP", "SEED ENTERPRISE", sop, sop.status);

  const record = await ensure(
    prisma.controlledRecord,
    { code: "REG-GACP-001" },
    {
      code: "REG-GACP-001",
      title: "Registro diario de cultivo",
      type: "Bitácora",
      status: "Aprobado",
      sopId: sop.id,
    }
  );
  await audit("Registros", "SEED ENTERPRISE", record, record.status);

  const signature = await ensure(
    prisma.electronicSignature,
    { signer: "Director de Calidad", action: "Aprobó", sopId: sop.id },
    {
      signer: "Director de Calidad",
      role: "QA Manager",
      action: "Aprobó",
      status: "Firmado",
      sopId: sop.id,
      recordId: record.id,
      evidence: "Firma electrónica seed enterprise",
    }
  );
  await audit("Firmas", "SEED ENTERPRISE", signature, signature.status);

  const supplier = await ensure(
    prisma.supplier,
    { name: "Proveedor Farmacéutico Colombia" },
    {
      name: "Proveedor Farmacéutico Colombia",
      nit: "900111222-3",
      category: "Materia prima",
      contact: "compras@proveedor.local",
      status: "Aprobado",
    }
  );
  await audit("Proveedores", "SEED ENTERPRISE", supplier, supplier.status);

  const purchase = await ensure(
    prisma.purchaseOrder,
    { code: "OC-2026-001" },
    {
      code: "OC-2026-001",
      supplier: supplier.name,
      item: "Cera de abeja orgánica",
      quantity: 25,
      status: "Aprobada",
    }
  );
  await audit("Compras", "SEED ENTERPRISE", purchase, purchase.status);

  const reception = await ensure(
    prisma.receptionRecord,
    { code: "REC-2026-001" },
    {
      code: "REC-2026-001",
      supplier: supplier.name,
      item: "Cera de abeja orgánica",
      lot: "LOT-CERA-001",
      quantity: 25,
      status: "Aceptada",
    }
  );
  await audit("Recepción", "SEED ENTERPRISE", reception, reception.status);

  const quarantine = await ensure(
    prisma.quarantineItem,
    { code: "CUA-2026-001" },
    {
      code: "CUA-2026-001",
      itemType: "Materia prima",
      lot: "LOT-CERA-001",
      reason: "Recepción inicial pendiente de liberación",
      status: "Liberado",
    }
  );
  await audit("Cuarentena", "SEED ENTERPRISE", quarantine, quarantine.status);

  const release = await ensure(
    prisma.releaseRecord,
    { code: "LIB-2026-001" },
    {
      code: "LIB-2026-001",
      itemType: "Materia prima",
      lot: "LOT-CERA-001",
      approvedBy: "Director de Calidad",
      status: "Aprobado",
    }
  );
  await audit("Liberación", "SEED ENTERPRISE", release, release.status);

  const rawMaterial = await ensure(
    prisma.rawMaterial,
    { code: "MP-2026-001" },
    {
      code: "MP-2026-001",
      name: "Cera de abeja orgánica",
      supplier: supplier.name,
      lot: "LOT-CERA-001",
      stock: 25,
      status: "Aprobado",
    }
  );
  await audit("Materias Primas", "SEED ENTERPRISE", rawMaterial, rawMaterial.status);

  const input = await ensure(
    prisma.inputItem,
    { code: "INS-2026-001" },
    {
      code: "INS-2026-001",
      name: "Frascos ámbar 30 ml",
      category: "Empaque",
      stock: 1000,
      status: "Disponible",
    }
  );
  await audit("Insumos", "SEED ENTERPRISE", input, input.status);

  const product = await ensure(
    prisma.product,
    { code: "PROD-2026-001" },
    {
      code: "PROD-2026-001",
      name: "Crema CBD Natural",
      lot: "LOT-CBD-001",
      presentation: "Tarro 30 g",
      stock: 100,
      status: "Aprobado",
    }
  );
  await audit("Productos", "SEED ENTERPRISE", product, product.status);

  const equipment = await ensure(
    prisma.equipment,
    { code: "EQ-LAB-001" },
    {
      code: "EQ-LAB-001",
      name: "Liofilizadora Harvest Right",
      area: "Laboratorio",
      status: "Activo",
    }
  );
  await audit("Equipos", "SEED ENTERPRISE", equipment, equipment.status);

  const calibration = await ensure(
    prisma.calibrationRecord,
    { code: "CAL-2026-001" },
    {
      code: "CAL-2026-001",
      equipmentName: "Liofilizadora Harvest Right",
      dueDate: addDays(25),
      status: "Programada",
      equipmentId: equipment.id,
    }
  );
  await audit("Calibraciones", "SEED ENTERPRISE", calibration, calibration.status);

  const maintenance = await ensure(
    prisma.maintenanceRecord,
    { code: "MAN-2026-001" },
    {
      code: "MAN-2026-001",
      equipmentName: "Liofilizadora Harvest Right",
      type: "Preventivo",
      dueDate: addDays(35),
      status: "Programado",
      equipmentId: equipment.id,
    }
  );
  await audit("Mantenimiento", "SEED ENTERPRISE", maintenance, maintenance.status);

  const cleaning = await ensure(
    prisma.cleaningRecord,
    { code: "LIM-2026-001" },
    {
      code: "LIM-2026-001",
      area: "Laboratorio",
      procedure: "Limpieza diaria de superficies críticas",
      responsible: "Operario QA",
      status: "Aprobado",
    }
  );
  await audit("Limpieza", "SEED ENTERPRISE", cleaning, cleaning.status);

  const biosafety = await ensure(
    prisma.biosafetyRecord,
    { code: "BIO-2026-001" },
    {
      code: "BIO-2026-001",
      area: "Laboratorio",
      eventType: "EPP",
      responsible: "Operario QA",
      status: "Aprobado",
    }
  );
  await audit("Bioseguridad", "SEED ENTERPRISE", biosafety, biosafety.status);

  const waste = await ensure(
    prisma.wasteRecord,
    { code: "RES-2026-001" },
    {
      code: "RES-2026-001",
      type: "Orgánico",
      quantity: 10,
      status: "Dispuesto",
    }
  );
  await audit("Residuos", "SEED ENTERPRISE", waste, waste.status);

  const environmental = await ensure(
    prisma.environmentalRecord,
    { code: "AMB-2026-001" },
    {
      code: "AMB-2026-001",
      variable: "Temperatura",
      value: "22",
      unit: "°C",
      status: "Cumple",
    }
  );
  await audit("Ambiental", "SEED ENTERPRISE", environmental, environmental.status);

  const training = await ensure(
    prisma.trainingRecord,
    { code: "CAP-2026-001" },
    {
      code: "CAP-2026-001",
      topic: "Inducción GACP/GMP FloraTrack",
      participant: "Equipo operativo",
      dueDate: addDays(10),
      status: "Programada",
    }
  );
  await audit("Capacitaciones", "SEED ENTERPRISE", training, training.status);

  const deviation = await ensure(
    prisma.deviation,
    { code: "DES-2026-001" },
    {
      code: "DES-2026-001",
      area: "GACP",
      description: "Diferencia menor en registro de humedad ambiental",
      severity: "Media",
      responsible: "Director de Calidad",
      status: "En investigación",
      dueDate: addDays(12),
    }
  );
  await audit("Desviaciones", "SEED ENTERPRISE", deviation, deviation.status);

  const nc = await ensure(
    prisma.nonConformity,
    { code: "NC-2026-001" },
    {
      code: "NC-2026-001",
      source: "Auditoría",
      description: "Registro incompleto en bitácora de limpieza",
      severity: "Media",
      responsible: "QA Manager",
      status: "CAPA requerida",
      dueDate: addDays(15),
    }
  );
  await audit("No Conformidades", "SEED ENTERPRISE", nc, nc.status);

  const capa = await ensure(
    prisma.capaAction,
    { code: "CAPA-2026-001" },
    {
      code: "CAPA-2026-001",
      origin: "NC-2026-001",
      rootCause: "Falta de doble verificación documental",
      correctiveAction: "Completar registro y entrenar responsable",
      preventiveAction: "Implementar revisión diaria por calidad",
      responsible: "QA Manager",
      status: "En ejecución",
      dueDate: addDays(20),
    }
  );
  await audit("CAPA", "SEED ENTERPRISE", capa, capa.status);

  const risk = await ensure(
    prisma.riskAssessment,
    { code: "RISK-2026-001" },
    {
      code: "RISK-2026-001",
      process: "Liberación de producto",
      risk: "Liberación sin COA aprobado",
      probability: "Baja",
      impact: "Crítico",
      level: "Alto",
      control: "Bloqueo por estado y revisión QA",
      status: "Mitigado",
    }
  );
  await audit("Riesgos", "SEED ENTERPRISE", risk, risk.status);

  const change = await ensure(
    prisma.changeControl,
    { code: "CC-2026-001" },
    {
      code: "CC-2026-001",
      area: "Sistema",
      changeType: "Sistema",
      description: "Migración de módulos a Prisma",
      impact: "Alto",
      responsible: "FloraTrack Admin",
      status: "Implementado",
      dueDate: addDays(5),
    }
  );
  await audit("Control de Cambios", "SEED ENTERPRISE", change, change.status);

  const qAudit = await ensure(
    prisma.qualityAudit,
    { code: "AUD-2026-001" },
    {
      code: "AUD-2026-001",
      auditType: "Interna",
      area: "GACP",
      auditor: "Director de Calidad",
      finding: "Sistema funcional en fase enterprise local",
      status: "Programada",
      dueDate: addDays(18),
    }
  );
  await audit("Auditorías", "SEED ENTERPRISE", qAudit, qAudit.status);

  const backup = await ensure(
    prisma.backupRecord,
    { code: "BACKUP-SEED-ENTERPRISE" },
    {
      code: "BACKUP-SEED-ENTERPRISE",
      type: "Manual",
      fileName: "floratrack_seed_enterprise.json",
      status: "Creado",
      createdBy: "FloraTrack Seed",
    }
  );
  await audit("Backup", "SEED ENTERPRISE", backup, backup.status);

  console.log("SEED ENTERPRISE COMPLETO CREADO CORRECTAMENTE.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
