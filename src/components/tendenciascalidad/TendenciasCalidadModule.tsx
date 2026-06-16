"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function TendenciasCalidadModule() {
  return (
    <DbCrudModule
      title="Tendencias Calidad"
      description="Análisis de tendencias de calidad: desviaciones, CAPA, OOS, quejas, estabilidad, rendimiento, laboratorio y cumplimiento."
      apiPath="/api/quality-intelligence/trends"
      buttonLabel="Nueva Tendencia"
      icon="📈"
      emptyForm={{
        id: "",
        code: "",
        area: "Calidad",
        metric: "",
        period: "",
        value: "",
        unit: "",
        trend: "Estable",
        conclusion: "",
        owner: "",
        status: "Abierta",
      }}
      fields={[
        { name: "code", label: "Código tendencia", required: true },
        { name: "area", label: "Área", required: true },
        { name: "metric", label: "Métrica", required: true },
        { name: "period", label: "Periodo" },
        { name: "value", label: "Valor", type: "number" },
        { name: "unit", label: "Unidad" },
        {
          name: "trend",
          label: "Tendencia",
          type: "select",
          options: [
            { label: "Estable", value: "Estable" },
            { label: "Mejora", value: "Mejora" },
            { label: "Deterioro", value: "Deterioro" },
            { label: "Alerta", value: "Alerta" },
            { label: "Acción requerida", value: "Acción requerida" },
          ],
        },
        { name: "conclusion", label: "Conclusión" },
        { name: "owner", label: "Responsable" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Abierta", value: "Abierta" },
            { label: "En revisión QA", value: "En revisión QA" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Área", accessor: "area" },
        { label: "Métrica", accessor: "metric" },
        { label: "Periodo", accessor: "period" },
        { label: "Tendencia", accessor: "trend" },
      ]}
    />
  );
}
