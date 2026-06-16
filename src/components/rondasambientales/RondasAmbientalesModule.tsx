"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function RondasAmbientalesModule() {
  return (
    <DbCrudModule
      title="Rondas Ambientales"
      description="Rondas de monitoreo ambiental: área, tipo de ronda, ejecutor, fecha y estado."
      apiPath="/api/environmental-monitoring/runs"
      buttonLabel="Nueva Ronda"
      icon="🧭"
      emptyForm={{
        id: "",
        code: "",
        areaName: "",
        runType: "Rutina",
        performedBy: "",
        status: "Programada",
        runDate: "",
      }}
      fields={[
        { name: "code", label: "Código ronda", required: true },
        { name: "areaName", label: "Área" },
        {
          name: "runType",
          label: "Tipo ronda",
          type: "select",
          options: [
            { label: "Rutina", value: "Rutina" },
            { label: "Post limpieza", value: "Post limpieza" },
            { label: "Post mantenimiento", value: "Post mantenimiento" },
            { label: "Investigación", value: "Investigación" },
            { label: "Recalificación", value: "Recalificación" },
          ],
        },
        { name: "performedBy", label: "Ejecutado por" },
        { name: "runDate", label: "Fecha ronda", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Programada", value: "Programada" },
            { label: "Ejecutada", value: "Ejecutada" },
            { label: "En revisión QA", value: "En revisión QA" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Área", accessor: "areaName" },
        { label: "Tipo", accessor: "runType" },
        { label: "Ejecutor", accessor: "performedBy" },
        { label: "Fecha", accessor: "runDate" },
      ]}
    />
  );
}
