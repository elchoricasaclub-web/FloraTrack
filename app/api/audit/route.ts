import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { validateAuditPayload } from '../middleware/validate';

/**
 * GET /api/audit
 * Recupera todos los registros de auditoría de GACP/GMP registrados en el sistema,
 * opcionalmente filtrados por 'batchId' o 'section' a través de query params.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');
    const section = searchParams.get('section');
    const compliant = searchParams.get('compliant');

    // Construir filtro opcional dinámicamente
    const whereClause: any = {};
    if (batchId) {
      whereClause.batchId = batchId;
    }
    if (section) {
      whereClause.section = {
        contains: section,
        mode: 'insensitive',
      };
    }
    if (compliant !== null) {
      whereClause.compliant = compliant === 'true';
    }

    const auditRecords = await prisma.auditRecord.findMany({
      where: whereClause,
      include: {
        batch: {
          select: {
            name: true,
            variety: true,
            stage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, count: auditRecords.length, data: auditRecords }, { status: 200 });
  } catch (error: any) {
    console.error('[API_AUDIT_GET]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener los registros de auditoría e inspección.',
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/audit
 * Registra un nuevo punto de auditoría o de control verificado para un lote específico,
 * recalculando opcionalmente el balance de cumplimiento integral del lote asociado.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar el payload bajo criterios regulatorios de GACP / GMP
    const { isValid, errors } = validateAuditPayload(body);
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'GACP_COMPLIANCE_VALIDATION_ERROR',
          message: 'El registro de auditoría médica/hortícola no cumple los requisitos mínimos de control sanitario.',
          violations: errors,
        },
        { status: 422 }
      );
    }

    const {
      batchId,
      section,
      requirement,
      verified,
      notes,
      evidenceImage,
      compliant,
      scoreValue,
    } = body;

    // Verificar existencia del Batch asociado
    const targetBatch = await prisma.batch.findUnique({
      where: { id: batchId },
    });

    if (!targetBatch) {
      return NextResponse.json(
        { success: false, error: `No se encontró ningún lote asociado con el ID: ${batchId}` },
        { status: 404 }
      );
    }

    // Registro del punto auditado
    const newRecord = await prisma.auditRecord.create({
      data: {
        batchId,
        section: section.trim(),
        requirement: requirement.trim(),
        verified: typeof verified === 'boolean' ? verified : false,
        notes: notes ? notes.trim() : null,
        evidenceImage: evidenceImage ? evidenceImage.trim() : null,
        compliant: typeof compliant === 'boolean' ? compliant : false,
        scoreValue: typeof scoreValue === 'number' ? scoreValue : 0,
      },
    });

    // --- RECALCULO PREMIUM DE COMPLIANCE_SCORE EN BATCH ---
    // Cada vez que se agrega un punto de auditoría, calculamos el porcentaje promedio de éxito
    const allRecordsForBatch = await prisma.auditRecord.findMany({
      where: { batchId },
    });

    if (allRecordsForBatch.length > 0) {
      const positiveCount = allRecordsForBatch.filter((r) => r.compliant).length;
      const calculatedScore = Math.round((positiveCount / allRecordsForBatch.length) * 100);

      // Actualizar el score de cumplimiento integral en el Lote (Batch)
      await prisma.batch.update({
        where: { id: batchId },
        data: {
          complianceScore: calculatedScore,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registro de auditoría guardado satisfactoriamente. Indicador de lote actualizado.',
        data: newRecord,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API_AUDIT_POST]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al procesar el registro de auditoría.',
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

