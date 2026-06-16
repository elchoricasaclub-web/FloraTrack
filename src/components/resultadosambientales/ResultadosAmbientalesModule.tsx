"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function ResultadosAmbientalesModule() {
  return (
    <DbCrudModule
      title="Resultados Ambientales"
      description="Resultados de monitoreo ambiental: punto, parámetro, resultado, límite, unidad, analista y estado."
      apiPath="/api/environmental-monitoring/results"
      buttonLabel="Nuevo Resultado"
      icon="🧫"
      emptyForm={{
        id: "",
        code: "",
        runCode: "",
        pointCode: "",
        parameter: "UFC",
        resultValue: "",
        limitValue: "",
        unit: "UFC/placa",
        analyst: "",
        status: "Pendiente",
      }}
      fields={[
        { name: "code", label: "Código resultado", required: true },
        { name: "runCode", label: "Ronda" },
        { name: "pointCode", label: "Punto" },
        { name: "parameter", label: "Parámetro", required: true },
        { name: "resultValue", label: "Resultado" },
        { name: "limitValue", label: "Límite" },
        { name: "unit", label: "Unidad" },
        { name: "analyst", label: "Analista" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "Cumple", value: "Cumple" },
            { label: "Alerta", value: "Alerta" },
            { label: "Acción", value: "Acción" },
            { label: "OOS ambiental", value: "OOS ambiental" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Punto", accessor: "pointCode" },
        { label: "Parámetro", accessor: "parameter" },
        { label: "Resultado", accessor: "resultValue" },
        { label: "Límite", accessor: "limitValue" },
      ]}
    />
  );
}
