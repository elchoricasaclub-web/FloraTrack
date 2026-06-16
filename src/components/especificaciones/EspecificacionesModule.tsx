"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function EspecificacionesModule() {
  return (
    <DbCrudModule
      title="Especificaciones"
      description="Especificaciones de producto: parámetro, límite, método analítico, responsable, estado y auditoría."
      apiPath="/api/lab-qa/specifications"
      buttonLabel="Nueva Especificación"
      icon="📏"
      emptyForm={{
        id: "",
        code: "",
        productName: "",
        parameter: "",
        limitValue: "",
        methodCode: "",
        owner: "",
        status: "Activa",
      }}
      fields={[
        { name: "code", label: "Código especificación", required: true },
        { name: "productName", label: "Producto", required: true },
        { name: "parameter", label: "Parámetro", required: true },
        { name: "limitValue", label: "Límite / criterio" },
        { name: "methodCode", label: "Método analítico" },
        { name: "owner", label: "Responsable" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Activa", value: "Activa" },
            { label: "En revisión", value: "En revisión" },
            { label: "Aprobada", value: "Aprobada" },
            { label: "Obsoleta", value: "Obsoleta" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Producto", accessor: "productName" },
        { label: "Parámetro", accessor: "parameter" },
        { label: "Límite", accessor: "limitValue" },
        { label: "Método", accessor: "methodCode" },
      ]}
    />
  );
}
