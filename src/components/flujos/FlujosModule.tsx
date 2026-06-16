"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function FlujosModule() {
  return (
    <DbCrudModule
      title="Flujos"
      description="Motor de workflow enterprise para procesos críticos GACP/GMP: revisión, aprobación, liberación, CAPA, control de cambios y validación."
      apiPath="/api/workflow/processes"
      buttonLabel="Nuevo Flujo"
      icon="🔄"
      emptyForm={{
        id: "",
        code: "",
        name: "",
        module: "Calidad",
        description: "",
        status: "Activo",
      }}
      fields={[
        { name: "code", label: "Código flujo", required: true },
        { name: "name", label: "Nombre flujo", required: true },
        {
          name: "module",
          label: "Módulo",
          type: "select",
          options: [
            { label: "Calidad", value: "Calidad" },
            { label: "Regulatorio", value: "Regulatorio" },
            { label: "Laboratorio", value: "Laboratorio" },
            { label: "Documentos", value: "Documentos" },
            { label: "Inventario", value: "Inventario" },
            { label: "Facility", value: "Facility" },
            { label: "Validación GxP", value: "Validación GxP" },
          ],
        },
        { name: "description", label: "Descripción" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Activo", value: "Activo" },
            { label: "En diseño", value: "En diseño" },
            { label: "En validación", value: "En validación" },
            { label: "Inactivo", value: "Inactivo" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Flujo", accessor: "name" },
        { label: "Módulo", accessor: "module" },
        { label: "Descripción", accessor: "description" },
      ]}
    />
  );
}
