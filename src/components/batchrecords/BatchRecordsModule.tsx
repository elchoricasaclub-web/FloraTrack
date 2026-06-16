"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function BatchRecordsModule() {
  return (
    <DbCrudModule
      title="Batch Records"
      description="Registro maestro de lote: pasos de proceso, operadores, parámetros críticos, resultados, estado y auditoría."
      apiPath="/api/production/batch-records"
      buttonLabel="Nuevo Batch Record"
      icon="📋"
      emptyForm={{
        id: "",
        code: "",
        batchCode: "",
        step: "",
        operator: "",
        parameter: "",
        result: "",
        status: "En proceso",
      }}
      fields={[
        { name: "code", label: "Código registro", required: true },
        { name: "batchCode", label: "Lote" },
        { name: "step", label: "Paso proceso" },
        { name: "operator", label: "Operador" },
        { name: "parameter", label: "Parámetro crítico" },
        { name: "result", label: "Resultado" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "En proceso", value: "En proceso" },
            { label: "Cumple", value: "Cumple" },
            { label: "No cumple", value: "No cumple" },
            { label: "Revisión QA", value: "Revisión QA" },
            { label: "Aprobado", value: "Aprobado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Lote", accessor: "batchCode" },
        { label: "Paso", accessor: "step" },
        { label: "Operador", accessor: "operator" },
        { label: "Parámetro", accessor: "parameter" },
      ]}
    />
  );
}
