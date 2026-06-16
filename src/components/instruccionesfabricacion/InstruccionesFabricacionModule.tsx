"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function InstruccionesFabricacionModule() {
  return (
    <DbCrudModule
      title="Instrucciones Fabricación"
      description="Instrucciones maestras de proceso: paso, orden, instrucción, parámetro crítico, criterio de aceptación y estado QA."
      apiPath="/api/product-development/instructions"
      buttonLabel="Nueva Instrucción"
      icon="📘"
      emptyForm={{
        id: "",
        code: "",
        productName: "",
        processStep: "",
        stepNumber: "",
        instruction: "",
        criticalParameter: "",
        acceptanceCriteria: "",
        owner: "",
        status: "Borrador",
      }}
      fields={[
        { name: "code", label: "Código instrucción", required: true },
        { name: "productName", label: "Producto", required: true },
        { name: "processStep", label: "Paso proceso", required: true },
        { name: "stepNumber", label: "Orden", type: "number" },
        { name: "instruction", label: "Instrucción" },
        { name: "criticalParameter", label: "Parámetro crítico" },
        { name: "acceptanceCriteria", label: "Criterio aceptación" },
        { name: "owner", label: "Responsable" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Borrador", value: "Borrador" },
            { label: "En revisión QA", value: "En revisión QA" },
            { label: "Aprobada", value: "Aprobada" },
            { label: "Obsoleta", value: "Obsoleta" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Producto", accessor: "productName" },
        { label: "Paso", accessor: "processStep" },
        { label: "Orden", accessor: "stepNumber" },
        { label: "Responsable", accessor: "owner" },
      ]}
    />
  );
}
