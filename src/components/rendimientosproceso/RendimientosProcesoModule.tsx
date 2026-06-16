"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function RendimientosProcesoModule() {
  return (
    <DbCrudModule
      title="Rendimientos de Proceso"
      description="Control de rendimiento por proceso: entrada, salida, porcentaje, responsable, lote y estado."
      apiPath="/api/traceability-plus/yields"
      buttonLabel="Nuevo Rendimiento"
      icon="📊"
      emptyForm={{
        id: "",
        code: "",
        batchCode: "",
        processName: "Extracción",
        inputQuantity: "",
        outputQuantity: "",
        unit: "kg",
        yieldPercent: "",
        responsible: "",
        status: "Registrado",
      }}
      fields={[
        { name: "code", label: "Código rendimiento", required: true },
        { name: "batchCode", label: "Lote" },
        { name: "processName", label: "Proceso" },
        { name: "inputQuantity", label: "Entrada", type: "number" },
        { name: "outputQuantity", label: "Salida", type: "number" },
        { name: "unit", label: "Unidad" },
        { name: "yieldPercent", label: "Rendimiento %", type: "number" },
        { name: "responsible", label: "Responsable" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Registrado", value: "Registrado" },
            { label: "Revisión QA", value: "Revisión QA" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Fuera de tendencia", value: "Fuera de tendencia" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Lote", accessor: "batchCode" },
        { label: "Proceso", accessor: "processName" },
        { label: "Entrada", accessor: "inputQuantity" },
        { label: "Salida", accessor: "outputQuantity" },
      ]}
    />
  );
}
