"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function RetencionModule() {
  return (
    <DbCrudModule
      title="Retención"
      description="Muestras de retención por lote: tipo, ubicación, cantidad, unidad, estado y trazabilidad para auditoría."
      apiPath="/api/production/retention"
      buttonLabel="Nueva Retención"
      icon="🧪"
      emptyForm={{
        id: "",
        code: "",
        batchCode: "",
        sampleType: "",
        location: "",
        quantity: "",
        unit: "g",
        status: "Retenida",
      }}
      fields={[
        { name: "code", label: "Código muestra", required: true },
        { name: "batchCode", label: "Lote" },
        {
          name: "sampleType",
          label: "Tipo muestra",
          type: "select",
          options: [
            { label: "Flor", value: "Flor" },
            { label: "Extracto", value: "Extracto" },
            { label: "Producto terminado", value: "Producto terminado" },
            { label: "Materia prima", value: "Materia prima" },
            { label: "Empaque", value: "Empaque" },
          ],
        },
        { name: "location", label: "Ubicación" },
        { name: "quantity", label: "Cantidad", type: "number" },
        { name: "unit", label: "Unidad" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Retenida", value: "Retenida" },
            { label: "En análisis", value: "En análisis" },
            { label: "Consumida", value: "Consumida" },
            { label: "Descartada", value: "Descartada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Lote", accessor: "batchCode" },
        { label: "Tipo", accessor: "sampleType" },
        { label: "Ubicación", accessor: "location" },
        { label: "Cantidad", accessor: "quantity" },
      ]}
    />
  );
}
