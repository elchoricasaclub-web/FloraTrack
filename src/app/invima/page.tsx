"use client";

import AuthorityRegulatoryModule, { type AuthorityModuleConfig } from "../../components/regulatorio/AuthorityRegulatoryModule";

const config: AuthorityModuleConfig = {
  title: "INVIMA",
  subtitle: "Soportes sanitarios, GMP y productos regulados",
  description:
    "Módulo regulatorio para seguimiento de trámites, soportes sanitarios, certificaciones, expedientes, requerimientos y evidencias ante INVIMA bajo control QA.",
  storageKey: "floratrack_invima_regulatorio_v1",
  accent: "from-purple-700 to-fuchsia-500",
  tag: "INVIMA",
  authorityName: "INVIMA",
  defaultScope:
    "Seguimiento regulatorio INVIMA para soportes sanitarios, expedientes, certificaciones, GMP, productos regulados, requerimientos y respuesta a autoridad.",
  processOptions: [
    "Radicación sanitaria",
    "Certificación GMP",
    "Requerimiento INVIMA",
    "Respuesta a autoridad",
    "Actualización de expediente",
    "Consulta de estado",
    "Soporte de producto regulado",
    "Cierre de trámite",
  ],
  documentOptions: [
    "Radicado INVIMA",
    "Expediente sanitario",
    "Certificado GMP",
    "Respuesta a requerimiento",
    "Acta o concepto técnico",
    "Documento de producto",
    "Evidencia de calidad",
    "Soporte documental QA",
    "Otro soporte controlado",
  ],
};

export default function InvimaPage() {
  return <AuthorityRegulatoryModule config={config} />;
}
