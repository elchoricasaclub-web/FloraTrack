"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function RecepcionModule() {
  return (
    <DbCrudModule
      title="Recepción"
      description="Recepción técnica de materiales, lotes, proveedores, cantidades, estado y trazabilidad con Prisma."
      apiPath="/api/inventory/receptions"
      buttonLabel="Nueva Recepción"
      icon="📥"
      emptyForm={{
        id: "",
        code: "",
        supplier: "",
        item: "",
        lot: "",
        quantity: "",
        status: "Cuarentena",
      }}
      fields={[
        { name: "code", label: "Código recepción", required: true },
        { name: "supplier", label: "Proveedor" },
        { name: "item", label: "Ítem recibido", required: true },
        { name: "lot", label: "Lote" },
        { name: "quantity", label: "Cantidad", type: "number" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Aceptada", value: "Aceptada" },
            { label: "Cuarentena", value: "Cuarentena" },
            { label: "Rechazada", value: "Rechazada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Proveedor", accessor: "supplier" },
        { label: "Ítem", accessor: "item" },
        { label: "Lote", accessor: "lot" },
        { label: "Cantidad", accessor: "quantity" },
      ]}
    />
  );
}
