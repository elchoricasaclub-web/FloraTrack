"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function HomologacionProveedoresModule() {
  return (
    <DbCrudModule
      title="Homologación Proveedores"
      description="Calificación y homologación de proveedores críticos: categoría, tipo, score, responsable, fecha límite y estado QA."
      apiPath="/api/supplier-qa/qualifications"
      buttonLabel="Nueva Homologación"
      icon="🏅"
      emptyForm={{
        id: "",
        code: "",
        supplierName: "",
        category: "Crítico",
        qualificationType: "Inicial",
        score: "",
        owner: "",
        status: "En evaluación",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código homologación", required: true },
        { name: "supplierName", label: "Proveedor", required: true },
        {
          name: "category",
          label: "Categoría",
          type: "select",
          options: [
            { label: "Crítico", value: "Crítico" },
            { label: "Mayor", value: "Mayor" },
            { label: "Menor", value: "Menor" },
            { label: "Servicio", value: "Servicio" },
          ],
        },
        {
          name: "qualificationType",
          label: "Tipo",
          type: "select",
          options: [
            { label: "Inicial", value: "Inicial" },
            { label: "Recalificación", value: "Recalificación" },
            { label: "Condicional", value: "Condicional" },
            { label: "Descalificación", value: "Descalificación" },
          ],
        },
        { name: "score", label: "Score %", type: "number" },
        { name: "owner", label: "Responsable" },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "En evaluación", value: "En evaluación" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Aprobado condicional", value: "Aprobado condicional" },
            { label: "Rechazado", value: "Rechazado" },
            { label: "Bloqueado", value: "Bloqueado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Proveedor", accessor: "supplierName" },
        { label: "Categoría", accessor: "category" },
        { label: "Tipo", accessor: "qualificationType" },
        { label: "Score", accessor: "score" },
      ]}
    />
  );
}
