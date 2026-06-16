"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function DespachosModule() {
  return (
    <DbCrudModule
      title="Despachos"
      description="Despachos con pedido, cliente, producto, lote, cantidad, transportador, fecha y estado."
      apiPath="/api/distribution/dispatches"
      buttonLabel="Nuevo Despacho"
      icon="🚚"
      emptyForm={{
        id: "",
        code: "",
        orderCode: "",
        customerName: "",
        productName: "",
        batchCode: "",
        quantity: "",
        unit: "unidades",
        transporter: "",
        status: "Preparado",
        dispatchDate: "",
      }}
      fields={[
        { name: "code", label: "Código despacho", required: true },
        { name: "orderCode", label: "Pedido" },
        { name: "customerName", label: "Cliente" },
        { name: "productName", label: "Producto" },
        { name: "batchCode", label: "Lote" },
        { name: "quantity", label: "Cantidad", type: "number" },
        { name: "unit", label: "Unidad" },
        { name: "transporter", label: "Transportador" },
        { name: "dispatchDate", label: "Fecha despacho", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Preparado", value: "Preparado" },
            { label: "En ruta", value: "En ruta" },
            { label: "Entregado", value: "Entregado" },
            { label: "Devuelto", value: "Devuelto" },
            { label: "Bloqueado", value: "Bloqueado" },
          ],
        },
      ]}
      columns={[
        { label: "Despacho", accessor: "code" },
        { label: "Pedido", accessor: "orderCode" },
        { label: "Cliente", accessor: "customerName" },
        { label: "Lote", accessor: "batchCode" },
        { label: "Transportador", accessor: "transporter" },
      ]}
    />
  );
}
