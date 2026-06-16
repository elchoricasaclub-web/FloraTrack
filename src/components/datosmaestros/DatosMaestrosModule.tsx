"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function DatosMaestrosModule() {
  return (
    <DbCrudModule
      title="Datos Maestros"
      description="Catálogos maestros para normalizar datos de operación, calidad, laboratorio, inventario y regulación."
      apiPath="/api/system/master-data"
      buttonLabel="Nuevo Dato Maestro"
      icon="🗂️"
      emptyForm={{
        id: "",
        code: "",
        category: "Catálogo",
        name: "",
        value: "",
        status: "Activo",
      }}
      fields={[
        { name: "code", label: "Código", required: true },
        { name: "category", label: "Categoría", required: true },
        { name: "name", label: "Nombre", required: true },
        { name: "value", label: "Valor" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Activo", value: "Activo" },
            { label: "Inactivo", value: "Inactivo" },
            { label: "Obsoleto", value: "Obsoleto" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Categoría", accessor: "category" },
        { label: "Nombre", accessor: "name" },
        { label: "Valor", accessor: "value" },
      ]}
    />
  );
}
