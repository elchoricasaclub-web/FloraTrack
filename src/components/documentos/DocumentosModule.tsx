"use client";

import ComplianceAuditShell, { ComplianceAuditItem } from "../ui/ComplianceAuditShell";

const items: ComplianceAuditItem[] = [
  {
    id: "sop-aprobacion",
    title: "SOP Pendiente de Aprobación",
    moduleName: "Documentos",
    area: "Gestión documental",
    standard: "GMP / Data Integrity",
    metric: "SOP-QA-001",
    status: "Pendiente revisión",
    risk: "Medio",
    owner: "QA Documental",
    dueDate: "2026-07-18",
    evidence: "Versión, aprobador, historial, vigencia",
    documentRef: "SOP-QA-001 v1.0",
    description: "Control de SOP con versión, revisión, aprobación, vigencia, capacitación relacionada y audit trail.",
    progress: 50,
    actionLabel: "Revisar SOP",
    auditTrail: "Borrador creado",
  },
  {
    id: "expediente",
    title: "Expediente Maestro Regulatorio",
    moduleName: "Documentos",
    area: "Dossier",
    standard: "Regulatorio Colombia / Internacional",
    metric: "DOS-001",
    status: "En proceso",
    risk: "Alto",
    owner: "Regulatorio",
    dueDate: "2026-08-30",
    evidence: "Anexos, licencias, SOP, COA, organigrama",
    documentRef: "DOS-MASTER-001",
    description: "Construcción y control del expediente maestro con documentos, anexos, evidencias y exportación.",
    progress: 72,
    actionLabel: "Abrir expediente",
    auditTrail: "Generador documental",
  },
  {
    id: "registro-maestro",
    title: "Registro Maestro Operativo",
    moduleName: "Documentos",
    area: "Registros",
    standard: "GACP / GMP",
    metric: "REG-001",
    status: "Vigente",
    risk: "Bajo",
    owner: "QA / Operaciones",
    dueDate: "2026-12-31",
    evidence: "Registro controlado, versión, responsable",
    documentRef: "REG-MASTER-001",
    description: "Control de registros operativos, formatos, versiones, uso, almacenamiento y retención documental.",
    progress: 90,
    actionLabel: "Ver registro",
    auditTrail: "Aprobado",
  }
];

export default function DocumentosModule() {
  return (
    <ComplianceAuditShell
      eyebrow="FloraTrack Document Control"
      title="Documentos y SOP"
      description="Control documental audit-ready para SOP, registros, versiones, aprobaciones, expedientes, vigencias y trazabilidad."
      createLabel="+ Nuevo Documento"
      items={items}
    />
  );
}
