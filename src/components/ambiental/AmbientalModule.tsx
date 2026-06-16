"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function AmbientalModule() {
  return (
    <DbCrudModule
      title="Ambiental"
      description="Monitoreo ambiental conectado a Prisma con variable, valor, unidad, estado y auditoría."
      apiPath="/api/facility/environmental"
      buttonLabel="Nuevo Monitoreo"
      icon="🌡️"
      emptyForm={{
        id: "",
        code: "",
        variable: "Temperatura",
        value: "",
        unit: "°C",
        status: "Cumple",
      }}
      fields={[
        { name: "code", label: "Código monitoreo", required: true },
        {
          name: "variable",
          label: "Variable",
          type: "select",
          options: [
            { label: "Temperatura", value: "Temperatura" },
            { label: "Humedad", value: "Humedad" },
            { label: "CO2", value: "CO2" },
            { label: "Partículas", value: "Partículas" },
            { label: "Presión", value: "Presión" },
            { label: "Lux", value: "Lux" },
          ],
        },
        { name: "value", label: "Valor" },
        { name: "unit", label: "Unidad" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Cumple", value: "Cumple" },
            { label: "Alerta", value: "Alerta" },
            { label: "Fuera de rango", value: "Fuera de rango" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Variable", accessor: "variable" },
        { label: "Valor", accessor: "value" },
        { label: "Unidad", accessor: "unit" },
      ]}
    />
  );
}
