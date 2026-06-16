"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function ComprasModule() {
  return (
    <DbCrudModule
      title="Compras"
      description="Órdenes de compra conectadas a Prisma con proveedor, ítem, cantidad, estado y auditoría."
      apiPath="/api/inventory/purchases"
      buttonLabel="Nueva Compra"
      icon="🧾"
      emptyForm={{
        id: "",
        code: "",
        supplier: "",
        item: "",
        quantity: "",
        status: "Solicitada",
      }}
      fields={[
        { name: "code", label: "Orden de compra", required: true },
        { name: "supplier", label: "Proveedor" },
        { name: "item", label: "Ítem / servicio", required: true },
        { name: "quantity", label: "Cantidad", type: "number" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Solicitada", value: "Solicitada" },
            { label: "Aprobada", value: "Aprobada" },
            { label: "Recibida", value: "Recibida" },
            { label: "Rechazada", value: "Rechazada" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Orden", accessor: "code" },
        { label: "Proveedor", accessor: "supplier" },
        { label: "Ítem", accessor: "item" },
        { label: "Cantidad", accessor: "quantity" },
      ]}
    />
  );
}
