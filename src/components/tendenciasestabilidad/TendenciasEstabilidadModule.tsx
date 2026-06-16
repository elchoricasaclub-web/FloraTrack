"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function TendenciasEstabilidadModule() {
  return (
    <DbCrudModule
      title="Tendencias Estabilidad"
      description="Análisis de tendencia de estabilidad por producto, lote, condición, parámetro, resultado y conclusión."
      apiPath="/api/quality-intelligence/stability"
      buttonLabel="Nueva Tendencia"
      icon="⏳"
      emptyForm={{
        id: "",
        code: "",
        productName: "",
        batchCode: "",
        condition: "25°C / 60% HR",
        parameter: "",
        resultValue: "",
        trend: "Estable",
        conclusion: "",
        owner: "",
        status: "En revisión",
        reviewDate: "",
      }}
      fields={[
        { name: "code", label: "Código estabilidad", required: true },
        { name: "productName", label: "Producto", required: true },
        { name: "batchCode", label: "Lote" },
        { name: "condition", label: "Condición" },
        { name: "parameter", label: "Parámetro", required: true },
        { name: "resultValue", label: "Resultado" },
        {
          name: "trend",
          label: "Tendencia",
          type: "select",
          options: [
            { label: "Estable", value: "Estable" },
            { label: "Alerta", value: "Alerta" },
            { label: "Fuera de tendencia", value: "Fuera de tendencia" },
            { label: "Fuera de especificación", value: "Fuera de especificación" },
          ],
        },
        { name: "conclusion", label: "Conclusión" },
        { name: "owner", label: "Responsable" },
        { name: "reviewDate", label: "Fecha revisión", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "En revisión", value: "En revisión" },
            { label: "Cumple", value: "Cumple" },
            { label: "Investigación", value: "Investigación" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Producto", accessor: "productName" },
        { label: "Lote", accessor: "batchCode" },
        { label: "Parámetro", accessor: "parameter" },
        { label: "Tendencia", accessor: "trend" },
      ]}
    />
  );
}
