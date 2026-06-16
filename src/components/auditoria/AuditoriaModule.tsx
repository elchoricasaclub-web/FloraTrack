"use client";

import ComplianceAuditShell, { ComplianceAuditItem } from "../ui/ComplianceAuditShell";

const items: ComplianceAuditItem[] = [
  {
    id: "audit-gacp",
    title: "Auditoría Interna GACP",
    moduleName: "Auditorías",
    area: "GACP",
    standard: "WHO / EMA GACP",
    metric: "34/52",
    status: "En proceso",
    risk: "Alto",
    owner: "Auditor interno",
    dueDate: "2026-07-31",
    evidence: "Checklist, hallazgos, evidencias, CAPA",
    documentRef: "AUD-GACP-001",
    description: "Auditoría interna GACP con checklist, evidencias, hallazgos, clasificación y acciones correctivas.",
    progress: 65,
    actionLabel: "Abrir auditoría",
    auditTrail: "Ejecución en proceso",
  },
  {
    id: "audit-proveedor",
    title: "Auditoría Proveedor Crítico",
    moduleName: "Auditorías",
    area: "Supplier QA",
    standard: "GMP / ISO 9001",
    metric: "SUP-AUD-001",
    status: "Programado",
    risk: "Medio",
    owner: "Compras / QA",
    dueDate: "2026-08-12",
    evidence: "Cuestionario, evaluación, aprobación proveedor",
    documentRef: "SUP-AUD-001",
    description: "Auditoría de proveedor crítico con calificación, riesgo, materiales aprobados y seguimiento.",
    progress: 45,
    actionLabel: "Ver proveedor",
    auditTrail: "Programación inicial",
  },
  {
    id: "audit-readiness",
    title: "Readiness Auditoría Externa",
    moduleName: "Auditorías",
    area: "Audit readiness",
    standard: "GACP / GMP / ISO",
    metric: "82%",
    status: "Pendiente evidencia",
    risk: "Alto",
    owner: "Dirección QA",
    dueDate: "2026-09-01",
    evidence: "Expediente maestro, SOP, registros, CAPA cerradas",
    documentRef: "AUD-READY-001",
    description: "Preparación para auditoría externa consolidando evidencia, brechas, documentos, CAPA y responsables.",
    progress: 82,
    actionLabel: "Ver readiness",
    auditTrail: "Brechas abiertas",
  }
];

export default function AuditoriaModule() {
  return (
    <ComplianceAuditShell
      eyebrow="FloraTrack Audit"
      title="Auditoría"
      description="Auditorías internas, externas y de proveedores con checklist, evidencia, hallazgos, CAPA, responsable y audit trail."
      createLabel="+ Nueva Auditoría"
      items={items}
    />
  );
}
