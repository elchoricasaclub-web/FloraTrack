import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

async function safeList(label: string, callback: () => Promise<any[]>) {
  try {
    const data = await callback();

    return {
      label,
      ok: true,
      count: data.length,
      data,
    };
  } catch (error) {
    return {
      label,
      ok: false,
      count: 0,
      error: error instanceof Error ? error.message : "Unknown error",
      data: [],
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
      expirations,
      frameworks,
      requirements,
      gaps,
      plans,

      sops,
      records,
      signatures,
      evidenceRecords,
      evidencePackages,
      evidenceItems,

      deviations,
      nonConformities,
      capa,
      risks,
      changes,
      audits,

      productionOrders,
      productionBatches,
      batchRecords,
      packaging,
      stability,
      retention,

      customers,
      orders,
      dispatches,
      returns,
      complaints,
      recalls,
      pharmacovigilance,

      validationProtocols,
      validationTests,
      electronicControls,
      dataIntegrity,
      auditTrailReviews,
      accessReviews,

      dossierMasters,
      dossierSections,
      dossierSubmissions,

      kpis,
      objectives,
      managementReviews,
      readiness,
      auditTrail,
      aiRecommendations,
      backups,
    ] = await Promise.all([
      safeList("Empresas", () => prisma.company.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Usuarios", () => prisma.user.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Predios", () => prisma.farm.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Genéticas", () => prisma.genetic.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Cultivos", () => prisma.crop.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Cosechas", () => prisma.harvest.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Muestras", () => prisma.sample.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Análisis", () => prisma.analysis.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("COA", () => prisma.cOA.findMany({ orderBy: { createdAt: "desc" } })),

      safeList("Licencias", () => prisma.regulatoryLicense.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Cupos", () => prisma.quota.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("PEAS", () => prisma.peasRecord.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Registros ICA", () => prisma.icaRecord.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Trámites INVIMA", () => prisma.invimaProcedure.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Vencimientos", () => prisma.expiration.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Normativa", () => prisma.regulatoryFramework.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Requisitos Normativos", () => prisma.regulatoryRequirement.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Brechas de Cumplimiento", () => prisma.complianceGap.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Plan de Cumplimiento", () => prisma.compliancePlan.findMany({ orderBy: { createdAt: "desc" } })),

      safeList("SOP", () => prisma.sopDocument.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Registros Controlados", () => prisma.controlledRecord.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Firmas Electrónicas", () => prisma.electronicSignature.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Evidencias", () => prisma.evidenceRecord.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Paquetes de Auditoría", () => prisma.auditPackage.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Ítems de Evidencia", () => prisma.auditPackageItem.findMany({ orderBy: { createdAt: "desc" } })),

      safeList("Desviaciones", () => prisma.deviation.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("No Conformidades", () => prisma.nonConformity.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("CAPA", () => prisma.capaAction.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Riesgos", () => prisma.riskAssessment.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Control de Cambios", () => prisma.changeControl.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Auditorías", () => prisma.qualityAudit.findMany({ orderBy: { createdAt: "desc" } })),

      safeList("Órdenes de Producción", () => prisma.productionOrder.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Lotes de Producción", () => prisma.productionBatch.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Batch Records", () => prisma.batchRecord.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Envasado", () => prisma.packagingRecord.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Estabilidad", () => prisma.stabilityStudy.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Retención", () => prisma.retentionSample.findMany({ orderBy: { createdAt: "desc" } })),

      safeList("Clientes", () => prisma.customerAccount.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Pedidos", () => prisma.salesOrder.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Despachos", () => prisma.dispatchRecord.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Devoluciones", () => prisma.returnRecord.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Quejas", () => prisma.complaintRecord.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Recall", () => prisma.recallRecord.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Farmacovigilancia", () => prisma.pharmacovigilanceCase.findMany({ orderBy: { createdAt: "desc" } })),

      safeList("Validación CSV", () => prisma.validationProtocol.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Pruebas CSV", () => prisma.validationTest.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Part 11 / Annex 11", () => prisma.electronicRecordControl.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("ALCOA+", () => prisma.dataIntegrityReview.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Revisión Audit Trail", () => prisma.auditTrailReview.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Revisión Accesos", () => prisma.accessPeriodicReview.findMany({ orderBy: { createdAt: "desc" } })),

      safeList("Dossier Maestro", () => prisma.dossierMaster.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Secciones Dossier", () => prisma.dossierSection.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Radicaciones", () => prisma.dossierSubmission.findMany({ orderBy: { createdAt: "desc" } })),

      safeList("Indicadores", () => prisma.kpiMetric.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Objetivos", () => prisma.businessObjective.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Revisión Gerencial", () => prisma.managementReview.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Audit Readiness", () => prisma.auditReadinessItem.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Audit Trail", () => prisma.auditTrail.findMany({ orderBy: { createdAt: "desc" }, take: 1000 })),
      safeList("Recomendaciones IA", () => prisma.aiRecommendation.findMany({ orderBy: { createdAt: "desc" } })),
      safeList("Backups", () => prisma.backupRecord.findMany({ orderBy: { createdAt: "desc" } })),
    ]);

    const packages = [
      {
        code: "PKG-GACP-GMP",
        title: "Paquete GACP / GMP",
        description: "Operación agrícola, laboratorio, producción, calidad y trazabilidad.",
        sections: [
          farms,
          genetics,
          crops,
          harvests,
          samples,
          analyses,
          coas,
          productionOrders,
          productionBatches,
          batchRecords,
          packaging,
          stability,
          retention,
          deviations,
          capa,
          risks,
          changes,
        ],
      },
      {
        code: "PKG-REGULATORIO",
        title: "Paquete Regulatorio",
        description: "Licencias, cupos, PEAS, ICA, INVIMA, normativa, requisitos, brechas y plan.",
        sections: [
          licenses,
          quotas,
          peas,
          ica,
          invima,
          expirations,
          frameworks,
          requirements,
          gaps,
          plans,
        ],
      },
      {
        code: "PKG-DATA-INTEGRITY",
        title: "Paquete Data Integrity / CSV / Part 11 / Annex 11",
        description: "ALCOA+, audit trail, revisión de accesos, validación CSV y controles electrónicos.",
        sections: [
          validationProtocols,
          validationTests,
          electronicControls,
          dataIntegrity,
          auditTrailReviews,
          accessReviews,
          signatures,
          auditTrail,
          backups,
        ],
      },
      {
        code: "PKG-DOSSIER",
        title: "Paquete Dossier / Radicación",
        description: "Dossier maestro, secciones, radicaciones, evidencias y paquetes de auditoría.",
        sections: [
          dossierMasters,
          dossierSections,
          dossierSubmissions,
          evidenceRecords,
          evidencePackages,
          evidenceItems,
          sops,
          records,
          signatures,
        ],
      },
      {
        code: "PKG-POSTMERCADO",
        title: "Paquete Comercial / Postmercado",
        description: "Clientes, pedidos, despachos, devoluciones, quejas, recall y farmacovigilancia.",
        sections: [
          customers,
          orders,
          dispatches,
          returns,
          complaints,
          recalls,
          pharmacovigilance,
        ],
      },
      {
        code: "PKG-DIRECCION",
        title: "Paquete Dirección / BI / Audit Readiness",
        description: "Scorecard, indicadores, objetivos, revisión gerencial, readiness e IA.",
        sections: [
          kpis,
          objectives,
          managementReviews,
          readiness,
          aiRecommendations,
          auditTrail,
        ],
      },
    ];

    const totalRecords = packages.reduce(
      (sum, item) => sum + item.sections.reduce((inner, section) => inner + section.count, 0),
      0
    );

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      app: "FloraTrack Enterprise",
      totalPackages: packages.length,
      totalRecords,
      packages,
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
