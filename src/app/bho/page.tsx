"use client";

import ExtractionPremiumModule, { type ExtractionModuleConfig } from "../../components/extraccion/ExtractionPremiumModule";

const config: ExtractionModuleConfig = {
  moduleTitle: "Extracción BHO",
  moduleSubtitle: "Closed-loop, solvente, purge y liberación QA",
  moduleDescription:
    "Módulo de trazabilidad para extracción BHO bajo enfoque GMP: lote de origen, solvente o mezcla hidrocarburos documentada, sistema cerrado, limpieza, seguridad operacional, cuarentena, evidencia, desviaciones, CAPA y decisión QA.",
  storageKey: "floratrack_extraccion_bho_v1",
  accent: "from-orange-600 to-amber-400",
  processType: "bho",
  tag: "BHO",
  mediumLabel: "Solvente / mezcla hidrocarburos *",
  criticalInputLabel: "Lote de solvente o insumo crítico *",
  techniqueOptions: [
    "BHO closed-loop",
    "BHO/PHO closed-loop",
    "Crude extract BHO",
    "Sauce / diamonds controlado",
    "Winterización posterior",
    "Otro proceso BHO documentado",
  ],
  materialOptions: [
    "Flor seca",
    "Fresh frozen",
    "Trim seleccionado",
    "Biomasa congelada",
    "Material de reproceso aprobado QA",
  ],
  stageOptions: [
    "Recepción de material",
    "Carga de equipo cerrado",
    "Extracción documentada",
    "Recuperación de solvente",
    "Purge documentado",
    "Cuarentena QA",
    "Muestreo QC",
    "Liberación QA",
  ],
  defaultCriticalControl:
    "Sistema cerrado documentado, ventilación verificada, control de solvente, limpieza aprobada, recuperación/purge documentados, cuarentena QA y evidencia completa.",
};

export default function BhoPage() {
  return <ExtractionPremiumModule config={config} />;
}
