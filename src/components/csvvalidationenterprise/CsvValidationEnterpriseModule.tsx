"use client";

import ComplianceAuditShell, { ComplianceAuditItem } from "../ui/ComplianceAuditShell";

const items: ComplianceAuditItem[] = [
  {
    id: "urs",
    title: "URS Aprobado Pendiente",
    moduleName: "Validación CSV",
    area: "Computer System Validation",
    standard: "GAMP 5 / Data Integrity",
    metric: "URS-001",
    status: "Pendiente revisión",
    risk: "Crítico",
    owner: "QA / CSV Lead",
    dueDate: "2026-07-25",
    evidence: "Requerimientos usuario, aprobación QA, trazabilidad",
    documentRef: "CSV-URS-001",
    description: "Control de requerimientos de usuario para validar FloraTrack como sistema computarizado regulado.",
    progress: 55,
    actionLabel: "Abrir URS",
    auditTrail: "Borrador generado",
  },
  {
    id: "oq",
    title: "Prueba OQ Pendiente",
    moduleName: "Validación CSV",
    area: "Pruebas",
    standard: "CSV / GxP",
    metric: "OQ-001",
    status: "Programado",
    risk: "Alto",
    owner: "QA / IT",
    dueDate: "2026-08-05",
    evidence: "Evidencia de ejecución, resultado, desviaciones",
    documentRef: "CSV-OQ-001",
    description: "Prueba operacional para demostrar que los módulos críticos funcionan bajo condiciones definidas.",
    progress: 40,
    actionLabel: "Ejecutar OQ",
    auditTrail: "Pendiente ejecución",
  },
  {
    id: "rtm",
    title: "Matriz de Trazabilidad RTM",
    moduleName: "Validación CSV",
    area: "Trazabilidad",
    standard: "GAMP 5",
    metric: "RTM-001",
    status: "En proceso",
    risk: "Alto",
    owner: "CSV Lead",
    dueDate: "2026-08-10",
    evidence: "URS → Función → Prueba → Evidencia",
    documentRef: "CSV-RTM-001",
    description: "Matriz de trazabilidad que conecta requisitos, funciones, pruebas, evidencias y desviaciones.",
    progress: 64,
    actionLabel: "Ver RTM",
    auditTrail: "En construcción",
  }
];

export default function CsvValidationEnterpriseModule() {
  return (
    <ComplianceAuditShell
      eyebrow="FloraTrack CSV"
      title="Validación CSV Enterprise"
      description="Validación de sistema computarizado con URS, FRS, RTM, IQ/OQ/PQ, evidencia, desviaciones y reporte final."
      createLabel="+ Nueva Prueba CSV"
      items={items}
    />
  );
}
