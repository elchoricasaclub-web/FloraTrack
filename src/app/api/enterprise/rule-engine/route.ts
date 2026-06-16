import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type RuleSeverity = "Crítica" | "Alta" | "Media" | "Baja";
type RuleStatus = "Acción inmediata" | "Acción requerida" | "Monitorear" | "Cumple";

type RuleResult = {
  code: string;
  title: string;
  area: string;
  module: string;
  severity: RuleSeverity;
  status: RuleStatus;
  count: number;
  evidence: unknown[];
  recommendation: string;
  capaSuggested: boolean;
  auditPackage: string;
};

async function safeFindMany(delegateName: string, args: any = {}) {
  try {
    const delegate = (prisma as any)[delegateName];

    if (!delegate) {
      return {
        ok: false,
        data: [],
        error: `Delegate Prisma no existe: ${delegateName}`,
      };
    }

    const data = await delegate.findMany(args);

    return {
      ok: true,
      data,
      error: "",
    };
  } catch (error) {
    return {
      ok: false,
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function normalizeRecord(record: any) {
  return {
    id: record.id,
    code:
      record.code ||
      record.title ||
      record.productName ||
      record.batchCode ||
      record.supplierName ||
      record.areaName ||
      record.id,
    title:
      record.title ||
      record.productName ||
      record.issue ||
      record.gap ||
      record.requirement ||
      record.metric ||
      record.standard ||
      record.supplierName ||
      record.areaName ||
      record.processName ||
      null,
    status:
      record.status ||
      record.approvalStatus ||
      record.processStatus ||
      record.trend ||
      null,
    owner:
      record.owner ||
      record.responsible ||
      record.auditor ||
      record.analyst ||
      record.performedBy ||
      record.executedBy ||
      null,
    createdAt: record.createdAt || null,
    dueDate: record.dueDate || record.reviewDate || record.auditDate || null,
  };
}

function isOpenStatus(status: unknown) {
  const value = String(status || "").toLowerCase();

  if (!value) return true;

  const closed = [
    "cerrada",
    "cerrado",
    "cumple",
    "aprobada",
    "aprobado",
    "completado",
    "completada",
    "transferida",
    "mitigado",
    "mitigada",
    "liberado",
    "liberada",
  ];

  return !closed.some((item) => value.includes(item));
}

function isCriticalValue(value: unknown) {
  const text = String(value || "").toLowerCase();

  return (
    text.includes("crítica") ||
    text.includes("critica") ||
    text.includes("alta") ||
    text.includes("oos") ||
    text.includes("fuera") ||
    text.includes("capa requerida") ||
    text.includes("alerta")
  );
}

function buildRule(params: {
  code: string;
  title: string;
  area: string;
  module: string;
  severity: RuleSeverity;
  count: number;
  evidence: unknown[];
  recommendation: string;
  capaSuggested?: boolean;
  auditPackage: string;
}): RuleResult {
  let status: RuleStatus = "Cumple";

  if (params.count > 0 && params.severity === "Crítica") {
    status = "Acción inmediata";
  } else if (params.count > 0 && params.severity === "Alta") {
    status = "Acción requerida";
  } else if (params.count > 0) {
    status = "Monitorear";
  }

  return {
    code: params.code,
    title: params.title,
    area: params.area,
    module: params.module,
    severity: params.severity,
    status,
    count: params.count,
    evidence: params.evidence,
    recommendation: params.recommendation,
    capaSuggested: params.capaSuggested ?? params.count > 0,
    auditPackage: params.auditPackage,
  };
}

export async function GET() {
  try {
    const [
      capa,
      deviations,
      nonConformities,
      oos,
      environmentalExcursions,
      complianceGaps,
      supplierRisks,
      dataIntegrity,
      auditTrailReviews,
      accessReviews,
      validationProtocols,
      qualificationTests,
      equipmentQualifications,
      productReviews,
      qualityTrends,
      stabilityTrends,
      processCapability,
      complaints,
      recalls,
      pharmacovigilance,
      expirations,
      dossierSubmissions,
      techTransfers,
      generatedDocuments,
    ] = await Promise.all([
      safeFindMany("capaAction", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("deviation", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("nonConformity", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("oosInvestigation", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("environmentalExcursion", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("complianceGap", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("supplierRiskProfile", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("dataIntegrityReview", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("auditTrailReview", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("accessPeriodicReview", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("validationProtocol", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("qualificationTest", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("equipmentQualification", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("productQualityReview", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("qualityTrend", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("stabilityTrendReview", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("processCapabilityReview", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("complaintRecord", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("recallRecord", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("pharmacovigilanceCase", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("expiration", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("dossierSubmission", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("techTransferRecord", { orderBy: { createdAt: "desc" }, take: 50 }),
      safeFindMany("generatedDocument", { orderBy: { createdAt: "desc" }, take: 50 }),
    ]);

    const openCapa = capa.data.filter((item: any) => isOpenStatus(item.status));
    const openDeviations = deviations.data.filter((item: any) => isOpenStatus(item.status));
    const openNonConformities = nonConformities.data.filter((item: any) => isOpenStatus(item.status));
    const openOos = oos.data.filter((item: any) => isOpenStatus(item.status));
    const openExcursions = environmentalExcursions.data.filter((item: any) => isOpenStatus(item.status));
    const openGaps = complianceGaps.data.filter((item: any) => isOpenStatus(item.status));
    const criticalSupplierRisks = supplierRisks.data.filter((item: any) =>
      isCriticalValue(item.riskLevel)
    );
    const openDataIntegrity = dataIntegrity.data.filter((item: any) => isOpenStatus(item.status));
    const openAuditTrail = auditTrailReviews.data.filter((item: any) => isOpenStatus(item.status));
    const openAccess = accessReviews.data.filter((item: any) => isOpenStatus(item.status));
    const validationOpen = validationProtocols.data.filter((item: any) => isOpenStatus(item.status));
    const qualificationFailed = qualificationTests.data.filter(
      (item: any) => isOpenStatus(item.status) && isCriticalValue(item.status || item.result)
    );
    const equipmentPending = equipmentQualifications.data.filter((item: any) =>
      isOpenStatus(item.status)
    );
    const pqrOpen = productReviews.data.filter((item: any) => isOpenStatus(item.status));
    const qualityAlerts = qualityTrends.data.filter((item: any) =>
      isCriticalValue(item.trend || item.status || item.conclusion)
    );
    const stabilityAlerts = stabilityTrends.data.filter((item: any) =>
      isCriticalValue(item.trend || item.status || item.conclusion)
    );
    const capabilityAlerts = processCapability.data.filter((item: any) =>
      isCriticalValue(item.status || item.conclusion) || Number(item.cpk || 99) < 1.33
    );
    const openComplaints = complaints.data.filter((item: any) => isOpenStatus(item.status));
    const openRecalls = recalls.data.filter((item: any) => isOpenStatus(item.status));
    const openPhv = pharmacovigilance.data.filter((item: any) => isOpenStatus(item.status));
    const openExpirations = expirations.data.filter((item: any) => isOpenStatus(item.status));
    const dossierOpen = dossierSubmissions.data.filter((item: any) => isOpenStatus(item.status));
    const techTransferOpen = techTransfers.data.filter((item: any) => isOpenStatus(item.status));
    const generatedDrafts = generatedDocuments.data.filter((item: any) => isOpenStatus(item.status));

    const rules: RuleResult[] = [
      buildRule({
        code: "RULE-QA-001",
        title: "CAPA abiertas",
        area: "QMS",
        module: "CAPA",
        severity: "Alta",
        count: openCapa.length,
        evidence: openCapa.map(normalizeRecord),
        recommendation:
          "Priorizar cierre de CAPA abiertas, verificar eficacia y documentar evidencia antes de auditoría.",
        auditPackage: "PKG-QMS-CAPA",
      }),
      buildRule({
        code: "RULE-QA-002",
        title: "Desviaciones abiertas",
        area: "QMS",
        module: "Desviaciones",
        severity: "Alta",
        count: openDeviations.length,
        evidence: openDeviations.map(normalizeRecord),
        recommendation:
          "Cerrar desviaciones abiertas con investigación, impacto, causa raíz y decisión QA.",
        auditPackage: "PKG-QMS-DEVIATIONS",
      }),
      buildRule({
        code: "RULE-QA-003",
        title: "No conformidades abiertas",
        area: "QMS",
        module: "No Conformidades",
        severity: "Alta",
        count: openNonConformities.length,
        evidence: openNonConformities.map(normalizeRecord),
        recommendation:
          "Evaluar impacto de no conformidades abiertas y vincular CAPA si aplica.",
        auditPackage: "PKG-QMS-NC",
      }),
      buildRule({
        code: "RULE-LAB-001",
        title: "OOS/OOT abiertos",
        area: "Laboratorio",
        module: "OOS",
        severity: "Crítica",
        count: openOos.length,
        evidence: openOos.map(normalizeRecord),
        recommendation:
          "No liberar lotes asociados a OOS/OOT hasta cerrar investigación, causa raíz, impacto y disposición QA.",
        auditPackage: "PKG-LIMS-OOS",
      }),
      buildRule({
        code: "RULE-EMS-001",
        title: "Excursiones ambientales abiertas",
        area: "Monitoreo Ambiental",
        module: "Excursiones Ambientales",
        severity: "Alta",
        count: openExcursions.length,
        evidence: openExcursions.map(normalizeRecord),
        recommendation:
          "Investigar excursiones ambientales, revisar limpieza, HVAC, flujo de personal y necesidad de CAPA.",
        auditPackage: "PKG-EMS",
      }),
      buildRule({
        code: "RULE-REG-001",
        title: "Brechas regulatorias abiertas",
        area: "Regulatorio",
        module: "Brechas Cumplimiento",
        severity: "Alta",
        count: openGaps.length,
        evidence: openGaps.map(normalizeRecord),
        recommendation:
          "Cerrar brechas regulatorias antes de radicación o auditoría; asociar evidencia documental.",
        auditPackage: "PKG-REGULATORY-GAPS",
      }),
      buildRule({
        code: "RULE-SUP-001",
        title: "Riesgos críticos de proveedor",
        area: "Supplier QA",
        module: "Riesgo Proveedores",
        severity: "Alta",
        count: criticalSupplierRisks.length,
        evidence: criticalSupplierRisks.map(normalizeRecord),
        recommendation:
          "Mitigar proveedores críticos con auditoría, proveedor alterno, stock de seguridad y aprobación QA.",
        auditPackage: "PKG-SUPPLIER-QA",
      }),
      buildRule({
        code: "RULE-DI-001",
        title: "Revisiones Data Integrity abiertas",
        area: "Data Integrity",
        module: "ALCOA+",
        severity: "Alta",
        count: openDataIntegrity.length,
        evidence: openDataIntegrity.map(normalizeRecord),
        recommendation:
          "Completar revisiones ALCOA+, audit trail y evidencia de integridad de datos.",
        auditPackage: "PKG-DATA-INTEGRITY",
      }),
      buildRule({
        code: "RULE-DI-002",
        title: "Revisión de audit trail pendiente",
        area: "Data Integrity",
        module: "Revisión Audit Trail",
        severity: "Alta",
        count: openAuditTrail.length,
        evidence: openAuditTrail.map(normalizeRecord),
        recommendation:
          "Ejecutar revisión periódica de audit trail y documentar eventos críticos.",
        auditPackage: "PKG-AUDIT-TRAIL",
      }),
      buildRule({
        code: "RULE-DI-003",
        title: "Revisión de accesos pendiente",
        area: "Data Integrity",
        module: "Revisión Accesos",
        severity: "Media",
        count: openAccess.length,
        evidence: openAccess.map(normalizeRecord),
        recommendation:
          "Revisar usuarios, roles, permisos, accesos inactivos y privilegios críticos.",
        auditPackage: "PKG-ACCESS-REVIEW",
      }),
      buildRule({
        code: "RULE-CSV-001",
        title: "Validación CSV abierta",
        area: "CSV / Sistemas Computarizados",
        module: "Validación CSV",
        severity: "Alta",
        count: validationOpen.length,
        evidence: validationOpen.map(normalizeRecord),
        recommendation:
          "Cerrar URS, IQ, OQ, PQ, matriz de trazabilidad y reporte final de validación.",
        auditPackage: "PKG-CSV",
      }),
      buildRule({
        code: "RULE-QUAL-001",
        title: "Pruebas de calificación con desviación",
        area: "Calificación / Validación",
        module: "Pruebas Calificación",
        severity: "Alta",
        count: qualificationFailed.length,
        evidence: qualificationFailed.map(normalizeRecord),
        recommendation:
          "Resolver pruebas fallidas o con desviación antes de liberar equipo, área o sistema crítico.",
        auditPackage: "PKG-QUALIFICATION",
      }),
      buildRule({
        code: "RULE-QUAL-002",
        title: "Calificaciones de equipos pendientes",
        area: "Calificación / Validación",
        module: "Calificación Equipos",
        severity: "Media",
        count: equipmentPending.length,
        evidence: equipmentPending.map(normalizeRecord),
        recommendation:
          "Completar DQ/IQ/OQ/PQ y aprobar reportes antes de uso GMP rutinario.",
        capaSuggested: false,
        auditPackage: "PKG-EQUIPMENT-QUALIFICATION",
      }),
      buildRule({
        code: "RULE-PQR-001",
        title: "PQR/APR abiertos",
        area: "Quality Intelligence",
        module: "Revisión Producto",
        severity: "Media",
        count: pqrOpen.length,
        evidence: pqrOpen.map(normalizeRecord),
        recommendation:
          "Cerrar revisión anual/periódica de producto con tendencias, desviaciones, quejas, OOS y conclusión QA.",
        capaSuggested: false,
        auditPackage: "PKG-PQR-APR",
      }),
      buildRule({
        code: "RULE-TREND-001",
        title: "Tendencias de calidad en alerta",
        area: "Quality Intelligence",
        module: "Tendencias Calidad",
        severity: "Alta",
        count: qualityAlerts.length,
        evidence: qualityAlerts.map(normalizeRecord),
        recommendation:
          "Evaluar señales de tendencia, justificar estadísticamente y abrir CAPA si hay deterioro.",
        auditPackage: "PKG-QUALITY-TRENDS",
      }),
      buildRule({
        code: "RULE-STAB-001",
        title: "Tendencias de estabilidad en alerta",
        area: "Estabilidad",
        module: "Tendencias Estabilidad",
        severity: "Alta",
        count: stabilityAlerts.length,
        evidence: stabilityAlerts.map(normalizeRecord),
        recommendation:
          "Evaluar estabilidad, potencia, degradación, terpenos y vida útil antes de liberación comercial.",
        auditPackage: "PKG-STABILITY",
      }),
      buildRule({
        code: "RULE-CPK-001",
        title: "Capacidad de proceso insuficiente",
        area: "Producción GMP",
        module: "Capacidad Proceso",
        severity: "Alta",
        count: capabilityAlerts.length,
        evidence: capabilityAlerts.map(normalizeRecord),
        recommendation:
          "Revisar parámetros críticos, variabilidad de proceso, Cpk y necesidad de optimización o CAPA.",
        auditPackage: "PKG-PROCESS-CAPABILITY",
      }),
      buildRule({
        code: "RULE-PMS-001",
        title: "Quejas abiertas",
        area: "Postmercado",
        module: "Quejas",
        severity: "Alta",
        count: openComplaints.length,
        evidence: openComplaints.map(normalizeRecord),
        recommendation:
          "Investigar quejas abiertas, evaluar impacto de lote, tendencia y posible CAPA.",
        auditPackage: "PKG-COMPLAINTS",
      }),
      buildRule({
        code: "RULE-PMS-002",
        title: "Recall abierto",
        area: "Postmercado",
        module: "Recall",
        severity: "Crítica",
        count: openRecalls.length,
        evidence: openRecalls.map(normalizeRecord),
        recommendation:
          "Activar comité de crisis, trazabilidad de distribución, comunicación regulatoria y cierre formal.",
        auditPackage: "PKG-RECALL",
      }),
      buildRule({
        code: "RULE-PMS-003",
        title: "Farmacovigilancia abierta",
        area: "Postmercado",
        module: "Farmacovigilancia",
        severity: "Alta",
        count: openPhv.length,
        evidence: openPhv.map(normalizeRecord),
        recommendation:
          "Evaluar eventos adversos, causalidad, reporte regulatorio y seguimiento clínico.",
        auditPackage: "PKG-PHARMACOVIGILANCE",
      }),
      buildRule({
        code: "RULE-REG-002",
        title: "Vencimientos regulatorios abiertos",
        area: "Regulatorio",
        module: "Vencimientos",
        severity: "Alta",
        count: openExpirations.length,
        evidence: openExpirations.map(normalizeRecord),
        recommendation:
          "Priorizar renovaciones, licencias, certificados y obligaciones regulatorias próximas.",
        auditPackage: "PKG-REGULATORY-EXPIRATIONS",
      }),
      buildRule({
        code: "RULE-DOS-001",
        title: "Radicaciones abiertas",
        area: "Dossier / Radicación",
        module: "Radicaciones",
        severity: "Media",
        count: dossierOpen.length,
        evidence: dossierOpen.map(normalizeRecord),
        recommendation:
          "Completar dossier, anexos, evidencias, control documental y respuesta a requerimientos.",
        capaSuggested: false,
        auditPackage: "PKG-DOSSIER",
      }),
      buildRule({
        code: "RULE-TT-001",
        title: "Transferencias tecnológicas abiertas",
        area: "Desarrollo Producto",
        module: "Transferencia Tecnológica",
        severity: "Media",
        count: techTransferOpen.length,
        evidence: techTransferOpen.map(normalizeRecord),
        recommendation:
          "Cerrar transferencia con paquete técnico, riesgos, parámetros críticos y aprobación QA.",
        capaSuggested: false,
        auditPackage: "PKG-TECH-TRANSFER",
      }),
      buildRule({
        code: "RULE-DOC-001",
        title: "Documentos generados pendientes de aprobación",
        area: "Control Documental",
        module: "Documentos Generados",
        severity: "Media",
        count: generatedDrafts.length,
        evidence: generatedDrafts.map(normalizeRecord),
        recommendation:
          "Enviar documentos generados a revisión QA, firma electrónica y control de versión.",
        capaSuggested: false,
        auditPackage: "PKG-DOCUMENTS",
      }),
    ];

    const activeRules = rules.filter((rule) => rule.count > 0);
    const criticalRules = activeRules.filter((rule) => rule.severity === "Crítica");
    const highRules = activeRules.filter((rule) => rule.severity === "Alta");
    const capaRules = activeRules.filter((rule) => rule.capaSuggested);

    const score = Math.max(
      0,
      Math.round(100 - criticalRules.length * 12 - highRules.length * 6 - activeRules.length * 2)
    );

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      app: "FloraTrack Enterprise",
      score,
      summary: {
        totalRules: rules.length,
        activeRules: activeRules.length,
        criticalRules: criticalRules.length,
        highRules: highRules.length,
        capaSuggested: capaRules.length,
        auditPackagesSuggested: Array.from(new Set(activeRules.map((rule) => rule.auditPackage))).length,
      },
      activeRules,
      allRules: rules,
      capaSuggestions: capaRules.map((rule) => ({
        sourceRule: rule.code,
        title: `CAPA sugerida - ${rule.title}`,
        area: rule.area,
        module: rule.module,
        severity: rule.severity,
        recommendation: rule.recommendation,
        evidenceCount: rule.count,
      })),
      auditPackagesSuggested: Array.from(
        new Set(activeRules.map((rule) => rule.auditPackage))
      ).map((code) => ({
        code,
        rules: activeRules
          .filter((rule) => rule.auditPackage === code)
          .map((rule) => rule.code),
      })),
      recommendations: [
        criticalRules.length > 0
          ? "Existen reglas críticas activas. No liberar producto ni cerrar auditoría hasta resolverlas."
          : "No hay reglas críticas activas.",
        highRules.length > 0
          ? "Existen reglas de severidad alta. Priorizar CAPA, investigación y evidencia QA."
          : "No hay reglas altas activas.",
        "Usar Exportaciones para generar paquetes de auditoría de las reglas activas.",
        "Usar Generador Documental para producir reportes QA, regulatorios y Data Integrity.",
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
