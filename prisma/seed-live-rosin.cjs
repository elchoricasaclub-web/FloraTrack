const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function upsertSafe(label, fn) {
  try {
    await fn();
    console.log("OK:", label);
  } catch (error) {
    console.log("WARN:", label, error.message);
  }
}

async function main() {
  await upsertSafe("Biomass BIO-LR-001", () =>
    prisma.liveRosinBiomassBatch.upsert({
      where: { code: "BIO-LR-001" },
      update: {},
      create: {
        code: "BIO-LR-001",
        sourceHarvestCode: "HARV-BB-001",
        geneticCode: "GEN-BLUEBERRY-INDICA",
        biomassType: "Fresca congelada",
        weightReceived: "Registro QA pendiente de báscula",
        temperatureAtReceipt: "Dentro de criterio interno",
        coldChainStatus: "Conforme",
        qcStatus: "Cuarentena",
        storageLocation: "Congelador autorizado / Área derivados",
        responsible: "Responsable GMP",
        status: "Recibida",
      },
    })
  );

  await upsertSafe("Cold Chain CC-LR-001", () =>
    prisma.liveRosinColdChainLog.upsert({
      where: { code: "CC-LR-001" },
      update: {},
      create: {
        code: "CC-LR-001",
        biomassBatchCode: "BIO-LR-001",
        checkpoint: "Recepción biomasa",
        temperatureStatus: "Conforme a criterio interno",
        recordedAt: "2026-06-14",
        location: "Área derivados",
        deviationFound: "No",
        responsible: "QA / Producción",
        status: "Registrado",
      },
    })
  );

  await upsertSafe("Wash WASH-LR-001", () =>
    prisma.liveRosinWashBatch.upsert({
      where: { code: "WASH-LR-001" },
      update: {},
      create: {
        code: "WASH-LR-001",
        biomassBatchCode: "BIO-LR-001",
        washRunType: "Bubble Hash solventless autorizado",
        equipmentCode: "EQ-WASH-001",
        waterQuality: "Agua conforme a especificación interna",
        iceLot: "ICE-001",
        operatorName: "Operador autorizado",
        inputWeight: "Pendiente cierre batch record",
        outputWetHash: "Pendiente cierre batch record",
        processStatus: "En proceso",
        status: "Abierto",
      },
    })
  );

  await upsertSafe("Fraction MIC-LR-001", () =>
    prisma.liveRosinMicronFraction.upsert({
      where: { code: "MIC-LR-001" },
      update: {},
      create: {
        code: "MIC-LR-001",
        washBatchCode: "WASH-LR-001",
        micronRange: "Fracción premium / rango definido por SOP",
        wetWeight: "Pendiente",
        dryWeight: "Pendiente",
        qcStatus: "Cuarentena",
        disposition: "Pendiente liofilización",
        status: "Activa",
      },
    })
  );

  await upsertSafe("Freeze Dry FD-LR-001", () =>
    prisma.liveRosinFreezeDryBatch.upsert({
      where: { code: "FD-LR-001" },
      update: {},
      create: {
        code: "FD-LR-001",
        fractionCode: "MIC-LR-001",
        equipmentCode: "EQ-LIO-001",
        cycleCode: "CYCLE-LR-001",
        moistureStatus: "Pendiente medición QC",
        startDate: "2026-06-14",
        endDate: "",
        operatorName: "Operador autorizado",
        qcStatus: "Cuarentena",
        status: "En ciclo",
      },
    })
  );

  await upsertSafe("Intermediate INT-LR-001", () =>
    prisma.liveRosinIntermediateProduct.upsert({
      where: { code: "INT-LR-001" },
      update: {},
      create: {
        code: "INT-LR-001",
        freezeDryBatchCode: "FD-LR-001",
        productType: "Bubble Hash seco",
        weight: "Pendiente liberación intermedia",
        qcStatus: "Cuarentena",
        storageCondition: "Almacenamiento controlado",
        status: "Intermedio",
      },
    })
  );

  await upsertSafe("Press PRS-LR-001", () =>
    prisma.liveRosinPressBatch.upsert({
      where: { code: "PRS-LR-001" },
      update: {},
      create: {
        code: "PRS-LR-001",
        intermediateCode: "INT-LR-001",
        pressEquipmentCode: "EQ-PRESS-001",
        pressRunCode: "RUN-PRESS-001",
        temperatureRecord: "Registro de temperatura controlado",
        pressureRecord: "Registro de presión controlado",
        timeRecord: "Registro de tiempo controlado",
        inputWeight: "Pendiente",
        outputWeight: "Pendiente",
        yieldPercent: "Pendiente",
        operatorName: "Operador autorizado",
        qcStatus: "Cuarentena",
        status: "Prensado",
      },
    })
  );

  await upsertSafe("Finished FIN-LR-001", () =>
    prisma.liveRosinFinishedBatch.upsert({
      where: { code: "FIN-LR-001" },
      update: {},
      create: {
        code: "FIN-LR-001",
        pressBatchCode: "PRS-LR-001",
        productName: "Live Rosin Blueberry Indica",
        batchSize: "Pendiente cierre empaque",
        packagingType: "Frasco ámbar / empaque autorizado",
        storageCondition: "Almacenamiento controlado",
        sampleCode: "SMP-LR-001",
        coaCode: "COA-LR-001",
        releaseDecision: "Pendiente QA",
        qaResponsible: "QA Manager",
        status: "Cuarentena",
      },
    })
  );

  await upsertSafe("Yield YLD-LR-001", () =>
    prisma.liveRosinYieldReview.upsert({
      where: { code: "YLD-LR-001" },
      update: {},
      create: {
        code: "YLD-LR-001",
        sourceBatchCode: "BIO-LR-001",
        processStage: "Biomasa a producto terminado",
        inputWeight: "Pendiente",
        outputWeight: "Pendiente",
        yieldPercent: "Pendiente",
        trendConclusion: "Primer lote de tendencia. Requiere más datos.",
        reviewedBy: "QA / Producción",
        status: "En revisión",
      },
    })
  );

  await upsertSafe("Release REL-LR-001", () =>
    prisma.liveRosinReleaseRecord.upsert({
      where: { code: "REL-LR-001" },
      update: {},
      create: {
        code: "REL-LR-001",
        finishedBatchCode: "FIN-LR-001",
        coaCode: "COA-LR-001",
        disposition: "Pendiente resultados QC y revisión QA",
        releaseDecision: "Pendiente",
        releasedBy: "QA Manager",
        releaseDate: "",
        notes: "No liberar hasta COA aprobado y cierre de batch record.",
        status: "Borrador",
      },
    })
  );

  console.log("SEED LIVE ROSIN COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

