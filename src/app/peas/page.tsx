"use client";

import AuthorityRegulatoryModule, { type AuthorityModuleConfig } from "../../components/regulatorio/AuthorityRegulatoryModule";

const config: AuthorityModuleConfig = {
  title: "PEAS",
  subtitle: "Planes, permisos, anexos y seguimiento regulatorio",
  description:
    "Módulo PEAS para control de planes, permisos, anexos, soportes, requerimientos, seguimiento documental, evidencia, desviaciones, CAPA y decisión QA.",
  storageKey: "floratrack_peas_regulatorio_v1",
  accent: "from-cyan-700 to-blue-500",
  tag: "PEAS",
  authorityName: "PEAS",
  defaultScope:
    "Seguimiento PEAS para planes, permisos, anexos, soportes documentales, requerimientos y trazabilidad regulatoria interna.",
  processOptions: [
    "Registro PEAS",
    "Actualización PEAS",
    "Anexo documental",
    "Permiso asociado",
    "Seguimiento de plan",
    "Requerimiento recibido",
    "Respuesta documentada",
    "Cierre PEAS",
  ],
  documentOptions: [
    "Plan PEAS",
    "Anexo PEAS",
    "Permiso asociado",
    "Matriz de seguimiento",
    "Acta de revisión",
    "Respuesta a requerimiento",
    "Evidencia documental",
    "Soporte QA",
    "Otro soporte controlado",
  ],
};

export default function PeasPage() {
  return <AuthorityRegulatoryModule config={config} />;
}
