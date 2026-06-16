"use client";

import AuthorityRegulatoryModule, { type AuthorityModuleConfig } from "../../components/regulatorio/AuthorityRegulatoryModule";

const config: AuthorityModuleConfig = {
  title: "Ministerio de Justicia",
  subtitle: "Licencias, cupos y seguimiento regulatorio",
  description:
    "Módulo regulatorio para seguimiento de licencias de cannabis, modificaciones, renovaciones, cupos, informes periódicos, requerimientos, radicados, resoluciones, evidencia, desviaciones, CAPA y decisión QA.",
  storageKey: "floratrack_minjusticia_regulatorio_v1",
  accent: "from-green-800 to-emerald-500",
  tag: "MinJus",
  authorityName: "Ministerio de Justicia",
  defaultScope:
    "Seguimiento regulatorio ante Ministerio de Justicia para licencias, cupos, modificaciones, renovaciones, informes, requerimientos y soportes documentales.",
  processOptions: [
    "Solicitud de licencia",
    "Modificación de licencia",
    "Renovación de licencia",
    "Cupo ordinario",
    "Cupo suplementario",
    "Informe periódico",
    "Actualización documental",
    "Requerimiento Ministerio de Justicia",
    "Respuesta a autoridad",
    "Seguimiento de trámite",
    "Cierre de trámite"
  ],
  documentOptions: [
    "Radicado Ministerio de Justicia",
    "Resolución",
    "Licencia",
    "Cupo ordinario",
    "Cupo suplementario",
    "Informe periódico",
    "Anexo documental",
    "Respuesta a requerimiento",
    "Acta / concepto",
    "Evidencia documental QA",
    "Otro soporte controlado"
  ],
};

export default function MinisterioJusticiaPage() {
  return <AuthorityRegulatoryModule config={config} />;
}
