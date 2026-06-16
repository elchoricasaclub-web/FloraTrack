"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function InsumosModule() {
  return (
    <DbCrudModule
      title="Insumos"
      description="Insumos conectados a Prisma con código, nombre, categoría, stock, estado y auditoría."
      apiPath="/api/inventory/inputs"
      buttonLabel="Nuevo Insumo"
      icon="🧰"
      emptyForm={{
        id: "",
        code: "",
        name: "",
        category: "Agrícola",
        stock: "",
        status: "Disponible",
      }}
      fields={[
        { name: "code", label: "Código", required: true },
        { name: "name", label: "Insumo", required: true },
        {
          name: "category",
          label: "Categoría",
          type: "select",
          options: [
            { label: "Agrícola", value: "Agrícola" },
            { label: "Laboratorio", value: "Laboratorio" },
            { label: "Limpieza", value: "Limpieza" },
            { label: "Mantenimiento", value: "Mantenimiento" },
            { label: "Empaque", value: "Empaque" },
          ],
        },
        { name: "stock", label: "Stock", type: "number" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Disponible", value: "Disponible" },
            { label: "Cuarentena", value: "Cuarentena" },
            { label: "Agotado", value: "Agotado" },
            { label: "Bloqueado", value: "Bloqueado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Insumo", accessor: "name" },
        { label: "Categoría", accessor: "category" },
        { label: "Stock", accessor: "stock" },
      ]}
    />
  );
}
