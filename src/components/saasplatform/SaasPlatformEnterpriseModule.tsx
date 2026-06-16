"use client";

import ExecutivePremiumShell, { ExecutivePremiumItem } from "../ui/ExecutivePremiumShell";

const items: ExecutivePremiumItem[] = [
  {
    id: "tenant-health",
    title: "Tenant Health Enterprise",
    moduleName: "SaaS Multiempresa",
    category: "Tenant",
    score: 90,
    metric: "Tenant activo",
    trend: "+1 sede",
    status: "Operativo",
    risk: "Medio",
    owner: "Admin SaaS",
    insight: "La arquitectura multiempresa está lista para clientes regulados.",
    description: "Estado ejecutivo de tenants, sedes, usuarios, módulos habilitados, aislamiento, permisos, onboarding y suscripción.",
    actionLabel: "Ver tenant",
    metrics: ["Tenants 1", "Sedes 1", "Usuarios 8", "Módulos 40+"],
  },
  {
    id: "subscription",
    title: "Plan Enterprise",
    moduleName: "SaaS Multiempresa",
    category: "Suscripción",
    score: 82,
    metric: "Enterprise",
    trend: "Implementación inicial",
    status: "Implementación",
    risk: "Medio",
    owner: "Dirección Comercial",
    insight: "El plan puede empaquetarse por GACP, GMP, LIMS, QMS, CSV e IA.",
    description: "Gestión de planes, módulos por cliente, límites, onboarding, soporte, facturación futura e integraciones.",
    actionLabel: "Ver plan",
    metrics: ["Plan Enterprise", "Módulos full", "API futuro", "Soporte premium"],
  },
  {
    id: "rbac-saas",
    title: "Seguridad Multiempresa",
    moduleName: "SaaS Multiempresa",
    category: "Seguridad",
    score: 78,
    metric: "RBAC activo",
    trend: "+MFA pendiente",
    status: "Pendiente revisión",
    risk: "Alto",
    owner: "Seguridad / QA",
    insight: "Debe reforzarse MFA, firma y aislamiento antes de clientes externos.",
    description: "Control ejecutivo de seguridad SaaS: RBAC, permisos, segregación, revisión de accesos, firma electrónica y auditoría.",
    actionLabel: "Ver seguridad",
    metrics: ["RBAC 80%", "MFA pendiente", "SoD 70%", "Audit log OK"],
  }
];

export default function SaasPlatformEnterpriseModule() {
  return (
    <ExecutivePremiumShell
      eyebrow="FloraTrack SaaS"
      title="SaaS Multiempresa"
      description="Gestión ejecutiva de tenants, sedes, usuarios, módulos, planes, onboarding, seguridad, suscripciones e integraciones."
      primaryAction="Actualizar SaaS"
      items={items}
    />
  );
}
