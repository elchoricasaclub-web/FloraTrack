"use client";

import StrategicProcessShell, { StrategicProcessItem } from "../ui/StrategicProcessShell";

const items: StrategicProcessItem[] = [
  {
    id: "biomasa",
    title: "Recepción de Biomasa",
    moduleName: "Live Rosin",
    phase: "Materia prima",
    metric: "42 kg flor fresca",
    status: "Activo",
    risk: "Medio",
    owner: "Producción / QA",
    evidence: "Lote biomasa / origen / COA / humedad",
    description: "Control de ingreso de flor o biomasa para proceso solventless con trazabilidad desde cultivo, cosecha, lote, peso, humedad y liberación QA.",
    progress: 82,
    actionLabel: "Abrir biomasa",
    flow: ["Origen", "Pesaje", "Inspección QA", "Liberación"],
    kpis: ["Peso fresco", "Humedad", "Lote origen", "Estado QA"],
  },
  {
    id: "bubblehash",
    title: "Extracción Bubble Hash",
    moduleName: "Live Rosin",
    phase: "Lavado con hielo y agua",
    metric: "18% retorno",
    status: "En proceso",
    risk: "Alto",
    owner: "Jefe extracción",
    evidence: "Mallas, temperatura, agua, lote hash",
    description: "Seguimiento de lavado con hielo y agua, mallas, temperatura, tiempos, rendimiento, contaminación física y trazabilidad del hash.",
    progress: 68,
    actionLabel: "Ver extracción",
    flow: ["Preparación", "Lavado", "Filtrado", "Recolección"],
    kpis: ["Temperatura agua", "Micras", "Rendimiento", "Tiempo lavado"],
  },
  {
    id: "liofilizacion",
    title: "Liofilización de Hash",
    moduleName: "Live Rosin",
    phase: "Secado controlado",
    metric: "36 h ciclo",
    status: "Monitoreo",
    risk: "Medio",
    owner: "Operador liofilizadora",
    evidence: "Ciclo, presión, temperatura, humedad residual",
    description: "Control de liofilización del bubble hash con parámetros de ciclo, bandejas, humedad residual, limpieza y liberación para prensado.",
    progress: 74,
    actionLabel: "Ver ciclo",
    flow: ["Carga", "Congelación", "Vacío", "Descarga"],
    kpis: ["Duración", "Vacío", "Temperatura", "Humedad residual"],
  },
  {
    id: "prensado",
    title: "Prensado Live Rosin",
    moduleName: "Live Rosin",
    phase: "Prensa solventless",
    metric: "5.2 kg rosin",
    status: "Pendiente revisión",
    risk: "Alto",
    owner: "Master Extractor / QA",
    evidence: "Temperatura, presión, micras, rendimiento, lote final",
    description: "Registro de prensado solventless con temperatura, presión, malla, tiempo, rendimiento, calidad visual, lote final y decisión QA.",
    progress: 61,
    actionLabel: "Abrir prensado",
    flow: ["Preparación", "Prensado", "Recolección", "QA"],
    kpis: ["Temperatura prensa", "Presión", "Yield", "COA pendiente"],
  }
];

export function LiveRosinEnterpriseModule() {
  return (
    <StrategicProcessShell
      eyebrow="FloraTrack Solventless / GMP"
      title="Live Rosin Enterprise"
      description="Gestión moderna del proceso solventless: biomasa, bubble hash, liofilización, prensado, rendimiento, COA, trazabilidad y liberación QA."
      createLabel="+ Nuevo Lote Live Rosin"
      items={items}
    />
  );
}

export const LiveRosinModule = LiveRosinEnterpriseModule;
export const LiveRosinSolventlessEnterpriseModule = LiveRosinEnterpriseModule;

export default LiveRosinEnterpriseModule;
