"use client";

import ExecutivePremiumShell, { ExecutivePremiumItem } from "../ui/ExecutivePremiumShell";

const items: ExecutivePremiumItem[] = [
  {
    id: "global-compliance",
    title: "Score Global de Cumplimiento",
    moduleName: "Dashboard",
    category: "Compliance",
    score: 92,
    metric: "Audit-ready avanzado",
    trend: "+8% este ciclo",
    status: "Operativo",
    risk: "Medio",
    owner: "Dirección / QA",
    insight: "La plataforma consolida GACP, GMP, QMS, LIMS, CSV, IA y SaaS.",
    description: "Vista ejecutiva del estado general de cumplimiento, riesgos críticos, evidencias, auditorías, validación CSV y preparación regulatoria.",
    actionLabel: "Abrir detalle",
    metrics: ["GACP 84%", "CSV 65%", "QMS 78%", "LIMS 72%"],
  },
  {
    id: "audit-readiness",
    title: "Audit Readiness Enterprise",
    moduleName: "Dashboard",
    category: "Auditoría",
    score: 84,
    metric: "Listo con brechas",
    trend: "+5% por CAPA cerradas",
    status: "En monitoreo",
    risk: "Alto",
    owner: "QA Manager",
    insight: "La evidencia crítica está parcialmente consolidada.",
    description: "Indicador ejecutivo de preparación para auditorías GACP, GMP, ISO 17025, proveedor, CSV y regulatorias.",
    actionLabel: "Ver readiness",
    metrics: ["Evidencias 71%", "CAPA 58%", "SOP 80%", "Auditorías 65%"],
  },
  {
    id: "operations-health",
    title: "Salud Operativa",
    moduleName: "Dashboard",
    category: "Operaciones",
    score: 88,
    metric: "Producción estable",
    trend: "+4% productividad",
    status: "Estable",
    risk: "Medio",
    owner: "Operaciones",
    insight: "Propagación, cultivos, genéticas y cosecha están bajo control.",
    description: "Resumen de módulos operativos: propagación, cultivos, genéticas, cosecha, Live Rosin, micropropagación y producción.",
    actionLabel: "Ver operaciones",
    metrics: ["Cultivos 82%", "Propagación 88%", "Genéticas 91%", "Cosecha 78%"],
  },
  {
    id: "executive-risk",
    title: "Riesgo Ejecutivo",
    moduleName: "Dashboard",
    category: "Riesgos",
    score: 69,
    metric: "Riesgo moderado",
    trend: "-2 brechas cerradas",
    status: "Pendiente revisión",
    risk: "Alto",
    owner: "Dirección",
    insight: "Los riesgos abiertos se concentran en CSV, licencias y evidencias.",
    description: "Mapa ejecutivo de riesgos por incumplimiento, vencimientos, CAPA abiertas, auditorías, CSV e integridad de datos.",
    actionLabel: "Ver riesgos",
    metrics: ["CAPA 3", "Brechas 5", "CSV 2", "Licencias 1"],
  }
];

export default function DashboardModule() {
  return (
    <ExecutivePremiumShell
      eyebrow="FloraTrack Executive"
      title="Dashboard Ejecutivo"
      description="Vista premium del desempeño general de FloraTrack: cumplimiento, operaciones, auditoría, QMS, CSV, SaaS e inteligencia regulatoria."
      primaryAction="Actualizar Dashboard"
      items={items}
    />
  );
}
