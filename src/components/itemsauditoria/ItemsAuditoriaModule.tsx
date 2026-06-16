"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function ItemsAuditoriaModule() {
  return (
    <DbCrudModule
      title="Ítems Auditoría"
      description="Ítems del paquete de auditoría: paquete, módulo, código de evidencia, título, estado y trazabilidad para auditor externo."
      apiPath="/api/evidence/items"
      buttonLabel="Nuevo Ítem"
      icon="✅"
      emptyForm={{
        id: "",
        code: "",
        packageCode: "",
        module: "GACP",
        evidenceCode: "",
        title: "",
        status: "Pendiente",
      }}
      fields={[
        { name: "code", label: "Código ítem", required: true },
        { name: "packageCode", label: "Código paquete" },
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
            { label: "Validación GxP", value: "Validación GxP" },
          ],
        },
        { name: "evidenceCode", label: "Código evidencia" },
        { name: "title", label: "Título ítem", required: true },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "Disponible", value: "Disponible" },
            { label: "En revisión", value: "En revisión" },
            { label: "Aceptado", value: "Aceptado" },
            { label: "Observado", value: "Observado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Paquete", accessor: "packageCode" },
        { label: "Módulo", accessor: "module" },
        { label: "Evidencia", accessor: "evidenceCode" },
        { label: "Título", accessor: "title" },
      ]}
    />
  );
}
