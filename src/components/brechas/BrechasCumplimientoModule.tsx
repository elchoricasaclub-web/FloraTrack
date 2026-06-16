"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function BrechasCumplimientoModule() {
  return (
    <DbCrudModule
      title="Brechas de Cumplimiento"
      description="Gestión de brechas normativas: requisito, brecha, severidad, plan de acción, responsable, vencimiento y cierre."
      apiPath="/api/compliance-regulatory/gaps"
      buttonLabel="Nueva Brecha"
      icon="🚧"
      emptyForm={{
        id: "",
        code: "",
        requirementCode: "",
        gap: "",
        severity: "Media",
        actionPlan: "",
        owner: "",
        status: "Abierta",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código brecha", required: true },
        { name: "requirementCode", label: "Requisito asociado" },
        { name: "gap", label: "Brecha", required: true },
        {
          name: "severity",
          label: "Severidad",
          type: "select",
          options: [
            { label: "Baja", value: "Baja" },
            { label: "Media", value: "Media" },
            { label: "Alta", value: "Alta" },
            { label: "Crítica", value: "Crítica" },
          ],
        },
        { name: "actionPlan", label: "Plan de acción" },
        { name: "owner", label: "Responsable" },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Abierta", value: "Abierta" },
            { label: "En ejecución", value: "En ejecución" },
            { label: "CAPA requerida", value: "CAPA requerida" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Requisito", accessor: "requirementCode" },
        { label: "Brecha", accessor: "gap" },
        { label: "Severidad", accessor: "severity" },
        { label: "Responsable", accessor: "owner" },
      ]}
    />
  );
}
