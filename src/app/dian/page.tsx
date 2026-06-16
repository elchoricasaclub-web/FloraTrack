"use client";

import AuthorityRegulatoryModule, { type AuthorityModuleConfig } from "../../components/regulatorio/AuthorityRegulatoryModule";

const config: AuthorityModuleConfig = {
  title: "DIAN / Comercio Exterior",
  subtitle: "Aduanas, importaciones, exportaciones y soportes tributarios",
  description:
    "Módulo regulatorio para seguimiento de importaciones, exportaciones, soportes aduaneros, documentos tributarios, certificados, declaraciones, radicados, requerimientos DIAN, conciliación documental, evidencia, desviaciones, CAPA y decisión QA.",
  storageKey: "floratrack_dian_regulatorio_v1",
  accent: "from-yellow-700 to-orange-500",
  tag: "DIAN",
  authorityName: "DIAN",
  defaultScope:
    "Seguimiento regulatorio DIAN para importaciones, exportaciones, documentos aduaneros, soportes tributarios, certificados, declaraciones, requerimientos y conciliación documental.",
  processOptions: [
    "Importación",
    "Exportación",
    "Declaración de importación",
    "Declaración de exportación",
    "Soporte aduanero",
    "Documento tributario",
    "Certificado de origen",
    "Requerimiento DIAN",
    "Respuesta a autoridad",
    "Conciliación documental",
    "Cierre de trámite"
  ],
  documentOptions: [
    "Declaración de importación",
    "Declaración de exportación",
    "Factura / documento tributario",
    "Certificado de origen",
    "Documento de transporte",
    "Soporte aduanero",
    "Radicado DIAN",
    "Respuesta a requerimiento",
    "Conciliación documental",
    "Evidencia QA",
    "Otro soporte controlado"
  ],
};

export default function DianPage() {
  return <AuthorityRegulatoryModule config={config} />;
}
