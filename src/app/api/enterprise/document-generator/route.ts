import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type TemplateKey =
  | "audit-report"
  | "system-sop"
  | "csv-validation-plan"
  | "pqr-apr"
  | "regulatory-dossier"
  | "management-review"
  | "data-integrity-report";

type ScopeKey =
  | "full"
  | "gacp"
  | "gmp"
  | "lims"
  | "qms"
  | "regulatory"
  | "data-integrity"
  | "supplier"
  | "facility"
  | "product";

const templateTitles: Record<TemplateKey, string> = {
  "audit-report": "Informe Maestro de Auditoría FloraTrack",
  "system-sop": "SOP Maestro de Operación del Sistema FloraTrack",
  "csv-validation-plan": "Plan Maestro de Validación CSV FloraTrack",
  "pqr-apr": "Revisión Periódica / Anual de Producto PQR-APR",
  "regulatory-dossier": "Dossier Regulatorio Maestro",
  "management-review": "Revisión Gerencial del Sistema de Calidad",
  "data-integrity-report": "Informe Data Integrity ALCOA+ / Part 11 / Annex 11",
};

const templates = [
  {
    key: "audit-report",
    title: templateTitles["audit-report"],
    description: "Documento ejecutivo para auditoría GACP/GMP/GxP con evidencias, alertas, hallazgos y readiness.",
  },
  {
    key: "system-sop",
    title: templateTitles["system-sop"],
    description: "SOP maestro de uso de FloraTrack: roles, módulos, registros, trazabilidad, backup y auditoría.",
  },
  {
    key: "csv-validation-plan",
    title: templateTitles["csv-validation-plan"],
    description: "Plan CSV para validación de sistema computarizado: URS, IQ, OQ, PQ, riesgos y Part 11.",
  },
  {
    key: "pqr-apr",
    title: templateTitles["pqr-apr"],
    description: "Revisión periódica/anual de producto con tendencias, OOS, desviaciones, estabilidad y proceso.",
  },
  {
    key: "regulatory-dossier",
    title: templateTitles["regulatory-dossier"],
    description: "Dossier regulatorio para licencias, cupos, PEAS, ICA, INVIMA, brechas y radicaciones.",
  },
  {
    key: "management-review",
    title: templateTitles["management-review"],
    description: "Revisión gerencial QMS: indicadores, riesgos, CAPA, auditorías, recursos y decisiones.",
  },
  {
    key: "data-integrity-report",
    title: templateTitles["data-integrity-report"],
    description: "Informe ALCOA+, audit trail, revisión de accesos, CSV, registros electrónicos y controles.",
  },
];

const scopeLabels: Record<ScopeKey, string> = {
  full: "Full Enterprise",
  gacp: "GACP",
  gmp: "GMP",
  lims: "LIMS / COA",
  qms: "QMS",
  regulatory: "Regulatorio",
  "data-integrity": "Data Integrity / CSV",
  supplier: "Supplier QA",
  facility: "Facility / EMS",
  product: "Producto / PQR",
};

const delegateGroups: Record<ScopeKey, Array<{ label: string; delegate: string; module: string }>> = {
  gacp: [
    { label: "Predios", delegate: "farm", module: "Predios" },
    { label: "Genéticas", delegate: "genetic", module: "Genéticas" },
    { label: "Cultivos", delegate: "crop", module: "Cultivos" },
    { label: "Cosechas", delegate: "harvest", module: "Cosecha" },
    { label: "Genealogía", delegate: "lotGenealogy", module: "Genealogía Lotes" },
    { label: "Eventos trazabilidad", delegate: "traceabilityEvent", module: "Eventos Trazabilidad" },
  ],
  gmp: [
    { label: "Productos", delegate: "product", module: "Productos" },
    { label: "Producción", delegate: "productionOrder", module: "Producción" },
    { label: "Batch Records", delegate: "batchRecord", module: "Batch Records" },
    { label: "Envasado", delegate: "packagingRecord", module: "Envasado" },
    { label: "Estabilidad", delegate: "stabilityStudy", module: "Estabilidad" },
    { label: "Retención", delegate: "retentionSample", module: "Retención" },
  ],
  lims: [
    { label: "Muestras", delegate: "sample", module: "Muestras" },
    { label: "Análisis", delegate: "analysis", module: "Análisis" },
    { label: "COA", delegate: "cOA", module: "COA" },
    { label: "Métodos", delegate: "analyticalMethod", module: "Métodos Analíticos" },
    { label: "Especificaciones", delegate: "productSpecification", module: "Especificaciones" },
    { label: "OOS", delegate: "oosInvestigation", module: "OOS" },
  ],
  qms: [
    { label: "SOP", delegate: "sopDocument", module: "SOP" },
    { label: "Registros", delegate: "controlledRecord", module: "Registros" },
    { label: "Firmas", delegate: "electronicSignature", module: "Firmas" },
    { label: "CAPA", delegate: "capaAction", module: "CAPA" },
    { label: "Desviaciones", delegate: "deviation", module: "Desviaciones" },
    { label: "No Conformidades", delegate: "nonConformity", module: "No Conformidades" },
    { label: "Control Cambios", delegate: "changeControl", module: "Control Cambios" },
    { label: "Auditorías", delegate: "qualityAudit", module: "Auditorías" },
  ],
  regulatory: [
    { label: "Licencias", delegate: "regulatoryLicense", module: "Licencias" },
    { label: "Cupos", delegate: "quota", module: "Cupos" },
    { label: "PEAS", delegate: "peasRecord", module: "PEAS" },
    { label: "ICA", delegate: "icaRecord", module: "Registros ICA" },
    { label: "INVIMA", delegate: "invimaProcedure", module: "Trámites INVIMA" },
    { label: "Normativa", delegate: "regulatoryFramework", module: "Normativa" },
    { label: "Requisitos", delegate: "regulatoryRequirement", module: "Requisitos Normativos" },
    { label: "Brechas", delegate: "complianceGap", module: "Brechas Cumplimiento" },
  ],
  "data-integrity": [
    { label: "ALCOA+", delegate: "dataIntegrityReview", module: "ALCOA+" },
    { label: "Audit Trail", delegate: "auditTrail", module: "Auditoría Sistema" },
    { label: "Revisión Audit Trail", delegate: "auditTrailReview", module: "Revisión Audit Trail" },
    { label: "Revisión Accesos", delegate: "accessPeriodicReview", module: "Revisión Accesos" },
    { label: "Validación CSV", delegate: "validationProtocol", module: "Validación CSV" },
    { label: "Pruebas CSV", delegate: "validationTest", module: "Pruebas CSV" },
    { label: "Part 11 / Annex 11", delegate: "electronicRecordControl", module: "21 CFR Part 11" },
  ],
  supplier: [
    { label: "Proveedores", delegate: "supplier", module: "Proveedores" },
    { label: "Compras", delegate: "purchaseOrder", module: "Compras" },
    { label: "Recepción", delegate: "receptionRecord", module: "Recepción" },
    { label: "Cuarentena", delegate: "quarantineItem", module: "Cuarentena" },
    { label: "Liberación", delegate: "releaseRecord", module: "Liberación" },
    { label: "Homologación", delegate: "supplierQualification", module: "Homologación Proveedores" },
    { label: "Riesgo Proveedores", delegate: "supplierRiskProfile", module: "Riesgo Proveedores" },
  ],
  facility: [
    { label: "Equipos", delegate: "equipment", module: "Equipos" },
    { label: "Calibraciones", delegate: "calibrationRecord", module: "Calibraciones" },
    { label: "Mantenimiento", delegate: "maintenanceRecord", module: "Mantenimiento" },
    { label: "Limpieza", delegate: "cleaningRecord", module: "Limpieza" },
    { label: "Puntos Monitoreo", delegate: "envMonitoringPoint", module: "Puntos Monitoreo" },
    { label: "Resultados Ambientales", delegate: "envMonitoringResult", module: "Resultados Ambientales" },
    { label: "Excursiones Ambientales", delegate: "environmentalExcursion", module: "Excursiones Ambientales" },
    { label: "Calificación Equipos", delegate: "equipmentQualification", module: "Calificación Equipos" },
  ],
  product: [
    { label: "Formulaciones", delegate: "productFormulation", module: "Formulaciones" },
    { label: "BOM", delegate: "billOfMaterial", module: "BOM Fórmula Maestra" },
    { label: "Instrucciones", delegate: "manufacturingInstruction", module: "Instrucciones Fabricación" },
    { label: "Transferencia", delegate: "techTransferRecord", module: "Transferencia Tecnológica" },
    { label: "PQR/APR", delegate: "productQualityReview", module: "Revisión Producto" },
    { label: "Tendencias Calidad", delegate: "qualityTrend", module: "Tendencias Calidad" },
    { label: "Estabilidad", delegate: "stabilityTrendReview", module: "Tendencias Estabilidad" },
    { label: "Capacidad Proceso", delegate: "processCapabilityReview", module: "Capacidad Proceso" },
  ],
  full: [],
};

delegateGroups.full = [
  ...delegateGroups.gacp,
  ...delegateGroups.gmp,
  ...delegateGroups.lims,
  ...delegateGroups.qms,
  ...delegateGroups.regulatory,
  ...delegateGroups["data-integrity"],
  ...delegateGroups.supplier,
  ...delegateGroups.facility,
  ...delegateGroups.product,
];

function normalizeRecord(record: any) {
  return {
    id: record.id,
    code:
      record.code ||
      record.title ||
      record.name ||
      record.productName ||
      record.batchCode ||
      record.supplierName ||
      record.areaName ||
      record.id,
    title:
      record.title ||
      record.name ||
      record.productName ||
      record.issue ||
      record.metric ||
      record.standard ||
      record.requirement ||
      record.supplierName ||
      record.areaName ||
      record.processName ||
      record.equipmentName ||
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
  };
}

async function collectEvidence(scope: ScopeKey) {
  const selected = delegateGroups[scope] || delegateGroups.full;

  const sections = await Promise.all(
    selected.map(async (source) => {
      try {
        const delegate = (prisma as any)[source.delegate];

        if (!delegate) {
          return {
            ...source,
            ok: false,
            count: 0,
            records: [],
            error: `Delegate no existe: ${source.delegate}`,
          };
        }

        const [count, records] = await Promise.all([
          delegate.count(),
          delegate
            .findMany({
              orderBy: {
                createdAt: "desc",
              },
              take: 10,
            })
            .catch(() => []),
        ]);

        return {
          ...source,
          ok: true,
          count,
          records: records.map(normalizeRecord),
          error: "",
        };
      } catch (error) {
        return {
          ...source,
          ok: false,
          count: 0,
          records: [],
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    })
  );

  return sections;
}

function buildMarkdown(template: TemplateKey, scope: ScopeKey, sections: any[]) {
  const title = templateTitles[template];
  const totalRecords = sections.reduce((sum, item) => sum + item.count, 0);
  const errors = sections.filter((item) => !item.ok);
  const withEvidence = sections.filter((item) => item.count > 0);

  const lines: string[] = [];

  lines.push(`# ${title}`);
  lines.push("");
  lines.push(`**Sistema:** FloraTrack Enterprise`);
  lines.push(`**Alcance:** ${scopeLabels[scope]}`);
  lines.push(`**Fecha de generación:** ${new Date().toISOString()}`);
  lines.push(`**Secciones evaluadas:** ${sections.length}`);
  lines.push(`**Secciones con evidencia:** ${withEvidence.length}`);
  lines.push(`**Registros consolidados:** ${totalRecords}`);
  lines.push(`**Errores técnicos:** ${errors.length}`);
  lines.push("");

  if (template === "system-sop") {
    lines.push("## 1. Objetivo");
    lines.push("Establecer el procedimiento maestro para operar FloraTrack Enterprise como sistema digital de gestión GACP/GMP/GxP, trazabilidad, calidad, control documental, laboratorio, regulatorio, inventario, validación y auditoría.");
    lines.push("");
    lines.push("## 2. Alcance");
    lines.push("Aplica a usuarios administradores, responsables QA, responsables técnicos, laboratorio, producción, regulatorio, compras, facility, validación y dirección.");
    lines.push("");
    lines.push("## 3. Reglas principales de uso");
    lines.push("- Todo registro debe tener responsable, estado, fecha y evidencia trazable cuando aplique.");
    lines.push("- Las ediciones deben quedar soportadas por audit trail o registro equivalente.");
    lines.push("- Los registros críticos no deben eliminarse sin justificación QA.");
    lines.push("- La información exportada debe controlarse como copia no controlada salvo aprobación documental.");
    lines.push("- El sistema debe incluir revisión periódica de usuarios, roles, accesos, backups e integridad de datos.");
    lines.push("");
  }

  if (template === "csv-validation-plan") {
    lines.push("## 1. Enfoque CSV");
    lines.push("El sistema FloraTrack debe validarse bajo enfoque basado en riesgo, cubriendo URS, especificación funcional, matriz de trazabilidad, IQ/OQ/PQ, controles Part 11 / Annex 11, backup, recuperación, audit trail y revisión periódica.");
    lines.push("");
    lines.push("## 2. Pruebas mínimas recomendadas");
    lines.push("- Verificación de instalación y ambiente local.");
    lines.push("- Verificación de roles, permisos y accesos.");
    lines.push("- Prueba de creación, edición, eliminación controlada y consulta de registros.");
    lines.push("- Prueba de audit trail y trazabilidad.");
    lines.push("- Prueba de exportación de evidencias.");
    lines.push("- Prueba de backup y restauración documentada.");
    lines.push("");
  }

  if (template === "management-review") {
    lines.push("## 1. Conclusión ejecutiva");
    lines.push("La revisión gerencial debe evaluar el desempeño del sistema de calidad, indicadores, alertas, cumplimiento regulatorio, recursos, riesgos, CAPA, auditorías, proveedores, validación y mejora continua.");
    lines.push("");
  }

  if (template === "pqr-apr") {
    lines.push("## 1. Objetivo PQR/APR");
    lines.push("Evaluar la consistencia de producto, lotes, desviaciones, OOS/OOT, quejas, estabilidad, cambios, CAPA, rendimiento y capacidad del proceso durante el periodo revisado.");
    lines.push("");
  }

  if (template === "regulatory-dossier") {
    lines.push("## 1. Objetivo del dossier");
    lines.push("Consolidar la información requerida para soporte regulatorio, licencias, cupos, PEAS, registros ICA, trámites INVIMA, brechas, planes de cumplimiento y radicaciones.");
    lines.push("");
  }

  if (template === "data-integrity-report") {
    lines.push("## 1. Principios ALCOA+");
    lines.push("Los datos deben ser atribuibles, legibles, contemporáneos, originales, exactos, completos, consistentes, duraderos y disponibles.");
    lines.push("");
  }

  lines.push("## Índice de evidencia consolidada");
  lines.push("");

  for (const section of sections) {
    lines.push(`### ${section.label}`);
    lines.push(`- Módulo: ${section.module}`);
    lines.push(`- Delegate Prisma: ${section.delegate}`);
    lines.push(`- Registros disponibles: ${section.count}`);
    lines.push(`- Estado técnico: ${section.ok ? "OK" : "ERROR"}`);

    if (section.error) {
      lines.push(`- Error: ${section.error}`);
    }

    if (section.records.length > 0) {
      lines.push("- Evidencias recientes:");
      for (const record of section.records.slice(0, 5)) {
        lines.push(`  - ${record.code}${record.title ? ` | ${record.title}` : ""}${record.status ? ` | ${record.status}` : ""}`);
      }
    } else {
      lines.push("- Evidencias recientes: Sin registros.");
    }

    lines.push("");
  }

  lines.push("## Recomendaciones finales");
  lines.push("- Completar módulos sin evidencia antes de auditoría formal.");
  lines.push("- Cerrar registros abiertos o documentar justificación QA.");
  lines.push("- Exportar paquete final y controlarlo mediante SOP y firma electrónica.");
  lines.push("- Asociar este documento al dossier o paquete de auditoría correspondiente.");
  lines.push("");

  return lines.join("\n");
}

function markdownToHtml(markdown: string) {
  const escaped = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^\*\*(.*?):\*\* (.*)$/gm, "<p><strong>$1:</strong> $2</p>")
    .replace(/^- (.*)$/gm, "<li>$1</li>")
    .replace(/\n/g, "\n");
}

function buildHtml(title: string, markdown: string) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 42px; color: #0f172a; line-height: 1.55; }
    h1 { font-size: 34px; margin-bottom: 18px; }
    h2 { font-size: 24px; margin-top: 32px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; }
    h3 { font-size: 18px; margin-top: 24px; color: #166534; }
    p { margin: 8px 0; }
    li { margin: 5px 0; }
    .footer { margin-top: 40px; font-size: 12px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 12px; }
  </style>
</head>
<body>
${markdownToHtml(markdown)}
<div class="footer">Documento generado por FloraTrack Enterprise.</div>
</body>
</html>`;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    templates,
    scopes: Object.entries(scopeLabels).map(([value, label]) => ({
      value,
      label,
    })),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const template = String(body.template || "audit-report") as TemplateKey;
    const scope = String(body.scope || "full") as ScopeKey;

    const safeTemplate: TemplateKey = templateTitles[template] ? template : "audit-report";
    const safeScope: ScopeKey = delegateGroups[scope] ? scope : "full";

    const sections = await collectEvidence(safeScope);
    const title = `${templateTitles[safeTemplate]} - ${scopeLabels[safeScope]}`;
    const markdown = buildMarkdown(safeTemplate, safeScope, sections);
    const html = buildHtml(title, markdown);

    const totalRecords = sections.reduce((sum, section) => sum + section.count, 0);
    const technicalErrors = sections.filter((section) => !section.ok).length;
    const sectionsWithEvidence = sections.filter((section) => section.count > 0).length;

    await prisma.auditTrail.create({
      data: {
        module: "Generador Documental",
        action: "DOCUMENTO GENERADO",
        recordId: `${safeTemplate}-${safeScope}-${Date.now()}`,
        recordLabel: title,
        responsible: "Usuario local",
        status: "Generado",
        snapshot: JSON.stringify({
          template: safeTemplate,
          scope: safeScope,
          totalRecords,
          sections: sections.length,
          technicalErrors,
        }),
      },
    }).catch(() => {});

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      template: safeTemplate,
      scope: safeScope,
      title,
      summary: {
        sections: sections.length,
        sectionsWithEvidence,
        totalRecords,
        technicalErrors,
      },
      markdown,
      html,
      sections,
      recommendations: [
        "Exportar HTML para revisión ejecutiva o impresión PDF desde navegador.",
        "Exportar TXT/Markdown para editar en Word.",
        "Controlar versión final mediante SOP, firma electrónica y paquete de auditoría.",
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
