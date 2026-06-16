"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function DesviacionesModule() {
  return (
    <DbCrudModule
      title="Desviaciones"
      description="Gestión de desviaciones GACP/GMP con severidad, responsable, fecha límite, estado, auditoría y trazabilidad CAPA."
      apiPath="/api/quality/deviations"
      buttonLabel="Nueva Desviación"
      icon="🚨"
      emptyForm={{
        id: "",
        code: "",
        area: "GACP",
        description: "",
        severity: "Media",
        responsible: "",
        status: "Abierta",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código desviación", required: true },
        {
          name: "area",
          label: "Área",
          type: "select",
          options: [
            { label: "GACP", value: "GACP" },
            { label: "GMP", value: "GMP" },
            { label: "Laboratorio", value: "Laboratorio" },
            { label: "Calidad", value: "Calidad" },
            { label: "Regulatorio", value: "Regulatorio" },
            { label: "Inventario", value: "Inventario" },
          ],
        },
        { name: "description", label: "Descripción" },
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
        { name: "responsible", label: "Responsable" },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Abierta", value: "Abierta" },
            { label: "En investigación", value: "En investigación" },
            { label: "CAPA requerida", value: "CAPA requerida" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Área", accessor: "area" },
        { label: "Severidad", accessor: "severity" },
        { label: "Responsable", accessor: "responsible" },
        { label: "Fecha límite", accessor: "dueDate" },
      ]}
    />
  );
}
