import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/batches/[id]
 * Recupera los detalles de un único lote por su ID, con sus registros de auditoría y estados.
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el ID del lote en la ruta.' },
        { status: 400 }
      );
    }

    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        auditRecords: true,
        complianceLogs: true,
      },
    });

    if (!batch) {
      return NextResponse.json(
        { success: false, error: 'Lote no encontrado en el sistema.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: batch }, { status: 200 });
  } catch (error: any) {
    console.error(`[API_BATCHES_GET_ONE] ID: ${params?.id}`, error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al buscar el lote específico.',
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/batches/[id]
 * Modifica o actualiza el estado de un lote existente por su ID.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el ID del lote.' },
        { status: 400 }
      );
    }

    // Verificar si el lote existe antes de intentar actualizarlo
    const existingBatch = await prisma.batch.findUnique({
      where: { id },
    });

    if (!existingBatch) {
      return NextResponse.json(
        { success: false, error: 'El lote solicitado no existe en la base de datos.' },
        { status: 404 }
      );
    }

    // Construir objeto dinámico de actualización
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.variety !== undefined) updateData.variety = body.variety.trim();
    if (body.stage !== undefined) updateData.stage = body.stage.trim();
    if (body.complianceScore !== undefined) updateData.complianceScore = Number(body.complianceScore);
    if (body.location !== undefined) updateData.location = body.location.trim();
    if (body.hash !== undefined) updateData.hash = body.hash.trim();
    if (body.barcode !== undefined) updateData.barcode = body.barcode.trim();
    if (body.gmpCertified !== undefined) updateData.gmpCertified = Boolean(body.gmpCertified);

    const updatedBatch = await prisma.batch.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Lote actualizado correctamente.',
        data: updatedBatch,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`[API_BATCHES_PUT] ID: ${params?.id}`, error);
    return NextResponse.json(
      {
        success: false,
        message: 'No se pudo realizar la actualización del lote.',
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/batches/[id]
 * Elimina de manera física un lote de cultivo y sus registros relacionados gracias a la eliminación en cascada.
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de lote no proporcionado.' },
        { status: 400 }
      );
    }

    const existingBatch = await prisma.batch.findUnique({
      where: { id },
    });

    if (!existingBatch) {
      return NextResponse.json(
        { success: false, error: 'El lote que intenta eliminar no existe.' },
        { status: 404 }
      );
    }

    // Eliminar
    await prisma.batch.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'El lote y sus registros relacionados (Auditorías/Compliance) fueron eliminados exitosamente.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`[API_BATCHES_DELETE] ID: ${params?.id}`, error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error general al ejecutar la eliminación del lote.',
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
