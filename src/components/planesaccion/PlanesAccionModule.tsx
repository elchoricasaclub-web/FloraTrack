"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function PlanesAccionModule() {
  return (
    <DbCrudModule
      title="Planes de Acción"
      description="Planes de acción derivados de brechas, auditorías, CAPA, revisión gerencial, IA y matriz normativa."
      apiPath="/api/standards/gaps"
      buttonLabel="Nuevo Plan"
      icon="🗓️"
      emptyForm={{
        id: "",
        code: "",
        gap: "",
        source: "Revisión gerencial",
        rootCause: "",
        action: "",
        responsible: "",
        priority: "Alta",
        status: "Abierta",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código plan", required: true },
        { name: "gap", label: "Objetivo / brecha", required: true },
        { name: "source", label: "Fuente" },
        { name: "rootCause", label: "Causa / justificación" },
        { name: "action", label: "Plan de acción" },
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
        { label: "Objetivo", accessor: "gap" },
        { label: "Fuente", accessor: "source" },
        { label: "Acción", accessor: "action" },
        { label: "Responsable", accessor: "responsible" },
      ]}
    />
  );
}
