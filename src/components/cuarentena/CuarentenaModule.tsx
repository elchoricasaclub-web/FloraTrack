"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function CuarentenaModule() {
  return (
    <DbCrudModule
      title="Cuarentena"
      description="Control de ítems retenidos, lotes, motivo, estado y trazabilidad de calidad con Prisma."
      apiPath="/api/inventory/quarantine"
      buttonLabel="Nuevo Ítem"
      icon="⏳"
      emptyForm={{
        id: "",
        code: "",
        itemType: "Materia prima",
        lot: "",
        reason: "",
        status: "Pendiente",
      }}
      fields={[
        { name: "code", label: "Código", required: true },
        {
          name: "itemType",
          label: "Tipo",
          type: "select",
          options: [
            { label: "Materia prima", value: "Materia prima" },
            { label: "Insumo", value: "Insumo" },
            { label: "Producto", value: "Producto" },
            { label: "Muestra", value: "Muestra" },
            { label: "Lote", value: "Lote" },
          ],
        },
        { name: "lot", label: "Lote" },
        { name: "reason", label: "Motivo" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "En revisión", value: "En revisión" },
            { label: "Liberado", value: "Liberado" },
            { label: "Rechazado", value: "Rechazado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Tipo", accessor: "itemType" },
        { label: "Lote", accessor: "lot" },
        { label: "Motivo", accessor: "reason" },
      ]}
    />
  );
}
