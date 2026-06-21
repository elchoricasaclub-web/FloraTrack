"use client";

import ExecutivePremiumShell, { ExecutivePremiumItem } from "../ui/ExecutivePremiumShell";

const items: ExecutivePremiumItem[] = [
  {
    id: "command-signal", title: "Señal Ejecutiva Principal", moduleName: "Command Center", category: "Comando",
    score: 91, metric: "Control central", trend: "Operación consolidada", status: "Operativo",
    risk: "Medio", owner: "Dirección", insight: "Integra decisiones, alertas y score global.",
    description: "Centro ejecutivo para visualizar señales críticas y decisiones de alto nivel.",
    actionLabel: "Abrir comando", metrics: ["Alertas 7", "CAPA 3"]
  },
  {
    id: "critical-alerts", title: "Alertas Críticas", moduleName: "Command Center", category: "Alertas",
    score: 73, metric: "7 alertas", trend: "-1 alerta crítica", status: "En monitoreo",
    risk: "Alto", owner: "QA / Operaciones", insight: "Pendientes en CSV y sanidad.",
    description: "Panel de alertas críticas por vencimientos y brechas.",
    actionLabel: "Ver alertas", metrics: ["Licencias 1", "CSV 2"]
  }
];

export default function CommandCenterModule() {
  return (
    <ExecutivePremiumShell
      eyebrow="FloraTrack Command"
      title="Command Center"
      description="Centro de mando ejecutivo de FloraTrack"
      primaryAction="Actualizar Centro"
      items={items}
    />
  );
}
