"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function AreasClasificadasModule() {
  return (
    <DbCrudModule
      title="Áreas Clasificadas"
      description="Áreas limpias, cuartos de proceso y zonas clasificadas: clasificación, presión, temperatura, humedad, responsable y revisión."
      apiPath="/api/qualification/areas"
      buttonLabel="Nueva Área"
      icon="🏭"
      emptyForm={{
        id: "",
        code: "",
        areaName: "",
        classification: "No clasificada controlada",
        pressureCascade: "",
        temperatureRange: "",
        humidityRange: "",
        owner: "",
        status: "Calificada",
        reviewDate: "",
      }}
      fields={[
        { name: "code", label: "Código área", required: true },
        { name: "areaName", label: "Área", required: true },
        {
          name: "classification",
          label: "Clasificación",
          type: "select",
          options: [
            { label: "ISO 8", value: "ISO 8" },
            { label: "ISO 7", value: "ISO 7" },
            { label: "ISO 5", value: "ISO 5" },
            { label: "No clasificada controlada", value: "No clasificada controlada" },
            { label: "Área técnica", value: "Área técnica" },
          ],
        },
        { name: "pressureCascade", label: "Cascada presión" },
        { name: "temperatureRange", label: "Rango temperatura" },
        { name: "humidityRange", label: "Rango humedad" },
        { name: "owner", label: "Responsable" },
        { name: "reviewDate", label: "Fecha revisión", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Calificada", value: "Calificada" },
            { label: "En monitoreo", value: "En monitoreo" },
            { label: "Fuera de especificación", value: "Fuera de especificación" },
            { label: "Bloqueada", value: "Bloqueada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Área", accessor: "areaName" },
        { label: "Clasificación", accessor: "classification" },
        { label: "Presión", accessor: "pressureCascade" },
        { label: "Responsable", accessor: "owner" },
      ]}
    />
  );
}
