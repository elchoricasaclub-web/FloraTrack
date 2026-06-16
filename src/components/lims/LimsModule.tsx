"use client";

import StrategicProcessShell, { StrategicProcessItem } from "../ui/StrategicProcessShell";

const items: StrategicProcessItem[] = [
  {
    id: "muestras",
    title: "Recepción de Muestras",
    moduleName: "LIMS",
    phase: "Sample login",
    metric: "26 muestras",
    status: "Activo",
    risk: "Medio",
    owner: "Recepción laboratorio",
    evidence: "Código muestra, cadena custodia, matriz",
    description: "Ingreso controlado de muestras con identificación, matriz, cliente, lote, cadena de custodia, prioridad y condiciones de recepción.",
    progress: 84,
    actionLabel: "Abrir muestras",
    flow: ["Recepción", "Codificación", "Custodia", "Asignación"],
    kpis: ["Muestras", "Custodia", "Prioridad", "Matriz"],
  },
  {
    id: "analisis",
    title: "Análisis Cannabinoides / Terpenos",
    moduleName: "LIMS",
    phase: "Análisis QC",
    metric: "HPLC / GC",
    status: "En proceso",
    risk: "Alto",
    owner: "Analista QC",
    evidence: "Método, corrida, equipo, resultado",
    description: "Gestión de análisis de potencia, cannabinoides, terpenos, métodos, equipos, resultados, revisión técnica y liberación.",
    progress: 69,
    actionLabel: "Ver análisis",
    flow: ["Preparación", "Equipo", "Corrida", "Resultado"],
    kpis: ["Método", "Equipo", "Resultado", "Revisión"],
  },
  {
    id: "coa",
    title: "Certificado de Análisis COA",
    moduleName: "LIMS",
    phase: "Liberación QA",
    metric: "8 COA",
    status: "Pendiente revisión",
    risk: "Alto",
    owner: "QA Laboratorio",
    evidence: "Resultado, revisión, aprobación, firma",
    description: "Generación y revisión de COA con resultados, especificaciones, aprobación QA, firma y trazabilidad al lote.",
    progress: 63,
    actionLabel: "Abrir COA",
    flow: ["Resultado", "Revisión", "Aprobación", "Emisión"],
    kpis: ["COA emitidos", "Pendientes", "QA", "Firma"],
  },
  {
    id: "equipos",
    title: "Equipos y Calibración",
    moduleName: "LIMS",
    phase: "Equipment management",
    metric: "2 vencen",
    status: "Alerta",
    risk: "Alto",
    owner: "Metrología / QA",
    evidence: "Calibración, mantenimiento, aptitud",
    description: "Control de equipos de laboratorio, calibraciones, mantenimientos, aptitud, desviaciones y bloqueo por vencimiento.",
    progress: 52,
    actionLabel: "Ver equipos",
    flow: ["Inventario", "Calibración", "Mantenimiento", "Aptitud"],
    kpis: ["Equipos", "Calibración", "Mantenimiento", "Bloqueo"],
  }
];

export function LimsEnterpriseModule() {
  return (
    <StrategicProcessShell
      eyebrow="FloraTrack Laboratory / QC"
      title="LIMS Enterprise"
      description="Sistema moderno para laboratorio QC: muestras, análisis, COA, equipos, calibraciones, cadena de custodia, métodos y liberación QA."
      createLabel="+ Nueva Muestra"
      items={items}
    />
  );
}

export const LimsModule = LimsEnterpriseModule;
export const LIMSModule = LimsEnterpriseModule;
export const LimsLabModule = LimsEnterpriseModule;

export default LimsEnterpriseModule;
