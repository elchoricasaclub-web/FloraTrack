"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function RequisitosNormativosModule() {
  return (
    <DbCrudModule
      title="Requisitos Normativos"
      description="Matriz de requisitos por norma, área, evidencia, responsable, vencimiento y estado de cumplimiento."
      apiPath="/api/compliance-regulatory/requirements"
      buttonLabel="Nuevo Requisito"
      icon="📌"
      emptyForm={{
        id: "",
        code: "",
        frameworkCode: "",
        area: "Calidad",
        requirement: "",
        evidence: "",
        owner: "",
        status: "Pendiente",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código requisito", required: true },
        { name: "frameworkCode", label: "Norma asociada" },
        { name: "area", label: "Área" },
        { name: "requirement", label: "Requisito", required: true },
        { name: "evidence", label: "Evidencia" },
        { name: "owner", label: "Responsable" },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "En progreso", value: "En progreso" },
            { label: "Cumple", value: "Cumple" },
            { label: "No cumple", value: "No cumple" },
            { label: "No aplica", value: "No aplica" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Norma", accessor: "frameworkCode" },
        { label: "Área", accessor: "area" },
        { label: "Requisito", accessor: "requirement" },
        { label: "Responsable", accessor: "owner" },
      ]}
    />
  );
}
