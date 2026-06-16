"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function RecallModule() {
  return (
    <DbCrudModule
      title="Recall"
      description="Retiros de producto y acciones de campo: lote, producto, causa, alcance, fecha de inicio, estado y auditoría."
      apiPath="/api/distribution/recalls"
      buttonLabel="Nuevo Recall"
      icon="🚨"
      emptyForm={{
        id: "",
        code: "",
        productName: "",
        batchCode: "",
        reason: "",
        scope: "Interno",
        status: "Evaluación",
        startedAt: "",
      }}
      fields={[
        { name: "code", label: "Código recall", required: true },
        { name: "productName", label: "Producto" },
        { name: "batchCode", label: "Lote" },
        { name: "reason", label: "Causa" },
        {
          name: "scope",
          label: "Alcance",
          type: "select",
          options: [
            { label: "Interno", value: "Interno" },
            { label: "Cliente específico", value: "Cliente específico" },
            { label: "Regional", value: "Regional" },
            { label: "Nacional", value: "Nacional" },
            { label: "Internacional", value: "Internacional" },
          ],
        },
        { name: "startedAt", label: "Fecha inicio", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Evaluación", value: "Evaluación" },
            { label: "Activado", value: "Activado" },
            { label: "En ejecución", value: "En ejecución" },
            { label: "Cerrado", value: "Cerrado" },
            { label: "Cancelado", value: "Cancelado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Producto", accessor: "productName" },
        { label: "Lote", accessor: "batchCode" },
        { label: "Alcance", accessor: "scope" },
        { label: "Inicio", accessor: "startedAt" },
      ]}
    />
  );
}
