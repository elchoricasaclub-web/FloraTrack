"use client";

import ExtractionPremiumModule, { type ExtractionModuleConfig } from "../../components/extraccion/ExtractionPremiumModule";

const config: ExtractionModuleConfig = {
  moduleTitle: "Live Rosin",
  moduleSubtitle: "Solventless premium, fresh frozen, press y QA",
  moduleDescription:
    "Módulo de trazabilidad para Live Rosin solventless: lote fresh frozen o bubble hash, micronaje, consumibles críticos, limpieza, parámetros documentados, evidencia, cuarentena, liberación QA, desviaciones y CAPA.",
  storageKey: "floratrack_live_rosin_v1",
  accent: "from-lime-600 to-emerald-400",
  processType: "live-rosin",
  tag: "Rosin",
  mediumLabel: "Medio de proceso / consumible crítico *",
  criticalInputLabel: "Lote de consumible crítico *",
  techniqueOptions: [
    "Live Rosin cold cure",
    "Live Rosin heat cure",
    "Fresh press",
    "Jar tech documentado",
    "Rosin jam documentado",
    "Otro proceso solventless documentado",
  ],
  materialOptions: [
    "Fresh frozen",
    "Bubble hash 45u",
    "Bubble hash 73u",
    "Bubble hash 90u",
    "Bubble hash 120u",
    "Full spectrum solventless",
  ],
  stageOptions: [
    "Recepción fresh frozen",
    "Bubble hash previo",
    "Secado documentado",
    "Prensado documentado",
    "Cuarentena QA",
    "Curado controlado",
    "Muestreo QC",
    "Liberación QA",
  ],
  defaultCriticalControl:
    "Proceso solventless documentado, trazabilidad de micronaje, limpieza aprobada, control de temperatura/tiempo como registro QA, cuarentena y evidencia completa.",
};

export default function LiveRosinPage() {
  return <ExtractionPremiumModule config={config} />;
}
