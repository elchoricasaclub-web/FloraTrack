"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function ConsumosMaterialesModule() {
  return (
    <DbCrudModule
      title="Consumo de Materiales"
      description="Consumo trazable de materias primas, insumos, empaques y materiales por lote y paso de proceso."
      apiPath="/api/traceability-plus/consumption"
      buttonLabel="Nuevo Consumo"
      icon="⚖️"
      emptyForm={{
        id: "",
        code: "",
        batchCode: "",
        materialName: "",
        materialLot: "",
        quantity: "",
        unit: "kg",
        processStep: "",
        responsible: "",
        status: "Consumido",
      }}
      fields={[
        { name: "code", label: "Código consumo", required: true },
        { name: "batchCode", label: "Lote proceso" },
        { name: "materialName", label: "Material" },
        { name: "materialLot", label: "Lote material" },
        { name: "quantity", label: "Cantidad", type: "number" },
        { name: "unit", label: "Unidad" },
        { name: "processStep", label: "Paso proceso" },
        { name: "responsible", label: "Responsable" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Consumido", value: "Consumido" },
            { label: "Devuelto", value: "Devuelto" },
            { label: "Bloqueado", value: "Bloqueado" },
            { label: "Revisado QA", value: "Revisado QA" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Lote", accessor: "batchCode" },
        { label: "Material", accessor: "materialName" },
        { label: "Lote material", accessor: "materialLot" },
        { label: "Cantidad", accessor: "quantity" },
      ]}
    />
  );
}
