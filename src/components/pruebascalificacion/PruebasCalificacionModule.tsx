"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function PruebasCalificacionModule() {
  return (
    <DbCrudModule
      title="Pruebas Calificación"
      description="Pruebas de calificación con criterios de aceptación, resultado, ejecutor, fecha y estado."
      apiPath="/api/qualification/tests"
      buttonLabel="Nueva Prueba"
      icon="✅"
      emptyForm={{
        id: "",
        code: "",
        qualificationCode: "",
        testName: "",
        acceptanceCriteria: "",
        result: "",
        executedBy: "",
        status: "Pendiente",
        executedAt: "",
      }}
      fields={[
        { name: "code", label: "Código prueba", required: true },
        { name: "qualificationCode", label: "Calificación" },
        { name: "testName", label: "Prueba", required: true },
        { name: "acceptanceCriteria", label: "Criterio aceptación" },
        { name: "result", label: "Resultado" },
        { name: "executedBy", label: "Ejecutado por" },
        { name: "executedAt", label: "Fecha ejecución", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "Cumple", value: "Cumple" },
            { label: "No cumple", value: "No cumple" },
            { label: "Desviación", value: "Desviación" },
            { label: "Aprobada QA", value: "Aprobada QA" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Calificación", accessor: "qualificationCode" },
        { label: "Prueba", accessor: "testName" },
        { label: "Resultado", accessor: "result" },
        { label: "Ejecutor", accessor: "executedBy" },
      ]}
    />
  );
}
