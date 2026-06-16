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
      recordLabel: record.code || record.productName || record.materialName || record.processStep || record.id,
      responsible: record.owner || "FloraTrack Product Development Seed",
      status: record.status || record.processStatus || "Activo",
      snapshot: JSON.stringify(record),
    },
  }).catch(() => {});
}

async function main() {
  const formulations = [
    {
      code: "FORM-LR-BBI-001",
      productName: "Live Rosin Blueberry Indica 1g",
      dosageForm: "Extracto",
      targetStrength: "Perfil cannabinoide y terpénico conforme COA",
      activeIngredient: "Extracto de cannabis medicinal sin solvente",
      excipients: "Sin excipientes. Solo tricomas, calor controlado y presión.",
      processStatus: "Piloto",
      owner: "Responsable GMP",
      status: "En revisión QA",
    },
    {
      code: "FORM-CBD-CREMA-001",
      productName: "Crema tópica CBD cera de abeja orgánica",
      dosageForm: "Crema",
      targetStrength: "CBD conforme especificación cosmética",
      activeIngredient: "Extracto CBD",
      excipients: "Cera de abeja orgánica, aceites vegetales, extractos botánicos aprobados.",
      processStatus: "Desarrollo",
      owner: "Desarrollo Producto",
      status: "Borrador",
    },
  ];

  for (const item of formulations) {
    const record = await ensure(prisma.productFormulation, { code: item.code }, item);
    await audit("Formulaciones", "SEED DESARROLLO PRODUCTO", record);
  }

  const bom = [
    {
      code: "BOM-LR-001",
      productName: "Live Rosin Blueberry Indica 1g",
      materialName: "Bubble hash liofilizado",
      materialCode: "MP-BH-001",
      quantity: 1,
      unit: "kg",
      supplierName: "Producción interna GACP/GMP",
      status: "Aprobado QA",
    },
    {
      code: "BOM-LR-002",
      productName: "Live Rosin Blueberry Indica 1g",
      materialName: "Frasco ámbar 1g",
      materialCode: "EMP-FRA-001",
      quantity: 1000,
      unit: "unidades",
      supplierName: "Proveedor Extractos y Empaques Andinos",
      status: "Aprobado QA",
    },
    {
      code: "BOM-CREMA-001",
      productName: "Crema tópica CBD cera de abeja orgánica",
      materialName: "Cera de abeja orgánica",
      materialCode: "MP-CERA-001",
      quantity: 10,
      unit: "kg",
      supplierName: "Proveedor apícola certificado",
      status: "Borrador",
    },
  ];

  for (const item of bom) {
    const record = await ensure(prisma.billOfMaterial, { code: item.code }, item);
    await audit("BOM / Fórmula Maestra", "SEED DESARROLLO PRODUCTO", record);
  }

  const instructions = [
    {
      code: "MFG-LR-STEP-001",
      productName: "Live Rosin Blueberry Indica 1g",
      processStep: "Preparación del material",
      stepNumber: 1,
      instruction: "Verificar liberación QA del bubble hash liofilizado antes del prensado.",
      criticalParameter: "Humedad residual y temperatura del material.",
      acceptanceCriteria: "Material identificado, liberado y dentro de especificación.",
      owner: "Responsable GMP",
      status: "Aprobada",
    },
    {
      code: "MFG-LR-STEP-002",
      productName: "Live Rosin Blueberry Indica 1g",
      processStep: "Prensado sin solvente",
      stepNumber: 2,
      instruction: "Ejecutar prensado con temperatura y presión controladas, registrando lote, operador y rendimiento.",
      criticalParameter: "Temperatura de placas, presión, tiempo.",
      acceptanceCriteria: "Rendimiento dentro de tendencia y sin contaminación visible.",
      owner: "Responsable GMP",
      status: "En revisión QA",
    },
    {
      code: "MFG-LR-STEP-003",
      productName: "Live Rosin Blueberry Indica 1g",
      processStep: "Envasado",
      stepNumber: 3,
      instruction: "Envasar en frasco ámbar identificado, controlar peso neto y trazabilidad de empaque.",
      criticalParameter: "Peso neto, integridad del cierre, identificación.",
      acceptanceCriteria: "100% unidades identificadas y dentro de criterio.",
      owner: "QA Manager",
      status: "Borrador",
    },
  ];

  for (const item of instructions) {
    const record = await ensure(prisma.manufacturingInstruction, { code: item.code }, item);
    await audit("Instrucciones Fabricación", "SEED DESARROLLO PRODUCTO", record);
  }

  const transfer = await ensure(
    prisma.techTransferRecord,
    { code: "TT-LR-2026-001" },
    {
      code: "TT-LR-2026-001",
      productName: "Live Rosin Blueberry Indica 1g",
      fromArea: "Desarrollo Producto",
      toArea: "Producción GMP",
      packageCode: "PKG-LR-TECH-001",
      riskLevel: "Alto",
      conclusion: "Transferencia en fase piloto. Requiere cierre de OQ/PQ, estabilidad inicial y aprobación QA.",
      owner: "Director de Calidad",
      status: "En ejecución",
      transferDate: new Date(),
    }
  );
  await audit("Transferencia Tecnológica", "SEED DESARROLLO PRODUCTO", transfer);

  console.log("SEED DESARROLLO PRODUCTO ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
