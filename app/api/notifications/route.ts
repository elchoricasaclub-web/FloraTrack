import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { sendEmailNotifications } from '../services/emailService';

// Define the structure of a GACP/GMP Alert Notification
export interface GacpAlert {
  id: string;
  batchId: string;
  batchName: string;
  variety: string;
  stage: string;
  type: 'AUDIT_REQUIRED' | 'EXPIRATION_RISK' | 'NON_CONFORMITY_ALERT' | 'GMP_SUSPENSION_RISK';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  daysRemainingOrElapsed: number;
}

/**
 * GET /api/notifications
 * Evaluates all batches in the database dynamically against GACP and GMP regulatory rules.
 * Generates alert notifications based on age of the batch, current cultivation stage,
 * lack of recent audits, or low quality-compliance scores.
 * Option: Pass ?sendEmail=true to automatically send alert emails to the auditor.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const triggerEmail = searchParams.get('sendEmail') === 'true';

    const batches = await prisma.batch.findMany({
      include: {
        auditRecords: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    const alerts: GacpAlert[] = [];
    const now = new Date();

    for (const batch of batches) {
      const batchAgeInDays = Math.floor(
        (now.getTime() - new Date(batch.timestamp).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Rule 1: CRITICAL NON-CONFORMITY ALERT (Low score)
      if (batch.complianceScore < 70) {
        alerts.push({
          id: `alert-low-score-${batch.id}`,
          batchId: batch.id,
          batchName: batch.name,
          variety: batch.variety,
          stage: batch.stage,
          type: 'NON_CONFORMITY_ALERT',
          severity: 'CRITICAL',
          title: 'No conformidad crítica de calidad',
          description: `El lote tiene una puntuación de cumplimiento de ${batch.complianceScore}%, cayendo por debajo del umbral mínimo sanitario del 70%. Requiere corrección inmediata de higiene o control fitosanitario.`,
          daysRemainingOrElapsed: batch.complianceScore,
        });
      } else if (batch.complianceScore < 85) {
        // Rule 2: GMP_SUSPENSION_RISK (Warning score)
        alerts.push({
          id: `alert-warning-score-${batch.id}`,
          batchId: batch.id,
          batchName: batch.name,
          variety: batch.variety,
          stage: batch.stage,
          type: 'GMP_SUSPENSION_RISK',
          severity: 'WARNING',
          title: 'Riesgo de suspensión GMP',
          description: `La puntuación es de ${batch.complianceScore}%. Está cerca de perder la homologación de grado farmacéutico. Programe una inspección de control de calidad.`,
          daysRemainingOrElapsed: batch.complianceScore,
        });
      }

      // Rule 3: High-Risk stages check (Cuarentena, Cosechado, Secado)
      // High sanitary risk phases must be audited within tight limits.
      if (batch.stage === 'Cuarentena') {
        const stageAgeLimit = 3; // Maximum 3 days in quarantine without inspection
        const secondsSinceCreated = now.getTime() - new Date(batch.updatedAt).getTime();
        const daysInStage = Math.floor(secondsSinceCreated / (1000 * 60 * 60 * 24));

        if (daysInStage >= stageAgeLimit) {
          alerts.push({
            id: `alert-quarantine-limit-${batch.id}`,
            batchId: batch.id,
            batchName: batch.name,
            variety: batch.variety,
            stage: batch.stage,
            type: 'AUDIT_REQUIRED',
            severity: 'CRITICAL',
            title: 'Límite de tiempo en Cuarentena excedido',
            description: `El lote ha permanecido en Cuarentena por ${daysInStage} días sin cambio de estado. Se requiere validación de laboratorio urgente para su liberación o descarte.`,
            daysRemainingOrElapsed: daysInStage,
          });
        }
      }

      if (batch.stage === 'Cosechado' && batchAgeInDays > 5 && batch.auditRecords.length === 0) {
        alerts.push({
          id: `alert-harvest-audit-${batch.id}`,
          batchId: batch.id,
          batchName: batch.name,
          variety: batch.variety,
          stage: batch.stage,
          type: 'AUDIT_REQUIRED',
          severity: 'CRITICAL',
          title: 'Auditoría poscosecha requerida',
          description: `El lote está en estado 'Cosechado' hace ${batchAgeInDays} días y no registra ningún control microbiológico poscosecha. Riesgo de proliferación de hongos o mohos.`,
          daysRemainingOrElapsed: batchAgeInDays,
        });
      }

      // Rule 4: Expiration risk for active botanical crops
      // Crops left too long in general active cultivation risk loss of active compounds
      if ((batch.stage === 'Vegetativo' || batch.stage === 'Floración') && batchAgeInDays > 90) {
        alerts.push({
          id: `alert-crop-expiration-${batch.id}`,
          batchId: batch.id,
          batchName: batch.name,
          variety: batch.variety,
          stage: batch.stage,
          type: 'EXPIRATION_RISK',
          severity: 'CRITICAL',
          title: 'Riesgo de caducidad botánica de cosecha',
          description: `Este cultivo lleva activo ${batchAgeInDays} días desde su siembra inicial en la ubicación '${batch.location}'. Excede la ventana óptima de maduración floral de la variedad ${batch.variety}.`,
          daysRemainingOrElapsed: batchAgeInDays - 90,
        });
      } else if ((batch.stage === 'Vegetativo' || batch.stage === 'Floración') && batchAgeInDays > 75) {
        alerts.push({
          id: `alert-crop-warning-expiration-${batch.id}`,
          batchId: batch.id,
          batchName: batch.name,
          variety: batch.variety,
          stage: batch.stage,
          type: 'EXPIRATION_RISK',
          severity: 'WARNING',
          title: 'Próximo a límite óptimo de cosecha',
          description: `El periodo vegetativo/reproductivo alcanza los ${batchAgeInDays} días. El lote debe transicionar pronto a fases de Cosecha y Secado para evitar degradación de tricomas.`,
          daysRemainingOrElapsed: 90 - batchAgeInDays,
        });
      }

      // Rule 5: Audit required if not inspected recently (e.g. within 20 days for compliance check)
      const lastAuditDate = batch.auditRecords.length > 0 ? new Date(batch.auditRecords[0].createdAt) : null;
      if (lastAuditDate) {
        const daysSinceLastAudit = Math.floor(
          (now.getTime() - lastAuditDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastAudit > 25) {
          alerts.push({
            id: `alert-periodic-audit-${batch.id}`,
            batchId: batch.id,
            batchName: batch.name,
            variety: batch.variety,
            stage: batch.stage,
            type: 'AUDIT_REQUIRED',
            severity: 'WARNING',
            title: 'Auditoría periódica GACP atrasada',
            description: `Han transcurrido ${daysSinceLastAudit} días desde el último punto de inspección registrado en este lote. Según GACP, se recomiendan revisiones fitosanitarias de subsuelo/agua cada 25 días.`,
            daysRemainingOrElapsed: daysSinceLastAudit,
          });
        }
      } else if (batchAgeInDays > 15) {
        // No audit records at all since initialization
        alerts.push({
          id: `alert-first-audit-needed-${batch.id}`,
          batchId: batch.id,
          batchName: batch.name,
          variety: batch.variety,
          stage: batch.stage,
          type: 'AUDIT_REQUIRED',
          severity: 'INFO',
          title: 'Sin registro inicial de inspección',
          description: `Este lote lleva activo ${batchAgeInDays} días y nunca ha sido inspeccionado. Registre la primera inspección fitosanitaria de control del agua y sustrato.`,
          daysRemainingOrElapsed: batchAgeInDays,
        });
      }
    }

    let emailResult = null;
    if (triggerEmail && alerts.length > 0) {
      emailResult = await sendEmailNotifications(alerts);
    }

    return NextResponse.json(
      {
        success: true,
        summary: {
          totalAlerts: alerts.length,
          criticalCount: alerts.filter((a) => a.severity === 'CRITICAL').length,
          warningCount: alerts.filter((a) => a.severity === 'WARNING').length,
          infoCount: alerts.filter((a) => a.severity === 'INFO').length,
        },
        emailDispatch: emailResult,
        data: alerts,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API_NOTIFICATIONS_GET]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'No se pudo compilar el balance periódico de alertas regulatorias GACP/GMP.',
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Explicitly triggers a batch scan and immediately sends an alert email to the configured GACP/GMP auditors.
 */
export async function POST() {
  try {
    const batches = await prisma.batch.findMany({
      include: {
        auditRecords: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    const alerts: GacpAlert[] = [];
    const now = new Date();

    for (const batch of batches) {
      const batchAgeInDays = Math.floor(
        (now.getTime() - new Date(batch.timestamp).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (batch.complianceScore < 70) {
        alerts.push({
          id: `alert-low-score-${batch.id}`,
          batchId: batch.id,
          batchName: batch.name,
          variety: batch.variety,
          stage: batch.stage,
          type: 'NON_CONFORMITY_ALERT',
          severity: 'CRITICAL',
          title: 'No conformidad crítica de calidad',
          description: `El lote tiene una puntuación de cumplimiento de ${batch.complianceScore}%, cayendo por debajo del umbral mínimo sanitario del 70%.`,
          daysRemainingOrElapsed: batch.complianceScore,
        });
      } else if (batch.complianceScore < 85) {
        alerts.push({
          id: `alert-warning-score-${batch.id}`,
          batchId: batch.id,
          batchName: batch.name,
          variety: batch.variety,
          stage: batch.stage,
          type: 'GMP_SUSPENSION_RISK',
          severity: 'WARNING',
          title: 'Riesgo de suspensión GMP',
          description: `La puntuación es de ${batch.complianceScore}%. Está cerca de perder la homologación de grado farmacéutico.`,
          daysRemainingOrElapsed: batch.complianceScore,
        });
      }

      if (batch.stage === 'Cuarentena') {
        const secondsSinceCreated = now.getTime() - new Date(batch.updatedAt).getTime();
        const daysInStage = Math.floor(secondsSinceCreated / (1000 * 60 * 60 * 24));
        if (daysInStage >= 3) {
          alerts.push({
            id: `alert-quarantine-limit-${batch.id}`,
            batchId: batch.id,
            batchName: batch.name,
            variety: batch.variety,
            stage: batch.stage,
            type: 'AUDIT_REQUIRED',
            severity: 'CRITICAL',
            title: 'Límite de tiempo en Cuarentena excedido',
            description: `El lote ha permanecido en Cuarentena por ${daysInStage} días sin cambio de estado.`,
            daysRemainingOrElapsed: daysInStage,
          });
        }
      }

      if (batch.stage === 'Cosechado' && batchAgeInDays > 5 && batch.auditRecords.length === 0) {
        alerts.push({
          id: `alert-harvest-audit-${batch.id}`,
          batchId: batch.id,
          batchName: batch.name,
          variety: batch.variety,
          stage: batch.stage,
          type: 'AUDIT_REQUIRED',
          severity: 'CRITICAL',
          title: 'Auditoría poscosecha requerida',
          description: `El lote está en estado 'Cosechado' hace ${batchAgeInDays} días sin control microbiológico.`,
          daysRemainingOrElapsed: batchAgeInDays,
        });
      }

      if ((batch.stage === 'Vegetativo' || batch.stage === 'Floración') && batchAgeInDays > 90) {
        alerts.push({
          id: `alert-crop-expiration-${batch.id}`,
          batchId: batch.id,
          batchName: batch.name,
          variety: batch.variety,
          stage: batch.stage,
          type: 'EXPIRATION_RISK',
          severity: 'CRITICAL',
          title: 'Riesgo de caducidad botánica de cosecha',
          description: `Este cultivo lleva activo ${batchAgeInDays} días y excede su ventana óptima de cosecha floral.`,
          daysRemainingOrElapsed: batchAgeInDays - 90,
        });
      }
    }

    const emailResult = await sendEmailNotifications(alerts);

    return NextResponse.json(
      {
        success: true,
        summary: {
          totalAlerts: alerts.length,
          criticalCount: alerts.filter((a) => a.severity === 'CRITICAL').length,
          warningCount: alerts.filter((a) => a.severity === 'WARNING').length,
          infoCount: alerts.filter((a) => a.severity === 'INFO').length,
        },
        emailDispatch: emailResult,
        data: alerts,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API_NOTIFICATIONS_POST]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'No se pudo forzar el envío inmediato de notificaciones.',
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
