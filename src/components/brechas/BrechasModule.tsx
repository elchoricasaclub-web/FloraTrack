"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function BrechasModule() {
  return (
    <DbCrudModule
      title="Brechas"
      description="Gestión de brechas de cumplimiento: fuente, causa raíz, acción, responsable, prioridad, fecha límite y cierre."
      apiPath="/api/standards/gaps"
      buttonLabel="Nueva Brecha"
      icon="🧩"
      emptyForm={{
        id: "",
        code: "",
        gap: "",
        source: "Auditoría",
        rootCause: "",
        action: "",
        responsible: "",
        priority: "Media",
        status: "Abierta",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código brecha", required: true },
        { name: "gap", label: "Brecha", required: true },
        {
          name: "source",
          label: "Fuente",
          type: "select",
          options: [
            { label: "Auditoría", value: "Auditoría" },
            { label: "Matriz cumplimiento", value: "Matriz cumplimiento" },
            { label: "Regulatorio", value: "Regulatorio" },
            { label: "Data Integrity", value: "Data Integrity" },
            { label: "CSV", value: "CSV" },
            { label: "Postmercado", value: "Postmercado" },
          ],
        },
        { name: "rootCause", label: "Causa raíz" },
        { name: "action", label: "Acción" },
        { name: "responsible", label: "Responsable" },
        {
          name: "priority",
          label: "Prioridad",
          type: "select",
          options: [
            { label: "Baja", value: "Baja" },
            { label: "Media", value: "Media" },
            { label: "Alta", value: "Alta" },
            { label: "Crítica", value: "Crítica" },
          ],
        },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Abierta", value: "Abierta" },
            { label: "En ejecución", value: "En ejecución" },
            { label: "Verificación", value: "Verificación" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Brecha", accessor: "gap" },
        { label: "Fuente", accessor: "source" },
        { label: "Prioridad", accessor: "priority" },
        { label: "Responsable", accessor: "responsible" },
      ]}
    />
  );
}
