"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function BioseguridadModule() {
  return (
    <DbCrudModule
      title="Bioseguridad"
      description="Bioseguridad conectada a Prisma con área, evento, responsable, estado y auditoría."
      apiPath="/api/facility/biosafety"
      buttonLabel="Nuevo Registro"
      icon="🛡️"
      emptyForm={{
        id: "",
        code: "",
        area: "",
        eventType: "Ingreso",
        responsible: "",
        status: "Pendiente",
      }}
      fields={[
        { name: "code", label: "Código", required: true },
        { name: "area", label: "Área" },
        {
          name: "eventType",
          label: "Tipo evento",
          type: "select",
          options: [
            { label: "Ingreso", value: "Ingreso" },
            { label: "EPP", value: "EPP" },
            { label: "Desinfección", value: "Desinfección" },
            { label: "Incidente", value: "Incidente" },
            { label: "Control visitante", value: "Control visitante" },
          ],
        },
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
        { label: "Evento", accessor: "eventType" },
        { label: "Responsable", accessor: "responsible" },
      ]}
    />
  );
}
