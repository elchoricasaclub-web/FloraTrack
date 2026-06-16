"use client";

import OperationalModuleShell, { OperationalModuleItem } from "../ui/OperationalModuleShell";

const items: OperationalModuleItem[] = [
  {
    id: "programacion",
    title: "Cosecha Programada",
    moduleName: "Cosecha",
    area: "Planificación",
    metric: "15 días",
    status: "Pendiente revisión",
    priority: "Alta",
    owner: "Producción / QA",
    evidence: "Plan de cosecha / criterios de madurez",
    description: "Programación de cosecha por genética, cultivo, predio, madurez, disponibilidad de personal, sala de poscosecha y trazabilidad.",
    progress: 62,
    actionLabel: "Planear cosecha",
    flow: ["Madurez", "Programación", "Cuadrilla", "Corte"],
  },
  {
    id: "inspeccion",
    title: "Inspección Pre-Cosecha",
    moduleName: "Cosecha",
    area: "Calidad GACP",
    metric: "QA-PRE-001",
    status: "En proceso",
    priority: "Crítica",
    owner: "QA / Responsable GACP",
    evidence: "Checklist pre-cosecha / sanidad / residuos",
    description: "Verificación previa de sanidad, plagas, humedad, madurez, criterios GACP, registros, autorizaciones y desviaciones abiertas.",
    progress: 70,
    actionLabel: "Abrir checklist",
    flow: ["Sanidad", "Madurez", "Registros", "Aprobación"],
  },
  {
    id: "corte",
    title: "Corte y Recolección",
    moduleName: "Cosecha",
    area: "Operación",
    metric: "Lote HARV-001",
    status: "Activo",
    priority: "Alta",
    owner: "Jefe de cosecha",
    evidence: "Registro de corte / lote / cuadrilla",
    description: "Registro operativo de corte, fecha, hora, cuadrilla, lote, condiciones ambientales, peso fresco y traslado a poscosecha.",
    progress: 78,
    actionLabel: "Ver corte",
    flow: ["Corte", "Pesaje", "Transporte", "Recepción"],
  },
];

export default function CosechaModule() {
  return (
    <OperationalModuleShell
      eyebrow="FloraTrack GACP / Producción"
      title="Cosecha"
      description="Gestión moderna de cosecha: programación, inspección pre-cosecha, corte, cuadrilla, pesaje, trazabilidad y rendimiento."
      createLabel="+ Nueva Cosecha"
      items={items}
    />
  );
}
