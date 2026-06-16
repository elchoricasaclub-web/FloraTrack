"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function PaquetesAuditoriaModule() {
  return (
    <DbCrudModule
      title="Paquetes Auditoría"
      description="Paquetes de auditoría para certificación: estándar, auditor, fecha objetivo, estado, notas y trazabilidad documental."
      apiPath="/api/evidence/packages"
      buttonLabel="Nuevo Paquete"
      icon="📦"
      emptyForm={{
        id: "",
        code: "",
        name: "",
        standard: "WHO GACP",
        auditor: "",
        status: "En preparación",
        targetDate: "",
        notes: "",
      }}
      fields={[
        { name: "code", label: "Código paquete", required: true },
        { name: "name", label: "Nombre paquete", required: true },
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
            { label: "Regulatorio Colombia", value: "Regulatorio Colombia" },
          ],
        },
        { name: "auditor", label: "Auditor / entidad" },
        { name: "targetDate", label: "Fecha objetivo", type: "date" },
        { name: "notes", label: "Notas" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "En preparación", value: "En preparación" },
            { label: "En revisión", value: "En revisión" },
            { label: "Listo para auditoría", value: "Listo para auditoría" },
            { label: "Observado", value: "Observado" },
            { label: "Cerrado", value: "Cerrado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Paquete", accessor: "name" },
        { label: "Estándar", accessor: "standard" },
        { label: "Auditor", accessor: "auditor" },
        { label: "Fecha objetivo", accessor: "targetDate" },
      ]}
    />
  );
}
