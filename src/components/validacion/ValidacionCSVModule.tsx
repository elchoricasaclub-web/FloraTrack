"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function ValidacionCSVModule() {
  return (
    <DbCrudModule
      title="Validación CSV"
      description="Validación de sistema computarizado para entorno GxP: protocolos IQ/OQ/PQ, alcance, responsable, estado, fecha límite y auditoría."
      apiPath="/api/compliance/protocols"
      buttonLabel="Nuevo Protocolo"
      icon="🧪"
      emptyForm={{
        id: "",
        code: "",
        type: "IQ",
        scope: "",
        responsible: "",
        status: "Borrador",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código protocolo", required: true },
        {
          name: "type",
          label: "Tipo",
          type: "select",
          options: [
            { label: "IQ", value: "IQ" },
            { label: "OQ", value: "OQ" },
            { label: "PQ", value: "PQ" },
            { label: "URS", value: "URS" },
            { label: "Risk Assessment", value: "Risk Assessment" },
            { label: "Traceability Matrix", value: "Traceability Matrix" },
          ],
        },
        { name: "scope", label: "Alcance" },
        { name: "responsible", label: "Responsable" },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Borrador", value: "Borrador" },
            { label: "En ejecución", value: "En ejecución" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Rechazado", value: "Rechazado" },
            { label: "Obsoleto", value: "Obsoleto" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Tipo", accessor: "type" },
        { label: "Alcance", accessor: "scope" },
        { label: "Responsable", accessor: "responsible" },
        { label: "Fecha límite", accessor: "dueDate" },
      ]}
    />
  );
}
