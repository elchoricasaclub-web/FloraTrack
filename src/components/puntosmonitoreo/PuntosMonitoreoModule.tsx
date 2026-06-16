"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function PuntosMonitoreoModule() {
  return (
    <DbCrudModule
      title="Puntos Monitoreo"
      description="Puntos de monitoreo ambiental GMP por área, tipo, clasificación, frecuencia, límite y responsable."
      apiPath="/api/environmental-monitoring/points"
      buttonLabel="Nuevo Punto"
      icon="📍"
      emptyForm={{
        id: "",
        code: "",
        areaName: "",
        pointType: "Aire viable",
        classification: "No clasificada controlada",
        frequency: "Mensual",
        limitValue: "",
        owner: "",
        status: "Activo",
      }}
      fields={[
        { name: "code", label: "Código punto", required: true },
        { name: "areaName", label: "Área", required: true },
        {
          name: "pointType",
          label: "Tipo punto",
          type: "select",
          options: [
            { label: "Aire viable", value: "Aire viable" },
            { label: "Aire no viable", value: "Aire no viable" },
            { label: "Superficie", value: "Superficie" },
            { label: "Personal", value: "Personal" },
            { label: "Temperatura", value: "Temperatura" },
            { label: "Humedad", value: "Humedad" },
            { label: "Presión", value: "Presión" },
          ],
        },
        { name: "classification", label: "Clasificación" },
        { name: "frequency", label: "Frecuencia" },
        { name: "limitValue", label: "Límite" },
        { name: "owner", label: "Responsable" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Activo", value: "Activo" },
            { label: "En revisión", value: "En revisión" },
            { label: "Inactivo", value: "Inactivo" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Área", accessor: "areaName" },
        { label: "Tipo", accessor: "pointType" },
        { label: "Clasificación", accessor: "classification" },
        { label: "Límite", accessor: "limitValue" },
      ]}
    />
  );
}
