"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function GenealogiaLotesModule() {
  return (
    <DbCrudModule
      title="Genealogía de Lotes"
      description="Relación lote padre → lote hijo para trazabilidad total: cosecha, extracción, transformación, envasado y producto final."
      apiPath="/api/traceability-plus/genealogy"
      buttonLabel="Nueva Genealogía"
      icon="🧬"
      emptyForm={{
        id: "",
        code: "",
        parentLot: "",
        childLot: "",
        productName: "",
        transformationType: "Transformación",
        quantity: "",
        unit: "kg",
        status: "Activo",
      }}
      fields={[
        { name: "code", label: "Código genealogía", required: true },
        { name: "parentLot", label: "Lote padre" },
        { name: "childLot", label: "Lote hijo" },
        { name: "productName", label: "Producto" },
        {
          name: "transformationType",
          label: "Transformación",
          type: "select",
          options: [
            { label: "Cosecha", value: "Cosecha" },
            { label: "Secado", value: "Secado" },
            { label: "Extracción", value: "Extracción" },
            { label: "Live Rosin", value: "Live Rosin" },
            { label: "BHO", value: "BHO" },
            { label: "Envasado", value: "Envasado" },
            { label: "Producto terminado", value: "Producto terminado" },
          ],
        },
        { name: "quantity", label: "Cantidad", type: "number" },
        { name: "unit", label: "Unidad" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Activo", value: "Activo" },
            { label: "Liberado", value: "Liberado" },
            { label: "Bloqueado", value: "Bloqueado" },
            { label: "Cerrado", value: "Cerrado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Lote padre", accessor: "parentLot" },
        { label: "Lote hijo", accessor: "childLot" },
        { label: "Producto", accessor: "productName" },
        { label: "Transformación", accessor: "transformationType" },
      ]}
    />
  );
}
