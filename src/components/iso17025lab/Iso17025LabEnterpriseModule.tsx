"use client";

import StrategicProcessShell, { StrategicProcessItem } from "../ui/StrategicProcessShell";

const items: StrategicProcessItem[] = [
  {
    id: "alcance",
    title: "Alcance de Acreditación",
    moduleName: "ISO 17025",
    phase: "Alcance técnico",
    metric: "4 métodos",
    status: "En proceso",
    risk: "Alto",
    owner: "Dirección laboratorio",
    evidence: "Métodos, matrices, analitos, rango",
    description: "Definición del alcance ISO/IEC 17025 con métodos, matrices, analitos, rangos, incertidumbre y competencia técnica.",
    progress: 66,
    actionLabel: "Ver alcance",
    flow: ["Métodos", "Matrices", "Validación", "Solicitud"],
    kpis: ["Métodos", "Matrices", "Analitos", "ONAC"],
  },
  {
    id: "metodos",
    title: "Validación de Métodos",
    moduleName: "ISO 17025",
    phase: "Métodos analíticos",
    metric: "2/4 validados",
    status: "Pendiente revisión",
    risk: "Alto",
    owner: "Líder técnico",
    evidence: "Linealidad, precisión, exactitud, LOQ, LOD",
    description: "Validación de métodos analíticos con parámetros de desempeño, registros, cálculos, revisión técnica e informe.",
    progress: 58,
    actionLabel: "Ver métodos",
    flow: ["Protocolo", "Ejecución", "Cálculo", "Informe"],
    kpis: ["Linealidad", "Precisión", "Exactitud", "Incertidumbre"],
  },
  {
    id: "imparcialidad",
    title: "Imparcialidad y Confidencialidad",
    moduleName: "ISO 17025",
    phase: "Sistema de gestión",
    metric: "Política activa",
    status: "Activo",
    risk: "Medio",
    owner: "Calidad laboratorio",
    evidence: "Política, conflictos, confidencialidad",
    description: "Control de imparcialidad, independencia, confidencialidad, conflictos de interés y responsabilidades del laboratorio.",
    progress: 86,
    actionLabel: "Ver política",
    flow: ["Política", "Conflictos", "Evaluación", "Revisión"],
    kpis: ["Imparcialidad", "Conflictos", "Confidencialidad", "QA"],
  },
  {
    id: "aptitud",
    title: "Ensayos de Aptitud",
    moduleName: "ISO 17025",
    phase: "Competencia técnica",
    metric: "1 pendiente",
    status: "Monitoreo",
    risk: "Medio",
    owner: "Líder técnico / QA",
    evidence: "PT, interlaboratorio, desempeño, acciones",
    description: "Seguimiento de ensayos de aptitud, comparaciones interlaboratorio, desempeño técnico y acciones cuando aplique.",
    progress: 72,
    actionLabel: "Ver aptitud",
    flow: ["Programa", "Participación", "Resultado", "Acción"],
    kpis: ["PT", "Z-score", "Acciones", "Tendencia"],
  }
];

export function Iso17025LabEnterpriseModule() {
  return (
    <StrategicProcessShell
      eyebrow="FloraTrack ISO / Laboratory Quality"
      title="ISO/IEC 17025 Lab Enterprise"
      description="Gestión moderna de competencia técnica de laboratorio: alcance, métodos, incertidumbre, imparcialidad, equipos, aptitud y evidencias para acreditación."
      createLabel="+ Nuevo Requisito ISO"
      items={items}
    />
  );
}

export const Iso17025LabModule = Iso17025LabEnterpriseModule;
export const ISO17025LabModule = Iso17025LabEnterpriseModule;
export const ISO17025Module = Iso17025LabEnterpriseModule;
export const ISO17025EnterpriseModule = Iso17025LabEnterpriseModule;

export default Iso17025LabEnterpriseModule;
