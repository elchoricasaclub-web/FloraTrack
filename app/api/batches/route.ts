import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { validateBatchPayload } from '../middleware/validate';

/**
 * GET /api/batches
 * Retorna todos los lotes (batches) registrados con sus relaciones y ordenados por fecha.
 */
export async function GET() {
  try {
    const batches = await prisma.batch.findMany({
      include: {
        auditRecords: true,
        complianceLogs: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return NextResponse.json(batches, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[API_BATCHES_GET]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al recuperar el historial de lotes agrícolas GACP/GMP.',
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/batches
 * Crea un nuevo lote (batch) de monitoreo agrícola.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Ejecutar validación de middleware de estándares GACP/GMP
    const { isValid, errors } = validateBatchPayload(body);
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'GACP_COMPLIANCE_VALIDATION_ERROR',
          message: 'Los datos provistos para el lote de cultivo no cumplen con los estándares normativos de fitosanidad.',
          violations: errors,
        },
        { status: 422 }
      );
    }

    const {
      name,
      variety,
      stage,
      complianceScore,
      location,
      hash,
      barcode,
      gmpCertified,
    } = body;

    // Creación segura del lote usando Prisma Client
    const newBatch = await prisma.batch.create({
      data: {
        name: name.trim(),
        variety: variety.trim(),
        stage: stage.trim(),
        complianceScore: typeof complianceScore === 'number' ? complianceScore : 100,
        location: location ? location.trim() : 'Campo Aberto',
        hash: hash ? hash.trim() : `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        barcode: barcode ? barcode.trim() : `GTIN-${Date.now()}`,
        gmpCertified: typeof gmpCertified === 'boolean' ? gmpCertified : false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Lote de cultivo registrado de conformidad con las directivas GACP/GMP.',
        data: newBatch,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API_BATCHES_POST]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'No se pudo crear el lote de cultivo especificado.',
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

