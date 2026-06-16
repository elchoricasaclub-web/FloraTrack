"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function RevisionProductoModule() {
  return (
    <DbCrudModule
      title="Revisión Producto PQR/APR"
      description="Revisión periódica/anual de producto: lotes, desviaciones, quejas, OOS, conclusión, responsable y estado."
      apiPath="/api/quality-intelligence/pqr"
      buttonLabel="Nueva Revisión"
      icon="📋"
      emptyForm={{
        id: "",
        code: "",
        productName: "",
        period: "",
        batches: "",
        deviations: "",
        complaints: "",
        oosCount: "",
        conclusion: "",
        owner: "",
        status: "Borrador",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código PQR/APR", required: true },
        { name: "productName", label: "Producto", required: true },
        { name: "period", label: "Periodo", required: true },
        { name: "batches", label: "Lotes revisados", type: "number" },
        { name: "deviations", label: "Desviaciones", type: "number" },
        { name: "complaints", label: "Quejas", type: "number" },
        { name: "oosCount", label: "OOS/OOT", type: "number" },
        { name: "conclusion", label: "Conclusión" },
        { name: "owner", label: "Responsable" },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Borrador", value: "Borrador" },
            { label: "En revisión QA", value: "En revisión QA" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "CAPA requerida", value: "CAPA requerida" },
            { label: "Cerrado", value: "Cerrado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Producto", accessor: "productName" },
        { label: "Periodo", accessor: "period" },
        { label: "Lotes", accessor: "batches" },
        { label: "Estado", accessor: "status" },
      ]}
    />
  );
}
