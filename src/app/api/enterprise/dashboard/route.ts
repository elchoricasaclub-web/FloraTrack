import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
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
      auditTrail,

      licenses,
      quotas,
      peas,
      ica,
      invima,
      authorities,
      expirations,

      sops,
      records,
      signatures,

      suppliers,
      purchases,
      receptions,
      quarantine,
      releases,
      rawMaterials,
      inputs,
      products,

      equipment,
      calibrations,
      maintenance,
      cleaning,
      biosafety,
      waste,
      environmental,
      training,

      blockedCrops,
      blockedSamples,
      blockedAnalyses,
      approvedCoas,
      pendingExpirations,
      overdueExpirations,
      overdueCalibrations,
      overdueMaintenance,
      overdueTraining,
    ] = await Promise.all([
      prisma.company.count(),
      prisma.user.count(),
      prisma.farm.count(),
      prisma.genetic.count(),
      prisma.crop.count(),
      prisma.harvest.count(),
      prisma.sample.count(),
      prisma.analysis.count(),
      prisma.cOA.count(),
      prisma.auditTrail.count(),

      prisma.regulatoryLicense.count(),
      prisma.quota.count(),
      prisma.peasRecord.count(),
      prisma.icaRecord.count(),
      prisma.invimaProcedure.count(),
      prisma.authority.count(),
      prisma.expiration.count(),

      prisma.sopDocument.count(),
      prisma.controlledRecord.count(),
      prisma.electronicSignature.count(),

      prisma.supplier.count(),
      prisma.purchaseOrder.count(),
      prisma.receptionRecord.count(),
      prisma.quarantineItem.count(),
      prisma.releaseRecord.count(),
      prisma.rawMaterial.count(),
      prisma.inputItem.count(),
      prisma.product.count(),

      prisma.equipment.count(),
      prisma.calibrationRecord.count(),
      prisma.maintenanceRecord.count(),
      prisma.cleaningRecord.count(),
      prisma.biosafetyRecord.count(),
      prisma.wasteRecord.count(),
      prisma.environmentalRecord.count(),
      prisma.trainingRecord.count(),

      prisma.crop.count({ where: { status: "Bloqueado" } }),
      prisma.sample.count({ where: { status: "Bloqueado" } }),
      prisma.analysis.count({ where: { status: "Bloqueado" } }),
      prisma.cOA.count({ where: { status: "Aprobado" } }),
      prisma.expiration.count({
        where: {
          status: {
            in: ["Pendiente", "Próximo"],
          },
        },
      }),
      prisma.expiration.count({
        where: {
          dueDate: {
            lt: new Date(),
          },
          status: {
            not: "Cumplido",
          },
        },
      }),
      prisma.calibrationRecord.count({
        where: {
          dueDate: {
            lt: new Date(),
          },
          status: {
            not: "Aprobado",
          },
        },
      }),
      prisma.maintenanceRecord.count({
        where: {
          dueDate: {
            lt: new Date(),
          },
          status: {
            not: "Aprobado",
          },
        },
      }),
      prisma.trainingRecord.count({
        where: {
          dueDate: {
            lt: new Date(),
          },
          status: {
            not: "Aprobado",
          },
        },
      }),
    ]);

    const operationalTotal =
      companies +
      users +
      farms +
      genetics +
      crops +
      harvests +
      samples +
      analyses +
      coas;

    const regulatoryTotal =
      licenses + quotas + peas + ica + invima + authorities + expirations;

    const documentTotal = sops + records + signatures;

    const inventoryTotal =
      suppliers +
      purchases +
      receptions +
      quarantine +
      releases +
      rawMaterials +
      inputs +
      products;

    const facilityTotal =
      equipment +
      calibrations +
      maintenance +
      cleaning +
      biosafety +
      waste +
      environmental +
      training;

    const criticalAlerts =
      blockedCrops +
      blockedSamples +
      blockedAnalyses +
      overdueExpirations +
      overdueCalibrations +
      overdueMaintenance +
      overdueTraining;

    const baseScoreItems = [
      companies > 0,
      users >= 3,
      farms > 0,
      genetics > 0,
      crops > 0,
      samples > 0,
      analyses > 0,
      coas > 0,
      auditTrail > 0,
      licenses > 0,
      sops > 0,
      signatures > 0,
      equipment > 0,
      suppliers > 0,
      criticalAlerts === 0,
    ];

    const score = Math.round(
      (baseScoreItems.filter(Boolean).length / baseScoreItems.length) * 100
    );

    return NextResponse.json({
      ok: true,
      score,
      maturity:
        score >= 90
          ? "Enterprise audit-ready"
          : score >= 75
          ? "Compliance avanzado"
          : score >= 55
          ? "MVP regulatorio funcional"
          : "Construcción inicial",
      totals: {
        operationalTotal,
        regulatoryTotal,
        documentTotal,
        inventoryTotal,
        facilityTotal,
        auditTrail,
        criticalAlerts,
      },
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
        approvedCoas,
      },
      regulatory: {
        licenses,
        quotas,
        peas,
        ica,
        invima,
        authorities,
        expirations,
        pendingExpirations,
        overdueExpirations,
      },
      documents: {
        sops,
        records,
        signatures,
      },
      inventory: {
        suppliers,
        purchases,
        receptions,
        quarantine,
        releases,
        rawMaterials,
        inputs,
        products,
      },
      facility: {
        equipment,
        calibrations,
        maintenance,
        cleaning,
        biosafety,
        waste,
        environmental,
        training,
        overdueCalibrations,
        overdueMaintenance,
        overdueTraining,
      },
      risk: {
        blockedCrops,
        blockedSamples,
        blockedAnalyses,
        criticalAlerts,
      },
      timestamp: new Date().toISOString(),
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
