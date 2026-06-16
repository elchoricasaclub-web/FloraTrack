import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

async function collectFullBackup() {
  const [
    companies,
    users,
    farms,
    genetics,
    crops,
    harvests,
    samples,
    analyses,
    coas,

    regulatoryLicenses,
    quotas,
    peasRecords,
    icaRecords,
    invimaProcedures,
    authorities,
    expirations,

    sopDocuments,
    controlledRecords,
    electronicSignatures,

    suppliers,
    purchaseOrders,
    receptionRecords,
    quarantineItems,
    releaseRecords,
    rawMaterials,
    inputItems,
    products,

    equipment,
    calibrationRecords,
    maintenanceRecords,
    cleaningRecords,
    biosafetyRecords,
    wasteRecords,
    environmentalRecords,
    trainingRecords,

    deviations,
    nonConformities,
    capaActions,
    riskAssessments,
    changeControls,
    qualityAudits,

    securityRoles,
    securityPermissions,
    accessLogs,
    systemSettings,
    masterData,
    backupRecords,

    auditTrail,
  ] = await Promise.all([
    prisma.company.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.farm.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.genetic.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.crop.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.harvest.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.sample.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.analysis.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.cOA.findMany({ orderBy: { createdAt: "desc" } }),

    prisma.regulatoryLicense.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.quota.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.peasRecord.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.icaRecord.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.invimaProcedure.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.authority.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.expiration.findMany({ orderBy: { createdAt: "desc" } }),

    prisma.sopDocument.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.controlledRecord.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.electronicSignature.findMany({ orderBy: { createdAt: "desc" } }),

    prisma.supplier.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.purchaseOrder.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.receptionRecord.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.quarantineItem.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.releaseRecord.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.rawMaterial.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.inputItem.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),

    prisma.equipment.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.calibrationRecord.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.maintenanceRecord.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.cleaningRecord.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.biosafetyRecord.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.wasteRecord.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.environmentalRecord.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.trainingRecord.findMany({ orderBy: { createdAt: "desc" } }),

    prisma.deviation.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.nonConformity.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.capaAction.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.riskAssessment.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.changeControl.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.qualityAudit.findMany({ orderBy: { createdAt: "desc" } }),

    prisma.securityRole.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.securityPermission.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.accessLog.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.systemSetting.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.masterData.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.backupRecord.findMany({ orderBy: { createdAt: "desc" } }),

    prisma.auditTrail.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const data = {
    operations: {
      companies,
      users,
      farms,
      genetics,
      crops,
      harvests,
      samples,
      analyses,
      coas,
    },
    regulatory: {
      regulatoryLicenses,
      quotas,
      peasRecords,
      icaRecords,
      invimaProcedures,
      authorities,
      expirations,
    },
    documents: {
      sopDocuments,
      controlledRecords,
      electronicSignatures,
    },
    inventory: {
      suppliers,
      purchaseOrders,
      receptionRecords,
      quarantineItems,
      releaseRecords,
      rawMaterials,
      inputItems,
      products,
    },
    facility: {
      equipment,
      calibrationRecords,
      maintenanceRecords,
      cleaningRecords,
      biosafetyRecords,
      wasteRecords,
      environmentalRecords,
      trainingRecords,
    },
    quality: {
      deviations,
      nonConformities,
      capaActions,
      riskAssessments,
      changeControls,
      qualityAudits,
    },
    system: {
      securityRoles,
      securityPermissions,
      accessLogs,
      systemSettings,
      masterData,
      backupRecords,
    },
    audit: {
      auditTrail,
    },
  };

  const counts = {
    operations:
      companies.length +
      users.length +
      farms.length +
      genetics.length +
      crops.length +
      harvests.length +
      samples.length +
      analyses.length +
      coas.length,
    regulatory:
      regulatoryLicenses.length +
      quotas.length +
      peasRecords.length +
      icaRecords.length +
      invimaProcedures.length +
      authorities.length +
      expirations.length,
    documents:
      sopDocuments.length +
      controlledRecords.length +
      electronicSignatures.length,
    inventory:
      suppliers.length +
      purchaseOrders.length +
      receptionRecords.length +
      quarantineItems.length +
      releaseRecords.length +
      rawMaterials.length +
      inputItems.length +
      products.length,
    facility:
      equipment.length +
      calibrationRecords.length +
      maintenanceRecords.length +
      cleaningRecords.length +
      biosafetyRecords.length +
      wasteRecords.length +
      environmentalRecords.length +
      trainingRecords.length,
    quality:
      deviations.length +
      nonConformities.length +
      capaActions.length +
      riskAssessments.length +
      changeControls.length +
      qualityAudits.length,
    system:
      securityRoles.length +
      securityPermissions.length +
      accessLogs.length +
      systemSettings.length +
      masterData.length +
      backupRecords.length,
    audit: auditTrail.length,
  };

  return {
    app: "FloraTrack",
    version: "Enterprise Local MVP",
    generatedAt: new Date().toISOString(),
    engine: "Next.js + Prisma + SQLite",
    counts,
    totalRecords: Object.values(counts).reduce((sum, value) => sum + value, 0),
    data,
  };
}

export async function GET() {
  try {
    const backup = await collectFullBackup();

    return NextResponse.json({
      ok: true,
      backup,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const backup = await collectFullBackup();

    const code = `BACKUP-${new Date().toISOString().replaceAll(":", "-").slice(0, 19)}`;
    const fileName = `${code}.json`;

    const record = await prisma.backupRecord.create({
      data: {
        code,
        type: "Manual",
        fileName,
        status: "Creado",
        createdBy: "FloraTrack",
      },
    });

    await prisma.auditTrail.create({
      data: {
        module: "Backup",
        action: "BACKUP ENTERPRISE GENERADO",
        recordId: record.id,
        recordLabel: record.code,
        responsible: "Usuario local",
        status: record.status,
        snapshot: JSON.stringify({
          fileName,
          totalRecords: backup.totalRecords,
          counts: backup.counts,
        }),
      },
    });

    return NextResponse.json({
      ok: true,
      record,
      backup,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
