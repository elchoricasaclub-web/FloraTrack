"use client";

import AuthorityRegulatoryModule, { type AuthorityModuleConfig } from "../../components/regulatorio/AuthorityRegulatoryModule";

const config: AuthorityModuleConfig = {
  title: "FNE / Fondo Nacional de Estupefacientes",
  subtitle: "Control de sustancias, reportes y trazabilidad regulatoria",
  description:
    "Módulo regulatorio para seguimiento interno de trámites, reportes, soportes, requerimientos, cupos, controles de sustancias fiscalizadas, evidencias, desviaciones, CAPA y decisión QA relacionados con FNE.",
  storageKey: "floratrack_fne_regulatorio_v1",
  accent: "from-rose-800 to-orange-500",
  tag: "FNE",
  authorityName: "FNE / Fondo Nacional de Estupefacientes",
  defaultScope:
    "Seguimiento regulatorio FNE para sustancias fiscalizadas, soportes, reportes, cupos, requerimientos, trazabilidad documental, evidencias y revisión QA.",
  processOptions: [
    "Registro FNE",
    "Actualización FNE",
    "Reporte periódico",
    "Reporte de movimiento",
    "Control de cupo",
    "Soporte de sustancia fiscalizada",
    "Requerimiento FNE",
    "Respuesta a autoridad",
    "Conciliación documental",
    "Cierre de trámite"
  ],
  documentOptions: [
    "Radicado FNE",
    "Reporte periódico",
    "Reporte de movimiento",
    "Soporte de cupo",
    "Conciliación documental",
    "Certificado / soporte",
    "Respuesta a requerimiento",
    "Acta de revisión",
    "Evidencia QA",
    "Otro soporte controlado"
  ],
};

export default function FnePage() {
  return <AuthorityRegulatoryModule config={config} />;
}
