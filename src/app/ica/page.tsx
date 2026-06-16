"use client";

import AuthorityRegulatoryModule, { type AuthorityModuleConfig } from "../../components/regulatorio/AuthorityRegulatoryModule";

const config: AuthorityModuleConfig = {
  title: "ICA",
  subtitle: "Control fitosanitario, agrícola y predial",
  description:
    "Módulo regulatorio para seguimiento de trámites, radicaciones, conceptos, predios, soportes, requerimientos y evidencias ante ICA bajo control QA.",
  storageKey: "floratrack_ica_regulatorio_v1",
  accent: "from-emerald-700 to-lime-500",
  tag: "ICA",
  authorityName: "ICA",
  defaultScope:
    "Seguimiento regulatorio ICA para predios, actividad agrícola, soportes fitosanitarios, requerimientos, licencias o conceptos aplicables.",
  processOptions: [
    "Registro o actualización predial",
    "Concepto fitosanitario",
    "Soporte agrícola GACP",
    "Requerimiento ICA",
    "Respuesta a autoridad",
    "Seguimiento de visita",
    "Permiso o concepto asociado",
    "Cierre de trámite",
  ],
  documentOptions: [
    "Radicado ICA",
    "Concepto técnico",
    "Acta de visita",
    "Certificado / soporte",
    "Plano o georreferenciación",
    "Documento predial",
    "Respuesta a requerimiento",
    "Evidencia fotográfica",
    "Otro soporte controlado",
  ],
};

export default function IcaPage() {
  return <AuthorityRegulatoryModule config={config} />;
}
