"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function OOSModule() {
  return (
    <DbCrudModule
      title="OOS / OOT"
      description="Investigaciones fuera de especificación o tendencia: muestra, análisis, resultado, hallazgo, causa raíz, acción, responsable y cierre QA."
      apiPath="/api/lab-qa/oos"
      buttonLabel="Nuevo OOS"
      icon="🚨"
      emptyForm={{
        id: "",
        code: "",
        sampleCode: "",
        analysisCode: "",
        result: "",
        issue: "",
        rootCause: "",
        action: "",
        owner: "",
        status: "Abierta",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código OOS", required: true },
        { name: "sampleCode", label: "Muestra" },
        { name: "analysisCode", label: "Análisis" },
        { name: "result", label: "Resultado" },
        { name: "issue", label: "Hallazgo / desviación", required: true },
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
        { label: "Muestra", accessor: "sampleCode" },
        { label: "Análisis", accessor: "analysisCode" },
        { label: "Resultado", accessor: "result" },
        { label: "Responsable", accessor: "owner" },
      ]}
    />
  );
}
