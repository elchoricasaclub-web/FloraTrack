import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

async function safeCount(label: string, callback: () => Promise<number>) {
  try {
    const count = await callback();

    return {
      label,
      ok: true,
      count,
      error: null,
    };
  } catch (error) {
    return {
      label,
      ok: false,
      count: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET() {
  try {
    const checks = await Promise.all([
      safeCount("Empresas", () => prisma.company.count()),
      safeCount("Usuarios", () => prisma.user.count()),
      safeCount("Predios", () => prisma.farm.count()),
      safeCount("Genéticas", () => prisma.genetic.count()),
      safeCount("Cultivos", () => prisma.crop.count()),
      safeCount("Cosechas", () => prisma.harvest.count()),
      safeCount("Muestras", () => prisma.sample.count()),
      safeCount("Análisis", () => prisma.analysis.count()),
      safeCount("COA", () => prisma.cOA.count()),

      safeCount("Licencias", () => prisma.regulatoryLicense.count()),
      safeCount("Cupos", () => prisma.quota.count()),
      safeCount("PEAS", () => prisma.peasRecord.count()),
      safeCount("ICA", () => prisma.icaRecord.count()),
      safeCount("INVIMA", () => prisma.invimaProcedure.count()),
      safeCount("Autoridades", () => prisma.authority.count()),
      safeCount("Vencimientos", () => prisma.expiration.count()),

      safeCount("SOP", () => prisma.sopDocument.count()),
      safeCount("Registros", () => prisma.controlledRecord.count()),
      safeCount("Firmas", () => prisma.electronicSignature.count()),

      safeCount("Proveedores", () => prisma.supplier.count()),
      safeCount("Compras", () => prisma.purchaseOrder.count()),
      safeCount("Recepción", () => prisma.receptionRecord.count()),
      safeCount("Cuarentena", () => prisma.quarantineItem.count()),
      safeCount("Liberación", () => prisma.releaseRecord.count()),
      safeCount("Materias Primas", () => prisma.rawMaterial.count()),
      safeCount("Insumos", () => prisma.inputItem.count()),
      safeCount("Productos", () => prisma.product.count()),

      safeCount("Equipos", () => prisma.equipment.count()),
      safeCount("Calibraciones", () => prisma.calibrationRecord.count()),
      safeCount("Mantenimiento", () => prisma.maintenanceRecord.count()),
      safeCount("Limpieza", () => prisma.cleaningRecord.count()),
      safeCount("Bioseguridad", () => prisma.biosafetyRecord.count()),
      safeCount("Residuos", () => prisma.wasteRecord.count()),
      safeCount("Ambiental", () => prisma.environmentalRecord.count()),
      safeCount("Capacitaciones", () => prisma.trainingRecord.count()),

      safeCount("Desviaciones", () => prisma.deviation.count()),
      safeCount("No Conformidades", () => prisma.nonConformity.count()),
      safeCount("CAPA", () => prisma.capaAction.count()),
      safeCount("Riesgos", () => prisma.riskAssessment.count()),
      safeCount("Control de Cambios", () => prisma.changeControl.count()),
      safeCount("Auditorías", () => prisma.qualityAudit.count()),

      safeCount("Roles", () => prisma.securityRole.count()),
      safeCount("Permisos", () => prisma.securityPermission.count()),
      safeCount("Access Logs", () => prisma.accessLog.count()),
      safeCount("Configuración", () => prisma.systemSetting.count()),
      safeCount("Datos Maestros", () => prisma.masterData.count()),
      safeCount("Backups", () => prisma.backupRecord.count()),

      safeCount("Audit Trail", () => prisma.auditTrail.count()),
    ]);

    const failed = checks.filter((check) => !check.ok);
    const totalRecords = checks.reduce((sum, check) => sum + check.count, 0);
    const healthScore = Math.round(
      (checks.filter((check) => check.ok).length / checks.length) * 100
    );

    return NextResponse.json({
      ok: failed.length === 0,
      healthScore,
      totalModules: checks.length,
      modulesOk: checks.filter((check) => check.ok).length,
      modulesFailed: failed.length,
      totalRecords,
      checks,
      failed,
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
