import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

async function countSafe(name: string, callback: () => Promise<number>) {
  try {
    return {
      name,
      value: await callback(),
      ok: true,
    };
  } catch {
    return {
      name,
      value: 0,
      ok: false,
    };
  }
}

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
      deviations,
      nonConformities,
      capa,
      risks,
      changes,
      audits,
      roles,
      permissions,
      settings,
      masterData,
      backups,
      auditTrail,
      protocols,
      tests,
      controls,
    ] = await Promise.all([
      countSafe("Empresas", () => prisma.company.count()),
      countSafe("Usuarios", () => prisma.user.count()),
      countSafe("Predios", () => prisma.farm.count()),
      countSafe("Genéticas", () => prisma.genetic.count()),
      countSafe("Cultivos", () => prisma.crop.count()),
      countSafe("Cosechas", () => prisma.harvest.count()),
      countSafe("Muestras", () => prisma.sample.count()),
      countSafe("Análisis", () => prisma.analysis.count()),
      countSafe("COA", () => prisma.cOA.count()),
      countSafe("Licencias", () => prisma.regulatoryLicense.count()),
      countSafe("Cupos", () => prisma.quota.count()),
      countSafe("PEAS", () => prisma.peasRecord.count()),
      countSafe("Registros ICA", () => prisma.icaRecord.count()),
      countSafe("Trámites INVIMA", () => prisma.invimaProcedure.count()),
      countSafe("Autoridades", () => prisma.authority.count()),
      countSafe("Vencimientos", () => prisma.expiration.count()),
      countSafe("SOP", () => prisma.sopDocument.count()),
      countSafe("Registros", () => prisma.controlledRecord.count()),
      countSafe("Firmas", () => prisma.electronicSignature.count()),
      countSafe("Proveedores", () => prisma.supplier.count()),
      countSafe("Compras", () => prisma.purchaseOrder.count()),
      countSafe("Recepción", () => prisma.receptionRecord.count()),
      countSafe("Cuarentena", () => prisma.quarantineItem.count()),
      countSafe("Liberación", () => prisma.releaseRecord.count()),
      countSafe("Materias Primas", () => prisma.rawMaterial.count()),
      countSafe("Insumos", () => prisma.inputItem.count()),
      countSafe("Productos", () => prisma.product.count()),
      countSafe("Equipos", () => prisma.equipment.count()),
      countSafe("Calibraciones", () => prisma.calibrationRecord.count()),
      countSafe("Mantenimiento", () => prisma.maintenanceRecord.count()),
      countSafe("Limpieza", () => prisma.cleaningRecord.count()),
      countSafe("Bioseguridad", () => prisma.biosafetyRecord.count()),
      countSafe("Residuos", () => prisma.wasteRecord.count()),
      countSafe("Ambiental", () => prisma.environmentalRecord.count()),
      countSafe("Capacitaciones", () => prisma.trainingRecord.count()),
      countSafe("Desviaciones", () => prisma.deviation.count()),
      countSafe("No Conformidades", () => prisma.nonConformity.count()),
      countSafe("CAPA", () => prisma.capaAction.count()),
      countSafe("Riesgos", () => prisma.riskAssessment.count()),
      countSafe("Control de Cambios", () => prisma.changeControl.count()),
      countSafe("Auditorías", () => prisma.qualityAudit.count()),
      countSafe("Roles", () => prisma.securityRole.count()),
      countSafe("Permisos", () => prisma.securityPermission.count()),
      countSafe("Configuración", () => prisma.systemSetting.count()),
      countSafe("Datos Maestros", () => prisma.masterData.count()),
      countSafe("Backups", () => prisma.backupRecord.count()),
      countSafe("Audit Trail", () => prisma.auditTrail.count()),
      countSafe("Validación CSV", () => prisma.validationProtocol.count()),
      countSafe("Pruebas CSV", () => prisma.validationTest.count()),
      countSafe("Part 11 / Annex 11", () => prisma.electronicRecordControl.count()),
    ]);

    const sections = [
      {
        title: "Operación GACP / Laboratorio",
        records: [companies, users, farms, genetics, crops, harvests, samples, analyses, coas],
      },
      {
        title: "Regulatorio",
        records: [licenses, quotas, peas, ica, invima, authorities, expirations],
      },
      {
        title: "Documental",
        records: [sops, records, signatures],
      },
      {
        title: "Inventario",
        records: [suppliers, purchases, receptions, quarantine, releases, rawMaterials, inputs, products],
      },
      {
        title: "Facility / Ambiental / Capacitación",
        records: [equipment, calibrations, maintenance, cleaning, biosafety, waste, environmental, training],
      },
      {
        title: "Calidad",
        records: [deviations, nonConformities, capa, risks, changes, audits],
      },
      {
        title: "Sistema / Seguridad",
        records: [roles, permissions, settings, masterData, backups, auditTrail],
      },
      {
        title: "Validación GxP",
        records: [protocols, tests, controls],
      },
    ];

    const totalRecords = sections.reduce(
      (sum, section) =>
        sum + section.records.reduce((inner, record) => inner + record.value, 0),
      0
    );

    const modulesOk = sections.reduce(
      (sum, section) =>
        sum + section.records.filter((record) => record.ok).length,
      0
    );

    const totalModules = sections.reduce(
      (sum, section) => sum + section.records.length,
      0
    );

    const healthScore = Math.round((modulesOk / totalModules) * 100);

    const criticalStatus = {
      cropsBlocked: await prisma.crop.count({ where: { status: "Bloqueado" } }),
      samplesBlocked: await prisma.sample.count({ where: { status: "Bloqueado" } }),
      analysesBlocked: await prisma.analysis.count({
        where: {
          status: {
            in: ["Bloqueado", "Rechazado"],
          },
        },
      }),
      productsBlocked: await prisma.product.count({
        where: {
          status: {
            in: ["Bloqueado", "Vencido"],
          },
        },
      }),
      openDeviations: await prisma.deviation.count({
        where: {
          status: {
            not: "Cerrada",
          },
        },
      }),
      openCapa: await prisma.capaAction.count({
        where: {
          status: {
            not: "Cerrada",
          },
        },
      }),
      openChanges: await prisma.changeControl.count({
        where: {
          status: {
            notIn: ["Implementado", "Rechazado"],
          },
        },
      }),
    };

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      title: "FloraTrack Enterprise Report",
      healthScore,
      totalModules,
      modulesOk,
      totalRecords,
      sections,
      criticalStatus,
      reportStatus:
        healthScore >= 95
          ? "Enterprise audit-ready"
          : healthScore >= 85
          ? "Enterprise operativo"
          : healthScore >= 70
          ? "MVP avanzado"
          : "Requiere estabilización",
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
