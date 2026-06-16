"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function LimpiezaModule() {
  return (
    <DbCrudModule
      title="Limpieza"
      description="Registros de limpieza y sanitización conectados a Prisma con área, procedimiento, responsable, estado y auditoría."
      apiPath="/api/facility/cleaning"
      buttonLabel="Nuevo Registro"
      icon="🧼"
      emptyForm={{
        id: "",
        code: "",
        area: "",
        procedure: "",
        responsible: "",
        status: "Pendiente",
      }}
      fields={[
        { name: "code", label: "Código limpieza", required: true },
        { name: "area", label: "Área" },
        { name: "procedure", label: "Procedimiento" },
        { name: "responsible", label: "Responsable" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "Ejecutado", value: "Ejecutado" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Rechazado", value: "Rechazado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Área", accessor: "area" },
        { label: "Procedimiento", accessor: "procedure" },
        { label: "Responsable", accessor: "responsible" },
      ]}
    />
  );
}
