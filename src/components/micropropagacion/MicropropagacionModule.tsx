"use client";

import StrategicProcessShell, { StrategicProcessItem } from "../ui/StrategicProcessShell";

const items: StrategicProcessItem[] = [
  {
    id: "explantes",
    title: "Ingreso de Explantes",
    moduleName: "Micropropagación",
    phase: "Introducción in vitro",
    metric: "120 explantes",
    status: "Activo",
    risk: "Alto",
    owner: "Jefe laboratorio",
    evidence: "Origen vegetal / desinfección / lote in vitro",
    description: "Registro de explantes, origen genético, procedimiento de desinfección, lote, operador, fecha, medio de cultivo y trazabilidad.",
    progress: 76,
    actionLabel: "Abrir explantes",
    flow: ["Selección", "Desinfección", "Siembra", "Observación"],
    kpis: ["Explantes", "Contaminación", "Medio", "Operador"],
  },
  {
    id: "multiplicacion",
    title: "Multiplicación In Vitro",
    moduleName: "Micropropagación",
    phase: "Multiplicación",
    metric: "4.8x factor",
    status: "En proceso",
    risk: "Medio",
    owner: "Biotecnología vegetal",
    evidence: "Subcultivos, medio, reguladores, lote",
    description: "Control de multiplicación, subcultivos, factor de propagación, medio, reguladores de crecimiento, vigor y desviaciones.",
    progress: 70,
    actionLabel: "Ver multiplicación",
    flow: ["Subcultivo", "Crecimiento", "Evaluación", "Transferencia"],
    kpis: ["Factor", "Subcultivo", "Vigor", "Pérdidas"],
  },
  {
    id: "contaminacion",
    title: "Control de Contaminación",
    moduleName: "Micropropagación",
    phase: "QA microbiológico",
    metric: "3.2%",
    status: "Monitoreo",
    risk: "Alto",
    owner: "QA / Microbiología",
    evidence: "Placas, observación, cuarentena, descarte",
    description: "Seguimiento de contaminación fúngica o bacteriana, cuarentena, descarte, análisis de causa y acciones correctivas.",
    progress: 58,
    actionLabel: "Ver contaminación",
    flow: ["Detección", "Cuarentena", "Investigación", "CAPA"],
    kpis: ["Tasa contaminación", "Cuarentena", "CAPA", "Descarte"],
  },
  {
    id: "aclimatacion",
    title: "Aclimatación Ex Vitro",
    moduleName: "Micropropagación",
    phase: "Salida a vivero",
    metric: "88% supervivencia",
    status: "Pendiente revisión",
    risk: "Medio",
    owner: "Propagación / QA",
    evidence: "Lote, humedad, sustrato, supervivencia",
    description: "Control de salida de plantas in vitro a condiciones ex vitro, supervivencia, humedad, sustrato, sanidad y trazabilidad.",
    progress: 64,
    actionLabel: "Abrir aclimatación",
    flow: ["Salida", "Humedad", "Adaptación", "Liberación"],
    kpis: ["Supervivencia", "Humedad", "Lote", "Liberación"],
  }
];

export function MicropropagationEnterpriseModule() {
  return (
    <StrategicProcessShell
      eyebrow="FloraTrack Biotech / Clean Lab"
      title="Micropropagación Enterprise"
      description="Gestión moderna de laboratorio vegetal: explantes, multiplicación, contaminación, subcultivos, aclimatación, salas limpias, QA y trazabilidad."
      createLabel="+ Nuevo Lote In Vitro"
      items={items}
    />
  );
}

export const MicropropagationModule = MicropropagationEnterpriseModule;
export const MicropropagacionModule = MicropropagationEnterpriseModule;
export const MicropropagacionEnterpriseModule = MicropropagationEnterpriseModule;

export default MicropropagationEnterpriseModule;
