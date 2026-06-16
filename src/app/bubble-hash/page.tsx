"use client";

import ExtractionPremiumModule, { type ExtractionModuleConfig } from "../../components/extraccion/ExtractionPremiumModule";

const config: ExtractionModuleConfig = {
  moduleTitle: "Bubble Hash",
  moduleSubtitle: "Ice water hash, micronaje y trazabilidad solventless",
  moduleDescription:
    "Módulo de trazabilidad para Bubble Hash: lote de material, agua/hielo o consumibles críticos, bolsas micron, secado, limpieza, estado sanitario, evidencia, cuarentena, liberación QA, desviaciones y CAPA.",
  storageKey: "floratrack_bubble_hash_v1",
  accent: "from-cyan-600 to-sky-400",
  processType: "bubble-hash",
  tag: "Hash",
  mediumLabel: "Medio de proceso / agua-hielo documentado *",
  criticalInputLabel: "Lote de consumible crítico / bolsas micron *",
  techniqueOptions: [
    "Ice water hash",
    "WPFF bubble hash",
    "Full spectrum bubble hash",
    "Micron select",
    "Hash para Live Rosin",
    "Otro proceso solventless documentado",
  ],
  materialOptions: [
    "Fresh frozen",
    "Flor congelada",
    "Trim congelado",
    "Material seleccionado QA",
    "Material de reproceso aprobado QA",
  ],
  stageOptions: [
    "Recepción de material",
    "Lavado documentado",
    "Separación por micronaje",
    "Drenaje",
    "Secado documentado",
    "Cuarentena QA",
    "Muestreo QC",
    "Liberación QA",
  ],
  defaultCriticalControl:
    "Proceso solventless documentado, control de micronaje, agua/hielo o consumibles críticos trazables, limpieza aprobada, secado documentado, cuarentena QA y evidencia completa.",
};

export default function BubbleHashPage() {
  return <ExtractionPremiumModule config={config} />;
}
