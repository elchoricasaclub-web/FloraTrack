"use client";

import ComplianceAuditShell, { ComplianceAuditItem } from "../ui/ComplianceAuditShell";

const items: ComplianceAuditItem[] = [
  {
    id: "licencia-cannabis",
    title: "Licencia Cannabis Medicinal",
    moduleName: "Plan de Cumplimiento",
    area: "Licencias",
    standard: "Decreto 811 / Resolución 227",
    metric: "78%",
    status: "En revisión",
    risk: "Crítico",
    owner: "Representante legal / Regulatorio",
    dueDate: "2026-07-30",
    evidence: "Licencia, modalidad, cupos, PEAS, anexos",
    documentRef: "EXP-LIC-CAN-001",
    description: "Control de licencias, modalidades autorizadas, requisitos por operación, evidencias, vencimientos y brechas regulatorias.",
    progress: 78,
    actionLabel: "Ver licencia",
    auditTrail: "Pendiente revisión documental",
  },
  {
    id: "gacp",
    title: "Certificación GACP",
    moduleName: "Plan de Cumplimiento",
    area: "Buenas prácticas agrícolas",
    standard: "WHO / EMA GACP",
    metric: "84%",
    status: "Pendiente evidencia",
    risk: "Alto",
    owner: "Responsable GACP",
    dueDate: "2026-08-15",
    evidence: "SOP cultivo, trazabilidad, sanidad, cosecha",
    documentRef: "GACP-MASTER-001",
    description: "Seguimiento de requisitos GACP, evidencia operativa, SOP, registros, responsables y preparación para auditoría.",
    progress: 84,
    actionLabel: "Abrir GACP",
    auditTrail: "Checklist GACP inicial",
  },
  {
    id: "iso17025",
    title: "ISO/IEC 17025 Laboratorio",
    moduleName: "Plan de Cumplimiento",
    area: "Laboratorio QC",
    standard: "ISO/IEC 17025 / ONAC",
    metric: "65%",
    status: "En proceso",
    risk: "Alto",
    owner: "Jefe laboratorio",
    dueDate: "2026-09-30",
    evidence: "Alcance, métodos, incertidumbre, equipos, aptitud",
    documentRef: "ISO17025-SCOPE-001",
    description: "Preparación para competencia técnica de laboratorio, validez de resultados, métodos, calibración e imparcialidad.",
    progress: 65,
    actionLabel: "Ver alcance",
    auditTrail: "Alcance creado",
  },
  {
    id: "iso14644",
    title: "Salas Limpias ISO 14644",
    moduleName: "Plan de Cumplimiento",
    area: "Micropropagación / GMP",
    standard: "ISO 14644",
    metric: "58%",
    status: "Pendiente revisión",
    risk: "Medio",
    owner: "Facility / QA",
    dueDate: "2026-08-25",
    evidence: "Clasificación, monitoreo, limpieza, diferenciales",
    documentRef: "ISO14644-ROOMS-001",
    description: "Control de salas limpias, cabinas, áreas clasificadas, monitoreo ambiental, limpieza y desviaciones.",
    progress: 58,
    actionLabel: "Ver salas",
    auditTrail: "Pendiente clasificación formal",
  }
];

export default function PlanCumplimientoModule() {
  return (
    <ComplianceAuditShell
      eyebrow="FloraTrack RegTech"
      title="Plan de Cumplimiento"
      description="Gestión audit-ready de licencias, certificaciones, estándares, requisitos, evidencias, vencimientos, responsables y brechas regulatorias."
      createLabel="+ Nuevo Requisito"
      items={items}
    />
  );
}
