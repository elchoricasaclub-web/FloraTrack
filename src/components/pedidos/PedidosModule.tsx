"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function PedidosModule() {
  return (
    <DbCrudModule
      title="Pedidos"
      description="Pedidos comerciales con cliente, producto, lote, cantidad, fecha límite, estado y trazabilidad."
      apiPath="/api/distribution/orders"
      buttonLabel="Nuevo Pedido"
      icon="🧾"
      emptyForm={{
        id: "",
        code: "",
        customerName: "",
        productName: "",
        batchCode: "",
        quantity: "",
        unit: "unidades",
        status: "Creado",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código pedido", required: true },
        { name: "customerName", label: "Cliente" },
        { name: "productName", label: "Producto" },
        { name: "batchCode", label: "Lote" },
        { name: "quantity", label: "Cantidad", type: "number" },
        { name: "unit", label: "Unidad" },
        { name: "dueDate", label: "Fecha entrega", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Creado", value: "Creado" },
            { label: "Aprobación QA", value: "Aprobación QA" },
            { label: "Preparación", value: "Preparación" },
            { label: "Despachado", value: "Despachado" },
            { label: "Cancelado", value: "Cancelado" },
          ],
        },
      ]}
      columns={[
        { label: "Pedido", accessor: "code" },
        { label: "Cliente", accessor: "customerName" },
        { label: "Producto", accessor: "productName" },
        { label: "Lote", accessor: "batchCode" },
        { label: "Cantidad", accessor: "quantity" },
      ]}
    />
  );
}
