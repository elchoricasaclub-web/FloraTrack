"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function ConfiguracionModule() {
  return (
    <DbCrudModule
      title="Configuración"
      description="Parámetros maestros del sistema: claves, valores, categoría, estado y auditoría."
      apiPath="/api/system/settings"
      buttonLabel="Nueva Configuración"
      icon="⚙️"
      emptyForm={{
        id: "",
        key: "",
        value: "",
        category: "General",
        status: "Activo",
      }}
      fields={[
        { name: "key", label: "Clave", required: true },
        { name: "value", label: "Valor" },
        {
          name: "category",
          label: "Categoría",
          type: "select",
          options: [
            { label: "General", value: "General" },
            { label: "Seguridad", value: "Seguridad" },
            { label: "Calidad", value: "Calidad" },
            { label: "Regulatorio", value: "Regulatorio" },
            { label: "Reportes", value: "Reportes" },
            { label: "IA", value: "IA" },
          ],
        },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Activo", value: "Activo" },
            { label: "Inactivo", value: "Inactivo" },
          ],
        },
      ]}
      columns={[
        { label: "Clave", accessor: "key" },
        { label: "Valor", accessor: "value" },
        { label: "Categoría", accessor: "category" },
      ]}
    />
  );
}
