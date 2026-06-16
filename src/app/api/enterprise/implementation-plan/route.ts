import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

async function safeCount(delegateName: string, where: any = undefined) {
  try {
    const delegate = (prisma as any)[delegateName];

    if (!delegate) {
      return {
        ok: false,
        count: 0,
        error: `Delegate no existe: ${delegateName}`,
      };
    }

    const count = await delegate.count(where ? { where } : undefined);

    return {
      ok: true,
      count,
      error: "",
    };
  } catch (error) {
    return {
      ok: false,
      count: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function openWhere() {
  return {
    status: {
      notIn: [
        "Cerrada",
        "Cerrado",
        "Completado",
        "Completada",
        "Aprobado",
        "Aprobada",
        "Cumple",
        "Liberado",
        "Liberada",
        "Transferida",
        "Mitigado",
        "Mitigada",
      ],
    },
  };
}

function scoreFrom(items: Array<{ ok: boolean; count: number }>, openItems = 0) {
  const valid = items.filter((item) => item.ok);
  const coverage = items.length === 0 ? 0 : Math.round((valid.length / items.length) * 100);
  const volume = valid.reduce((sum, item) => sum + item.count, 0);
  const volumeBonus = Math.min(15, Math.round(volume / 5));
  const penalty = Math.min(35, openItems * 4);

  return Math.max(0, Math.min(100, coverage + volumeBonus - penalty));
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
      sop,
      records,
      signatures,
      suppliers,
      rawMaterials,
      products,
      equipment,
      calibrations,
      maintenance,
      environmentalPoints,
      environmentalExcursions,
      capaOpen,
      deviationsOpen,
      nonConformitiesOpen,
      oosOpen,
      gapsOpen,
      supplierRisksOpen,
      dataIntegrityOpen,
      validationProtocols,
      validationTests,
      electronicControls,
      dossierMasters,
      dossierSections,
      dossierSubmissions,
      formulations,
      bom,
      instructions,
      techTransferOpen,
      pqrOpen,
      qualityTrends,
      auditTrail,
      backups,
      generatedDocuments,
    ] = await Promise.all([
      safeCount("company"),
      safeCount("user"),
      safeCount("farm"),
      safeCount("genetic"),
      safeCount("crop"),
      safeCount("harvest"),
      safeCount("sample"),
      safeCount("analysis"),
      safeCount("cOA"),
      safeCount("regulatoryLicense"),
      safeCount("quota"),
      safeCount("peasRecord"),
      safeCount("icaRecord"),
      safeCount("invimaProcedure"),
      safeCount("sopDocument"),
      safeCount("controlledRecord"),
      safeCount("electronicSignature"),
      safeCount("supplier"),
      safeCount("rawMaterial"),
      safeCount("product"),
      safeCount("equipment"),
      safeCount("calibrationRecord"),
      safeCount("maintenanceRecord"),
      safeCount("envMonitoringPoint"),
      safeCount("environmentalExcursion", openWhere()),
      safeCount("capaAction", openWhere()),
      safeCount("deviation", openWhere()),
      safeCount("nonConformity", openWhere()),
      safeCount("oosInvestigation", openWhere()),
      safeCount("complianceGap", openWhere()),
      safeCount("supplierRiskProfile", openWhere()),
      safeCount("dataIntegrityReview", openWhere()),
      safeCount("validationProtocol"),
      safeCount("validationTest"),
      safeCount("electronicRecordControl"),
      safeCount("dossierMaster"),
      safeCount("dossierSection"),
      safeCount("dossierSubmission"),
      safeCount("productFormulation"),
      safeCount("billOfMaterial"),
      safeCount("manufacturingInstruction"),
      safeCount("techTransferRecord", openWhere()),
      safeCount("productQualityReview", openWhere()),
      safeCount("qualityTrend"),
      safeCount("auditTrail"),
      safeCount("backupRecord"),
      safeCount("generatedDocument"),
    ]);

    const qmsOpen =
      capaOpen.count +
      deviationsOpen.count +
      nonConformitiesOpen.count +
      oosOpen.count;

    const regulatoryOpen = gapsOpen.count;
    const supplierOpen = supplierRisksOpen.count;
    const facilityOpen = environmentalExcursions.count;
    const dataOpen = dataIntegrityOpen.count;
    const productOpen = techTransferOpen.count + pqrOpen.count;

    const phases = [
      {
        phase: 1,
        title: "Estabilización técnica de la plataforma",
        objective:
          "Garantizar que FloraTrack compile, navegue correctamente, tenga módulos conectados y no existan imports faltantes.",
        status: "En ejecución",
        priority: "Crítica",
        score: scoreFrom([companies, users, auditTrail, backups, generatedDocuments]),
        evidence: {
          companies: companies.count,
          users: users.count,
          auditTrail: auditTrail.count,
          backups: backups.count,
          generatedDocuments: generatedDocuments.count,
        },
        actions: [
          "Abrir App Doctor y revisar imports, menú, APIs, Prisma y archivos críticos.",
          "Cerrar los problemas restantes de VS Code antes de crear más módulos complejos.",
          "Verificar que Command Center, Control Tower, Motor Reglas y Audit Builder carguen sin error.",
          "Crear backup JSON después de cada bloque grande.",
          "Mantener npm run dev corriendo dentro de Ubuntu, no en PowerShell local.",
        ],
        deliverables: [
          "App Doctor sin errores críticos.",
          "Command Center operativo.",
          "Backup técnico actualizado.",
          "Control Tower con score superior a 90%.",
        ],
      },
      {
        phase: 2,
        title: "Completitud GACP / operación agrícola",
        objective:
          "Consolidar predios, genética, propagación, cultivos, cosecha, trazabilidad agrícola y genealogía de lotes.",
        status: farms.count + genetics.count + crops.count + harvests.count > 0 ? "Avanzado" : "Inicial",
        priority: "Alta",
        score: scoreFrom([farms, genetics, crops, harvests]),
        evidence: {
          farms: farms.count,
          genetics: genetics.count,
          crops: crops.count,
          harvests: harvests.count,
        },
        actions: [
          "Revisar módulos Predios, GIS, Genéticas, Propagación, Cultivos y Cosecha.",
          "Completar datos maestros de predios, áreas, lotes y responsables.",
          "Conectar genealogía completa: genética → propagación → cultivo → cosecha → lote.",
          "Validar consumo de insumos y rendimiento por lote.",
          "Exportar paquete GACP desde Audit Builder.",
        ],
        deliverables: [
          "Paquete GACP exportable.",
          "Trazabilidad agrícola completa.",
          "Registros de cosecha y lotes listos para auditoría.",
        ],
      },
      {
        phase: 3,
        title: "Completitud GMP / laboratorio / producto",
        objective:
          "Consolidar fabricación, laboratorio, COA, OOS, especificaciones, formulaciones, BOM y transferencia tecnológica.",
        status: samples.count + analyses.count + coas.count + products.count > 0 ? "Avanzado" : "Inicial",
        priority: "Alta",
        score: scoreFrom(
          [samples, analyses, coas, products, formulations, bom, instructions],
          oosOpen.count + productOpen
        ),
        evidence: {
          samples: samples.count,
          analyses: analyses.count,
          coas: coas.count,
          products: products.count,
          formulations: formulations.count,
          bom: bom.count,
          instructions: instructions.count,
          oosOpen: oosOpen.count,
          techTransferOpen: techTransferOpen.count,
          pqrOpen: pqrOpen.count,
        },
        actions: [
          "Revisar Muestras, Análisis, COA, Métodos, Especificaciones y OOS.",
          "Completar fórmulas maestras, BOM e instrucciones de fabricación.",
          "Cerrar OOS/OOT antes de liberación de producto.",
          "Cerrar transferencia tecnológica antes de pasar a operación GMP rutinaria.",
          "Generar PQR/APR preliminar desde Generador Documental.",
        ],
        deliverables: [
          "Paquete GMP/LIMS exportable.",
          "COA trazable por lote.",
          "Fórmula maestra y batch record base.",
          "PQR/APR preliminar.",
        ],
      },
      {
        phase: 4,
        title: "Sistema de calidad, regulatorio y Data Integrity",
        objective:
          "Asegurar SOP, registros, firmas, CAPA, desviaciones, brechas regulatorias, CSV, ALCOA+, Part 11 y Annex 11.",
        status:
          qmsOpen + regulatoryOpen + dataOpen > 0
            ? "Con pendientes críticos"
            : "Controlado",
        priority: qmsOpen + regulatoryOpen + dataOpen > 0 ? "Crítica" : "Alta",
        score: scoreFrom(
          [
            sop,
            records,
            signatures,
            licenses,
            quotas,
            peas,
            ica,
            invima,
            validationProtocols,
            validationTests,
            electronicControls,
          ],
          qmsOpen + regulatoryOpen + dataOpen
        ),
        evidence: {
          sop: sop.count,
          records: records.count,
          signatures: signatures.count,
          licenses: licenses.count,
          quotas: quotas.count,
          peas: peas.count,
          ica: ica.count,
          invima: invima.count,
          validationProtocols: validationProtocols.count,
          validationTests: validationTests.count,
          electronicControls: electronicControls.count,
          capaOpen: capaOpen.count,
          deviationsOpen: deviationsOpen.count,
          nonConformitiesOpen: nonConformitiesOpen.count,
          gapsOpen: gapsOpen.count,
          dataIntegrityOpen: dataIntegrityOpen.count,
        },
        actions: [
          "Cerrar CAPA, desviaciones, no conformidades y OOS abiertos.",
          "Cerrar brechas regulatorias y asociarlas a planes de cumplimiento.",
          "Crear paquete CSV: URS, IQ, OQ, PQ, matriz de trazabilidad y reporte final.",
          "Generar SOP maestro del sistema desde Generador Documental.",
          "Revisar ALCOA+, audit trail, accesos, firmas electrónicas y backups.",
        ],
        deliverables: [
          "SOP Maestro FloraTrack.",
          "Plan CSV.",
          "Informe Data Integrity.",
          "Paquete regulatorio.",
          "Revisión gerencial del QMS.",
        ],
      },
      {
        phase: 5,
        title: "Preparación de auditoría, entrega y escalamiento",
        objective:
          "Preparar el sistema para auditoría, entrega empresarial, instalación, backup, documentación y entrenamiento.",
        status: "Siguiente fase",
        priority: "Alta",
        score: scoreFrom([dossierMasters, dossierSections, dossierSubmissions, generatedDocuments, backups]),
        evidence: {
          dossierMasters: dossierMasters.count,
          dossierSections: dossierSections.count,
          dossierSubmissions: dossierSubmissions.count,
          generatedDocuments: generatedDocuments.count,
          backups: backups.count,
        },
        actions: [
          "Generar paquete maestro Full Enterprise desde Audit Builder.",
          "Generar informe maestro de auditoría desde Generador Documental.",
          "Crear manual de usuario y SOP operativo.",
          "Crear backup final y exportación completa del proyecto.",
          "Preparar versión demostrable para Growlifecol y potenciales clientes.",
        ],
        deliverables: [
          "Paquete Full Enterprise.",
          "Manual de usuario.",
          "Backup final.",
          "Versión demostrable.",
          "Roadmap comercial y técnico.",
        ],
      },
    ];

    const totalOpen =
      qmsOpen +
      regulatoryOpen +
      supplierOpen +
      facilityOpen +
      dataOpen +
      productOpen;

    const globalScore = Math.max(
      0,
      Math.round(
        phases.reduce((sum, phase) => sum + phase.score, 0) / phases.length -
          Math.min(25, totalOpen * 2)
      )
    );

    const immediateActions = [
      {
        order: 1,
        title: "Abrir App Doctor",
        reason: "Quedan problemas en VS Code y debemos confirmar si son reales o caché.",
        module: "App Doctor",
      },
      {
        order: 2,
        title: "Abrir Command Center",
        reason: "Permite ver el estado general del sistema y priorizar trabajo.",
        module: "Command Center",
      },
      {
        order: 3,
        title: "Ejecutar Motor Reglas",
        reason: "Identifica CAPA, OOS, brechas, Data Integrity y pendientes de alto riesgo.",
        module: "Motor Reglas",
      },
      {
        order: 4,
        title: "Generar paquete Full en Audit Builder",
        reason: "Consolida evidencia de todos los módulos y detecta secciones sin registros.",
        module: "Audit Builder",
      },
      {
        order: 5,
        title: "Generar SOP y Plan CSV",
        reason: "Son documentos críticos para convertir FloraTrack en sistema validable.",
        module: "Generador Documental",
      },
    ];

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      app: "FloraTrack Enterprise Implementation Plan",
      globalScore,
      totalOpen,
      nextFiveSteps: [
        "Plan Maestro de Implementación",
        "Limpieza visual / UI final",
        "Validación CSV real",
        "Roles, permisos y seguridad",
        "Empaquetado final entregable",
      ],
      phases,
      immediateActions,
      executiveConclusion:
        totalOpen > 0
          ? "FloraTrack ya tiene una arquitectura enterprise amplia, pero debe cerrar pendientes críticos antes de considerarse audit-ready."
          : "FloraTrack está entrando en fase de consolidación enterprise y puede avanzar a validación CSV, documentación y preparación de auditoría.",
      recommendations: [
        "No crear módulos pequeños adicionales sin revisar App Doctor y Command Center.",
        "Priorizar cierre de problemas técnicos visibles en VS Code.",
        "Convertir Generador Documental y Audit Builder en herramientas centrales de entrega.",
        "Ejecutar backup al finalizar cada sesión de desarrollo.",
        "Preparar una versión demostrable limpia para Growlifecol y clientes potenciales.",
      ],
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
