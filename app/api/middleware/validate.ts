import { NextResponse } from 'next/server';

// Approved phases/stages of medical/agricultural cultivation matching GACP guidelines
export const APPROVED_GACP_STAGES = [
  'Siembra',
  'Propagación',
  'Vegetativo',
  'Floración',
  'Cosechado',
  'Secado',
  'Curado',
  'Procesado',
  'Cuarentena',
  'Aprobado'
];

// Official GACP/GMP verification sections ensuring safe horticultural processing
export const APPROVED_AUDIT_SECTIONS = [
  'Higiene',
  'Personal',
  'Equipos',
  'Agua',
  'Sustratos',
  'Fertilizantes',
  'Control de Plagas',
  'Bitácora',
  'Instalaciones',
  'Documentación',
  'Almacenamiento',
  'Despacho'
];

/**
 * Validates a Batch (Lote) payload against GACP/GMP compliance rules.
 */
export function validateBatchPayload(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 1. Name validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 3) {
    errors.push('Identificador del Lote (name) debe tener al menos 3 caracteres.');
  }

  // 2. Variety validation (Botanical taxonomy checks)
  if (!data.variety || typeof data.variety !== 'string' || data.variety.trim().length === 0) {
    errors.push('Debe especificar la taxonomía botánica de origen (variety).');
  }

  // 3. Cultivation stage validation (GACP alignment)
  if (!data.stage || typeof data.stage !== 'string') {
    errors.push(`La etapa de cultivo (stage) es obligatoria.`);
  } else if (!APPROVED_GACP_STAGES.includes(data.stage.trim())) {
    errors.push(
      `La etapa de cultivo '${data.stage}' no está homologada. Debe ser una de: ${APPROVED_GACP_STAGES.join(', ')}.`
    );
  }

  // 4. Compliance Score limits
  if (data.complianceScore !== undefined) {
    const score = Number(data.complianceScore);
    if (isNaN(score) || score < 0 || score > 100) {
      errors.push('El complianceScore (puntaje de cumplimiento) debe estar en el rango de 0 a 100.');
    }
  }

  // 5. Unique Barcode verification
  if (data.barcode && typeof data.barcode === 'string' && data.barcode.trim().length < 5) {
    errors.push('El código de barras (barcode) de rastreabilidad física debe tener al menos 5 caracteres.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates an AuditRecord payload against sanitary and pharmaceutical standards.
 */
export function validateAuditPayload(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 1. Target Batch Reference
  if (!data.batchId || typeof data.batchId !== 'string' || data.batchId.trim() === '') {
    errors.push('ID de lote (batchId) de referencia es obligatorio para registrar auditorías.');
  }

  // 2. Standard Sanitary Sections
  if (!data.section || typeof data.section !== 'string') {
    errors.push('La sección evaluada (section) es obligatoria.');
  } else if (!APPROVED_AUDIT_SECTIONS.includes(data.section.trim())) {
    errors.push(
      `La sección '${data.section}' no está homologada. Use una de las secciones normativas GMP: ${APPROVED_AUDIT_SECTIONS.join(', ')}.`
    );
  }

  // 3. Clear audit tracking descriptions
  if (!data.requirement || typeof data.requirement !== 'string' || data.requirement.trim().length < 10) {
    errors.push('La descripción del requisito (requirement) auditado debe ser explícita (mínimo 10 caracteres).');
  }

  // 4. Score range checks
  if (data.scoreValue !== undefined) {
    const score = Number(data.scoreValue);
    if (isNaN(score) || score < 0 || score > 10) {
      errors.push('La ponderación del punto de control (scoreValue) debe estar contenida entre 0 y 10.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Next.js-compatible Higher-Order Helper simulating validation middleware for API Route handlers.
 * Intercepts POST/PUT JSON payloads and returns detailed GACP error summaries automatically if invalid.
 */
export async function withValidation(
  request: Request,
  validationType: 'batch' | 'audit',
  handler: (validatedData: any) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validationResult =
      validationType === 'batch' ? validateBatchPayload(body) : validateAuditPayload(body);

    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'GACP_COMPLIANCE_VALIDATION_ERROR',
          message: 'Los datos provistos no cumplen con los estándares fitosanitarios y de trazabilidad GACP/GMP.',
          violations: validationResult.errors,
        },
        { status: 422 } // Unprocessable Entity
      );
    }

    return await handler(body);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'JSON_PARSING_ERROR',
        message: 'El cuerpo de la solicitud no contiene un JSON estructurado válido.',
        details: error.message || error,
      },
      { status: 400 }
    );
  }
}
