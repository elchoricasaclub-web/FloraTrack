"use client";

import ExecutivePremiumShell, { ExecutivePremiumItem } from "../ui/ExecutivePremiumShell";

const items: ExecutivePremiumItem[] = [
  {
    id: "tower-global",
    title: "Control Tower Global",
    moduleName: "Control Tower",
    category: "Enterprise",
    score: 89,
    metric: "Consolidado 360",
    trend: "+6% performance",
    status: "Operativo",
    risk: "Medio",
    owner: "Enterprise Admin",
    insight: "Consolida datos de todos los módulos críticos de FloraTrack.",
    description: "Torre de control ejecutiva que consolida calidad, operaciones, cumplimiento, laboratorio, proveedores, CSV, SaaS e IA.",
    actionLabel: "Abrir torre",
    metrics: ["Módulos 40+", "Datos 300+", "Alertas 7", "Score 89%"],
  },
  {
    id: "quality-signal",
    title: "Señal de Calidad",
    moduleName: "Control Tower",
    category: "Calidad",
    score: 81,
    metric: "QMS activo",
    trend: "+4% cierre QMS",
    status: "En monitoreo",
    risk: "Alto",
    owner: "QA Manager",
    insight: "El QMS requiere cierre de CAPA y evidencias pendientes.",
    description: "Señal consolidada de CAPA, desviaciones, no conformidades, OOS, PQR, tendencias y auditorías.",
    actionLabel: "Ver QMS",
    metrics: ["CAPA 3", "OOS 1", "PQR 2", "Audits 3"],
  },
  {
    id: "regulatory-signal",
    title: "Señal Regulatoria",
    moduleName: "Control Tower",
    category: "Regulatorio",
    score: 76,
    metric: "Brechas abiertas",
    trend: "+2 evidencias",
    status: "Pendiente revisión",
    risk: "Alto",
    owner: "Regulatorio",
    insight: "Faltan evidencias para licencias, certificaciones y exportación.",
    description: "Consolidado de licencias, certificaciones, normas, requisitos, vencimientos, expedientes y brechas regulatorias.",
    actionLabel: "Ver regulatorios",
    metrics: ["Licencias 4", "Brechas 5", "SOP 12", "Dossier 2"],
  }
];

export default function ControlTowerModule() {
  return (
    <ExecutivePremiumShell
      eyebrow="FloraTrack Enterprise"
      title="Control Tower"
      description="Torre de control 360 para monitorear calidad, operaciones, cumplimiento, laboratorio, proveedores, validación, SaaS e IA."
      primaryAction="Actualizar Torre"
      items={items}
    />
  );
}
