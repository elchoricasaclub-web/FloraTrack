const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function escapeSql(value) {
  return String(value ?? "").replace(/'/g, "''");
}

function nowIso() {
  return new Date().toISOString();
}

function id(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

async function insertOrIgnore(table, row) {
  const fullRow = {
    id: row.id || id("lr"),
    ...row,
    createdAt: row.createdAt || nowIso(),
    updatedAt: row.updatedAt || nowIso(),
  };

  const columns = Object.keys(fullRow);
  const sqlColumns = columns.map((column) => `"${column}"`).join(", ");
  const sqlValues = columns
    .map((column) => `'${escapeSql(fullRow[column])}'`)
    .join(", ");

  const sql = `INSERT OR IGNORE INTO "${table}" (${sqlColumns}) VALUES (${sqlValues})`;

  await prisma.$executeRawUnsafe(sql);
}

async function safe(label, fn) {
  try {
    await fn();
    console.log("OK:", label);
  } catch (error) {
    console.log("WARN:", label, error.message);
  }
}

async function main() {
  await safe("Biomass BIO-LR-001", () =>
    insertOrIgnore("LiveRosinBiomassBatch", {
      code: "BIO-LR-001",
      sourceHarvestCode: "HARV-BB-001",
      geneticCode: "GEN-BLUEBERRY-INDICA",
      biomassType: "Fresca congelada",
      weightReceived: "Registro QA pendiente de bascula",
      temperatureAtReceipt: "Dentro de criterio interno",
      coldChainStatus: "Conforme",
      qcStatus: "Cuarentena",
      storageLocation: "Congelador autorizado / Area derivados",
      responsible: "Responsable GMP",
      status: "Recibida",
    })
  );

  await safe("Cold Chain CC-LR-001", () =>
    insertOrIgnore("LiveRosinColdChainLog", {
      code: "CC-LR-001",
      biomassBatchCode: "BIO-LR-001",
      checkpoint: "Recepcion biomasa",
      temperatureStatus: "Conforme a criterio interno",
      recordedAt: "2026-06-14",
      location: "Area derivados",
      deviationFound: "No",
      responsible: "QA / Produccion",
      status: "Registrado",
    })
  );

  await safe("Wash WASH-LR-001", () =>
    insertOrIgnore("LiveRosinWashBatch", {
      code: "WASH-LR-001",
      biomassBatchCode: "BIO-LR-001",
      washRunType: "Bubble Hash solventless autorizado",
      equipmentCode: "EQ-WASH-001",
      waterQuality: "Agua conforme a especificacion interna",
      iceLot: "ICE-001",
      operatorName: "Operador autorizado",
      inputWeight: "Pendiente cierre batch record",
      outputWetHash: "Pendiente cierre batch record",
      processStatus: "En proceso",
      status: "Abierto",
    })
  );

  await safe("Fraction MIC-LR-001", () =>
    insertOrIgnore("LiveRosinMicronFraction", {
      code: "MIC-LR-001",
      washBatchCode: "WASH-LR-001",
      micronRange: "Fraccion premium / rango definido por SOP",
      wetWeight: "Pendiente",
      dryWeight: "Pendiente",
      qcStatus: "Cuarentena",
      disposition: "Pendiente liofilizacion",
      status: "Activa",
    })
  );

  await safe("Freeze Dry FD-LR-001", () =>
    insertOrIgnore("LiveRosinFreezeDryBatch", {
      code: "FD-LR-001",
      fractionCode: "MIC-LR-001",
      equipmentCode: "EQ-LIO-001",
      cycleCode: "CYCLE-LR-001",
      moistureStatus: "Pendiente medicion QC",
      startDate: "2026-06-14",
      endDate: "",
      operatorName: "Operador autorizado",
      qcStatus: "Cuarentena",
      status: "En ciclo",
    })
  );

  await safe("Intermediate INT-LR-001", () =>
    insertOrIgnore("LiveRosinIntermediateProduct", {
      code: "INT-LR-001",
      freezeDryBatchCode: "FD-LR-001",
      productType: "Bubble Hash seco",
      weight: "Pendiente liberacion intermedia",
      qcStatus: "Cuarentena",
      storageCondition: "Almacenamiento controlado",
      status: "Intermedio",
    })
  );

  await safe("Press PRS-LR-001", () =>
    insertOrIgnore("LiveRosinPressBatch", {
      code: "PRS-LR-001",
      intermediateCode: "INT-LR-001",
      pressEquipmentCode: "EQ-PRESS-001",
      pressRunCode: "RUN-PRESS-001",
      temperatureRecord: "Registro de temperatura controlado",
      pressureRecord: "Registro de presion controlado",
      timeRecord: "Registro de tiempo controlado",
      inputWeight: "Pendiente",
      outputWeight: "Pendiente",
      yieldPercent: "Pendiente",
      operatorName: "Operador autorizado",
      qcStatus: "Cuarentena",
      status: "Prensado",
    })
  );

  await safe("Finished FIN-LR-001", () =>
    insertOrIgnore("LiveRosinFinishedBatch", {
      code: "FIN-LR-001",
      pressBatchCode: "PRS-LR-001",
      productName: "Live Rosin Blueberry Indica",
      batchSize: "Pendiente cierre empaque",
      packagingType: "Frasco ambar / empaque autorizado",
      storageCondition: "Almacenamiento controlado",
      sampleCode: "SMP-LR-001",
      coaCode: "COA-LR-001",
      releaseDecision: "Pendiente QA",
      qaResponsible: "QA Manager",
      status: "Cuarentena",
    })
  );

  await safe("Yield YLD-LR-001", () =>
    insertOrIgnore("LiveRosinYieldReview", {
      code: "YLD-LR-001",
      sourceBatchCode: "BIO-LR-001",
      processStage: "Biomasa a producto terminado",
      inputWeight: "Pendiente",
      outputWeight: "Pendiente",
      yieldPercent: "Pendiente",
      trendConclusion: "Primer lote de tendencia. Requiere mas datos.",
      reviewedBy: "QA / Produccion",
      status: "En revision",
    })
  );

  await safe("Release REL-LR-001", () =>
    insertOrIgnore("LiveRosinReleaseRecord", {
      code: "REL-LR-001",
      finishedBatchCode: "FIN-LR-001",
      coaCode: "COA-LR-001",
      disposition: "Pendiente resultados QC y revision QA",
      releaseDecision: "Pendiente",
      releasedBy: "QA Manager",
      releaseDate: "",
      notes: "No liberar hasta COA aprobado y cierre de batch record.",
      status: "Borrador",
    })
  );

  console.log("SEED RAW LIVE ROSIN COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
