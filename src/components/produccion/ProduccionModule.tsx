"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function ProduccionModule() {
  return (
    <DbCrudModule
      title="Producción"
      description="Órdenes de producción GMP para flores, extractos, derivados, cosméticos y productos terminados."
      apiPath="/api/production/orders"
      buttonLabel="Nueva Orden"
      icon="🏭"
      emptyForm={{
        id: "",
        code: "",
        productName: "",
        processType: "Derivado",
        batchSize: "",
        unit: "kg",
        responsible: "",
        status: "Planificada",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código orden", required: true },
        { name: "productName", label: "Producto", required: true },
        {
          name: "processType",
          label: "Proceso",
          type: "select",
          options: [
            { label: "Flor medicinal", value: "Flor medicinal" },
            { label: "BHO", value: "BHO" },
            { label: "Live Rosin", value: "Live Rosin" },
            { label: "Bubble Hash", value: "Bubble Hash" },
            { label: "Cosmético", value: "Cosmético" },
            { label: "Derivado", value: "Derivado" },
          ],
        },
        { name: "batchSize", label: "Tamaño lote", type: "number" },
        { name: "unit", label: "Unidad" },
        { name: "responsible", label: "Responsable" },
        { name: "dueDate", label: "Fecha programada", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Planificada", value: "Planificada" },
            { label: "En proceso", value: "En proceso" },
            { label: "En revisión QA", value: "En revisión QA" },
            { label: "Completada", value: "Completada" },
            { label: "Cancelada", value: "Cancelada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Producto", accessor: "productName" },
        { label: "Proceso", accessor: "processType" },
        { label: "Tamaño", accessor: "batchSize" },
        { label: "Fecha", accessor: "dueDate" },
      ]}
    />
  );
}
