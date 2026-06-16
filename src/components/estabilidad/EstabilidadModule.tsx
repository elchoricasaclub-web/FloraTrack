"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function EstabilidadModule() {
  return (
    <DbCrudModule
      title="Estabilidad"
      description="Estudios de estabilidad para lotes: condición, punto de tiempo, resultado, fecha de seguimiento, estado y auditoría."
      apiPath="/api/production/stability"
      buttonLabel="Nuevo Estudio"
      icon="🧊"
      emptyForm={{
        id: "",
        code: "",
        batchCode: "",
        condition: "",
        timePoint: "",
        result: "",
        status: "En estudio",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código estudio", required: true },
        { name: "batchCode", label: "Lote" },
        {
          name: "condition",
          label: "Condición",
          type: "select",
          options: [
            { label: "25°C / 60% HR", value: "25°C / 60% HR" },
            { label: "30°C / 65% HR", value: "30°C / 65% HR" },
            { label: "40°C / 75% HR", value: "40°C / 75% HR" },
            { label: "Refrigerado", value: "Refrigerado" },
            { label: "Congelado", value: "Congelado" },
          ],
        },
        { name: "timePoint", label: "Punto de tiempo" },
        { name: "result", label: "Resultado" },
        { name: "dueDate", label: "Próximo análisis", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "En estudio", value: "En estudio" },
            { label: "Cumple", value: "Cumple" },
            { label: "No cumple", value: "No cumple" },
            { label: "Cerrado", value: "Cerrado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Lote", accessor: "batchCode" },
        { label: "Condición", accessor: "condition" },
        { label: "Tiempo", accessor: "timePoint" },
        { label: "Próximo análisis", accessor: "dueDate" },
      ]}
    />
  );
}
