"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function CapacitacionesModule() {
  return (
    <DbCrudModule
      title="Capacitaciones"
      description="Capacitaciones conectadas a Prisma con tema, participante, fecha, estado y auditoría."
      apiPath="/api/facility/training"
      buttonLabel="Nueva Capacitación"
      icon="🎓"
      emptyForm={{
        id: "",
        code: "",
        topic: "",
        participant: "",
        dueDate: "",
        status: "Pendiente",
      }}
      fields={[
        { name: "code", label: "Código capacitación", required: true },
        { name: "topic", label: "Tema" },
        { name: "participant", label: "Participante" },
        { name: "dueDate", label: "Fecha", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "Programada", value: "Programada" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Vencido", value: "Vencido" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Tema", accessor: "topic" },
        { label: "Participante", accessor: "participant" },
        { label: "Fecha", accessor: "dueDate" },
      ]}
    />
  );
}
