import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type Rule = {
  code: string;
  area: string;
  requirement: string;
  status: "Cumple" | "Parcial" | "No cumple";
  severity: "Baja" | "Media" | "Alta" | "Crítica";
  score: number;
  finding: string;
  recommendation: string;
  sop: string;
  risk: string;
  capa: string;
};

function evaluateRule(
  condition: boolean,
  partialCondition: boolean,
  rule: Omit<Rule, "status" | "score">
): Rule {
  if (condition) {
    return {
      ...rule,
      status: "Cumple",
      score: 100,
    };
  }

  if (partialCondition) {
    return {
      ...rule,
      status: "Parcial",
      score: 50,
    };
  }

  return {
    ...rule,
    status: "No cumple",
    score: 0,
  };
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
      auditTrail,
      approvedCoas,
      blockedCrops,
      blockedSamples,
      blockedAnalyses,
      openAudits,
    ] = await Promise.all([
      prisma.company.count(),
      prisma.user.count(),
      prisma.farm.count(),
      prisma.genetic.count(),
      prisma.crop.count(),
      prisma.harvest.count(),
      prisma.sample.count(),
      prisma.analysis.count(),
      prisma.cOA.count(),
      prisma.auditTrail.count(),
      prisma.cOA.count({
        where: {
          status: "Aprobado",
        },
      }),
      prisma.crop.count({
        where: {
          status: "Bloqueado",
        },
      }),
      prisma.sample.count({
        where: {
          status: "Bloqueado",
        },
      }),
      prisma.analysis.count({
        where: {
          status: "Bloqueado",
        },
      }),
      prisma.auditTrail.count({
        where: {
          action: {
            contains: "CREADO",
          },
        },
      }),
    ]);

    const rules: Rule[] = [
      evaluateRule(companies > 0, false, {
        code: "ENT-001",
        area: "Empresa",
        requirement: "Debe existir al menos una empresa configurada.",
        severity: "Crítica",
        finding: companies > 0 ? "Empresa principal configurada." : "No existe empresa configurada.",
        recommendation: "Configurar empresa titular, NIT, ciudad, estado, licencias y responsables.",
        sop: "SOP-GEN-001 Configuración y control maestro de empresa.",
        risk: "Operación sin titularidad empresarial clara.",
        capa: "Crear registro maestro de empresa y asignar responsables.",
      }),

      evaluateRule(users >= 3, users > 0, {
        code: "USR-001",
        area: "Usuarios y roles",
        requirement: "Debe existir estructura mínima de usuarios, roles y responsabilidades.",
        severity: "Alta",
        finding: users >= 3 ? "Usuarios mínimos configurados." : "Estructura de usuarios incompleta.",
        recommendation: "Crear usuarios por área: dirección técnica, calidad, operación GACP, laboratorio y administración.",
        sop: "SOP-SIS-001 Gestión de usuarios, roles y permisos.",
        risk: "Falta de segregación de funciones y trazabilidad de responsables.",
        capa: "Completar matriz de usuarios y roles por área crítica.",
      }),

      evaluateRule(farms > 0, false, {
        code: "GACP-001",
        area: "Predios",
        requirement: "Debe existir al menos un predio productivo registrado.",
        severity: "Crítica",
        finding: farms > 0 ? "Predios registrados." : "No existen predios productivos.",
        recommendation: "Registrar predios, áreas, ubicación, estado, empresa titular y capacidad productiva.",
        sop: "SOP-GACP-001 Registro y control de predios productivos.",
        risk: "Producción sin trazabilidad territorial.",
        capa: "Crear predio maestro y asociarlo a empresa activa.",
      }),

      evaluateRule(genetics > 0, false, {
        code: "GACP-002",
        area: "Genéticas",
        requirement: "Debe existir inventario maestro de genéticas autorizadas.",
        severity: "Crítica",
        finding: genetics > 0 ? "Genéticas registradas." : "No existen genéticas registradas.",
        recommendation: "Registrar genética, origen, tipo, estado regulatorio y uso autorizado.",
        sop: "SOP-GACP-002 Control de genética y material vegetal.",
        risk: "Uso de material vegetal sin respaldo documental.",
        capa: "Registrar genética autorizada y soportes regulatorios.",
      }),

      evaluateRule(crops > 0, false, {
        code: "GACP-003",
        area: "Cultivos",
        requirement: "Debe existir trazabilidad de cultivos asociados a predio y genética.",
        severity: "Alta",
        finding: crops > 0 ? "Cultivos registrados." : "No existen cultivos registrados.",
        recommendation: "Crear cultivos con código único, predio, genética, etapa y estado.",
        sop: "SOP-GACP-003 Siembra, manejo y trazabilidad de cultivos.",
        risk: "Pérdida de trazabilidad desde etapa agrícola.",
        capa: "Crear lote de cultivo y asociarlo a predio y genética.",
      }),

      evaluateRule(harvests > 0, crops > 0, {
        code: "GACP-004",
        area: "Cosecha",
        requirement: "Debe existir trazabilidad de cosecha asociada a cultivo.",
        severity: "Alta",
        finding: harvests > 0 ? "Cosechas registradas." : "No existen cosechas registradas.",
        recommendation: "Registrar cosecha, peso húmedo, cultivo origen, estado y responsable.",
        sop: "SOP-GACP-004 Cosecha, pesaje y transferencia.",
        risk: "No se puede reconstruir origen del material cosechado.",
        capa: "Registrar cosecha vinculada al cultivo correspondiente.",
      }),

      evaluateRule(samples > 0, harvests > 0, {
        code: "LAB-001",
        area: "Muestras",
        requirement: "Debe existir cadena de custodia de muestras.",
        severity: "Alta",
        finding: samples > 0 ? "Muestras registradas." : "No existen muestras registradas.",
        recommendation: "Crear muestra con código único, tipo, cosecha origen y estado.",
        sop: "SOP-LAB-001 Toma, recepción y custodia de muestras.",
        risk: "Resultados analíticos sin muestra trazable.",
        capa: "Crear muestra asociada a cosecha y definir responsable de custodia.",
      }),

      evaluateRule(analyses > 0, samples > 0, {
        code: "LAB-002",
        area: "Análisis",
        requirement: "Debe existir análisis asociado a muestra.",
        severity: "Alta",
        finding: analyses > 0 ? "Análisis registrados." : "No existen análisis registrados.",
        recommendation: "Registrar análisis, tipo, resultado, estado y muestra asociada.",
        sop: "SOP-LAB-002 Ejecución y revisión de análisis.",
        risk: "Liberación sin evidencia analítica.",
        capa: "Crear análisis asociado a muestra y definir criterios de aceptación.",
      }),

      evaluateRule(coas > 0, analyses > 0, {
        code: "QA-001",
        area: "COA",
        requirement: "Debe existir COA asociado a análisis.",
        severity: "Crítica",
        finding: coas > 0 ? "COA registrados." : "No existen certificados COA.",
        recommendation: "Crear COA por análisis aprobado, resultado, estado y liberación documental.",
        sop: "SOP-QA-001 Emisión, revisión y aprobación de COA.",
        risk: "Producto sin certificado de análisis.",
        capa: "Crear COA asociado a análisis y aprobar por calidad.",
      }),

      evaluateRule(auditTrail > 0, false, {
        code: "QA-002",
        area: "Auditoría",
        requirement: "Debe existir auditoría persistente de eventos críticos.",
        severity: "Crítica",
        finding: auditTrail > 0 ? "Auditoría activa." : "No existen eventos de auditoría.",
        recommendation: "Auditar creación, edición, eliminación, cambios de estado y liberaciones.",
        sop: "SOP-QA-002 Auditoría de datos y trazabilidad electrónica.",
        risk: "No conformidad por ausencia de audit trail.",
        capa: "Activar auditoría persistente en todos los módulos críticos.",
      }),

      evaluateRule(approvedCoas > 0, coas > 0, {
        code: "QA-003",
        area: "Liberación",
        requirement: "Debe existir al menos un COA aprobado para liberación.",
        severity: "Alta",
        finding: approvedCoas > 0 ? "COA aprobados disponibles." : "No existen COA aprobados.",
        recommendation: "Aprobar COA que cumplan criterios de especificación y liberación.",
        sop: "SOP-QA-003 Liberación de producto con base en COA.",
        risk: "Material no liberado o bloqueado por calidad.",
        capa: "Revisar COA pendientes y aprobar o rechazar según resultado.",
      }),

      evaluateRule(blockedCrops === 0 && blockedSamples === 0 && blockedAnalyses === 0, false, {
        code: "RISK-001",
        area: "Riesgos críticos",
        requirement: "No deben existir registros críticos bloqueados sin CAPA.",
        severity: "Media",
        finding:
          blockedCrops + blockedSamples + blockedAnalyses === 0
            ? "No existen bloqueos críticos."
            : "Existen registros bloqueados que requieren investigación.",
        recommendation: "Investigar registros bloqueados y abrir desviación/CAPA cuando corresponda.",
        sop: "SOP-RISK-001 Gestión de bloqueos, desviaciones y CAPA.",
        risk: "Acumulación de bloqueos sin investigación.",
        capa: "Revisar bloqueos críticos y documentar acciones correctivas.",
      }),

      evaluateRule(openAudits > 0, auditTrail > 0, {
        code: "DATA-001",
        area: "Integridad de datos",
        requirement: "Debe existir evidencia de actividad registrada en base de datos.",
        severity: "Media",
        finding: openAudits > 0 ? "Actividad registrada." : "No hay suficiente actividad trazable.",
        recommendation: "Registrar operaciones reales en módulos críticos para robustecer evidencia.",
        sop: "SOP-DATA-001 Integridad, consistencia y disponibilidad de datos.",
        risk: "Sistema sin evidencia operacional suficiente.",
        capa: "Ejecutar pruebas de flujo completo y documentar resultados.",
      }),
    ];

    const score =
      rules.length > 0
        ? Math.round(rules.reduce((sum, rule) => sum + rule.score, 0) / rules.length)
        : 0;

    const gaps = rules.filter((rule) => rule.status !== "Cumple");
    const critical = gaps.filter((rule) => rule.severity === "Crítica");
    const high = gaps.filter((rule) => rule.severity === "Alta");

    return NextResponse.json({
      ok: true,
      score,
      maturity:
        score >= 90
          ? "Enterprise audit-ready"
          : score >= 70
          ? "MVP regulatorio avanzado"
          : score >= 50
          ? "MVP funcional en consolidación"
          : "Base inicial en construcción",
      totals: {
        companies,
        users,
        farms,
        genetics,
        crops,
        harvests,
        samples,
        analyses,
        coas,
        auditTrail,
        approvedCoas,
        blockedCrops,
        blockedSamples,
        blockedAnalyses,
      },
      summary: {
        totalRules: rules.length,
        fulfilled: rules.filter((rule) => rule.status === "Cumple").length,
        partial: rules.filter((rule) => rule.status === "Parcial").length,
        failed: rules.filter((rule) => rule.status === "No cumple").length,
        critical: critical.length,
        high: high.length,
      },
      rules,
      gaps,
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
