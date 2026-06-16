"use client";

import ExecutivePremiumShell, { ExecutivePremiumItem } from "../ui/ExecutivePremiumShell";

const items: ExecutivePremiumItem[] = [
  {
    id: "ai-gap-engine",
    title: "Motor de Brechas Regulatorias",
    moduleName: "IA Regulatoria",
    category: "RegTech AI",
    score: 83,
    metric: "Revisión humana",
    trend: "+5 recomendaciones",
    status: "Pendiente revisión",
    risk: "Alto",
    owner: "QA / Regulatorio",
    insight: "La IA detecta brechas, pero requiere aprobación humana.",
    description: "Motor de inteligencia regulatoria para analizar brechas, requisitos, evidencias, recomendaciones y roadmap por jurisdicción.",
    actionLabel: "Ver brechas",
    metrics: ["Brechas 5", "Recomendaciones 12", "Evidencias 18", "QA Review"],
  },
  {
    id: "country-comparator",
    title: "Comparador por País",
    moduleName: "IA Regulatoria",
    category: "Internacional",
    score: 74,
    metric: "Colombia base",
    trend: "+Países futuros",
    status: "En implementación",
    risk: "Medio",
    owner: "Regulatorio",
    insight: "El comparador internacional será clave para SaaS global.",
    description: "Comparador de requisitos regulatorios por país, operación, certificación, licencia y estándar aplicable.",
    actionLabel: "Comparar",
    metrics: ["Colombia", "GACP", "GMP", "ISO"],
  },
  {
    id: "human-review",
    title: "Revisión Humana Obligatoria",
    moduleName: "IA Regulatoria",
    category: "Gobierno IA",
    score: 88,
    metric: "Control QA",
    trend: "Guardrails activos",
    status: "Operativo",
    risk: "Medio",
    owner: "QA / Legal",
    insight: "Ninguna conclusión regulatoria debe ser automática.",
    description: "Control ejecutivo de gobierno IA: logs, revisión humana, guardrails, evaluación de respuesta y limitaciones regulatorias.",
    actionLabel: "Ver política",
    metrics: ["Logs OK", "Guardrails OK", "QA review", "No legal auto"],
  }
];

export default function RegulatoryAiEngineModule() {
  return (
    <ExecutivePremiumShell
      eyebrow="FloraTrack RegTech AI"
      title="Inteligencia Regulatoria IA"
      description="Motor ejecutivo para brechas regulatorias, recomendaciones, evidencias, comparación por país, revisión humana y gobierno IA."
      primaryAction="Actualizar IA"
      items={items}
    />
  );
}
