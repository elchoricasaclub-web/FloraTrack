"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function LotesModule() {
  return (
    <DbCrudModule
      title="Lotes"
      description="Gestión de lotes productivos con producto, genética, lote fuente, fecha, cantidad, unidad, estado y auditoría."
      apiPath="/api/production/batches"
      buttonLabel="Nuevo Lote"
      icon="📦"
      emptyForm={{
        id: "",
        code: "",
        productName: "",
        geneticName: "",
        sourceLot: "",
        productionDate: "",
        quantity: "",
        unit: "kg",
        status: "Cuarentena",
      }}
      fields={[
        { name: "code", label: "Código lote", required: true },
        { name: "productName", label: "Producto", required: true },
        { name: "geneticName", label: "Genética" },
        { name: "sourceLot", label: "Lote fuente" },
        { name: "productionDate", label: "Fecha producción", type: "date" },
        { name: "quantity", label: "Cantidad", type: "number" },
        { name: "unit", label: "Unidad" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Cuarentena", value: "Cuarentena" },
            { label: "En análisis", value: "En análisis" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Liberado", value: "Liberado" },
            { label: "Rechazado", value: "Rechazado" },
            { label: "Bloqueado", value: "Bloqueado" },
          ],
        },
      ]}
      columns={[
        { label: "Lote", accessor: "code" },
        { label: "Producto", accessor: "productName" },
        { label: "Genética", accessor: "geneticName" },
        { label: "Cantidad", accessor: "quantity" },
        { label: "Fecha", accessor: "productionDate" },
      ]}
    />
  );
}
