"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function LiberacionModule() {
  return (
    <DbCrudModule
      title="Liberación"
      description="Liberación de materiales, productos, lotes e ítems de calidad con aprobador, estado y auditoría Prisma."
      apiPath="/api/inventory/releases"
      buttonLabel="Nueva Liberación"
      icon="✅"
      emptyForm={{
        id: "",
        code: "",
        itemType: "Producto",
        lot: "",
        approvedBy: "",
        status: "Aprobado",
      }}
      fields={[
        { name: "code", label: "Código liberación", required: true },
        {
          name: "itemType",
          label: "Tipo",
          type: "select",
          options: [
            { label: "Materia prima", value: "Materia prima" },
            { label: "Insumo", value: "Insumo" },
            { label: "Producto", value: "Producto" },
            { label: "COA", value: "COA" },
            { label: "Lote", value: "Lote" },
          ],
        },
        { name: "lot", label: "Lote" },
        { name: "approvedBy", label: "Aprobador" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Aprobado", value: "Aprobado" },
            { label: "Condicionado", value: "Condicionado" },
            { label: "Rechazado", value: "Rechazado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Tipo", accessor: "itemType" },
        { label: "Lote", accessor: "lot" },
        { label: "Aprobador", accessor: "approvedBy" },
      ]}
    />
  );
}
