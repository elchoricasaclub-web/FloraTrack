"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function EvidenciasModule() {
  return (
    <DbCrudModule
      title="Evidencias"
      description="Matriz de evidencias audit-ready: estándar, módulo, requisito, tipo de evidencia, ubicación, responsable, estado y trazabilidad."
      apiPath="/api/evidence/records"
      buttonLabel="Nueva Evidencia"
      icon="🗃️"
      emptyForm={{
        id: "",
        code: "",
        standard: "WHO GACP",
        module: "GACP",
        requirementCode: "",
        evidenceType: "Registro",
        title: "",
        location: "",
        owner: "",
        status: "Pendiente",
      }}
      fields={[
        { name: "code", label: "Código evidencia", required: true },
        {
          name: "standard",
          label: "Estándar",
          type: "select",
          options: [
            { label: "WHO GACP", value: "WHO GACP" },
            { label: "EU GMP", value: "EU GMP" },
            { label: "EU Annex 11", value: "EU Annex 11" },
            { label: "21 CFR Part 11", value: "21 CFR Part 11" },
            { label: "WHO Data Integrity", value: "WHO Data Integrity" },
            { label: "ICA", value: "ICA" },
            { label: "INVIMA", value: "INVIMA" },
            { label: "MinJusticia", value: "MinJusticia" },
          ],
        },
        {
          name: "module",
          label: "Módulo",
          type: "select",
          options: [
            { label: "GACP", value: "GACP" },
            { label: "GMP", value: "GMP" },
            { label: "Calidad", value: "Calidad" },
            { label: "Laboratorio", value: "Laboratorio" },
            { label: "Regulatorio", value: "Regulatorio" },
            { label: "Documentos", value: "Documentos" },
            { label: "Inventario", value: "Inventario" },
            { label: "Facility", value: "Facility" },
            { label: "Sistema", value: "Sistema" },
            { label: "CSV", value: "CSV" },
          ],
        },
        { name: "requirementCode", label: "Código requisito" },
        {
          name: "evidenceType",
          label: "Tipo evidencia",
          type: "select",
          options: [
            { label: "SOP", value: "SOP" },
            { label: "Registro", value: "Registro" },
            { label: "Firma", value: "Firma" },
            { label: "COA", value: "COA" },
            { label: "Reporte", value: "Reporte" },
            { label: "Certificado", value: "Certificado" },
            { label: "Fotografía", value: "Fotografía" },
            { label: "Backup", value: "Backup" },
            { label: "Audit Trail", value: "Audit Trail" },
          ],
        },
        { name: "title", label: "Título evidencia", required: true },
        { name: "location", label: "Ubicación / ruta / enlace" },
        { name: "owner", label: "Responsable" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "Disponible", value: "Disponible" },
            { label: "En revisión", value: "En revisión" },
            { label: "Aprobada", value: "Aprobada" },
            { label: "Rechazada", value: "Rechazada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Estándar", accessor: "standard" },
        { label: "Módulo", accessor: "module" },
        { label: "Tipo", accessor: "evidenceType" },
        { label: "Título", accessor: "title" },
      ]}
    />
  );
}
