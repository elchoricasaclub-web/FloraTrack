"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function ControlCambiosModule() {
  return (
    <DbCrudModule
      title="Control de Cambios"
      description="Control de cambios con área, tipo, descripción, impacto, responsable, vencimiento, estado y auditoría."
      apiPath="/api/quality/changes"
      buttonLabel="Nuevo Cambio"
      icon="🔁"
      emptyForm={{
        id: "",
        code: "",
        area: "",
        changeType: "Proceso",
        description: "",
        impact: "Medio",
        responsible: "",
        status: "Solicitado",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código cambio", required: true },
        { name: "area", label: "Área" },
        {
          name: "changeType",
          label: "Tipo cambio",
          type: "select",
          options: [
            { label: "Proceso", value: "Proceso" },
            { label: "Equipo", value: "Equipo" },
            { label: "Documento", value: "Documento" },
            { label: "Proveedor", value: "Proveedor" },
            { label: "Regulatorio", value: "Regulatorio" },
            { label: "Sistema", value: "Sistema" },
          ],
        },
        { name: "description", label: "Descripción" },
        {
          name: "impact",
          label: "Impacto",
          type: "select",
          options: [
            { label: "Bajo", value: "Bajo" },
            { label: "Medio", value: "Medio" },
            { label: "Alto", value: "Alto" },
            { label: "Crítico", value: "Crítico" },
          ],
        },
        { name: "responsible", label: "Responsable" },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Solicitado", value: "Solicitado" },
            { label: "En evaluación", value: "En evaluación" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Implementado", value: "Implementado" },
            { label: "Rechazado", value: "Rechazado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Área", accessor: "area" },
        { label: "Tipo", accessor: "changeType" },
        { label: "Impacto", accessor: "impact" },
        { label: "Responsable", accessor: "responsible" },
      ]}
    />
  );
}
