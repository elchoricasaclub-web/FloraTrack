"use client";

import ExecutivePremiumShell, { ExecutivePremiumItem } from "../ui/ExecutivePremiumShell";

const items: ExecutivePremiumItem[] = [
  {
    id: "command-signal",
    title: "Señal Ejecutiva Principal",
    moduleName: "Command Center",
    category: "Comando",
    score: 91,
    metric: "Control central",
    trend: "Operación consolidada",
    status: "Operativo",
    risk: "Medio",
    owner: "Dirección",
    insight: "Integra decisiones, alertas, recomendaciones y score global.",
    description: "Centro ejecutivo para visualizar señales críticas, actividad reciente, alertas, KPIs y recomendaciones de gestión.",
    actionLabel: "Abrir comando",
    metrics: ["Alertas 7", "CAPA 3", "Evidencias 18", "Tareas 11"],
  },
  {
    id: "critical-alerts",
    title: "Alertas Críticas",
    moduleName: "Command Center",
    category: "Alertas",
    score: 73,
    metric: "7 alertas",
    trend: "-1 alerta crítica",
    status: "En monitoreo",
    risk: "Alto",
    owner: "QA / Operaciones",
    insight: "Las alertas principales están en licencias, CSV y sanidad.",
    description: "Panel de alertas críticas por vencimientos, brechas, desviaciones, CAPA, lotes, ambiente, licencias y auditorías.",
    actionLabel: "Ver alertas",
    metrics: ["Licencias 1", "CSV 2", "QMS 2", "Cultivo 2"],
  },
  {
    id: "recommendations",
    title: "Recomendaciones Ejecutivas",
    moduleName: "Command Center",
    category: "Recomendaciones",
    score: 86,
    metric: "12 sugerencias",
    trend: "+3 nuevas",
    status: "Pendiente revisión",
    risk: "Medio",
    owner: "Dirección / QA",
    insight: "El sistema prioriza cierres regulatorios y preparación audit-ready.",
    description: "Recomendaciones ejecutivas generadas desde reglas, IA regulatoria, CAPA, auditorías, evidencias y scorecard.",
    actionLabel: "Revisar",
    metrics: ["Alta 4", "Media 6", "Baja 2", "QA 8"],
  }
];

export default function CommandCenterModule() {
  return (
    <ExecutivePremiumShell
      eyebrow="FloraTrack Command"
      title="Command Center"
      description="Centro de mando ejecutivo para señales críticas, alertas, recomendaciones, actividad reciente, riesgos y decisiones de alto nivel."
      primaryAction="Actualizar Centro"
      items={items}
    />
  );
}
