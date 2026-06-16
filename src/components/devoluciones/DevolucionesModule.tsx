"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function DevolucionesModule() {
  return (
    <DbCrudModule
      title="Devoluciones"
      description="Control de devoluciones: cliente, producto, lote, cantidad, causa, estado, investigación QA y trazabilidad."
      apiPath="/api/distribution/returns"
      buttonLabel="Nueva Devolución"
      icon="↩️"
      emptyForm={{
        id: "",
        code: "",
        customerName: "",
        productName: "",
        batchCode: "",
        quantity: "",
        unit: "unidades",
        reason: "",
        status: "Recibida",
      }}
      fields={[
        { name: "code", label: "Código devolución", required: true },
        { name: "customerName", label: "Cliente" },
        { name: "productName", label: "Producto" },
        { name: "batchCode", label: "Lote" },
        { name: "quantity", label: "Cantidad", type: "number" },
        { name: "unit", label: "Unidad" },
        { name: "reason", label: "Causa" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Recibida", value: "Recibida" },
            { label: "En investigación", value: "En investigación" },
            { label: "Aceptada", value: "Aceptada" },
            { label: "Rechazada", value: "Rechazada" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Cliente", accessor: "customerName" },
        { label: "Producto", accessor: "productName" },
        { label: "Lote", accessor: "batchCode" },
        { label: "Causa", accessor: "reason" },
      ]}
    />
  );
}
