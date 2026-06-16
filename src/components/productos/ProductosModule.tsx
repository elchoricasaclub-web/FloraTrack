"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function ProductosModule() {
  return (
    <DbCrudModule
      title="Productos"
      description="Productos terminados conectados a Prisma con lote, presentación, stock, cuarentena, liberación y auditoría."
      apiPath="/api/inventory/products"
      buttonLabel="Nuevo Producto"
      icon="📦"
      emptyForm={{
        id: "",
        code: "",
        name: "",
        lot: "",
        presentation: "",
        stock: "",
        status: "Cuarentena",
      }}
      fields={[
        { name: "code", label: "Código producto", required: true },
        { name: "name", label: "Producto", required: true },
        { name: "lot", label: "Lote" },
        { name: "presentation", label: "Presentación" },
        { name: "stock", label: "Stock", type: "number" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Cuarentena", value: "Cuarentena" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Bloqueado", value: "Bloqueado" },
            { label: "Vencido", value: "Vencido" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Producto", accessor: "name" },
        { label: "Lote", accessor: "lot" },
        { label: "Presentación", accessor: "presentation" },
        { label: "Stock", accessor: "stock" },
      ]}
    />
  );
}
