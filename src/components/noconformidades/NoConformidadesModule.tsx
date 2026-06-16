"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function NoConformidadesModule() {
  return (
    <DbCrudModule
      title="No Conformidades"
      description="Control de no conformidades con origen, descripción, severidad, responsable, fecha límite, estado y auditoría."
      apiPath="/api/quality/non-conformities"
      buttonLabel="Nueva No Conformidad"
      icon="❌"
      emptyForm={{
        id: "",
        code: "",
        source: "Auditoría",
        description: "",
        severity: "Media",
        responsible: "",
        status: "Abierta",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código NC", required: true },
        {
          name: "source",
          label: "Origen",
          type: "select",
          options: [
            { label: "Auditoría", value: "Auditoría" },
            { label: "Laboratorio", value: "Laboratorio" },
            { label: "Cliente", value: "Cliente" },
            { label: "Producción", value: "Producción" },
            { label: "Regulatorio", value: "Regulatorio" },
            { label: "Proveedor", value: "Proveedor" },
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
        { label: "Origen", accessor: "source" },
        { label: "Severidad", accessor: "severity" },
        { label: "Responsable", accessor: "responsible" },
        { label: "Fecha límite", accessor: "dueDate" },
      ]}
    />
  );
}
