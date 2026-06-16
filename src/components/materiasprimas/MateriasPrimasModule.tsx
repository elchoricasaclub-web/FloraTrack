"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function MateriasPrimasModule() {
  return (
    <DbCrudModule
      title="Materias Primas"
      description="Materias primas conectadas a Prisma con código, proveedor, lote, stock, estado, cuarentena y liberación."
      apiPath="/api/inventory/raw-materials"
      buttonLabel="Nueva Materia Prima"
      icon="🧱"
      emptyForm={{
        id: "",
        code: "",
        name: "",
        supplier: "",
        lot: "",
        stock: "",
        status: "Cuarentena",
      }}
      fields={[
        { name: "code", label: "Código", required: true },
        { name: "name", label: "Materia prima", required: true },
        { name: "supplier", label: "Proveedor" },
        { name: "lot", label: "Lote" },
        { name: "stock", label: "Stock", type: "number" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Cuarentena", value: "Cuarentena" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Rechazado", value: "Rechazado" },
            { label: "Vencido", value: "Vencido" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Materia prima", accessor: "name" },
        { label: "Proveedor", accessor: "supplier" },
        { label: "Lote", accessor: "lot" },
        { label: "Stock", accessor: "stock" },
      ]}
    />
  );
}
