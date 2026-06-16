"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function EnvasadoModule() {
  return (
    <DbCrudModule
      title="Envasado"
      description="Control de envasado y etiquetado: lote, producto, tipo de empaque, unidades, control de etiqueta, responsable y estado."
      apiPath="/api/production/packaging"
      buttonLabel="Nuevo Envasado"
      icon="🏷️"
      emptyForm={{
        id: "",
        code: "",
        batchCode: "",
        productName: "",
        packagingType: "",
        unitsPackaged: "",
        labelControl: "",
        responsible: "",
        status: "En proceso",
      }}
      fields={[
        { name: "code", label: "Código envasado", required: true },
        { name: "batchCode", label: "Lote" },
        { name: "productName", label: "Producto" },
        { name: "packagingType", label: "Tipo de empaque" },
        { name: "unitsPackaged", label: "Unidades envasadas", type: "number" },
        { name: "labelControl", label: "Control etiqueta" },
        { name: "responsible", label: "Responsable" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "En proceso", value: "En proceso" },
            { label: "Revisión QA", value: "Revisión QA" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Rechazado", value: "Rechazado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Lote", accessor: "batchCode" },
        { label: "Producto", accessor: "productName" },
        { label: "Unidades", accessor: "unitsPackaged" },
        { label: "Responsable", accessor: "responsible" },
      ]}
    />
  );
}
