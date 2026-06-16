"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function ExcursionesAmbientalesModule() {
  return (
    <DbCrudModule
      title="Excursiones Ambientales"
      description="Excursiones ambientales: punto, parámetro, resultado, límite, hallazgo, causa raíz, acción y cierre QA."
      apiPath="/api/environmental-monitoring/excursions"
      buttonLabel="Nueva Excursión"
      icon="🚨"
      emptyForm={{
        id: "",
        code: "",
        pointCode: "",
        parameter: "",
        resultValue: "",
        limitValue: "",
        issue: "",
        rootCause: "",
        action: "",
        owner: "",
        status: "Abierta",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código excursión", required: true },
        { name: "pointCode", label: "Punto" },
        { name: "parameter", label: "Parámetro" },
        { name: "resultValue", label: "Resultado" },
        { name: "limitValue", label: "Límite" },
        { name: "issue", label: "Hallazgo", required: true },
        { name: "rootCause", label: "Causa raíz" },
        { name: "action", label: "Acción" },
        { name: "owner", label: "Responsable" },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Abierta", value: "Abierta" },
            { label: "En investigación", value: "En investigación" },
            { label: "CAPA requerida", value: "CAPA requerida" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Punto", accessor: "pointCode" },
        { label: "Parámetro", accessor: "parameter" },
        { label: "Resultado", accessor: "resultValue" },
        { label: "Responsable", accessor: "owner" },
      ]}
    />
  );
}
