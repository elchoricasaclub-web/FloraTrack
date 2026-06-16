"use client";

import ComplianceAuditShell, { ComplianceAuditItem } from "../ui/ComplianceAuditShell";

const items: ComplianceAuditItem[] = [
  {
    id: "capa-critica",
    title: "CAPA Crítica Abierta",
    moduleName: "CAPA",
    area: "QMS",
    standard: "GMP / QMS",
    metric: "CAPA-001",
    status: "Abierto",
    risk: "Crítico",
    owner: "QA Manager",
    dueDate: "2026-07-20",
    evidence: "Causa raíz, plan de acción, verificación de eficacia",
    documentRef: "CAPA-001",
    description: "Gestión de acción correctiva/preventiva con causa raíz, responsable, fecha objetivo, evidencia y evaluación de eficacia.",
    progress: 42,
    actionLabel: "Abrir CAPA",
    auditTrail: "Creada por desviación",
  },
  {
    id: "noconformidad",
    title: "No Conformidad Mayor",
    moduleName: "CAPA",
    area: "Calidad",
    standard: "GACP / GMP",
    metric: "NC-002",
    status: "Pendiente revisión",
    risk: "Alto",
    owner: "QA / Responsable proceso",
    dueDate: "2026-07-28",
    evidence: "Hallazgo, contención, investigación",
    documentRef: "NC-002",
    description: "Control de no conformidades mayores desde detección, contención, investigación, CAPA y cierre QA.",
    progress: 55,
    actionLabel: "Investigar",
    auditTrail: "Pendiente asignación final",
  },
  {
    id: "eficacia",
    title: "Verificación de Eficacia",
    moduleName: "CAPA",
    area: "Cierre QA",
    standard: "QMS",
    metric: "EF-001",
    status: "Programado",
    risk: "Medio",
    owner: "QA Manager",
    dueDate: "2026-08-05",
    evidence: "Prueba de eficacia, tendencia, revisión QA",
    documentRef: "EFF-CAPA-001",
    description: "Verificación de que la acción correctiva fue efectiva y no generó recurrencia del hallazgo.",
    progress: 68,
    actionLabel: "Ver eficacia",
    auditTrail: "Seguimiento programado",
  }
];

export default function CAPAModule() {
  return (
    <ComplianceAuditShell
      eyebrow="FloraTrack QMS"
      title="CAPA"
      description="Gestión audit-ready de acciones correctivas y preventivas, causa raíz, responsables, eficacia, evidencias y cierre QA."
      createLabel="+ Nueva CAPA"
      items={items}
    />
  );
}
