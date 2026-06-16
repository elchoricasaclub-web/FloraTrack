"use client";

import ExecutivePremiumShell, { ExecutivePremiumItem } from "../ui/ExecutivePremiumShell";

const items: ExecutivePremiumItem[] = [
  {
    id: "gateway-provider",
    title: "AI Gateway Seguro",
    moduleName: "AI Gateway",
    category: "Gobierno IA",
    score: 86,
    metric: "Proveedor controlado",
    trend: "Arquitectura preparada",
    status: "Operativo",
    risk: "Medio",
    owner: "Arquitectura / QA",
    insight: "El gateway controla proveedores, prompts, logs y evaluación.",
    description: "Capa segura para proveedores IA, modelos, prompts aprobados, fuentes de contexto, guardrails, logs, evaluación y costos.",
    actionLabel: "Ver gateway",
    metrics: ["Providers", "Prompts", "Guardrails", "Logs"],
  },
  {
    id: "private-ai-roadmap",
    title: "Ruta IA Privada",
    moduleName: "AI Gateway",
    category: "Private AI",
    score: 72,
    metric: "Planeado",
    trend: "Pendiente hardware",
    status: "Planeado",
    risk: "Medio",
    owner: "Arquitectura",
    insight: "La IA local se activará cuando exista equipo o servidor adecuado.",
    description: "Ruta para IA privada local: runtime, corpus, embeddings, RAG, validación del modelo y gobierno de datos.",
    actionLabel: "Ver roadmap",
    metrics: ["Runtime", "Corpus", "RAG", "CSV modelo"],
  },
  {
    id: "prompt-governance",
    title: "Gobierno de Prompts",
    moduleName: "AI Gateway",
    category: "Prompts",
    score: 80,
    metric: "Prompts controlados",
    trend: "+Plantillas iniciales",
    status: "Pendiente revisión",
    risk: "Alto",
    owner: "QA / Regulatorio",
    insight: "Los prompts GxP deben aprobarse antes de uso productivo.",
    description: "Gestión de prompts críticos, instrucciones sistema, esquemas de salida, aprobación QA y evaluación de respuesta.",
    actionLabel: "Ver prompts",
    metrics: ["Plantillas", "Aprobación QA", "Riesgo", "Output schema"],
  }
];

export default function AiGatewayEnterpriseModule() {
  return (
    <ExecutivePremiumShell
      eyebrow="FloraTrack AI Governance"
      title="AI Gateway"
      description="Capa ejecutiva para gobernar proveedores IA, modelos, prompts, guardrails, logs, evaluaciones, costos y futura IA privada."
      primaryAction="Actualizar Gateway"
      items={items}
    />
  );
}
